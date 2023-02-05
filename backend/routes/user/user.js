const express = require("express");
const { getUsers } = require("../../controllers/user/user");

const router = express.Router();

router.route("/users").get(getUsers);

module.exports = router;
