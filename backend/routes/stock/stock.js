const express = require("express");
const router = express.Router({ mergeParams: true });
const { getStock, updateStock } = require("../../controllers/stock/stock");
const { protect } = require("../../middleware/auth/auth");

router.route("/").get(getStock).put(protect, updateStock);

module.exports = router;
