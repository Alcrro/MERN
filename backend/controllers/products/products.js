const e = require("express");
const asyncHandler = require("express-async-handler");
const Products = require("../../models/products/Products");

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  const products = await Products.find({});
  res.status(200).json({
    success: true,
    count: products.length,
    products: products,
  });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Products.findById(req.params.id);

  res.status(200).json({
    success: true,
    product: product,
  });
});

// @desc 	Create a product
// @route 	POST /api/product
// @access 	Private/Admin
exports.postProduct = asyncHandler(async (req, res) => {
  const { name, price, description } = req.body;

  const nameProduct = await Products.findOne({ name: name });

  //check duplicate product
  if (nameProduct === name) {
    res.status(400);
    throw new Error("Product already exists");
  }

  const product = await Products.create({
    name: name,
    price: price,
    description: description,
  });

  res.status(201).json({
    success: true,
    product: product,
    message: "Product created successfully",
  });
});
