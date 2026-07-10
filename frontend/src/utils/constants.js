/* ─── Products listing ───────────────────────────────────── */
export const SORT_OPTIONS = [
  { value: "Newest",              label: "Cele mai noi" },
  { value: "Oldest",              label: "Cele mai vechi" },
  { value: "Price: Low to High",  label: "Preț: crescător" },
  { value: "Price: High to Low",  label: "Preț: descrescător" },
  { value: "Rating: High to Low", label: "Rating: descrescător" },
  { value: "Rating: Low to High", label: "Rating: crescător" },
];

export const LIMIT_OPTIONS = [30, 60, 90];

/* ─── Navigation promo links ─────────────────────────────── */
export const PROMO_LINKS = [
  { label: "Oferte zilnice", to: "/products?availability=Promotii", accent: "#ef4444" },
  { label: "Noutăți",        to: "/products?availability=Nou" },
  { label: "Resigilate",     to: "/products?availability=Resigilat" },
  { label: "Top vânzări",    to: "/products?sort=-rating" },
  { label: "Clearance",      to: "/products?sort=price" },
];

/* ─── User roles ─────────────────────────────────────────── */
export const ROLE_LABEL = {
  client: "Cumpărător",
  vendor: "Vânzător",
  admin:  "Administrator",
};

/* ─── Product availability ───────────────────────────────── */
export const AVAILABILITY = Object.freeze({
  IN_STOCK:    "In Stoc",
  PROMOTII:    "Promotii",
  NOU:         "Nou",
  RESIGILAT:   "Resigilat",
  PRECOMANDA:  "Precomanda",
  OUT_OF_STOCK:"Stoc Epuizat",
});

/* ─── Home stats ─────────────────────────────────────────── */
export const STATS = [
  { value: "500+",  label: "Produse disponibile" },
  { value: "30+",   label: "Branduri de top" },
  { value: "12K+",  label: "Clienți mulțumiți" },
  { value: "4.9★",  label: "Rating mediu" },
];
