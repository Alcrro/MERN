const ErrorResponse = require("../../utilitis/errorResponse");
const asyncHandler = require("express-async-handler");
const Products = require("../../models/product/Product");

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  const { search, sort, brand, rating, model, kind, tip, availability } = req.query;

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 30);
  const skip = (page - 1) * limit;

  const queryObject = {};

  if (search) {
    queryObject.$text = { $search: search };
  }
  if (brand) {
    const brands = Array.isArray(brand) ? brand : [brand];
    queryObject.brand = { $in: brands };
  }
  if (rating) {
    queryObject["rating.average"] = { $gte: Number(rating) };
  }
  if (model) {
    const models = Array.isArray(model) ? model : [model];
    queryObject.model = { $in: models };
  }
  if (kind) {
    queryObject.kind = kind;
  }
  if (tip) {
    queryObject.tip = tip;
  }
  if (availability) {
    queryObject["stock.availability"] = availability;
  }

  const sortMap = {
    "Price: Low to High":   "price",
    "Price: High to Low":   "-price",
    "Newest":               "-createdAt",
    "Oldest":               "createdAt",
    "Rating: Low to High":  "rating.average",
    "Rating: High to Low":  "-rating.average",
    "-rating":              "-rating.average",
    "price":                "price",
  };
  const sortStr = sortMap[sort] || "-createdAt";

  const [queryProducts, totalFiltered, totalProducts] = await Promise.all([
    Products.find(queryObject).sort(sortStr).skip(skip).limit(limit),
    Products.countDocuments(queryObject),
    Products.find({}).sort("-createdAt"),
  ]);

  const numberOfPages = Math.ceil(totalFiltered / limit);

  res.status(200).json({
    success: true,
    totalProductsNumberQuery: totalFiltered,
    numberOfPages,
    currentPage: page,
    limit,
    queryProducts,
    totalProducts,
  });
});

// @desc    Fetch single product
// @route   GET /api/product/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Products.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    product: product,
  });
});

// @desc 	Create a product
// @route 	POST /api/product
// @access 	Private/Admin
exports.postProduct = asyncHandler(async (req, res, next) => {
  const {
    productBrand,
    productModel,
    productMemorieInterna,
    price,
    description,
    stock,
    availability,
  } = req.body;

  const product = await Products.create({
    brand: productBrand,
    model: productModel,
    memorieInterna: productMemorieInterna,
    price: price,
    description: description,
    rating: { average: 0, count: 0 },
    stock: { quantity: stock ?? 0, availability: availability ?? "In Stoc" },
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    product,
    message: "Product created successfully",
  });
});

