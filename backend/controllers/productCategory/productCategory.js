const ErrorResponse = require("../../utilitis/errorResponse");
const asyncHandler = require("express-async-handler");
const Categories = require("../../models/administrator/productCategory/phone/PhoneCategory");
const fs = require("fs");

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Categories.find({});
  res.status(200).json({
    success: true,
    count: categories.length,
    categories: categories,
  });
});

// @desc    Fetch single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Categories.findById(req.params.id);

  res.status(200).json({
    success: true,
    category: category,
  });
});

// @desc 	Create a category
// @route 	POST /api/category
// @access 	Private/Admin
exports.postCategory = asyncHandler(async (req, res, next) => {
  const { reviewsCat, phoneCategoryName } = req.body;
  // const colectionCategString = JSON.stringify(collectionName.collectionName);
  // const fileName = colectionCategString.replace(/"/g, "");
  // const fUpperCase = fileName.charAt(0).toUpperCase() + fileName.slice(1);
  // log(fUpperCase);

  // if (fs.existsSync(`./backend/models/administrator/productCategory/phone/${fUpperCase}.js`)) {
  //   return next(new ErrorResponse(`This name already exist!`, 400));
  // } else {
  //   fs.writeFile(
  //     `./backend/models/administrator/productCategory/phone/${fileName}.js`,
  //     "merge2",
  //     { overwrite: false },
  //     function (err) {
  //       if (err) throw err;
  //       console.log("Saved!");
  //     }
  //   );
  //   res.status(201).json({
  //     success: true,
  //     message: "Category created successfully",
  //   });
  // }
  // Check if category exists

  //loop through the array of categories and check if the category already exists

  const test = await Categories.create({
    phoneCategoryName,
    reviewsCat,
  });

  console.log(test);
  res.status(201).json({
    success: true,
    category: test,
    message: "Category created successfully",
  });
});
