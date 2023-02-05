const express = require("express");
const { protect } = require("../../middleware/auth/auth");
const { index } = require("../../controllers/index/index");

const router = express.Router();

router.route("/").get(protect, index);

module.exports = router;
