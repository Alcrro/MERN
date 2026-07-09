const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const { Register } = require("./models/auth/register");
const Product = require("./models/product/Product");
const Electronics = require("./models/product/types/Electronics");
const Review = require("./models/review/Review");
const Category = require("./models/category/Category");
const { AVAILABILITY } = require("./models/product/stock/Stock");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
};

// ─── Users ───────────────────────────────────────────────────────────────────

const usersData = [
  { name: "Admin Boss",   email: "admin@alcrro.ro",   password: "Parola123", role: "admin" },
  { name: "Vendor Alex",  email: "vendor@alcrro.ro",  password: "Parola123", role: "vendor" },
  { name: "Ion Popescu",  email: "ion@gmail.com",     password: "Parola123", role: "client" },
  { name: "Maria Ionescu",email: "maria@gmail.com",   password: "Parola123", role: "client" },
  { name: "Andrei Popa",  email: "andrei@gmail.com",  password: "Parola123", role: "client" },
];

// ─── Products (created by vendor) ────────────────────────────────────────────

const productsData = (vendorId) => [
  {
    brand: "Samsung", tip: "Telefon",
    model: "Galaxy S24 Ultra", stocare: "256GB",
    RAM: "12GB", procesor: "Snapdragon 8 Gen 3", display: "6.8\" Dynamic AMOLED 2X 120Hz",
    camera: "200MP + 12MP + 10MP + 10MP", baterie: "5000mAh", OS: "Android 14",
    price: 4999,
    description: "Cel mai puternic Samsung din 2024. Display Dynamic AMOLED 2X de 6.8 inch, Snapdragon 8 Gen 3, camera de 200MP si S Pen inclus.",
    stock: { quantity: 12, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Samsung", tip: "Telefon",
    model: "Galaxy S24", stocare: "128GB",
    RAM: "8GB", procesor: "Snapdragon 8 Gen 3", display: "6.2\" Dynamic AMOLED 2X 120Hz",
    camera: "50MP + 12MP + 10MP", baterie: "4000mAh", OS: "Android 14",
    price: 3499,
    description: "Samsung Galaxy S24 cu Snapdragon 8 Gen 3, display de 6.2 inch si camera tripla de 50MP. Design compact si performanta de top.",
    stock: { quantity: 25, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Samsung", tip: "Telefon",
    model: "Galaxy A55", stocare: "128GB",
    RAM: "8GB", procesor: "Exynos 1480", display: "6.6\" Super AMOLED 120Hz",
    camera: "50MP + 12MP + 5MP", baterie: "5000mAh", OS: "Android 14",
    price: 1899,
    description: "Samsung Galaxy A55 cu Exynos 1480, display Super AMOLED de 6.6 inch si camera de 50MP cu OIS. Rezistent la apa IP67.",
    stock: { quantity: 40, availability: AVAILABILITY.PROMOTII },
    user: vendorId,
  },
  {
    brand: "Samsung", tip: "Telefon",
    model: "Galaxy Z Flip 5", stocare: "256GB",
    RAM: "8GB", procesor: "Snapdragon 8 Gen 2", display: "6.7\" Flex AMOLED 120Hz",
    camera: "12MP + 12MP", baterie: "3700mAh", OS: "Android 14",
    price: 3899,
    description: "Telefonul pliabil de la Samsung cu ecran Flex AMOLED de 6.7 inch, carcasa din Armor Aluminum si cover display de 3.4 inch.",
    stock: { quantity: 8, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Apple", tip: "Telefon",
    model: "iPhone 15 Pro Max", stocare: "256GB",
    RAM: "8GB", procesor: "Apple A17 Pro", display: "6.7\" Super Retina XDR OLED 120Hz",
    camera: "48MP + 12MP + 12MP", baterie: "4422mAh", OS: "iOS 17",
    conectivitate: "Wi-Fi 6E, Bluetooth 5.3, USB-C 3.0",
    price: 6799,
    description: "iPhone 15 Pro Max cu chip A17 Pro, titaniu de clasa aerospatiala, camera de 48MP cu zoom optic 5x si Action Button.",
    stock: { quantity: 15, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Apple", tip: "Telefon",
    model: "iPhone 15", stocare: "128GB",
    RAM: "6GB", procesor: "Apple A16 Bionic", display: "6.1\" Super Retina XDR OLED 60Hz",
    camera: "48MP + 12MP", baterie: "3349mAh", OS: "iOS 17",
    conectivitate: "Wi-Fi 6, Bluetooth 5.3, USB-C",
    price: 4299,
    description: "iPhone 15 cu chip A16 Bionic, Dynamic Island, camera principala de 48MP si USB-C. Cel mai accesibil iPhone din generatia 2023.",
    stock: { quantity: 30, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Apple", tip: "Telefon",
    model: "iPhone 14", stocare: "128GB",
    RAM: "6GB", procesor: "Apple A15 Bionic", display: "6.1\" Super Retina XDR OLED 60Hz",
    camera: "12MP + 12MP", baterie: "3279mAh", OS: "iOS 17",
    price: 3299,
    description: "iPhone 14 resigilat in stare excelenta. Chip A15 Bionic, camera duala de 12MP si display Super Retina XDR de 6.1 inch.",
    stock: { quantity: 5, availability: AVAILABILITY.RESIGILAT },
    user: vendorId,
  },
  {
    brand: "Xiaomi", tip: "Telefon",
    model: "14", stocare: "256GB",
    RAM: "12GB", procesor: "Snapdragon 8 Gen 3", display: "6.36\" AMOLED 120Hz",
    camera: "50MP Leica + 50MP + 50MP", baterie: "4610mAh", OS: "Android 14 / HyperOS",
    price: 3799,
    description: "Xiaomi 14 cu Snapdragon 8 Gen 3, camera Leica cu senzor de 50MP si display AMOLED de 6.36 inch cu rata de refresh de 120Hz.",
    stock: { quantity: 18, availability: AVAILABILITY.NOU },
    user: vendorId,
  },
  {
    brand: "Xiaomi", tip: "Telefon",
    model: "Redmi Note 13 Pro", stocare: "256GB",
    RAM: "8GB", procesor: "Snapdragon 7s Gen 2", display: "6.67\" AMOLED 120Hz",
    camera: "200MP + 8MP + 2MP", baterie: "5100mAh", OS: "Android 13 / MIUI 14",
    price: 1399,
    description: "Xiaomi Redmi Note 13 Pro cu Snapdragon 7s Gen 2, camera de 200MP si display AMOLED de 6.67 inch cu 120Hz. Cel mai bun raport calitate-pret.",
    stock: { quantity: 55, availability: AVAILABILITY.PROMOTII },
    user: vendorId,
  },
  {
    brand: "Xiaomi", tip: "Telefon",
    model: "Poco X6 Pro", stocare: "256GB",
    RAM: "12GB", procesor: "Dimensity 8300-Ultra", display: "6.67\" Flow AMOLED 144Hz",
    camera: "64MP + 8MP + 2MP", baterie: "5000mAh", OS: "Android 14 / HyperOS",
    price: 1699,
    description: "Xiaomi Poco X6 Pro cu Dimensity 8300-Ultra, display Flow AMOLED de 6.67 inch si camera tripla de 64MP. Gaming phone la pret accesibil.",
    stock: { quantity: 22, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Google", tip: "Telefon",
    model: "Pixel 8 Pro", stocare: "128GB",
    RAM: "12GB", procesor: "Google Tensor G3", display: "6.7\" LTPO OLED 120Hz",
    camera: "50MP + 48MP + 48MP", baterie: "5050mAh", OS: "Android 14",
    conectivitate: "Wi-Fi 7, Bluetooth 5.3, USB-C 3.2",
    price: 3999,
    description: "Google Pixel 8 Pro cu chip Tensor G3, camera cu zoom optic 5x si 7 ani garantati de update-uri Android. Cel mai bun software foto de pe piata.",
    stock: { quantity: 10, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Google", tip: "Telefon",
    model: "Pixel 8a", stocare: "128GB",
    RAM: "8GB", procesor: "Google Tensor G3", display: "6.1\" OLED 120Hz",
    camera: "64MP + 13MP", baterie: "4492mAh", OS: "Android 14",
    price: 2399,
    description: "Google Pixel 8a cu Tensor G3, camera de 64MP si 7 ani de actualizari garantate. Design compact cu display OLED de 6.1 inch.",
    stock: { quantity: 20, availability: AVAILABILITY.NOU },
    user: vendorId,
  },
  {
    brand: "OnePlus", tip: "Telefon",
    model: "12", stocare: "256GB",
    RAM: "12GB", procesor: "Snapdragon 8 Gen 3", display: "6.82\" AMOLED 2K 120Hz",
    camera: "50MP Hasselblad + 48MP + 64MP", baterie: "5400mAh", OS: "Android 14 / OxygenOS 14",
    price: 3599,
    description: "OnePlus 12 cu Snapdragon 8 Gen 3, camera Hasselblad de 50MP cu zoom optic 3x si incarcare rapida de 100W. Display AMOLED 2K la 120Hz.",
    stock: { quantity: 14, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "OnePlus", tip: "Telefon",
    model: "Nord CE 4", stocare: "256GB",
    RAM: "8GB", procesor: "Snapdragon 7s Gen 2", display: "6.7\" AMOLED 120Hz",
    camera: "50MP + 8MP", baterie: "5500mAh", OS: "Android 14 / OxygenOS 14",
    price: 1599,
    description: "OnePlus Nord CE 4 cu Snapdragon 7s Gen 2, incarcare rapida de 100W si display AMOLED de 6.7 inch cu 120Hz. Autonomie excelenta.",
    stock: { quantity: 35, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Motorola", tip: "Telefon",
    model: "Edge 50 Pro", stocare: "256GB",
    RAM: "12GB", procesor: "Snapdragon 7 Gen 3", display: "6.7\" pOLED 144Hz",
    camera: "50MP + 13MP + 10MP", baterie: "4500mAh", OS: "Android 14",
    price: 2099,
    description: "Motorola Edge 50 Pro cu Snapdragon 7 Gen 3, camera de 50MP cu OIS, display pOLED de 6.7 inch si incarcare rapida de 125W.",
    stock: { quantity: 0, availability: AVAILABILITY.OUT_OF_STOCK },
    user: vendorId,
  },
];

// ─── Categories ──────────────────────────────────────────────────────────────

const categoriesData = [
  {
    order: 1, label: "Electronice", icon: "💻", kind: "Electronics",
    sub: [
      { label: "Telefoane",       icon: "📱", tip: "Telefon" },
      { label: "Laptopuri",       icon: "💻", tip: "Laptop" },
      { label: "Desktop PC",      icon: "🖥️", tip: "Desktop PC" },
      { label: "Console Gaming",  icon: "🎮", tip: "Consolă Gaming" },
      { label: "Tablete",         icon: "📟", tip: "Tabletă" },
      { label: "Servere",         icon: "🖧", tip: "Server" },
      { label: "Componente PC",   icon: "🔩", tip: "Componente" },
      { label: "Rețelistică",     icon: "📡", tip: "Rețelistică" },
      { label: "Periferice",      icon: "🖱️", tip: "Periferice" },
    ],
  },
  {
    order: 2, label: "TV, Audio & Foto", icon: "📺", kind: "Electronics",
    sub: [
      { label: "Televizoare",               icon: "📺", tip: "TV" },
      { label: "Proiectoare",               icon: "📽️", tip: "Proiector" },
      { label: "Soundbar-uri",              icon: "🔊", tip: "Soundbar" },
      { label: "Sisteme Hi-Fi",             icon: "🎵", tip: "Hi-Fi" },
      { label: "Boxe Bluetooth",            icon: "🔉", tip: "Boxe Bluetooth" },
      { label: "Căști & Earbuds",           icon: "🎧", tip: "Căști" },
      { label: "Microfoane",                icon: "🎤", tip: "Microfon" },
      { label: "Camere DSLR",              icon: "📷", tip: "DSLR" },
      { label: "Camere Mirrorless",         icon: "📸", tip: "Mirrorless" },
      { label: "Camere compacte & Instant", icon: "🤳", tip: "Camera Compacta" },
      { label: "Obiective foto",            icon: "🔭", tip: "Obiectiv" },
      { label: "Drone & Action Cam",        icon: "🚁", tip: "Drona" },
      { label: "Camere video & Vlogging",   icon: "🎥", tip: "Camera Video" },
      { label: "Trepieduri & Accesorii",    icon: "🗜️", tip: "Accesorii Foto" },
    ],
  },
  {
    order: 3, label: "Casă, Grădină & Mobilier", icon: "🏡", kind: null,
    sub: [
      { label: "Canapele & Fotolii",    icon: "🛋️", kind: "Furniture" },
      { label: "Mese & Scaune",         icon: "🪑", kind: "Furniture" },
      { label: "Paturi & Saltele",      icon: "🛏️", kind: "Furniture" },
      { label: "Dulapuri & Rafturi",    icon: "🗄️", kind: "Furniture" },
      { label: "Birouri",               icon: "✏️", kind: "Furniture" },
      { label: "Bucătărie & Corpuri",   icon: "🍳", kind: "Furniture" },
      { label: "Decorațiuni",           icon: "🏺", kind: "HomeGarden" },
      { label: "Iluminat",              icon: "💡", kind: "HomeGarden" },
      { label: "Grădinărit",            icon: "🌱", kind: "HomeGarden" },
      { label: "Unelte & Scule",        icon: "🔧", kind: "HomeGarden" },
      { label: "Textile casă",          icon: "🧵", kind: "HomeGarden" },
      { label: "Depozitare",            icon: "📦", kind: "HomeGarden" },
    ],
  },
  {
    order: 4, label: "Sport & Fitness", icon: "🏋️", kind: "Sport",
    sub: [
      { label: "Echipament fitness", icon: "🏋️", tip: "Fitness" },
      { label: "Ciclism",            icon: "🚴", tip: "Ciclism" },
      { label: "Camping & Drumeții", icon: "⛺", tip: "Camping" },
      { label: "Sporturi de apă",    icon: "🏊", tip: "Sporturi Apa" },
      { label: "Îmbrăcăminte sport", icon: "👟", tip: "Imbracaminte Sport" },
    ],
  },
  {
    order: 5, label: "Auto & Moto", icon: "🚗", kind: "Auto",
    sub: [
      { label: "Accesorii auto", icon: "🔑", tip: "Accesorii Auto" },
      { label: "Piese auto",     icon: "⚙️", tip: "Piese Auto" },
      { label: "Anvelope",       icon: "🛞", tip: "Anvelope" },
      { label: "Motociclete",    icon: "🏍️", tip: "Motocicleta" },
      { label: "GPS & Camere",   icon: "📍", tip: "GPS" },
    ],
  },
  {
    order: 6, label: "Jucării & Copii", icon: "🧸", kind: "Toys",
    sub: [
      { label: "Jucării educative",    icon: "🎓", tip: "Educativ" },
      { label: "LEGO & Construcții",   icon: "🧱", tip: "LEGO" },
      { label: "Jocuri de societate",  icon: "🎲", tip: "Joc Societate" },
      { label: "Articole bebe",        icon: "🍼", tip: "Bebe" },
      { label: "Îmbrăcăminte copii",   icon: "👕", tip: "Imbracaminte Copii" },
    ],
  },
  {
    order: 7, label: "Modă & Fashion", icon: "👗", kind: "Fashion",
    sub: [
      { label: "Femei",             icon: "👗", tip: "Femei" },
      { label: "Bărbați",           icon: "👔", tip: "Barbati" },
      { label: "Încălțăminte",      icon: "👟", tip: "Incaltaminte" },
      { label: "Genți & Accesorii", icon: "👜", tip: "Genti" },
      { label: "Ceasuri",           icon: "⌚", tip: "Ceasuri" },
    ],
  },
  {
    order: 8, label: "Sănătate & Frumusețe", icon: "💊", kind: "Health",
    sub: [
      { label: "Îngrijire personală", icon: "🧴", tip: "Ingrijire" },
      { label: "Parfumuri",           icon: "🌹", tip: "Parfumuri" },
      { label: "Suplimente",          icon: "💊", tip: "Suplimente" },
      { label: "Aparatură medicală",  icon: "🩺", tip: "Medical" },
      { label: "Optică",              icon: "👓", tip: "Optica" },
    ],
  },
];

// ─── Reviews ─────────────────────────────────────────────────────────────────
// 3 review-uri per produs de la cei 3 clienti

const reviewTemplates = [
  // Samsung Galaxy S24 Ultra
  [
    { value: 5, comment: "Absolut extraordinar! Camera de 200MP face poze incredibile, iar S Pen e o atingere de geniu. Merită fiecare ban." },
    { value: 5, comment: "Display-ul e cel mai frumos pe care l-am vazut pe un telefon. Culori vii si refresh-ul de 120Hz face totul sa arate fluid." },
    { value: 4, comment: "Performante de top si baterie buna. Singurul minus e pretul, dar pentru ce ofera e justificat." },
  ],
  // Samsung Galaxy S24
  [
    { value: 5, comment: "Format compact, performante de flagship. Exact ce aveam nevoie!" },
    { value: 4, comment: "Foarte bun, dar bateria ar fi putut fi mai mare. In rest nu am ce sa ii reprosez." },
    { value: 4, comment: "Telefon solid, camera excelenta pentru videoclipuri. Recomand!" },
  ],
  // Samsung Galaxy A55
  [
    { value: 4, comment: "La pretul asta e un deal fantastic. Display Super AMOLED e mai bun decat ma asteptam." },
    { value: 5, comment: "Cel mai bun telefon mid-range pe care l-am cumparat vreodata. Camera noaptea e impresionanta." },
    { value: 3, comment: "Bun in general, dar procesorul ar fi putut fi mai puternic. Uneori simti ca se lupta cu task-urile grele." },
  ],
  // Samsung Galaxy Z Flip 5
  [
    { value: 5, comment: "Designul pliabil primeste complimente de la toata lumea. Cover display-ul e super util!" },
    { value: 4, comment: "Minunat de folosit, insa e scump si rezistenta la uzura a balamalei e un semn de intrebare pe termen lung." },
    { value: 5, comment: "Cel mai cool telefon de pe piata. OG flex phone experience." },
  ],
  // iPhone 15 Pro Max
  [
    { value: 5, comment: "A17 Pro e un monstru. Jocuri, video 4K ProRes, editare foto - le face pe toate fara sa incetineasca." },
    { value: 5, comment: "Zoom-ul optic 5x e schimbator de joc. Fotografii de la distanta arata ca profesionale." },
    { value: 4, comment: "Cel mai bun iPhone facut vreodata. Pretul e greu de inghtit, dar calitatea se simte." },
  ],
  // iPhone 15
  [
    { value: 5, comment: "Dynamic Island e o idee genial implementata. Camera de 48MP face o diferenta enorma fata de 12." },
    { value: 4, comment: "Trecerea la USB-C e binevenita. Telefon excelent, ecosistem Apple intact." },
    { value: 4, comment: "Soliditate si viteza, ca de obicei la Apple. Cumparat fara regrete." },
  ],
  // iPhone 14 (Resigilat)
  [
    { value: 4, comment: "Stare impecabila pentru un resigilat. Economisesti bani si primesti acelasi produs." },
    { value: 5, comment: "Nu s-ar fi ghicit ca e resigilat. Ca nou, la un pret mult mai bun. Recomandat!" },
    { value: 3, comment: "Bun, dar as fi dat ceva mai mult si as fi luat un 15. A15 Bionic e inca rapid insa." },
  ],
  // Xiaomi 14
  [
    { value: 5, comment: "Camera Leica ridica bara foarte sus. Pozele au o calitate si un look aparte fata de orice alt telefon." },
    { value: 5, comment: "Snapdragon 8 Gen 3 e o bestie. Nici macar nu simti ca folosesti un telefon Android." },
    { value: 4, comment: "Raport calitate-pret excelent comparativ cu iPhone sau Samsung la acelasi nivel de performanta." },
  ],
  // Xiaomi Redmi Note 13 Pro
  [
    { value: 5, comment: "200MP camera la 1400 RON?? E o gluma buna de la Xiaomi in avantajul clientilor." },
    { value: 4, comment: "Display AMOLED frumos, autonomie buna si camera excelenta. La pret asta nu exista competitie." },
    { value: 4, comment: "Recomandat 100% pentru cei cu buget limitat. Face tot ce ai nevoie de la un telefon modern." },
  ],
  // Xiaomi Poco X6 Pro
  [
    { value: 5, comment: "Gaming pe Dimensity 8300-Ultra e o experienta de top. Framerate-uri constante la setari maxime." },
    { value: 4, comment: "Ecranul AMOLED cu 120Hz e pur si simplu superb. Pretul e incredibil pentru ce ofera." },
    { value: 3, comment: "Bun ca gaming phone, camera lasa ceva de dorit comparativ cu Redmi Note 13 Pro." },
  ],
  // Google Pixel 8 Pro
  [
    { value: 5, comment: "Software-ul foto de la Google e neegalat. Magic Eraser, Best Take si AI photo editing sunt magice." },
    { value: 5, comment: "7 ani de update-uri garantate e argumentul suprem. Nici Samsung nici Apple nu ofera asta." },
    { value: 4, comment: "Tensor G3 nu e cel mai rapid chip, dar experienta globala e printre cele mai fluide." },
  ],
  // Google Pixel 8a
  [
    { value: 4, comment: "Pixelul accesibil cu toate feature-urile AI. Cel mai bun mid-range pentru poze reale." },
    { value: 5, comment: "Dimensiunile compacte si calitatea camerei fac din el telefonul perfect de zi cu zi." },
    { value: 4, comment: "Update-uri garantate 7 ani la un pret decent. Loialitate fata de utilizatori cum putini producatori au." },
  ],
  // OnePlus 12
  [
    { value: 5, comment: "Incarcarea de 100W e incredibila - de la 0 la 100% in sub 30 minute. Display-ul 2K e spectaculos." },
    { value: 4, comment: "Camera Hasselblad aduce un plus real la calitatea pozelor. OxygenOS e inca cel mai curat Android." },
    { value: 5, comment: "Performante de flagship, pret mai mic decat Samsung sau Apple. Win-win." },
  ],
  // OnePlus Nord CE 4
  [
    { value: 4, comment: "100W charging pe un telefon de buget? OnePlus a schimbat jocul mid-range." },
    { value: 5, comment: "Autonomie fantastica si incarcare rapida. Nu mai stau cu grija bateriei." },
    { value: 4, comment: "Solid, rapid, si arata bine. Pentru 1600 RON e o alegere excelenta." },
  ],
  // Motorola Edge 50 Pro (stoc 0 - OUT_OF_STOCK)
  [
    { value: 4, comment: "125W incarcare si display pOLED sunt argumentele principale. Stoc zero e o pierdere." },
    { value: 4, comment: "L-am prins cand era in stoc. Camera cu OIS merge excelent noaptea, design premium." },
    { value: 5, comment: "Best Motorola ever. Sper sa revina in stoc cat mai repede!" },
  ],
];

// ─── Main seeder ─────────────────────────────────────────────────────────────

const seed = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    Register.deleteMany({}),
    Product.deleteMany({}),
    Review.deleteMany({}),
    Category.deleteMany({}),
  ]);

  // 1. Create users (schema pre-save hashes passwords)
  console.log("Creating users...");
  const users = await Register.create(usersData);

  const admin  = users.find((u) => u.role === "admin");
  const vendor = users.find((u) => u.role === "vendor");
  const clients = users.filter((u) => u.role === "client");

  console.log(`  admin:  ${admin.email}`);
  console.log(`  vendor: ${vendor.email}`);
  clients.forEach((c) => console.log(`  client: ${c.email}`));

  // 2. Create categories
  console.log("Creating categories...");
  await Category.create(categoriesData);
  console.log(`  ${categoriesData.length} categories created`);

  // 3. Create products
  console.log("\nCreating products...");
  const products = await Electronics.create(productsData(vendor._id));
  console.log(`  ${products.length} products created`);

  // 3. Create reviews (sequential per product to let calcAverageRating settle)
  console.log("\nCreating reviews...");
  let totalReviews = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const templates = reviewTemplates[i];

    for (let j = 0; j < templates.length; j++) {
      await Review.create({
        product: product._id,
        user: clients[j]._id,
        value: templates[j].value,
        comment: templates[j].comment,
      });
      totalReviews++;
    }
  }

  console.log(`  ${totalReviews} reviews created`);

  // 4. Show final product ratings
  console.log("\nFinal product ratings:");
  const finalProducts = await Product.find().select("brand model rating stock.availability").sort("brand");
  finalProducts.forEach((p) => {
    console.log(
      `  ${p.brand} ${p.model}: ★ ${p.rating.average} (${p.rating.count} reviews) — ${p.stock?.availability}`
    );
  });

  console.log("\n✓ Seed complete!");
  console.log("\nCredentials (all passwords: Parola123):");
  console.log("  admin@alcrro.ro  — admin");
  console.log("  vendor@alcrro.ro — vendor");
  console.log("  ion@gmail.com    — client");
  console.log("  maria@gmail.com  — client");
  console.log("  andrei@gmail.com — client");

  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
