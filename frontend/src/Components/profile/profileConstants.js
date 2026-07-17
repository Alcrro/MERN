export const NAV = [
  { to: "orders",   label: "Comenzile mele", icon: "📦" },
  { to: "address",  label: "Adresele mele",  icon: "📍" },
  { to: "my-card",         label: "Cardul meu",     icon: "★" },
  { to: "payment-methods", label: "Cardurile mele", icon: "💳" },
  { to: "settings",        label: "Setări cont",    icon: "⚙️" },
];

const AVATAR_BG = ["#2563eb","#059669","#d97706","#7c3aed","#db2777","#0891b2"];
export const avatarColor = (name = "") => AVATAR_BG[name.charCodeAt(0) % AVATAR_BG.length];
