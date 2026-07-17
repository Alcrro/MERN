const { ShopCard, TIER_MULTIPLIERS } = require("../../models/shopCard/ShopCard");
const { CardTransaction } = require("../../models/shopCard/CardTransaction");

async function createCardForUser(userId) {
  let cardNumber, referralCode, attempts = 0;

  do {
    cardNumber = ShopCard.generateCardNumber();
    referralCode = ShopCard.generateReferralCode();
    attempts++;
    if (attempts > 10) throw new Error("Could not generate unique card number");
  } while (await ShopCard.findOne({ $or: [{ cardNumber }, { referralCode }] }));

  const card = await ShopCard.create({ user: userId, cardNumber, referralCode });
  return card;
}

async function awardPoints(userId, orderTotal, orderId, orderRef) {
  const card = await ShopCard.findOne({ user: userId });
  if (!card) return;

  const base = Math.floor(orderTotal * 0.1);
  const pts = Math.floor(base * TIER_MULTIPLIERS[card.tier]);
  if (pts <= 0) return;

  const updated = await ShopCard.findOneAndUpdate(
    { user: userId },
    { $inc: { points: pts } },
    { new: true }
  );

  await CardTransaction.create({
    card: card._id,
    user: userId,
    type: "points-earned",
    amount: pts,
    description: `Comandă ${orderRef} - ${Math.round(orderTotal)} RON`,
    orderId,
  });

  await checkWelcomeBonus(card, userId);

  return { pointsEarned: pts, card: updated };
}

async function checkWelcomeBonus(card, userId) {
  const alreadyGiven = await CardTransaction.findOne({ card: card._id, type: "welcome-bonus" });
  if (alreadyGiven) return;

  await ShopCard.findOneAndUpdate({ user: userId }, { $inc: { points: 50 } });
  await CardTransaction.create({
    card: card._id,
    user: userId,
    type: "welcome-bonus",
    amount: 50,
    description: "Bonus prima comandă",
  });
}

async function revokePoints(orderId) {
  const tx = await CardTransaction.findOne({ orderId, type: "points-earned" });
  if (!tx) return;

  await ShopCard.findOneAndUpdate(
    { _id: tx.card },
    { $inc: { points: -Math.abs(tx.amount) } }
  );

  await CardTransaction.create({
    card: tx.card,
    user: tx.user,
    type: "points-earned",
    amount: -Math.abs(tx.amount),
    description: `Revocare puncte (retur comandă)`,
    orderId,
  });
}

module.exports = { createCardForUser, awardPoints, revokePoints };
