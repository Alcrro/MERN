export const CATEGORY_SLUG_TO_KIND = {
  electronice:    "Electronics",
  electrocasnice: "HomeGarden",
  mobilier:       "Furniture",
  imbracaminte:   "Clothing",
  carti:          "Books",
};

export const TIP_SLUG_TO_TIP = {
  // Electronice
  telefon:            "Telefon",
  laptop:             "Laptop",
  tableta:            "Tabletă",
  "desktop-pc":       "Desktop PC",
  server:             "Server",
  componente:         "Componente",
  retelistica:        "Rețelistică",
  periferice:         "Periferice",
  "consola-gaming":   "Consolă Gaming",
  // TV, Audio & Foto
  tv:                 "TV",
  proiector:          "Proiector",
  soundbar:           "Soundbar",
  "hi-fi":            "Hi-Fi",
  "boxe-bluetooth":   "Boxe Bluetooth",
  casti:              "Căști",
  microfon:           "Microfon",
  dslr:               "DSLR",
  mirrorless:         "Mirrorless",
  "camera-compacta":  "Camera Compacta",
  obiectiv:           "Obiectiv",
  drona:              "Drona",
  "camera-video":     "Camera Video",
  "accesorii-foto":   "Accesorii Foto",
  // Electrocasnice (HomeGarden)
  "masina-de-spalat": "Mașină de spălat",
  frigider:           "Frigider",
  "side-by-side":     "Side by Side",
  aspirator:          "Aspirator",
  "robot-aspirator":  "Robot aspirator",
  "friteuza-cu-aer":  "Friteuza cu aer",
  espressor:          "Espressor",
  "bec-smart":        "Bec smart",
  // Sport & Fitness
  fitness:            "Fitness",
  ciclism:            "Ciclism",
  camping:            "Camping",
  "sporturi-apa":     "Sporturi Apa",
  "imbracaminte-sport": "Imbracaminte Sport",
  // Auto & Moto
  "accesorii-auto":   "Accesorii Auto",
  "piese-auto":       "Piese Auto",
  anvelope:           "Anvelope",
  motocicleta:        "Motocicleta",
  gps:                "GPS",
  // Jucării & Copii
  educativ:           "Educativ",
  lego:               "LEGO",
  "joc-societate":    "Joc Societate",
  bebe:               "Bebe",
  "imbracaminte-copii": "Imbracaminte Copii",
  // Modă & Fashion
  femei:              "Femei",
  barbati:            "Barbati",
  incaltaminte:       "Incaltaminte",
  genti:              "Genti",
  ceasuri:            "Ceasuri",
  // Sănătate & Frumusețe
  ingrijire:          "Ingrijire",
  parfumuri:          "Parfumuri",
  suplimente:         "Suplimente",
  medical:            "Medical",
  optica:             "Optica",
};

export const KIND_TO_CATEGORY_SLUG = Object.fromEntries(
  Object.entries(CATEGORY_SLUG_TO_KIND).map(([slug, kind]) => [kind, slug])
);

export const TIP_TO_TIP_SLUG = Object.fromEntries(
  Object.entries(TIP_SLUG_TO_TIP).map(([slug, tip]) => [tip, slug])
);
