const asyncHandler = require("express-async-handler");
const { Order, ORDER_STATUS } = require("../../models/order/Order");
const Product = require("../../models/product/Product");
const { Address } = require("../../models/address/Address");
const ErrorResponse = require("../../utilitis/errorResponse");

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
  const { items, addressId, paymentMethod } = req.body;

  if (!items?.length) {
    return next(new ErrorResponse("No order items", 400));
  }

  const address = await Address.findOne({ _id: addressId, user: req.user.id });
  if (!address) return next(new ErrorResponse("Address not found", 404));

  // snapshot produse + verifica stoc
  const orderItems = await Promise.all(
    items.map(async ({ product: productId, quantity }) => {
      const product = await Product.findById(productId);

      if (!product) throw new ErrorResponse(`Product ${productId} not found`, 404);
      if (product.stock.quantity < quantity) {
        throw new ErrorResponse(
          `Insufficient stock for ${product.brand} ${product.model}`,
          400
        );
      }

      // scade stocul
      product.stock.quantity -= quantity;
      await product.save();

      return {
        product: product._id,
        brand: product.brand,
        model: product.model,
        price: product.price,
        quantity,
      };
    })
  );

  const order = await Order.create({
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
  });

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

  // returneaza stocul
  await Promise.all(
    order.items.map(async (item) => {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock.quantity += item.quantity;
        await product.save();
      }
    })
  );

  order.status = ORDER_STATUS.CANCELLED;
  await order.save();

  res.status(200).json({ success: true, order });
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
  if (status === ORDER_STATUS.DELIVERED) order.deliveredAt = Date.now();

  await order.save();

  res.status(200).json({ success: true, order });
});
