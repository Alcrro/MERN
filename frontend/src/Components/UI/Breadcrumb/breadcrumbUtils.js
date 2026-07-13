// Segments that are skipped but inject a virtual parent crumb instead
const VIRTUAL_PARENTS = {
  product: { label: "Produse", to: "/products" },
};

export const LABELS = {
  "":        "Acasă",
  products:  "Produse",
  cart:      "Coș",
  checkout:  "Finalizare",
  profile:   "Profil",
  info:      "Informații",
  orders:    "Comenzi",
  address:   "Adrese",
  settings:  "Setări",
  auth:      null,
  login:     "Autentificare",
  register:  "Înregistrare",
  about:     "Despre noi",
  add:       null,
  admin:     "Admin",
  samsung:   "Samsung",
  apple:     "Apple",
  xiaomi:    "Xiaomi",
  motorola:  "Motorola",
  google:    "Google",
  oneplus:   "OnePlus",
};

export const buildCrumbs = (pathname) => {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = [{ label: "Acasă", to: "/" }];
  let path = "";

  for (const seg of segments) {
    path += `/${seg}`;
    if (VIRTUAL_PARENTS[seg]) {
      crumbs.push(VIRTUAL_PARENTS[seg]);
      continue;
    }
    const label = LABELS[seg];
    if (label === null) continue;
    crumbs.push({
      label: label ?? (seg.length > 14 ? seg.slice(0, 12) + "…" : seg),
      to: path,
    });
  }

  return crumbs;
};
