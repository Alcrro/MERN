const express = require("express");
const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} = require("../../controllers/address/address");
const { protect } = require("../../middleware/auth/auth");

const router = express.Router();

router.use(protect);

router.route("/").get(getAddresses).post(addAddress);
router.route("/:id").put(updateAddress).delete(deleteAddress);

module.exports = router;
