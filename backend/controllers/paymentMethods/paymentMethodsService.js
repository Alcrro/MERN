const stripe = require("../../utils/stripe");
const { Register } = require("../../models/auth/register");

async function getOrCreateStripeCustomer(user) {
  if (user.stripeCustomerId) return user.stripeCustomerId;

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: { userId: user._id.toString() },
  });

  await Register.findByIdAndUpdate(user._id, { stripeCustomerId: customer.id });
  return customer.id;
}

module.exports = { getOrCreateStripeCustomer };
