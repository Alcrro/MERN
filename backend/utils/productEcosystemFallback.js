const toSlug = require("./toSlug");

const BASE = "/products/electronice";
const s = (label) => `${BASE}/${toSlug(label)}`;

module.exports = {
  Telefon: {
    critical: [
      { label: "Încărcător",         reason: "Bateria se consumă zilnic, încărcătorul din cutie se degradează rapid", icon: "⚡",  slug: s("Incarcator") },
      { label: "Husă de protecție",  reason: "Prima linie de apărare împotriva căderilor și zgârieturilor",          icon: "🛡️", slug: s("Husa de protectie") },
    ],
    recommended: [
      { label: "Folie sticlă securizată", reason: "Ecranul e componenta cea mai scumpă de înlocuit",    icon: "📱", slug: s("Folie sticla securizata") },
      { label: "Căști",                   reason: "Audio de calitate și mâini libere pentru apeluri",   icon: "🎧", slug: s("Casti") },
      { label: "Cablu USB-C",             reason: "Transfer rapid de fișiere și backup zilnic",          icon: "🔌", slug: s("Cablu USB-C") },
      { label: "Power bank",              reason: "Autonomie extinsă când nu ai priză la îndemână",      icon: "🔋", slug: s("Power bank") },
    ],
    tasks: [
      {
        id: "photography",
        label: "Fotografie & Video",
        icon: "📸",
        context: "Vrei să filmezi sau să faci poze de calitate cu telefonul",
        items: [
          { label: "Trepied smartphone",  icon: "📷", slug: s("Trepied smartphone") },
          { label: "Gimbal stabilizator", icon: "🎬", slug: s("Gimbal stabilizator") },
          { label: "Microfon extern",     icon: "🎙️", slug: s("Microfon extern") },
          { label: "Lentile externe",     icon: "🔭", slug: s("Lentile externe") },
        ],
      },
      {
        id: "gaming",
        label: "Gaming Mobile",
        icon: "🎮",
        context: "Joci titluri competitive sau vrei performanță maximă pe telefon",
        items: [
          { label: "Controller Bluetooth", icon: "🕹️", slug: s("Controller Bluetooth") },
          { label: "Răcitor telefon",      icon: "❄️",  slug: s("Racitor telefon") },
          { label: "Căști gaming",         icon: "🎧", slug: s("Casti gaming") },
          { label: "Power bank",           icon: "🔋", slug: s("Power bank") },
        ],
      },
      {
        id: "productivity",
        label: "Productivitate & Birou",
        icon: "💼",
        context: "Folosești telefonul ca unealtă de lucru sau îl conectezi la monitor",
        items: [
          { label: "Suport birou reglabil",  icon: "🖥️", slug: s("Suport birou") },
          { label: "Tastatură Bluetooth",    icon: "⌨️", slug: s("Tastatura Bluetooth") },
          { label: "Hub USB-C",              icon: "🔌", slug: s("Hub USB-C") },
          { label: "Power bank",             icon: "🔋", slug: s("Power bank") },
        ],
      },
      {
        id: "travel",
        label: "Mașină & Călătorie",
        icon: "🚗",
        context: "Telefonul stă în mașină sau ești mereu pe drumuri",
        items: [
          { label: "Suport auto telefon",   icon: "🚗", slug: s("Suport auto") },
          { label: "Încărcător auto rapid",  icon: "⚡",  slug: s("Incarcator auto") },
          { label: "Power bank compact",     icon: "🔋", slug: s("Power bank compact") },
        ],
      },
    ],
  },
};
