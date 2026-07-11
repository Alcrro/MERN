const CatalogProduct = require("../../models/catalog/CatalogProduct");

const listCatalog = async (req, res) => {
  try {
    const { kind, brand, tip, page = 1, limit = 24 } = req.query;
    const filter = {};
    if (kind) filter.kind = kind;
    if (brand) filter.brand = new RegExp(brand.trim(), "i");
    if (tip) filter["specs.tip"] = tip;
    const cap = Math.min(Number(limit), 50);
    const skip = (Math.max(Number(page), 1) - 1) * cap;
    const [results, total] = await Promise.all([
      CatalogProduct.find(filter).sort({ brand: 1 }).skip(skip).limit(cap),
      CatalogProduct.countDocuments(filter),
    ]);
    res.json({ results, total, page: Number(page), pages: Math.ceil(total / cap) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const searchCatalog = async (req, res) => {
  try {
    const { q, kind, limit } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: "Query prea scurt (minim 2 caractere)" });
    }

    const cap = Math.min(Number(limit) || 10, 20);
    const filter = { $text: { $search: q.trim() } };
    if (kind) filter.kind = kind;

    const results = await CatalogProduct.find(filter, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .limit(cap);

    res.json({ results, count: results.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createCatalogEntry = async (req, res) => {
  try {
    const entry = await CatalogProduct.create(req.body);
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateCatalogEntry = async (req, res) => {
  try {
    const entry = await CatalogProduct.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!entry) return res.status(404).json({ message: "Intrare negăsită" });
    res.json(entry);
  } catch (err) {
    const status = err.name === "CastError" ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
};

const deleteCatalogEntry = async (req, res) => {
  try {
    const entry = await CatalogProduct.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ message: "Intrare negăsită" });
    res.json({ message: "Șters cu succes" });
  } catch (err) {
    const status = err.name === "CastError" ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
};

module.exports = { listCatalog, searchCatalog, createCatalogEntry, updateCatalogEntry, deleteCatalogEntry };
