const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O or 1/I confusion

const toAscii = (str = "") =>
  str.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z0-9]/g, "");

const cityCode  = (city  = "") => toAscii(city ).slice(0, 2).toUpperCase().padEnd(2, "X");
const brandCode = (brand = "") => toAscii(brand).slice(0, 3).toUpperCase().padEnd(3, "X");

const rand = (n) => {
  let s = "";
  for (let i = 0; i < n; i++) s += ALPHA[Math.floor(Math.random() * ALPHA.length)];
  return s;
};

// Extracts a 2-4 char article code from a model/name string.
// Priority:
//   1. Word that starts with letter(s) + digits:  "Galaxy S21" → "S21", "A15" → "A15"
//   2. Pure-digit word + first letter of preceding word: "Note 12" → "N12", "iPhone 14" → "I14"
//   3. First 3 chars of cleaned model: "Pro Max" → "PRO"
const articleCode = (model = "") => {
  const clean = model.normalize("NFD").replace(/[̀-ͯ]/g, "")
                     .replace(/[^a-zA-Z0-9\s]/g, " ").trim().toUpperCase();
  const words = clean.split(/\s+/).filter(Boolean);

  for (const w of words) {
    if (/^[A-Z]{1,2}\d/.test(w)) return w.slice(0, 4);
  }

  for (let i = 0; i < words.length; i++) {
    if (/^\d+$/.test(words[i])) {
      const prefix = i > 0 ? words[i - 1][0] : (words[0]?.[0] ?? "X");
      return (prefix + words[i]).slice(0, 4);
    }
  }

  return clean.replace(/\s/g, "").slice(0, 3) || "GEN";
};

// Format: RO[CC][BBB][AAAA][RRRR] — up to 15 chars
// RO = România · CC = depot city (2) · BBB = brand (3) · AAAA = article code (2-4) · RRRR = random (4)
// Examples:
//   Samsung Galaxy S21, București → ROBUSAMS21K4F2
//   Apple iPhone 14, Cluj        → ROCLAPPI14Q3B2
//   Xiaomi Redmi Note 12, —      → ROXXXIAN12A8V3
const generateSku = (brand, orasDepozit, model = "") =>
  "RO" + cityCode(orasDepozit) + brandCode(brand) + articleCode(model) + rand(4);

module.exports = { generateSku };
