const stripe = require("../../utils/stripe");
const { Order, ORDER_STATUS } = require("../../models/order/Order");
const Product = require("../../models/product/Product");
const StripeEvent = require("../../models/stripe/StripeEvent");
const { ShopCard } = require("../../models/shopCard/ShopCard");
const { CardTransaction } = require("../../models/shopCard/CardTransaction");
const { generateRewardVouchers, invalidateOrderVouchers } = require("../voucher/voucherRewardService");

async function handleShopCardTopUp(pi) {
  const { userId, cardId, credits } = pi.metadata || {};
  if (!userId || !cardId || !credits) return;

  const alreadyProcessed = await CardTransaction.findOne({ stripePaymentIntentId: pi.id, type: "credit-purchase" });
  if (alreadyProcessed) return;

  const creditsNum = Number(credits);
  await ShopCard.findOneAndUpdate(
    { _id: cardId, user: userId },
    { $inc: { credits: creditsNum } }
  );

  const card = await ShopCard.findById(cardId);
  if (card) {
    await CardTransaction.create({
      card: cardId,
      user: userId,
      type: "credit-purchase",
      amount: creditsNum,
      description: `Pachet ${creditsNum} credite`,
      stripePaymentIntentId: pi.id,
    });
  }
}

async function handlePaymentSucceeded(pi) {
  if (pi.metadata?.type === "shop-card-topup") {
    return handleShopCardTopUp(pi);
  }

  const order = await Order.findOne({ stripePaymentIntentId: pi.id });
  if (!order) return;

  let last4 = null, brand = null, receiptUrl = null;

  if (pi.charges?.data?.length) {
    const charge = pi.charges.data[0];
    last4 = charge.payment_method_details?.card?.last4 ?? null;
    brand = charge.payment_method_details?.card?.brand ?? null;
    receiptUrl = charge.receipt_url ?? null;
  } else if (pi.latest_charge && typeof pi.latest_charge === "string") {
    const charge = await stripe.charges.retrieve(pi.latest_charge);
    last4 = charge.payment_method_details?.card?.last4 ?? null;
    brand = charge.payment_method_details?.card?.brand ?? null;
    receiptUrl = charge.receipt_url ?? null;
  }

  order.isPaid = true;
  order.paidAt = new Date();
  order.status = ORDER_STATUS.PROCESSING;
  order.paymentDetails = { last4, brand, receiptUrl };
  await order.save();
  generateRewardVouchers(order).catch(() => {});
}

async function restoreStockAndCancel(pi) {
  const order = await Order.findOne({ stripePaymentIntentId: pi.id });
  if (!order || order.status === ORDER_STATUS.CANCELLED) return;

  await Promise.all(
    order.items.map(({ product: productId, quantity }) =>
      Product.findByIdAndUpdate(productId, { $inc: { "variants.0.stock.quantity": quantity } })
    )
  );
  order.status = ORDER_STATUS.CANCELLED;
  await order.save();
}

async function handleChargeRefunded(charge) {
  const order = await Order.findOne({ stripePaymentIntentId: charge.payment_intent });
  if (!order) return;

  order.isPaid = false;
  order.isRefunded = true;
  order.refundedAt = new Date();
  await order.save();

  const { revokePoints } = require("../shopCard/shopCardService");
  revokePoints(order._id).catch(() => {});
  invalidateOrderVouchers(order._id).catch(() => {});
}

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return res.status(400).send("Webhook signature verification failed");
  }

  const obj = event.data.object;
  const orderId = obj.metadata?.orderId ?? obj.payment_intent ?? null;

  try {
    await StripeEvent.create({ eventId: event.id, type: event.type, orderId: orderId || undefined });
  } catch (err) {
    if (err.code === 11000) return res.json({ received: true });
    return res.status(500).json({ received: false });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(obj);
        break;
      case "payment_intent.payment_failed":
      case "payment_intent.canceled":
        await restoreStockAndCancel(obj);
        break;
      case "charge.refunded":
        await handleChargeRefunded(obj);
        break;
    }
  } catch {
    return res.status(500).json({ received: false });
  }

  res.json({ received: true });
};

exports.getStripeConfig = (_req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
};
