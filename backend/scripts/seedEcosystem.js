/**
 * seedEcosystem.js — generează ecosistem via OpenAI și salvează în MongoDB cache
 *
 * Rulează manual când vrei să actualizezi datele:
 *   node backend/scripts/seedEcosystem.js
 *   node backend/scripts/seedEcosystem.js Laptop
 *   node backend/scripts/seedEcosystem.js Telefon Laptop TV
 *
 * Dacă nu dai argumente, procesează toate tip-urile din TIPS.
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const mongoose = require("mongoose");
const OpenAI   = require("openai");
const EcosystemCache = require("../models/ecosystemCache/EcosystemCache");
const toSlug   = require("../utils/toSlug");

const TTL_MS = 7 * 24 * 60 * 60 * 1000;
const BASE   = "/products/electronice";

const TIPS = ["Telefon", "Laptop", "TV", "Căști", "Tabletă"];

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

async function generateForTip(openai, tip) {
  const completion = await openai.chat.completions.create(
    {
      model:           "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages:        [{ role: "user", content: buildPrompt(tip) }],
    },
    { signal: AbortSignal.timeout(30000) }
  );

  const raw  = JSON.parse(completion.choices[0].message.content);
  return addSlugs(raw);
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB\n");

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const targets = process.argv.slice(2).length ? process.argv.slice(2) : TIPS;

  for (const tip of targets) {
    process.stdout.write(`  ${tip} ... `);
    try {
      const data = await generateForTip(openai, tip);
      await EcosystemCache.findOneAndUpdate(
        { tip },
        { tip, data, source: "openai", expiresAt: new Date(Date.now() + TTL_MS) },
        { upsert: true, new: true }
      );
      console.log("✓");
    } catch (err) {
      console.log(`✗ ${err.message}`);
    }
  }

  console.log("\nDone.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
