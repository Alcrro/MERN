const express = require("express");
const {
  getProducts,
  postProduct,
  getProduct,
  getProductBySlug,
} = require("../../controllers/products/products");
const { protect, authorize } = require("../../middleware/auth/auth");

const router = express.Router();

router.route("/products").get(getProducts);
router.route("/product/:id").get(getProduct);
router.route("/products/slug/:slug").get(getProductBySlug);
router.route("/admin/product").post(protect, authorize("vendor", "admin"), postProduct);

module.exports = router;
