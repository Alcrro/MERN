const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../../utilitis/errorResponse");
const { ShopCard } = require("../../models/shopCard/ShopCard");
const { CardTransaction } = require("../../models/shopCard/CardTransaction");
const { createCardForUser } = require("./shopCardService");
const stripe = require("../../utils/stripe");

const CREDIT_PACKAGES = {
  "50":  { credits: 50,  priceRON: 50  },
  "100": { credits: 100, priceRON: 95  },
  "250": { credits: 250, priceRON: 220 },
  "500": { credits: 500, priceRON: 400 },
};

// @desc    Get current user's shop card
// @route   GET /api/shop-card/my
// @access  Private
exports.getMyCard = asyncHandler(async (req, res) => {
  let card = await ShopCard.findOne({ user: req.user.id });
  if (!card) card = await createCardForUser(req.user.id);
  res.status(200).json({ success: true, data: card });
});

// @desc    Get card transactions (paginated)
// @route   GET /api/shop-card/transactions
// @access  Private
exports.getTransactions = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const card = await ShopCard.findOne({ user: req.user.id }).select("_id");
  const [data, count] = await Promise.all([
    CardTransaction.find({ user: req.user.id })
      .sort("-createdAt")
      .skip(skip)
      .limit(limit)
      .select("-__v"),
    CardTransaction.countDocuments({ user: req.user.id }),
  ]);

  res.status(200).json({ success: true, count, page, data });
});

// @desc    Initiate Stripe PaymentIntent for credit top-up
// @route   POST /api/shop-card/top-up
// @access  Private
exports.topUp = asyncHandler(async (req, res, next) => {
  const pkg = CREDIT_PACKAGES[req.body.package];
  if (!pkg) {
    return next(new ErrorResponse("Pachet invalid. Alege: 50, 100, 250 sau 500", 400));
  }

  const card = await ShopCard.findOne({ user: req.user.id }).select("_id");
  if (!card) return next(new ErrorResponse("Card not found", 404));

  const paymentIntent = await stripe.paymentIntents.create({
    amount: pkg.priceRON * 100,
    currency: "ron",
    payment_method_types: ["card"],
    metadata: {
      type: "shop-card-topup",
      userId: req.user.id,
      cardId: card._id.toString(),
      credits: String(pkg.credits),
    },
  });

  res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
    amount: pkg.priceRON,
    credits: pkg.credits,
  });
});

// @desc    Convert points to credits
// @route   POST /api/shop-card/redeem-points
// @access  Private
exports.redeemPoints = asyncHandler(async (req, res, next) => {
  const points = Number(req.body.points);

  if (!points || points < 10 || points % 10 !== 0) {
    return next(new ErrorResponse("Minim 10 puncte, multiplu de 10", 400));
  }

  const card = await ShopCard.findOne({ user: req.user.id });
  if (!card) return next(new ErrorResponse("Card not found", 404));

  if (card.points < points) {
    return next(new ErrorResponse("Puncte insuficiente", 400));
  }

  const creditsAdded = points / 10;

  const updated = await ShopCard.findOneAndUpdate(
    { user: req.user.id, points: { $gte: points } },
    { $inc: { points: -points, credits: creditsAdded } },
    { new: true }
  );

  if (!updated) return next(new ErrorResponse("Operație eșuată, încearcă din nou", 409));

  await CardTransaction.create({
    card: card._id,
    user: req.user.id,
    type: "points-redeemed",
    amount: -points,
    description: `Conversie ${points} puncte → ${creditsAdded} credite`,
  });

  res.status(200).json({
    success: true,
    creditsAdded,
    newCredits: updated.credits,
    newPoints: updated.points,
  });
});

// @desc    Apply referral code
// @route   POST /api/shop-card/referral/apply
// @access  Private
exports.applyReferral = asyncHandler(async (req, res, next) => {
  const { referralCode } = req.body;
  if (!referralCode) return next(new ErrorResponse("referralCode lipsește", 400));

  const myCard = await ShopCard.findOne({ user: req.user.id });
  if (!myCard) return next(new ErrorResponse("Card not found", 404));

  if (myCard.hasUsedReferral) {
    return next(new ErrorResponse("Ai folosit deja un cod de referral", 400));
  }

  const referrerCard = await ShopCard.findOne({ referralCode: referralCode.toUpperCase() });
  if (!referrerCard) return next(new ErrorResponse("Cod de referral invalid", 400));

  if (referrerCard.user.toString() === req.user.id) {
    return next(new ErrorResponse("Nu poți folosi propriul cod de referral", 400));
  }

  await Promise.all([
    ShopCard.findOneAndUpdate({ user: req.user.id }, { $inc: { points: 50 }, hasUsedReferral: true, referredBy: referrerCard.user }),
    ShopCard.findOneAndUpdate({ _id: referrerCard._id }, { $inc: { points: 100 } }),
  ]);

  await Promise.all([
    CardTransaction.create({
      card: myCard._id,
      user: req.user.id,
      type: "referral-bonus",
      amount: 50,
      description: "Bonus referral primit",
    }),
    CardTransaction.create({
      card: referrerCard._id,
      user: referrerCard.user,
      type: "referral-bonus",
      amount: 100,
      description: `Referral acceptat`,
    }),
  ]);

  res.status(200).json({ success: true, bonusPoints: 50 });
});
