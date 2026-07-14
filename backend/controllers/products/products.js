const ErrorResponse = require("../../utilitis/errorResponse");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Products = require("../../models/product/Product");
const { generateSku } = require("../../utils/skuGenerator");

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  const { search, sort, brand, rating, model, kind, tip, availability, stocare, ram, culoare } = req.query;

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 30);
  const skip = (page - 1) * limit;

  const queryObject = {
    listingStatus: "approved",
    $or: [
      { publishStatus: "published" },
      { publishStatus: { $exists: false } },
      { vendor: null },
    ],
  };

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
    const kindArr = Array.isArray(kind) ? kind : [kind];
    queryObject.kind = { $in: kindArr };
  }
  if (tip) {
    const tipArr = Array.isArray(tip) ? tip : [tip];
    queryObject.tip = { $in: tipArr };
  }
  if (availability) {
    const avArr = Array.isArray(availability) ? availability : [availability];
    queryObject["variants.stock.availability"] = { $in: avArr };
  }
  if (stocare) {
    const stocareArr = Array.isArray(stocare) ? stocare : [stocare];
    queryObject["variants.attributes.Stocare"] = { $in: stocareArr };
  }
  if (ram) {
    const ramArr = Array.isArray(ram) ? ram : [ram];
    queryObject.RAM = { $in: ramArr };
  }
  if (culoare) {
    const culoareArr = Array.isArray(culoare) ? culoare : [culoare];
    queryObject["variants.attributes.Culoare"] = { $in: culoareArr };
  }

  const sortMap = {
    "Price: Low to High":  { minPrice: 1 },
    "Price: High to Low":  { minPrice: -1 },
    "Newest":              { createdAt: -1 },
    "Oldest":              { createdAt: 1 },
    "Rating: Low to High": { "rating.average": 1 },
    "Rating: High to Low": { "rating.average": -1 },
    "-rating":             { "rating.average": -1 },
    "price":               { minPrice: 1 },
  };
  const sortObj = sortMap[sort] || { createdAt: -1 };

  // Group by catalogRef so multiple vendors selling the same product → 1 card.
  // Pre-sort by minPrice ASC so $first always picks the cheapest listing per group.
  const basePipeline = [
    { $match: queryObject },
    { $sort: { minPrice: 1 } },
    { $group: {
      _id: { $ifNull: ["$catalogRef", "$_id"] },
      doc: { $first: "$$ROOT" },
      sellersCount: { $sum: 1 },
    }},
    { $replaceRoot: { newRoot: { $mergeObjects: ["$doc", { sellersCount: "$sellersCount" }] } } },
    { $sort: sortObj },
  ];

  const [queryProducts, countResult, totalProducts] = await Promise.all([
    Products.aggregate([...basePipeline, { $skip: skip }, { $limit: limit }]),
    Products.aggregate([
      { $match: queryObject },
      { $group: { _id: { $ifNull: ["$catalogRef", "$_id"] } } },
      { $count: "total" },
    ]),
    Products.find({ listingStatus: "approved", $or: [{ publishStatus: "published" }, { publishStatus: { $exists: false } }, { vendor: null }] }).sort("-createdAt"),
  ]);

  const totalFiltered = countResult[0]?.total ?? 0;
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
  const product = await Products.findById(req.params.id)
    .populate("vendor", "shopName vendorProfile");

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    product: product,
  });
});

// @desc    Fetch single product by SKU
// @route   GET /api/product/sku/:sku
// @access  Public
exports.getProductBySku = asyncHandler(async (req, res, next) => {
  const product = await Products.findOne({ sku: req.params.sku })
    .populate("vendor", "shopName vendorProfile");

  if (!product) {
    return next(new ErrorResponse(`Product not found with sku ${req.params.sku}`, 404));
  }

  res.status(200).json({ success: true, product });
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

// @desc    Get all approved sellers for a catalog product
// @route   GET /api/products/sellers/:catalogRef
// @access  Public
exports.getSellers = asyncHandler(async (req, res, next) => {
  const { catalogRef } = req.params;

  if (!mongoose.Types.ObjectId.isValid(catalogRef)) {
    return next(new ErrorResponse("Invalid catalogRef", 400));
  }

  const sellers = await Products.find({
    catalogRef,
    listingStatus: "approved",
    vendor: { $ne: null },
    $or: [
      { publishStatus: "published" },
      { publishStatus: { $exists: false } },
    ],
  })
    .sort({ minPrice: 1 })
    .populate("vendor", "shopName vendorProfile vendorRating")
    .select("minPrice variants vendor images listingStatus rating");

  res.status(200).json({ success: true, sellers, count: sellers.length });
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
    variants,
  } = req.body;

  const resolvedVariants = variants?.length
    ? variants
    : [{ attributes: {}, price: Number(price) || 0, stock: { quantity: stock ?? 0, availability: availability ?? "In Stoc" }, images: [] }];

  const product = await Products.create({
    brand: productBrand,
    model: productModel,
    memorieInterna: productMemorieInterna,
    variants: resolvedVariants,
    description: description,
    rating: { average: 0, count: 0 },
    user: req.user.id,
    sku: generateSku(productBrand, "", productModel || ""),
    ...(culoare && { culoare }),
  });

  res.status(201).json({
    success: true,
    product,
    message: "Product created successfully",
  });
});
