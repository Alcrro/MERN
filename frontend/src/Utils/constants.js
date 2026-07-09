export const PROMO_LINKS = [
  { label: "Oferte zilnice", to: "/products?availability=Promotii", accent: "#ef4444" },
  { label: "Noutăți",        to: "/products?availability=Nou" },
  { label: "Resigilate",     to: "/products?availability=Resigilat" },
  { label: "Top vânzări",    to: "/products?sort=-rating" },
  { label: "Clearance",      to: "/products?sort=price" },
];

export const ROLE_LABEL = {
  client: "Cumpărător",
  vendor: "Vânzător",
  admin:  "Administrator",
};

export const STATS = [
  { value: "500+",  label: "Produse disponibile" },
  { value: "30+",   label: "Branduri de top" },
  { value: "12K+",  label: "Clienți mulțumiți" },
  { value: "4.9★",  label: "Rating mediu" },
];
