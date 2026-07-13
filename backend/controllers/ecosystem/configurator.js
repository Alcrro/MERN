const asyncHandler = require("express-async-handler");
const mongoose     = require("mongoose");
const OpenAI       = require("openai");
require("../../models/product/types/Electronics");
const Product = mongoose.model("Products");

const buildPrompt = ({ tip, brand, model, scenarios, context, availableTips }) => {
  const productLine = brand && model ? `${brand} ${model} | tip: ${tip}` : tip;
  return `Ești un expert în accesorii pentru ${tip} pe o platformă de e-commerce din România.

Produs: ${productLine}

Scenarii selectate de utilizator: ${scenarios.join(", ")}
${context ? `Context suplimentar: "${context}"` : ""}

Categorii de accesorii disponibile în magazin:
${availableTips.join(", ")}

Returnează JSON cu cheia "recommendations": array de max 5 obiecte:
- "tip": exact o categorie din lista de mai sus (copiat exact, fără modificări)
- "reason": 1 propoziție în română de ce e util în contextul utilizatorului

Alege DOAR categorii din lista dată. Nu inventa categorii noi.`;
};

exports.configure = asyncHandler(async (req, res) => {
  const { tip, brand, model, scenarios = [], context = "" } = req.body;

  if (!tip) return res.status(400).json({ message: "tip is required" });
  if (!scenarios.length) return res.status(400).json({ message: "scenarios is required" });

  const allTips = await Product.distinct("tip", { tip: { $exists: true, $ne: "" } });
  const availableTips = allTips.filter((t) => t !== tip);

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await openai.chat.completions.create(
    {
      model:           "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages:        [{ role: "user", content: buildPrompt({ tip, brand, model, scenarios, context, availableTips }) }],
    },
    { signal: AbortSignal.timeout(20000) }
  );

  const { recommendations = [] } = JSON.parse(completion.choices[0].message.content);

  const settled = await Promise.all(
    recommendations.map(async (rec) => {
      const products = await Product
        .find({ tip: rec.tip, publishStatus: "published" })
        .limit(4)
        .select("brand model price images slug sku stock tip description")
        .lean();
      return { ...rec, products };
    })
  );

  const filtered = settled.filter((r) => r.products.length > 0);

  res.json({ recommendations: filtered });
});
