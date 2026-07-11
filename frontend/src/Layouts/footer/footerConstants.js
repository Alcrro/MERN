export const YEAR = `2023–${new Date().getFullYear()}`;

export const PRODUCT_LINKS = [
  { label: "Toate produsele", to: "/products" },
  { label: "Oferte zilnice",  to: "/products?availability=Promotii" },
  { label: "Noutăți",        to: "/products?availability=Nou" },
  { label: "Resigilate",     to: "/products?availability=Resigilat" },
  { label: "Top vânzări",    to: "/products?sort=-rating" },
  { label: "Clearance",      to: "/products?sort=price" },
];

export const ACCOUNT_LINKS = [
  { label: "Autentificare",  to: "/auth/login" },
  { label: "Înregistrare",   to: "/auth/register" },
  { label: "Profilul meu",   to: "/profile" },
  { label: "Comenzile mele", to: "/profile/orders" },
  { label: "Adresele mele",  to: "/profile/address" },
];

export const LEGAL_LINKS = [
  { label: "Termeni și condiții", to: "/terms" },
  { label: "Confidențialitate",   to: "/privacy" },
  { label: "GDPR",                to: "/gdpr" },
  { label: "Despre noi",          to: "/about" },
];
