const express = require("express");
const {
  getProducts,
  postProduct,
  getProduct,
  getProductBySlug,
  getProductBySku,
  getSellers,
} = require("../../controllers/products/products");
const { protect, authorize } = require("../../middleware/auth/auth");

const router = express.Router();

router.route("/products").get(getProducts);
router.route("/products/sellers/:catalogRef").get(getSellers);
router.route("/products/slug/:slug").get(getProductBySlug);
router.route("/products/sku/:sku").get(getProductBySku);
router.route("/products/:id").get(getProduct);
router.route("/admin/products").post(protect, authorize("vendor", "admin"), postProduct);

module.exports = router;
