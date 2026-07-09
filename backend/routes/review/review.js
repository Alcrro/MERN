const express = require("express");
const router = express.Router({ mergeParams: true });
const { getReviews, addReview, deleteReview } = require("../../controllers/review/review");
const { protect } = require("../../middleware/auth/auth");

router.route("/").get(getReviews).post(protect, addReview);
router.route("/:id").delete(protect, deleteReview);

module.exports = router;
