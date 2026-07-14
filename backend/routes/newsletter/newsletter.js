const express = require("express");
const { subscribeNewsletter, unsubscribeNewsletter } = require("../../controllers/newsletter/newsletter");

const router = express.Router();

router.route("/subscribe").post(subscribeNewsletter);
router.route("/unsubscribe").get(unsubscribeNewsletter);

module.exports = router;
