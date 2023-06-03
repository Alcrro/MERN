const ErrorResponse = require("../../utilitis/errorResponse");
const asyncHandler = require("express-async-handler");
const Products = require("../../models/product/products");
const Register = require("../../models/auth/register");

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
  if (sort === "Price: Low to High") {
    result = result.sort("price");
  }
  if (sort === "Price: High to Low") {
    result = result.sort("-price");
  }
  if (sort === "Newest") {
    result = result.sort("-createdAt");
  }
  if (sort === "Oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "Rating: Low to High") {
    result = result.sort("rating");
  }
  if (sort === "Rating: High to Low") {
    result = result.sort("-rating");
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
    productRating,
    productModel,
    productMemorieInterna,
    price,
    description,
    admin,
  } = req.body;

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

// @desc 	Add a product to cart
// @route 	POST /api/add-to-cart
// @access 	Public

exports.addToCart = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const product = await Products.findById(req.user.id);

  // const products = await Products.find();
  // products.map((product) => {
  //   if (product._id == req.body.id) {
  //     product.cart = true;
  //     product.save();
  //   }
  // });

  res.status(201).json({
    success: true,
    products,
    message: "Product added to cart successfully",
  });
});
