const FIELD_META = {
  brand:          { label: "Brand",         icon: "🏷️" },
  model:          { label: "Model",         icon: "📱" },
  name:           { label: "Nume",          icon: "📦" },
  tip:            { label: "Tip",           icon: "🔖" },
  stocare:        { label: "Stocare",       icon: "💾" },
  memorieInterna: { label: "Memorie int.",  icon: "💾" },
  RAM:            { label: "RAM",           icon: "⚡" },
  procesor:       { label: "Procesor",      icon: "🔧" },
  GPU:            { label: "GPU",           icon: "🎮" },
  display:        { label: "Display",       icon: "🖥️" },
  camera:         { label: "Cameră",        icon: "📷" },
  baterie:        { label: "Baterie",       icon: "🔋" },
  OS:             { label: "OS",            icon: "💻" },
  conectivitate:  { label: "Conectivitate", icon: "📡" },
  material:       { label: "Material",      icon: "🪵" },
  dimensiuni:     { label: "Dimensiuni",    icon: "📐" },
  culoare:        { label: "Culoare",       icon: "🎨" },
  stil:           { label: "Stil",          icon: "✨" },
  nrLocuri:       { label: "Nr. locuri",    icon: "🪑" },
};

export const getSpecs = (p) =>
  Object.entries(FIELD_META)
    .filter(([key]) => p[key] != null && p[key] !== "")
    .map(([key, { label, icon }]) => ({ label, value: String(p[key]), icon }));

const AVATAR_BG = ["#2563eb","#059669","#d97706","#7c3aed","#db2777","#0891b2"];
export const avatarColor = (name = "") => AVATAR_BG[name.charCodeAt(0) % AVATAR_BG.length];

export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" });

export const deliveryDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return d.toLocaleDateString("ro-RO", { weekday: "long", day: "numeric", month: "long" });
};
