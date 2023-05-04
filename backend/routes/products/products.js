const express = require("express");
const {
  getProducts,
  postProduct,
  getProduct,
  addToCart,
} = require("../../controllers/products/products");

const router = express.Router();

router.route("/products").get(getProducts);
router.route("/admin/product").post(postProduct);
router.route("/product/:id").get(getProduct);
router.route("/add-to-cart").post(addToCart);

module.exports = router;
