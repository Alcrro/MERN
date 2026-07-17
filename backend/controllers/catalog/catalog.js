const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../../utilitis/errorResponse");
const CatalogProduct = require("../../models/catalog/CatalogProduct");

const listCatalog = asyncHandler(async (req, res) => {
  const { kind, brand, tip, page = 1, limit = 24 } = req.query;
  const filter = {};
  if (kind) filter.kind = kind;
  if (brand) filter.brand = new RegExp(brand.trim(), "i");
  if (tip) filter["specs.tip"] = new RegExp(`^${tip.replace(/-/g, " ")}$`, "i");
  const cap = Math.min(Number(limit), 50);
  const skip = (Math.max(Number(page), 1) - 1) * cap;
  const [results, total] = await Promise.all([
    CatalogProduct.find(filter).sort({ brand: 1 }).skip(skip).limit(cap),
    CatalogProduct.countDocuments(filter),
  ]);
  res.json({ results, total, page: Number(page), pages: Math.ceil(total / cap) });
});

const searchCatalog = asyncHandler(async (req, res, next) => {
  const { q, kind, limit } = req.query;

  if (!q || q.trim().length < 2) {
    return next(new ErrorResponse("Query prea scurt (minim 2 caractere)", 400));
  }

  const cap = Math.min(Number(limit) || 10, 20);
  const filter = { $text: { $search: q.trim() } };
  if (kind) filter.kind = kind;

  const results = await CatalogProduct.find(filter, { score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" } })
    .limit(cap);

  res.json({ results, count: results.length });
});

const createCatalogEntry = asyncHandler(async (req, res) => {
  const entry = await CatalogProduct.create(req.body);
  res.status(201).json(entry);
});

const updateCatalogEntry = asyncHandler(async (req, res, next) => {
  const entry = await CatalogProduct.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!entry) return next(new ErrorResponse("Intrare negăsită", 404));
  res.json(entry);
});

const deleteCatalogEntry = asyncHandler(async (req, res, next) => {
  const entry = await CatalogProduct.findByIdAndDelete(req.params.id);
  if (!entry) return next(new ErrorResponse("Intrare negăsită", 404));
  res.json({ message: "Șters cu succes" });
});

module.exports = { listCatalog, searchCatalog, createCatalogEntry, updateCatalogEntry, deleteCatalogEntry };
