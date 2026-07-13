const express = require("express");
const router  = express.Router();
const { getEcosystem } = require("../../controllers/ecosystem/ecosystem");
const { configure }    = require("../../controllers/ecosystem/configurator");

router.post("/configure", configure);
router.get("/:tip", getEcosystem);

module.exports = router;
