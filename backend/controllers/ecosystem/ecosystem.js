const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../../utilitis/errorResponse");
const EcosystemCache = require("../../models/ecosystemCache/EcosystemCache");
const FALLBACK = require("../../utils/productEcosystemFallback");

const TTL_MS = 7 * 24 * 60 * 60 * 1000;
const BASE   = "/products/electronice";

const addSlugs = (data) => {
  const withSlug = (item) => ({ ...item, slug: `${BASE}/${toSlug(item.label)}` });
  return {
    critical:    data.critical.map(withSlug),
    recommended: data.recommended.map(withSlug),
    tasks: data.tasks.map((t) => ({ ...t, items: t.items.map(withSlug) })),
  };
};

const buildPrompt = (tip) => `\
Ești un expert în produse electronice și accesorii pentru o platformă de e-commerce din România.

Generează un ecosystem de accesorii pentru produsul de tip: "${tip}".

Regulile ecosistemului:
- "critical": max 3 accesorii FĂRĂ de care produsul nu funcționează bine sau deloc. Fiecare are: label, reason (1 propoziție), icon (emoji).
- "recommended": max 5 accesorii care completează semnificativ experiența. Fiecare are: label, reason (1 propoziție), icon (emoji).
- "tasks": 3-6 scenarii de utilizare nișate. Fiecare task are: id (slug fără spații), label, icon (emoji), context (max 15 cuvinte), items (3-4 obiecte cu label și icon).

Răspunde EXCLUSIV în limba română.
Răspunde cu un obiect JSON valid cu exact cheile: critical, recommended, tasks.
Nu include URL-uri sau slug-uri.`;

exports.getEcosystem = asyncHandler(async (req, res, next) => {
  const tip = decodeURIComponent(req.params.tip || "").trim();
  if (!tip) return next(new ErrorResponse("tip is required", 400));

  const cached = await EcosystemCache.findOne({ tip });
  if (cached) {
    return res.json({ tip, source: "cache", data: cached.data });
  }

  const fallback = FALLBACK[tip] ?? null;
  return res.json({ tip, source: "static", data: fallback });
});
