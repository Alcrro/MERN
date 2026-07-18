const asyncHandler = require("express-async-handler");
const stripe = require("../../utils/stripe");
const ErrorResponse = require("../../utilitis/errorResponse");
const { getOrCreateStripeCustomer } = require("./paymentMethodsService");

// @desc    Create SetupIntent for saving a card
// @route   POST /api/payment-methods/setup
// @access  Private
exports.setupIntent = asyncHandler(async (req, res, next) => {
  const customerId = await getOrCreateStripeCustomer(req.user);
  const existing = await stripe.paymentMethods.list({ customer: customerId, type: "card" });
  if (existing.data.length >= 5) return next(new ErrorResponse("Maximum 5 carduri salvate", 400));
  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ["card"],
  });
  res.json({ success: true, clientSecret: setupIntent.client_secret });
});

// @desc    List saved payment methods
// @route   GET /api/payment-methods
// @access  Private
exports.listPaymentMethods = asyncHandler(async (req, res) => {
  const customerId = await getOrCreateStripeCustomer(req.user);

  const [paymentMethods, customer] = await Promise.all([
    stripe.paymentMethods.list({ customer: customerId, type: "card" }),
    stripe.customers.retrieve(customerId),
  ]);

  const defaultPmId = customer.invoice_settings?.default_payment_method;

  const data = paymentMethods.data.map((pm) => ({
    id: pm.id,
    brand: pm.card.brand,
    last4: pm.card.last4,
    expMonth: pm.card.exp_month,
    expYear: pm.card.exp_year,
    isDefault: pm.id === defaultPmId,
  }));

  res.json({ success: true, data });
});

// @desc    Delete a saved payment method
// @route   DELETE /api/payment-methods/:pmId
// @access  Private
exports.deletePaymentMethod = asyncHandler(async (req, res, next) => {
  const { pmId } = req.params;
  const customerId = req.user.stripeCustomerId;

  if (!customerId) return next(new ErrorResponse("Not authorized", 403));

  const pm = await stripe.paymentMethods.retrieve(pmId);
  if (pm.customer !== customerId) {
    return next(new ErrorResponse("Not authorized", 403));
  }

  const customer = await stripe.customers.retrieve(customerId);
  const wasDefault = customer.invoice_settings?.default_payment_method === pmId;

  await stripe.paymentMethods.detach(pmId);

  if (wasDefault) {
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: "" },
    });
  }

  res.json({ success: true });
});

// @desc    Set a payment method as default
// @route   PUT /api/payment-methods/:pmId/default
// @access  Private
exports.setDefaultPaymentMethod = asyncHandler(async (req, res, next) => {
  const { pmId } = req.params;
  const customerId = req.user.stripeCustomerId;

  if (!customerId) return next(new ErrorResponse("Not authorized", 403));

  const pm = await stripe.paymentMethods.retrieve(pmId);
  if (pm.customer !== customerId) {
    return next(new ErrorResponse("Not authorized", 403));
  }

  await stripe.customers.update(customerId, {
    invoice_settings: { default_payment_method: pmId },
  });

  res.json({ success: true });
});
