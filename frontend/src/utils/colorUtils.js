export const isLightHex = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 180;
};

export const COLOR_MAP = {
  Negru: "#1c1c1e", Alb: "#f5f5f0", Albastru: "#2563eb",
  Gri: "#6b7280", Violet: "#7c3aed", Galben: "#eab308",
  Titan: "#8b9096", Argintiu: "#c0c0c0", Auriu: "#d4af37",
  Roz: "#ec4899", Verde: "#16a34a", "Roșu": "#dc2626",
  Portocaliu: "#f97316", Bej: "#d2b48c", Maro: "#92400e",
};
