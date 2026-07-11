const express = require("express");
const { uploadImage } = require("../../controllers/upload/upload");
const { protect } = require("../../middleware/auth/auth");
const upload = require("../../middleware/upload/upload");

const router = express.Router();

router.post("/image", protect, upload.single("image"), uploadImage);

module.exports = router;
