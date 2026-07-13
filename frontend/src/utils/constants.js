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
  { label: "Oferte zilnice", to: "/products/all?availability=Promotii",              accent: "#ef4444" },
  { label: "Noutăți",        to: "/products/all?sort=Newest" },
  { label: "Resigilate",     to: "/products/all?availability=Resigilat" },
  { label: "Top vânzări",    to: "/products/all?sort=Rating%3A+High+to+Low" },
  { label: "Clearance",      to: "/products/all?sort=Price%3A+Low+to+High" },
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

/* ─── Product color map (culoare field → CSS color) ─────── */
export const COLOR_MAP = {
  "Negru":      "#1a1a1a",
  "Alb":        "#f5f5f5",
  "Gri":        "#9ca3af",
  "Argintiu":   "#cbd5e1",
  "Auriu":      "#d4af37",
  "Roșu":       "#ef4444",
  "Albastru":   "#3b82f6",
  "Bleumarin":  "#1e3a5f",
  "Verde":      "#22c55e",
  "Violet":     "#8b5cf6",
  "Roz":        "#ec4899",
  "Portocaliu": "#f97316",
  "Galben":     "#eab308",
  "Maro":       "#92400e",
  "Titan":      "#8b9eb7",
  "Bej":        "#d4c5a9",
  "Coral":      "#ff6b6b",
  "Burgundy":   "#800020",
};

export const COLOR_MAP_KEYS = new Set(Object.keys(COLOR_MAP));

/* ─── Clothing sizes ─────────────────────────────────────── */
export const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];

/* ─── Vendor — categories ────────────────────────────────── */
export const VENDOR_CATEGORIES = [
  { value: "Electronics", label: "Electronice" },
  { value: "Clothing",    label: "Îmbrăcăminte & Încălțăminte" },
  { value: "Furniture",   label: "Mobilă" },
  { value: "HomeGarden",  label: "Casă & Grădină" },
  { value: "Books",       label: "Cărți & Media" },
];

/* ─── Vendor — product form defaults ─────────────────────── */
export const MAX_PRODUCT_IMAGES = 5;
export const DEFAULT_STOCK = { quantity: 0, availability: "In Stoc" };

/* ─── Vendor — stock availability options ────────────────── */
export const STOCK_AVAILABILITY_OPTIONS = ["Nou", "In Stoc", "Promotii", "Resigilat", "Precomanda"];

/* ─── Vendor — listing status labels ─────────────────────── */
export const LISTING_STATUS_LABELS = { pending: "În așteptare", approved: "Aprobat", rejected: "Respins" };

/* ─── Vendor — order status colors ───────────────────────── */
export const ORDER_STATUS_COLORS = { Pending: "#f59e0b", Processing: "#3b82f6", Shipped: "#8b5cf6", Delivered: "#10b981", Cancelled: "#ef4444" };

/* ─── Vendor — product status tabs ───────────────────────── */
export const VENDOR_STATUS_TABS = [
  { key: undefined,    label: "Toate" },
  { key: "published",  label: "Publicate" },
  { key: "draft",      label: "Draft" },
  { key: "pending",    label: "În așteptare" },
  { key: "rejected",   label: "Respinse" },
];

/* ─── Vendor — entity type options ──────────────────────── */
export const TIP_ENTITATE_OPTIONS = [
  { value: "SRL", label: "SRL" },
  { value: "PFA", label: "PFA" },
  { value: "SA",  label: "SA" },
  { value: "RA",  label: "RA" },
  { value: "II",  label: "II" },
  { value: "ONG", label: "ONG" },
];

/* ─── Admin sidebar links ────────────────────────────────── */
export const ADMIN_LINKS = [
  { to: "/admin/dashboard",           label: "Prezentare generală", icon: "📊", end: true },
  { to: "/admin/dashboard/listings",  label: "Produse în verificare", icon: "🕐" },
  { to: "/admin/dashboard/catalog",   label: "Catalog produse", icon: "📦" },
  { to: "/admin/dashboard/vendors",   label: "Vânzători", icon: "🏪" },
  { to: "/admin/dashboard/categories", label: "Categorii", icon: "🗂️" },
];

/* ─── Vendor sidebar links ───────────────────────────────── */
export const VENDOR_LINKS = [
  { to: "/vendor/dashboard",           label: "Prezentare generală", end: true },
  { to: "/vendor/dashboard/products",  label: "Produsele mele" },
  { to: "/vendor/dashboard/orders",    label: "Comenzi" },
  { to: "/vendor/dashboard/analytics", label: "Analytics" },
  { to: "/vendor/dashboard/catalog",   label: "Catalog produse" },
  { to: "/vendor/dashboard/profile",   label: "Profil firmă", end: false },
];

/* ─── Catalog ────────────────────────────────────────────── */
export const CATALOG_KINDS = ["Electronics", "Clothing", "Furniture", "HomeGarden", "Books"];

export const CATALOG_TREE = {
  Electronics: [
    { label: "Telefoane",  tip: "Telefon" },
    { label: "Laptopuri",  tip: "Laptop"  },
  ],
  Clothing: [
    { label: "Tricouri",     tip: "Tricou"      },
    { label: "Pantaloni",    tip: "Pantalon"     },
    { label: "Hanorace",     tip: "Hanorac"      },
    { label: "Jachete",      tip: "Jacheta"      },
    { label: "Încălțăminte", tip: "Incaltaminte" },
  ],
  Furniture:  [],
  HomeGarden: [],
  Books:      [],
};

export const CATALOG_SPEC_FIELDS = {
  Electronics: ["model", "tip", "stocare", "RAM", "procesor", "display", "camera", "baterie", "OS"],
  Clothing:    ["name", "tip", "gen", "material", "fit"],
  Furniture:   ["name", "material", "dimensiuni"],
  HomeGarden:  ["name", "material"],
  Books:       ["titlu", "autor", "editura", "pagini", "ISBN"],
};

/* ─── Home stats ─────────────────────────────────────────── */
export const STATS = [
  { value: "500+",  label: "Produse disponibile" },
  { value: "30+",   label: "Branduri de top" },
  { value: "12K+",  label: "Clienți mulțumiți" },
  { value: "4.9★",  label: "Rating mediu" },
];
