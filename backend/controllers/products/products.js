const ErrorResponse = require("../../utilitis/errorResponse");
const asyncHandler = require("express-async-handler");
const Products = require("../../models/products/Products");

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  const { search, sort, brand, rating, model } = req.query;
  const products = await Products.find({});

  //Check is there any query

  // const limit = 10;
  // const skip = 1;
  const queryObject = {};
  console.log(queryObject);

  // if (search) {
  //   queryObject.name = { $regex: search, $options: "i" };
  // }

  //no await
  let result = Products.find(queryObject);

  // chian sort conditions
  if (sort === "asc") {
    result = result.sort("price");
  }
  if (sort === "desc") {
    result = result.sort("-price");
  }
  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }

  if (brand) {
    result = result.find({ brand: brand });
  }
  if (rating) {
    result = result.find({ rating: rating });
  }
  if (model) {
    result = result.find({ model: model });
  }

  //chain skip and limit
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 30;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const test = await result;

  const totalProducts = await Products.countDocuments();
  const numberOfPages = Math.ceil(totalProducts / limit);

  res.status(200).json({
    success: true,
    totalProductsNumberQuery: totalProducts,
    numberOfPages,
    currentPage: page,
    limit,
    queryProducts: test,
    totalProducts: products,
    // test: products,
  });
});

// @desc    Fetch single product
// @route   GET /api/product/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Products.findById(req.params.id);

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
    productRating,
    productModel,
    productMemorieInterna,
    price,
    description,
    admin,
  } = req.body;
  console.log(req.body);

  const nameProduct = await Products.findOne({ name: productBrand });

  if (nameProduct === productBrand) {
    res.status(400);
    throw new Error("Product already exists");
  }

  const product = await Products.create({
    brand: productBrand,
    rating: productRating,
    model: productModel,
    memorieInterna: productMemorieInterna,
    price: price,
    description: description,
  });

  res.status(201).json({
    success: true,
    product: product,
    message: "Product created successfully",
  });
});
