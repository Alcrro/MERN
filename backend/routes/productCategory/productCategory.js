const express = require("express");
const router = express.Router();
const {
  getCategories,
  getCategory,
  postCategory,
} = require("../../controllers/productCategory/productCategory");

const { protect } = require("../../middleware/auth/auth");

router.route("/categories").get(getCategories);
router.route("/add-category").post(protect, postCategory);

module.exports = router;
