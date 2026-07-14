const express = require("express");
const { subscribeNewsletter } = require("../../controllers/newsletter/newsletter");

const router = express.Router();

router.route("/subscribe").post(subscribeNewsletter);

module.exports = router;
