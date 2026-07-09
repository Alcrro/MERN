const express = require("express");
const router = express.Router();
const { getCategories } = require("../../controllers/categories/categories");

router.get("/", getCategories);

module.exports = router;
