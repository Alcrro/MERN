export const SPEC_COLS = {
  Electronics: [
    (s) => [s.stocare, s.RAM].filter(Boolean).join(" · ") || "—",
    (s) => s.procesor || "—",
  ],
  Clothing:   [
    (s) => [s.tip, s.gen].filter(Boolean).join(" · ") || "—",
    (s) => [s.material, s.fit].filter(Boolean).join(" · ") || "—",
  ],
  Furniture:  [(s) => s.material || "—", (s) => s.dimensiuni || "—"],
  HomeGarden: [(s) => s.material || "—", () => "—"],
  Books:      [
    (s) => s.autor || "—",
    (s) => [s.editura, s.pagini ? `${s.pagini} pag.` : null].filter(Boolean).join(" · ") || "—",
  ],
};

export const COL_HEADERS = {
  Electronics: ["Stocare · RAM", "Procesor"],
  Clothing:    ["Tip · Gen",     "Material · Fit"],
  Furniture:   ["Material",      "Dimensiuni"],
  HomeGarden:  ["Material",      "—"],
  Books:       ["Autor",         "Editură · Pagini"],
};
