const ErrorResponse = require("../../utilitis/errorResponse");
const asyncHandler = require("express-async-handler");
const Products = require("../../models/product/Product");

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  const { search, sort, brand, rating, model, kind, tip, availability, stocare, ram, culoare } = req.query;

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 30);
  const skip = (page - 1) * limit;

  const queryObject = { listingStatus: "approved" };

  if (search) {
    queryObject.$text = { $search: search };
  }
  if (brand) {
    const brands = Array.isArray(brand) ? brand : [brand];
    queryObject.brand = { $in: brands };
  }
  if (rating) {
    queryObject["rating.average"] = { $gte: parseFloat(rating) };
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
    const avArr = Array.isArray(availability) ? availability : [availability];
    queryObject["stock.availability"] = { $in: avArr };
  }
  if (stocare) {
    const stocareArr = Array.isArray(stocare) ? stocare : [stocare];
    queryObject.stocare = { $in: stocareArr };
  }
  if (ram) {
    const ramArr = Array.isArray(ram) ? ram : [ram];
    queryObject.RAM = { $in: ramArr };
  }
  if (culoare) {
    const culoareArr = Array.isArray(culoare) ? culoare : [culoare];
    queryObject.culoare = { $in: culoareArr };
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
    Products.find({ listingStatus: "approved" }).sort("-createdAt"),
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

// @desc    Fetch single product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
exports.getProductBySlug = asyncHandler(async (req, res, next) => {
  const product = await Products.findOne({ slug: req.params.slug });

  if (!product) {
    return next(new ErrorResponse(`Product not found with slug ${req.params.slug}`, 404));
  }

  res.status(200).json({ success: true, product });
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
    culoare,
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
    ...(culoare && { culoare }),
  });

  res.status(201).json({
    success: true,
    product,
    message: "Product created successfully",
  });
});

