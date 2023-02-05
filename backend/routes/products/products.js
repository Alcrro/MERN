const express = require("express");
const { getProducts, postProduct, getProduct } = require("../../controllers/products/products");

const router = express.Router();

router.route("/products").get(getProducts);
router.route("/product").post(postProduct);
router.route("/product/:id").get(getProduct);

module.exports = router;
