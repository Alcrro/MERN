const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../../middleware/auth/auth");
const {
  listCatalog,
  searchCatalog,
  createCatalogEntry,
  updateCatalogEntry,
  deleteCatalogEntry,
} = require("../../controllers/catalog/catalog");

router.get("/all", listCatalog);
router.get("/", searchCatalog);

router.use(protect, authorize("admin"));
router.post("/", createCatalogEntry);
router.put("/:id", updateCatalogEntry);
router.delete("/:id", deleteCatalogEntry);

module.exports = router;
