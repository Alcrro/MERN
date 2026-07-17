const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { Order, ORDER_STATUS, INSTALLMENT_BANKS, INSTALLMENT_MONTHS } = require("../../models/order/Order");
const Product = require("../../models/product/Product");
const { Address } = require("../../models/address/Address");
const ErrorResponse = require("../../utilitis/errorResponse");
const stripe = require("../../utils/stripe");
const { awardPoints, revokePoints } = require("../shopCard/shopCardService");
const { ShopCard } = require("../../models/shopCard/ShopCard");
const { CardTransaction } = require("../../models/shopCard/CardTransaction");

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort("-createdAt");
  res.status(200).json({ success: true, count: orders.length, orders });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) return next(new ErrorResponse("Order not found", 404));

  if (order.user.toString() !== req.user.id && !req.user.isAdmin) {
    return next(new ErrorResponse("Not authorized to view this order", 401));
  }

  res.status(200).json({ success: true, order });
});

// @desc    Create order
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { items, addressId, paymentMethod, installmentPlan, creditsToUse = 0, savedPaymentMethodId } = req.body;

  if (!items?.length) {
    return next(new ErrorResponse("No order items", 400));
  }

  if (paymentMethod === "Ramburs" && installmentPlan) {
    return next(new ErrorResponse("Ramburs nu este compatibil cu un plan de rate", 400));
  }

  if (installmentPlan) {
    if (!INSTALLMENT_BANKS.includes(installmentPlan.bank)) {
      return next(new ErrorResponse("Bancă neacreditată", 400));
    }
    if (!INSTALLMENT_MONTHS.includes(Number(installmentPlan.months))) {
      return next(new ErrorResponse("Număr de rate invalid", 400));
    }
    if (typeof installmentPlan.monthlyAmount !== "number" || installmentPlan.monthlyAmount < 0) {
      return next(new ErrorResponse("monthlyAmount invalid", 400));
    }
  }

  const address = await Address.findOne({ _id: addressId, user: req.user.id });
  if (!address) return next(new ErrorResponse("Address not found", 404));

  const creditsUsed = Number(creditsToUse) || 0;
  if (creditsUsed < 0) return next(new ErrorResponse("creditsToUse invalid", 400));

  let shopCard = null;
  if (creditsUsed > 0) {
    shopCard = await ShopCard.findOne({ user: req.user.id });
    if (!shopCard || shopCard.credits < creditsUsed) {
      return next(new ErrorResponse("Credite insuficiente", 400));
    }
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  let order;
  try {
    // decrement atomic + snapshot — secvențial, nu Promise.all (sesiunea MongoDB nu suportă operații paralele în tranzacție)
    const orderItems = [];
    for (const { product: productId, quantity } of items) {
      const product = await Product.findOneAndUpdate(
        { _id: productId, variants: { $elemMatch: { "stock.quantity": { $gte: quantity } } } },
        { $inc: { "variants.$.stock.quantity": -quantity } },
        { new: true, session }
      );

      if (!product) {
        const exists = await Product.findById(productId).session(session);
        if (!exists) throw new ErrorResponse(`Product ${productId} not found`, 404);
        throw new ErrorResponse(
          `Stoc insuficient pentru ${exists.brand} ${exists.model || ""}`.trim(),
          400
        );
      }

      orderItems.push({
        product: product._id,
        brand: product.brand,
        model: product.model || "",
        price: product.minPrice ?? product.variants?.[0]?.price ?? 0,
        quantity,
      });
    }

    [order] = await Order.create(
      [{
        user: req.user.id,
        items: orderItems,
        deliveryAddress: {
          street: address.street,
          city: address.city,
          county: address.county,
          zip: address.zip,
          phone: address.phone,
        },
        paymentMethod,
        creditsUsed,
        ...(installmentPlan ? { installmentPlan } : {}),
      }],
      { session }
    );

    if (creditsUsed > 0 && shopCard) {
      await ShopCard.findOneAndUpdate(
        { user: req.user.id, credits: { $gte: creditsUsed } },
        { $inc: { credits: -creditsUsed } },
        { session }
      );
    }

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }

  // Tranzacție credits-spent după commit
  if (creditsUsed > 0 && shopCard) {
    CardTransaction.create({
      card: shopCard._id,
      user: req.user.id,
      type: "credits-spent",
      amount: -creditsUsed,
      description: `Plată comandă #${order._id.toString().slice(-6).toUpperCase()}`,
      orderId: order._id,
    }).catch(() => {});
  }

  const amountAfterCredits = Math.max(0, order.totalPrice - creditsUsed);

  // Stripe PaymentIntent — în afara tranzacției DB
  if (paymentMethod === "Card" && amountAfterCredits > 0) {
    let paymentIntent;
    try {
      if (savedPaymentMethodId) {
        paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amountAfterCredits * 100),
          currency: "ron",
          customer: req.user.stripeCustomerId,
          payment_method: savedPaymentMethodId,
          confirm: true,
          return_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/cart/checkout`,
          metadata: { orderId: order._id.toString() },
        });
      } else {
        paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amountAfterCredits * 100),
          currency: "ron",
          payment_method_types: ["card"],
          metadata: { orderId: order._id.toString() },
        });
      }
    } catch (stripeErr) {
      await Promise.all(
        order.items.map(({ product: productId, quantity }) =>
          Product.findByIdAndUpdate(productId, { $inc: { "variants.0.stock.quantity": quantity } })
        )
      );
      order.status = ORDER_STATUS.CANCELLED;
      await order.save();
      return next(new ErrorResponse(`Stripe: ${stripeErr.message}`, 502));
    }

    order.stripePaymentIntentId = paymentIntent.id;
    await order.save();

    if (savedPaymentMethodId && paymentIntent.status === "succeeded") {
      order.isPaid = true;
      order.paidAt = new Date();
      order.status = ORDER_STATUS.PROCESSING;
      await order.save();
      return res.status(201).json({ success: true, order });
    }

    return res.status(201).json({ success: true, order, clientSecret: paymentIntent.client_secret });
  }

  if (paymentMethod === "Card" && amountAfterCredits === 0) {
    order.isPaid = true;
    order.paidAt = new Date();
    order.status = ORDER_STATUS.PROCESSING;
    await order.save();
  }

  res.status(201).json({ success: true, order });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) return next(new ErrorResponse("Order not found", 404));

  if (order.user.toString() !== req.user.id) {
    return next(new ErrorResponse("Not authorized", 401));
  }

  if (order.status !== ORDER_STATUS.PENDING) {
    return next(new ErrorResponse("Only pending orders can be cancelled", 400));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Promise.all(
      order.items.map(({ product: productId, quantity }) =>
        Product.findByIdAndUpdate(
          productId,
          { $inc: { "variants.0.stock.quantity": quantity } },
          { session }
        )
      )
    );

    order.status = ORDER_STATUS.CANCELLED;
    await order.save({ session });

    await session.commitTransaction();
    res.status(200).json({ success: true, order });
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
});

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const query = status ? { status } : {};
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(query).sort("-createdAt").skip(skip).limit(Number(limit)).populate("user", "name email"),
    Order.countDocuments(query),
  ]);

  res.status(200).json({ success: true, total, page: Number(page), orders });
});

// @desc    Update order status (admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!Object.values(ORDER_STATUS).includes(status)) {
    return next(new ErrorResponse(`Invalid status: ${status}`, 400));
  }

  const order = await Order.findById(req.params.id);
  if (!order) return next(new ErrorResponse("Order not found", 404));

  if (order.status === ORDER_STATUS.CANCELLED) {
    return next(new ErrorResponse("Cannot update a cancelled order", 400));
  }

  order.status = status;
  if (status === ORDER_STATUS.DELIVERED) {
    order.deliveredAt = Date.now();
    const orderRef = `#${order._id.toString().slice(-6).toUpperCase()}`;
    awardPoints(order.user, order.totalPrice - (order.creditsUsed || 0), order._id, orderRef)
      .then(async (result) => {
        if (result?.pointsEarned) {
          await Order.findByIdAndUpdate(order._id, { pointsEarned: result.pointsEarned });
        }
      })
      .catch(() => {});
  }

  await order.save();

  res.status(200).json({ success: true, order });
});
