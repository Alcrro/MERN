const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const { Register } = require("./models/auth/register");
const Product = require("./models/product/Product");
const Electronics = require("./models/product/types/Electronics");
const HomeGarden = require("./models/product/types/HomeGarden");
const Furniture = require("./models/product/types/Furniture");
const Review = require("./models/review/Review");
const Category = require("./models/category/Category");
const CatalogProduct = require("./models/catalog/CatalogProduct");
const { AVAILABILITY } = require("./models/product/stock/Stock");
const { generateSku } = require("./utils/skuGenerator");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
};

// ─── Users ───────────────────────────────────────────────────────────────────

const usersData = [
  { name: "Admin Boss",   email: "admin@alcrro.ro",   password: "Parola123", role: "admin" },
  { name: "Vendor Alex",  email: "vendor@alcrro.ro",  password: "Parola123", role: "vendor",
    vendorStatus: "approved", shopName: "AlcrroTech", shopDescription: "Telefoane și electronice de top",
    vendorProfile: { orasDepozit: "București", tipEntitate: "SRL", denumireFirma: "ALCRRO TECH SRL", zileLivrare: { min: 1, max: 2 }, returZile: 30 } },
  { name: "Ion Popescu",  email: "ion@gmail.com",     password: "Parola123", role: "client" },
  { name: "Maria Ionescu",email: "maria@gmail.com",   password: "Parola123", role: "client" },
  { name: "Andrei Popa",  email: "andrei@gmail.com",  password: "Parola123", role: "client" },
];

// ─── Electronics: Telefoane + Laptopuri ──────────────────────────────────────

const phonesLaptopsData = (vendorId) => [
  {
    brand: "Samsung", tip: "Telefon",
    model: "Galaxy S24 Ultra", stocare: "256GB",
    RAM: "12GB", procesor: "Snapdragon 8 Gen 3", display: "6.8\" Dynamic AMOLED 2X 120Hz",
    camera: "200MP + 12MP + 10MP + 10MP", baterie: "5000mAh", OS: "Android 14",
    culoare: ["Negru", "Gri", "Violet", "Galben", "Titan"],
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
    culoare: ["Negru", "Gri", "Violet", "Galben"],
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
    culoare: ["Negru", "Albastru", "Roz", "Auriu"],
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
    culoare: ["Negru", "Roz", "Auriu", "Gri", "Albastru"],
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
    culoare: ["Negru", "Alb", "Albastru", "Titan"],
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
    culoare: ["Negru", "Albastru", "Verde", "Galben", "Roz"],
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
    culoare: ["Negru", "Albastru", "Violet", "Galben", "Roz", "Alb"],
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
    culoare: ["Negru", "Alb", "Verde"],
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
    culoare: ["Negru", "Alb", "Verde", "Roz"],
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
    culoare: ["Negru", "Gri", "Galben"],
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
    culoare: ["Negru", "Gri", "Albastru"],
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
    culoare: ["Negru", "Albastru", "Verde", "Roz"],
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
    culoare: ["Negru", "Verde"],
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
    culoare: ["Negru", "Gri", "Verde"],
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
    culoare: ["Negru", "Gri", "Roz"],
    price: 2099,
    description: "Motorola Edge 50 Pro cu Snapdragon 7 Gen 3, camera de 50MP cu OIS, display pOLED de 6.7 inch si incarcare rapida de 125W.",
    stock: { quantity: 0, availability: AVAILABILITY.OUT_OF_STOCK },
    user: vendorId,
  },
  // Laptopuri
  {
    brand: "Apple", tip: "Laptop",
    model: "MacBook Pro 14 M3", stocare: "512GB SSD",
    RAM: "18GB", procesor: "Apple M3 Pro", display: "14.2\" Liquid Retina XDR",
    OS: "macOS Sonoma", conectivitate: "Wi-Fi 6E, Bluetooth 5.3, Thunderbolt 4",
    culoare: ["Argintiu", "Negru"],
    price: 9999,
    description: "MacBook Pro 14 cu chip M3 Pro, display Liquid Retina XDR, baterie de 17h si conectori Thunderbolt 4.",
    stock: { quantity: 10, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Apple", tip: "Laptop",
    model: "MacBook Air 13 M3", stocare: "256GB SSD",
    RAM: "8GB", procesor: "Apple M3", display: "13.6\" Liquid Retina",
    OS: "macOS Sonoma", conectivitate: "Wi-Fi 6E, Bluetooth 5.3, Thunderbolt 4",
    culoare: ["Argintiu", "Gri"],
    price: 6499,
    description: "MacBook Air 13 cu chip M3, design fanless ultra-subtire, display Liquid Retina si autonomie de 18h.",
    stock: { quantity: 15, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Dell", tip: "Laptop",
    model: "XPS 15 9530", stocare: "512GB SSD",
    RAM: "16GB", procesor: "Intel Core i7-13700H", GPU: "NVIDIA RTX 4060",
    display: "15.6\" OLED 3.5K 120Hz", OS: "Windows 11 Home",
    conectivitate: "Wi-Fi 6E, Bluetooth 5.3, Thunderbolt 4",
    culoare: ["Argintiu", "Negru"],
    price: 7999,
    description: "Dell XPS 15 cu display OLED 3.5K, Intel Core i7, RTX 4060 si design premium din aluminiu.",
    stock: { quantity: 8, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "ASUS", tip: "Laptop",
    model: "ROG Zephyrus G14 2024", stocare: "1TB SSD",
    RAM: "32GB", procesor: "AMD Ryzen 9 8945HS", GPU: "NVIDIA RTX 4070",
    display: "14\" OLED 2.8K 120Hz", OS: "Windows 11 Home",
    conectivitate: "Wi-Fi 6E, Bluetooth 5.3, USB-C 3.2",
    culoare: ["Negru", "Gri"],
    price: 8499,
    description: "ASUS ROG Zephyrus G14 gaming laptop cu Ryzen 9 8945HS, RTX 4070 si display OLED 2.8K la 120Hz.",
    stock: { quantity: 6, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
];

// ─── Electronics: TV-uri + Audio ─────────────────────────────────────────────

const tvAudioData = (vendorId) => [
  {
    brand: "Samsung", tip: "TV",
    model: "Neo QLED QN90C", display: "55\" Neo QLED 4K 144Hz",
    OS: "Tizen OS", conectivitate: "Wi-Fi 6, Bluetooth 5.2, HDMI 2.1 x4, USB x3",
    culoare: ["Negru"],
    price: 4999,
    description: "Samsung Neo QLED QN90C cu Mini LED, procesor Neural Quantum 4K, 144Hz si Object Tracking Sound+. Ideal pentru gaming si cinema.",
    stock: { quantity: 8, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "LG", tip: "TV",
    model: "OLED C3", display: "55\" OLED evo 4K 120Hz",
    OS: "webOS 23", conectivitate: "Wi-Fi 5, Bluetooth 5.0, HDMI 2.1 x4, USB x3",
    culoare: ["Negru"],
    price: 5799,
    description: "LG OLED C3 cu panel OLED evo, procesor α9 Gen6 AI 4K, 120Hz, Dolby Vision IQ si G-Sync/FreeSync Premium Pro.",
    stock: { quantity: 5, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Sony", tip: "TV",
    model: "Bravia XR A80L", display: "55\" OLED 4K 120Hz",
    OS: "Google TV", conectivitate: "Wi-Fi 5, Bluetooth 5.0, HDMI 2.1 x4, USB x2",
    culoare: ["Negru"],
    price: 4799,
    description: "Sony Bravia XR A80L OLED cu Cognitive Processor XR, XR OLED Contrast si Acoustic Surface Audio+. Cinema la tine acasa.",
    stock: { quantity: 6, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Philips", tip: "TV",
    model: "55PUS8808", display: "55\" LED 4K 120Hz",
    OS: "Google TV", conectivitate: "Wi-Fi 5, Bluetooth 5.0, HDMI 2.0 x3, USB x2",
    culoare: ["Argintiu"],
    price: 2799,
    description: "Philips 55PUS8808 cu Ambilight 3 laturi, procesor P5 Perfect Picture Engine si Dolby Vision/Atmos. Experienta imersiva la pret accesibil.",
    stock: { quantity: 15, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "TCL", tip: "TV",
    model: "65C745", display: "65\" QLED 4K 144Hz",
    OS: "Google TV", conectivitate: "Wi-Fi 6, Bluetooth 5.0, HDMI 2.1 x2, USB x2",
    culoare: ["Negru"],
    price: 3299,
    description: "TCL 65C745 QLED 65 inch cu 144Hz, Game Master Pro 2.0, Dolby Vision IQ si sunet Onkyo 2.1.2 cu Dolby Atmos.",
    stock: { quantity: 12, availability: AVAILABILITY.PROMOTII },
    user: vendorId,
  },
  {
    brand: "Sony", tip: "Căști",
    model: "WH-1000XM5",
    conectivitate: "Bluetooth 5.2, 3.5mm jack, USB-C",
    baterie: "30 ore",
    culoare: ["Negru", "Argintiu"],
    price: 1299,
    description: "Sony WH-1000XM5 cu noise cancelling industry-leading, 8 microfoane, autonomie 30h si incarcare rapida 3 min = 3h.",
    stock: { quantity: 20, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "JBL", tip: "Boxe Bluetooth",
    model: "Charge 5",
    conectivitate: "Bluetooth 5.1, USB-C",
    baterie: "20 ore",
    culoare: ["Negru", "Albastru", "Roșu", "Gri", "Verde"],
    price: 749,
    description: "JBL Charge 5 cu sunet JBL Pro Sound, functie power bank integrat, rezistenta IP67 si autonomie de 20 ore.",
    stock: { quantity: 35, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Apple", tip: "Căști",
    model: "AirPods Pro 2",
    conectivitate: "Bluetooth 5.3, USB-C",
    baterie: "6 ore (30h cu carcasa)",
    culoare: ["Alb"],
    price: 1199,
    description: "Apple AirPods Pro 2 cu Active Noise Cancellation, Adaptive Audio, Transparency Mode si sunet Spatial Audio personalizat.",
    stock: { quantity: 25, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Samsung", tip: "Soundbar",
    model: "HW-Q800C",
    conectivitate: "Wi-Fi, Bluetooth 5.0, HDMI eARC, Optical",
    culoare: ["Negru"],
    price: 2199,
    description: "Samsung HW-Q800C soundbar 3.1.2 canale cu Dolby Atmos, DTS:X, Q-Symphony si subwoofer wireless inclus.",
    stock: { quantity: 10, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
];

// ─── Electronics: Accesorii Telefon ──────────────────────────────────────────
// tip-urile TREBUIE să se potrivească exact cu labelurile din productEcosystemFallback.js

const phoneAccessoriesData = (vendorId) => [
  // ── Nivel 1 Critic: Încărcătoare ─────────────────────────────────────────
  {
    brand: "Anker", tip: "Încărcător", model: "Nano Pro 65W GaN",
    conectivitate: "USB-C", culoare: ["Alb", "Negru"],
    price: 189,
    description: "Încărcător GaN de 65W care încarcă un telefon de la 0 la 50% în 25 de minute. Compatibil iPhone, Samsung, Xiaomi și orice dispozitiv USB-C. Compact cât un cub de zahăr.",
    stock: { quantity: 50, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Samsung", tip: "Încărcător", model: "EP-T4510 45W Super Fast Charger",
    conectivitate: "USB-C", culoare: ["Alb", "Negru"],
    price: 149,
    description: "Încărcătorul oficial Samsung de 45W cu Super Fast Charging 2.0. Compatibil Galaxy S24, S23, S22 și alte modele Samsung. Cablu USB-C inclus.",
    stock: { quantity: 35, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Apple", tip: "Încărcător", model: "MHJA3ZM/A USB-C 20W",
    conectivitate: "USB-C", culoare: ["Alb"],
    price: 119,
    description: "Adaptorul de alimentare oficial Apple de 20W cu USB-C. Suportă Fast Charging pentru iPhone 12 și versiunile ulterioare. Design compact și certificare Apple MFi.",
    stock: { quantity: 45, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },

  // ── Nivel 1 Critic: Huse de protecție ───────────────────────────────────
  {
    brand: "Spigen", tip: "Husă de protecție", model: "Tough Armor MagFit",
    culoare: ["Negru", "Gri"],
    price: 129,
    description: "Husă Spigen Tough Armor cu suport MagSafe și tehnologie Air Cushion în colțuri. Certificare militară MIL-STD-810H. Rezistă la căderi de până la 2m.",
    stock: { quantity: 60, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "UGREEN", tip: "Husă de protecție", model: "Frosted Shield Pro",
    culoare: ["Transparent", "Negru", "Albastru"],
    price: 79,
    description: "Husă semi-transparentă UGREEN din policarbonat dur și TPU moale pe margini. Anti-îngălbenire, protecție camera ridicată cu 2mm, compatibilă MagSafe.",
    stock: { quantity: 80, availability: AVAILABILITY.PROMOTII },
    user: vendorId,
  },
  {
    brand: "Ringke", tip: "Husă de protecție", model: "Fusion Clear",
    culoare: ["Transparent"],
    price: 69,
    description: "Husă Ringke Fusion transparentă cu protecție la impact, ramă TPU flexibilă și spate PC rigid. Arată telefonul original păstrând protecție maximă.",
    stock: { quantity: 70, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },

  // ── Nivel 2 Recomandat: Folii sticlă ────────────────────────────────────
  {
    brand: "Spigen", tip: "Folie sticlă securizată", model: "GlassTR Slim",
    culoare: ["Transparent"],
    price: 89,
    description: "Folie de sticlă temperată 9H Spigen cu cadru de aliniere pentru aplicare perfectă din prima. Grosime 0.2mm, touch sensibil și protecție anti-zgarieturi.",
    stock: { quantity: 100, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "3MK", tip: "Folie sticlă securizată", model: "HardGlass Max",
    culoare: ["Transparent"],
    price: 99,
    description: "Folie 3MK HardGlass Max cu acoperire full-screen edge-to-edge. Rezistență 9H la zgarieturi, filtru anti-amprentă, compatibilă cu toate husele de telefon.",
    stock: { quantity: 90, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },

  // ── Nivel 2 Recomandat: Cabluri USB-C ───────────────────────────────────
  {
    brand: "Anker", tip: "Cablu USB-C", model: "Bio-Braided USB-C 3A 100W",
    conectivitate: "USB-C la USB-C", culoare: ["Negru", "Alb", "Verde"],
    price: 79,
    description: "Cablu Anker USB-C împletit din materiale bio-degradabile. Suportă 100W Power Delivery și transfer de date USB 3.0 la 5Gbps. Lungime 1.8m, garantie 24 luni.",
    stock: { quantity: 120, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Baseus", tip: "Cablu USB-C", model: "Superior Series 100W Fast Data Cable",
    conectivitate: "USB-C la USB-C", culoare: ["Negru", "Alb"],
    price: 59,
    description: "Cablu Baseus Superior cu putere de transfer 100W și viteza de date 480Mbps. Înveliș nylon împletit rezistent la 10.000 de îndoituri. Lungime 2m.",
    stock: { quantity: 150, availability: AVAILABILITY.PROMOTII },
    user: vendorId,
  },

  // ── Nivel 2 Recomandat: Power bank ──────────────────────────────────────
  {
    brand: "Anker", tip: "Power bank", model: "737 PowerCore 24000",
    conectivitate: "USB-C + USB-A", culoare: ["Negru"],
    baterie: "24000mAh",
    price: 549,
    description: "Power bank Anker 140W cu ecran digital ce afișează nivelul bateriei și puterea de ieșire. Încarcă un laptop sau 3 telefoane simultan. Certificat pentru avion.",
    stock: { quantity: 30, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Xiaomi", tip: "Power bank", model: "Power Bank 3 Ultra Compact 10000mAh",
    conectivitate: "USB-C + USB-A", culoare: ["Alb", "Negru"],
    baterie: "10000mAh",
    price: 179,
    description: "Power bank Xiaomi compact de 10000mAh cu 22.5W Fast Charge. Dimensiuni mini (144x71x14mm), carcasă din aluminiu, compatibil iPhone și Android.",
    stock: { quantity: 55, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },

  // ── Task Fotografie ──────────────────────────────────────────────────────
  {
    brand: "Joby", tip: "Trepied smartphone", model: "GorillaPod 3K",
    culoare: ["Negru", "Gri"],
    price: 239,
    description: "Trepied flexibil Joby GorillaPod cu picioare articulabile care se prind de orice suprafață. Suportă până la 3kg, capăt de 360°, perfect pentru vlogging și foto.",
    stock: { quantity: 25, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "DJI", tip: "Gimbal stabilizator", model: "OM 6",
    culoare: ["Argintiu", "Negru"],
    price: 899,
    description: "Gimbal DJI OM 6 cu stabilizare pe 3 axe și prindere magnetică instant. Autonomie 6.4 ore, urmărire ActiveTrack 6.0, portret și landscape automat.",
    stock: { quantity: 15, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Rode", tip: "Microfon extern", model: "Wireless GO II",
    culoare: ["Negru", "Alb"],
    conectivitate: "Bluetooth 5.0 + USB-C",
    price: 1099,
    description: "Sistem wireless compact Rode cu 2 transmițătoare și un receptor. Raza 200m, înregistrare internă 24-bit, conectare directă la telefon prin adaptor USB-C.",
    stock: { quantity: 12, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Moment", tip: "Lentile externe", model: "Wide 18mm Lens",
    culoare: ["Negru"],
    price: 699,
    description: "Lentilă wide-angle Moment de 18mm cu optici de sticlă multi-strat. Prindere bayonet pe carcasă Moment, compatibilă iPhone și Samsung. Distorsiune minimă.",
    stock: { quantity: 20, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },

  // ── Task Gaming ──────────────────────────────────────────────────────────
  {
    brand: "GameSir", tip: "Controller Bluetooth", model: "T4 Mini",
    conectivitate: "Bluetooth 5.0", culoare: ["Negru", "Alb"],
    price: 229,
    description: "Controller GameSir compact cu joystick-uri Hall Effect fără drift garantat. Trigger-e de 90° pentru gaming rapid, vibratii duale, suport telescopic inclus.",
    stock: { quantity: 35, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Black Shark", tip: "Răcitor telefon", model: "FunCooler 3 Pro",
    culoare: ["Negru", "Alb"],
    conectivitate: "USB-C",
    price: 179,
    description: "Răcitor semiconductor Black Shark cu suprafață de contact din cupru și ventilator dual. Reduce temperatura telefonului cu până la 20°C în 30 de secunde.",
    stock: { quantity: 40, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "HyperX", tip: "Căști gaming", model: "Cloud Alpha Wireless",
    conectivitate: "Wireless 2.4GHz", culoare: ["Negru", "Roșu"],
    baterie: "300 ore",
    price: 799,
    description: "Căști wireless HyperX cu autonomie record de 300 de ore și drivere duale de 50mm. Microfon detașabil cu reducere zgomot, compatibil PC, PS5 și telefon.",
    stock: { quantity: 20, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },

  // ── Task Productivitate ──────────────────────────────────────────────────
  {
    brand: "Logitech", tip: "Tastatură Bluetooth", model: "K380 Multi-Device",
    conectivitate: "Bluetooth 3.0", culoare: ["Gri", "Albastru", "Roz"],
    price: 219,
    description: "Tastatură Logitech K380 compactă cu conectare simultană la 3 dispozitive. Layout românesc opțional, autonomie 2 ani, funcționează cu iPhone, Android și PC.",
    stock: { quantity: 45, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Anker", tip: "Hub USB-C", model: "565 USB-C Hub 7-in-1",
    conectivitate: "USB-C + HDMI + USB-A + SD", culoare: ["Gri"],
    price: 299,
    description: "Hub USB-C Anker cu 7 porturi: HDMI 4K@30Hz, 2x USB-A 3.0, USB-C 85W PD, SD și microSD. Compatibil cu orice telefon cu USB-C. Plug & play, fără driver.",
    stock: { quantity: 40, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },

  // ── Task Mașină & Călătorie ──────────────────────────────────────────────
  {
    brand: "Baseus", tip: "Suport auto telefon", model: "MagSafe Dashboard Mount",
    culoare: ["Negru", "Argintiu"],
    price: 159,
    description: "Suport auto Baseus cu magnet MagSafe de 15W pentru iPhone și Android. Prindere pe bord prin ventuza puternică, rotație 360°, ajustare unghi liberă.",
    stock: { quantity: 65, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Anker", tip: "Încărcător auto rapid", model: "PowerDrive Speed+ 2 40W",
    conectivitate: "USB-C + USB-A", culoare: ["Negru"],
    price: 129,
    description: "Încărcător auto Anker cu PowerIQ 3.0 — 20W USB-C Quick Charge și 20W USB-A. Încarcă 2 telefoane simultan la viteza maximă. Design slim, indicator LED.",
    stock: { quantity: 75, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
];

// ─── HomeGarden: Electrocasnice ───────────────────────────────────────────────

const homeData = (vendorId) => [
  {
    brand: "Bosch", tip: "Mașină de spălat",
    name: "WAX32M40BY",
    material: "Oțel inoxidabil / Plastic ABS",
    dimensiuni: "60 x 59 x 84.8 cm",
    culoare: "Alb",
    price: 2799,
    description: "Bosch WAX32M40BY mașină de spălat 9kg, motor EcoSilence Drive, clasa energetică A, 1400 rpm si conectivitate Home Connect.",
    stock: { quantity: 12, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Samsung", tip: "Side by Side",
    name: "RS68A8840S9",
    material: "Inox / Sticlă",
    dimensiuni: "91.2 x 178 x 71.6 cm",
    culoare: "Inox",
    price: 5999,
    description: "Samsung Side by Side RS68A8840S9 cu SpaceMax Technology, dozator cu apa si gheata si Family Hub cu ecran 21.5 inch.",
    stock: { quantity: 6, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Bosch", tip: "Frigider",
    name: "KGN56XLDR",
    material: "Oțel inoxidabil",
    dimensiuni: "70 x 193 x 73 cm",
    culoare: "Inox",
    price: 2499,
    description: "Bosch KGN56XLDR frigider-congelator NoFrost, clasa D, 508L capacitate totala si tehnologie VitaFresh pentru prospetime mai lunga.",
    stock: { quantity: 10, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Dyson", tip: "Aspirator",
    name: "V15 Detect",
    material: "ABS / Carbon fiber",
    dimensiuni: "25.2 x 12.3 x 127 cm",
    culoare: "Galben",
    price: 2999,
    description: "Dyson V15 Detect cu laser de detectie a prafului, senzor piezoelectric si autonomie de pana la 60 minute.",
    stock: { quantity: 18, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Philips", tip: "Friteuza cu aer",
    name: "HD9255/90",
    material: "Plastic / Metal",
    dimensiuni: "38.3 x 33.5 x 32.4 cm",
    culoare: "Negru",
    price: 699,
    description: "Philips Airfryer XXL HD9255 cu Rapid Air Technology, capacitate 7.3L, 16 programe presetate si app NutriU.",
    stock: { quantity: 40, availability: AVAILABILITY.PROMOTII },
    user: vendorId,
  },
  {
    brand: "Nespresso", tip: "Espressor",
    name: "Vertuo Pop",
    material: "Plastic ABS",
    dimensiuni: "14.2 x 34.6 x 31.7 cm",
    culoare: "Negru",
    price: 449,
    description: "Nespresso Vertuo Pop cu tehnologie Centrifusion, 5 marimi de cafea, incalzire in 25 secunde si rezervor 560ml.",
    stock: { quantity: 55, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "Philips", tip: "Bec smart",
    name: "Hue White Color Starter Kit",
    material: "Plastic / LED",
    dimensiuni: "60mm diametru",
    culoare: "Multicolor",
    price: 399,
    description: "Philips Hue Starter Kit cu 2 becuri E27 color ambiance, bridge Hue si 16 milioane de culori. Control din app sau vocal.",
    stock: { quantity: 30, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "iRobot", tip: "Robot aspirator",
    name: "Roomba j7+",
    material: "Plastic ABS",
    dimensiuni: "34 x 34 x 8.9 cm",
    culoare: "Negru",
    price: 3499,
    description: "iRobot Roomba j7+ cu detectie obstacole prin camera AI, golire automata a coșului si cartografiere inteligenta a casei.",
    stock: { quantity: 8, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
];

// ─── Furniture: Mobilier ──────────────────────────────────────────────────────

const furnitureData = (vendorId) => [
  {
    brand: "IKEA",
    name: "BILLY",
    material: "PAL melaminat",
    dimensiuni: "80 x 28 x 202 cm",
    culoare: "Alb",
    stil: "Scandinav",
    price: 499,
    description: "Biblioteca IKEA BILLY din PAL melaminat cu 6 polite ajustabile din 32 in 32 mm. Clasic si versatil.",
    stock: { quantity: 50, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "IKEA",
    name: "KALLAX",
    material: "PAL melaminat",
    dimensiuni: "77 x 39 x 77 cm",
    culoare: "Alb",
    stil: "Modern",
    price: 749,
    description: "Raft IKEA KALLAX 4 compartimente. Poate fi folosit vertical sau orizontal, cu sau fara insertii decorative.",
    stock: { quantity: 30, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "IKEA",
    name: "SÖDERHAMN",
    material: "Lemn masiv / Poliester",
    dimensiuni: "198 x 99 x 83 cm",
    culoare: "Bej",
    nrLocuri: 3,
    stil: "Scandinav",
    price: 2999,
    description: "Canapea IKEA SÖDERHAMN 3 locuri cu tapiterie poliester, husa detasabila si lavabila, sezut adanc si moale.",
    stock: { quantity: 8, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "IKEA",
    name: "MALM",
    material: "PAL melaminat",
    dimensiuni: "160 x 200 cm",
    culoare: "Alb",
    stil: "Scandinav",
    price: 1099,
    description: "Pat IKEA MALM 160x200 cu tablie inalta si 4 spatii generoase de depozitare sub pat.",
    stock: { quantity: 15, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "IKEA",
    name: "HEMNES",
    material: "Lemn masiv de pin",
    dimensiuni: "90 x 197 cm",
    culoare: "Alb",
    stil: "Clasic",
    price: 1399,
    description: "Dulap IKEA HEMNES din lemn masiv de pin cu 2 usi si oglinda interioara. Solid si durabil.",
    stock: { quantity: 12, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
  {
    brand: "IKEA",
    name: "LACK",
    material: "PAL melaminat",
    dimensiuni: "90 x 55 x 45 cm",
    culoare: "Negru",
    stil: "Modern",
    price: 299,
    description: "Masuta de cafea IKEA LACK, design minimalist, suprafata usoara si picioare solide.",
    stock: { quantity: 60, availability: AVAILABILITY.IN_STOCK },
    user: vendorId,
  },
];

// ─── Catalog ─────────────────────────────────────────────────────────────────

const catalogData = [
  // Telefoane
  { kind: "Electronics", brand: "Samsung", culoare: ["Negru", "Gri", "Violet", "Galben", "Titan"],       refPrice: 6299, specs: { model: "Galaxy S24 Ultra",      tip: "Telefon", stocare: "256GB", RAM: "12GB", procesor: "Snapdragon 8 Gen 3",     display: "6.8\" Dynamic AMOLED 2X 120Hz", camera: "200MP",        baterie: "5000mAh", OS: "Android 14" },              images: [] },
  { kind: "Electronics", brand: "Samsung", culoare: ["Negru", "Gri", "Violet", "Galben"],                refPrice: 3999, specs: { model: "Galaxy S24",            tip: "Telefon", stocare: "128GB", RAM: "8GB",  procesor: "Snapdragon 8 Gen 3",     display: "6.2\" Dynamic AMOLED 2X 120Hz", camera: "50MP",         baterie: "4000mAh", OS: "Android 14" },              images: [] },
  { kind: "Electronics", brand: "Samsung", culoare: ["Negru", "Albastru", "Roz", "Auriu"],               refPrice: 2299, specs: { model: "Galaxy A55",            tip: "Telefon", stocare: "128GB", RAM: "8GB",  procesor: "Exynos 1480",            display: "6.6\" Super AMOLED 120Hz",      camera: "50MP",         baterie: "5000mAh", OS: "Android 14" },              images: [] },
  { kind: "Electronics", brand: "Samsung", culoare: ["Negru", "Roz", "Auriu", "Gri", "Albastru"],        refPrice: 4999, specs: { model: "Galaxy Z Flip 5",       tip: "Telefon", stocare: "256GB", RAM: "8GB",  procesor: "Snapdragon 8 Gen 2",     display: "6.7\" Flex AMOLED 120Hz",       camera: "12MP",         baterie: "3700mAh", OS: "Android 14" },              images: [] },
  { kind: "Electronics", brand: "Apple",   culoare: ["Negru", "Alb", "Albastru", "Titan"],               refPrice: 7499, specs: { model: "iPhone 15 Pro Max",     tip: "Telefon", stocare: "256GB", RAM: "8GB",  procesor: "Apple A17 Pro",          display: "6.7\" Super Retina XDR OLED 120Hz", camera: "48MP",   baterie: "4422mAh", OS: "iOS 17" },                  images: [] },
  { kind: "Electronics", brand: "Apple",   culoare: ["Negru", "Alb", "Albastru", "Titan"],               refPrice: 6299, specs: { model: "iPhone 15 Pro",         tip: "Telefon", stocare: "128GB", RAM: "8GB",  procesor: "Apple A17 Pro",          display: "6.1\" Super Retina XDR OLED 120Hz", camera: "48MP",   baterie: "3274mAh", OS: "iOS 17" },                  images: [] },
  { kind: "Electronics", brand: "Apple",   culoare: ["Negru", "Alb", "Roz", "Galben", "Verde", "Albastru"], refPrice: 4499, specs: { model: "iPhone 15",          tip: "Telefon", stocare: "128GB", RAM: "6GB",  procesor: "Apple A16 Bionic",       display: "6.1\" Super Retina XDR OLED 60Hz",  camera: "48MP",   baterie: "3349mAh", OS: "iOS 17" },                  images: [] },
  { kind: "Electronics", brand: "Apple",   culoare: ["Negru", "Alb", "Roz", "Galben", "Violet", "Albastru"], refPrice: 3499, specs: { model: "iPhone 14",        tip: "Telefon", stocare: "128GB", RAM: "6GB",  procesor: "Apple A15 Bionic",       display: "6.1\" Super Retina XDR OLED 60Hz",  camera: "12MP",   baterie: "3279mAh", OS: "iOS 16" },                  images: [] },
  { kind: "Electronics", brand: "Xiaomi",  culoare: ["Negru", "Alb", "Verde"],                           refPrice: 4299, specs: { model: "14",                   tip: "Telefon", stocare: "256GB", RAM: "12GB", procesor: "Snapdragon 8 Gen 3",     display: "6.36\" AMOLED 120Hz",           camera: "50MP Leica",   baterie: "4610mAh", OS: "Android 14 / HyperOS" },    images: [] },
  { kind: "Electronics", brand: "Xiaomi",  culoare: ["Negru", "Alb", "Verde", "Roz"],                    refPrice: 1899, specs: { model: "Redmi Note 13 Pro",    tip: "Telefon", stocare: "256GB", RAM: "8GB",  procesor: "Snapdragon 7s Gen 2",    display: "6.67\" AMOLED 120Hz",           camera: "200MP",        baterie: "5100mAh", OS: "Android 13 / MIUI 14" },   images: [] },
  { kind: "Electronics", brand: "Xiaomi",  culoare: ["Negru", "Gri", "Galben"],                          refPrice: 1699, specs: { model: "Poco X6 Pro",          tip: "Telefon", stocare: "256GB", RAM: "12GB", procesor: "Dimensity 8300-Ultra",   display: "6.67\" Flow AMOLED 144Hz",      camera: "64MP",         baterie: "5000mAh", OS: "Android 14 / HyperOS" },    images: [] },
  { kind: "Electronics", brand: "Google",  culoare: ["Negru", "Alb", "Roz"],                             refPrice: 4499, specs: { model: "Pixel 8 Pro",          tip: "Telefon", stocare: "128GB", RAM: "12GB", procesor: "Google Tensor G3",       display: "6.7\" LTPO OLED 120Hz",         camera: "50MP",         baterie: "5050mAh", OS: "Android 14" },              images: [] },
  { kind: "Electronics", brand: "Google",  culoare: ["Negru", "Alb", "Albastru", "Verde"],               refPrice: 2799, specs: { model: "Pixel 8a",             tip: "Telefon", stocare: "128GB", RAM: "8GB",  procesor: "Google Tensor G3",       display: "6.1\" OLED 120Hz",              camera: "64MP",         baterie: "4492mAh", OS: "Android 14" },              images: [] },
  { kind: "Electronics", brand: "OnePlus", culoare: ["Negru", "Verde"],                                   refPrice: 4799, specs: { model: "12",                   tip: "Telefon", stocare: "256GB", RAM: "12GB", procesor: "Snapdragon 8 Gen 3",     display: "6.82\" AMOLED 2K 120Hz",        camera: "50MP Hasselblad", baterie: "5400mAh", OS: "Android 14 / OxygenOS 14" }, images: [] },
  { kind: "Electronics", brand: "OnePlus", culoare: ["Negru", "Gri", "Verde"],                            refPrice: 1999, specs: { model: "Nord CE 4",            tip: "Telefon", stocare: "256GB", RAM: "8GB",  procesor: "Snapdragon 7s Gen 2",    display: "6.7\" AMOLED 120Hz",            camera: "50MP",         baterie: "5500mAh", OS: "Android 14 / OxygenOS 14" }, images: [] },
  { kind: "Electronics", brand: "Motorola",culoare: ["Negru", "Albastru"],                                refPrice: 2499, specs: { model: "Edge 50 Pro",          tip: "Telefon", stocare: "256GB", RAM: "12GB", procesor: "Snapdragon 7 Gen 3",     display: "6.7\" pOLED 144Hz",             camera: "50MP",         baterie: "4500mAh", OS: "Android 14" },              images: [] },
  // Laptopuri
  { kind: "Electronics", brand: "Apple",   culoare: ["Argintiu", "Negru"],                                refPrice: 9999, specs: { model: "MacBook Pro 14 M3",    tip: "Laptop",  stocare: "512GB SSD", RAM: "18GB", procesor: "Apple M3 Pro",       display: "14.2\" Liquid Retina XDR",      baterie: "70Wh",    OS: "macOS Sonoma" },            images: [] },
  { kind: "Electronics", brand: "Apple",   culoare: ["Argintiu", "Gri"],                                  refPrice: 6499, specs: { model: "MacBook Air 13 M3",    tip: "Laptop",  stocare: "256GB SSD", RAM: "8GB",  procesor: "Apple M3",           display: "13.6\" Liquid Retina",          baterie: "52.6Wh",  OS: "macOS Sonoma" },            images: [] },
  { kind: "Electronics", brand: "Dell",    culoare: ["Argintiu", "Negru"],                                refPrice: 7999, specs: { model: "XPS 15 9530",          tip: "Laptop",  stocare: "512GB SSD", RAM: "16GB", procesor: "Intel Core i7-13700H", display: "15.6\" OLED 3.5K 120Hz",       GPU: "RTX 4060",    OS: "Windows 11 Home" },         images: [] },
  { kind: "Electronics", brand: "ASUS",    culoare: ["Negru", "Gri"],                                     refPrice: 8499, specs: { model: "ROG Zephyrus G14 2024", tip: "Laptop", stocare: "1TB SSD",   RAM: "32GB", procesor: "AMD Ryzen 9 8945HS", display: "14\" OLED 2.8K 120Hz",          GPU: "RTX 4070",    OS: "Windows 11 Home" },         images: [] },
  // TV-uri
  { kind: "Electronics", brand: "Samsung", culoare: ["Negru"],                                            refPrice: 4999, specs: { model: "Neo QLED QN90C",       tip: "TV", display: "55\" Neo QLED 4K 144Hz",      OS: "Tizen OS",   conectivitate: "Wi-Fi 6, HDMI 2.1 x4" }, images: [] },
  { kind: "Electronics", brand: "LG",      culoare: ["Negru"],                                            refPrice: 5799, specs: { model: "OLED C3",              tip: "TV", display: "55\" OLED evo 4K 120Hz",      OS: "webOS 23",   conectivitate: "Wi-Fi 5, HDMI 2.1 x4" }, images: [] },
  { kind: "Electronics", brand: "Sony",    culoare: ["Negru"],                                            refPrice: 4799, specs: { model: "Bravia XR A80L",       tip: "TV", display: "55\" OLED 4K 120Hz",           OS: "Google TV",  conectivitate: "Wi-Fi 5, HDMI 2.1 x4" }, images: [] },
  { kind: "Electronics", brand: "Philips", culoare: ["Argintiu"],                                         refPrice: 2799, specs: { model: "55PUS8808",            tip: "TV", display: "55\" LED 4K 120Hz",            OS: "Google TV",  conectivitate: "Wi-Fi 5, HDMI 2.0 x3" }, images: [] },
  { kind: "Electronics", brand: "TCL",     culoare: ["Negru"],                                            refPrice: 3299, specs: { model: "65C745",               tip: "TV", display: "65\" QLED 4K 144Hz",           OS: "Google TV",  conectivitate: "Wi-Fi 6, HDMI 2.1 x2" }, images: [] },
  // Audio
  { kind: "Electronics", brand: "Sony",    culoare: ["Negru", "Argintiu"],                                refPrice: 1299, specs: { model: "WH-1000XM5",          tip: "Căști",         conectivitate: "Bluetooth 5.2",         baterie: "30 ore" }, images: [] },
  { kind: "Electronics", brand: "JBL",     culoare: ["Negru", "Albastru", "Roșu", "Gri", "Verde"],       refPrice: 749,  specs: { model: "Charge 5",             tip: "Boxe Bluetooth", conectivitate: "Bluetooth 5.1",        baterie: "20 ore" }, images: [] },
  { kind: "Electronics", brand: "Apple",   culoare: ["Alb"],                                              refPrice: 1199, specs: { model: "AirPods Pro 2",        tip: "Căști",         conectivitate: "Bluetooth 5.3",         baterie: "6 ore (30h cu carcasa)" }, images: [] },
  { kind: "Electronics", brand: "Samsung", culoare: ["Negru"],                                            refPrice: 2199, specs: { model: "HW-Q800C",             tip: "Soundbar",      conectivitate: "Wi-Fi, Bluetooth, HDMI eARC" }, images: [] },
  // Electrocasnice (HomeGarden)
  { kind: "HomeGarden", brand: "Bosch",    culoare: ["Alb"],    refPrice: 2799, specs: { name: "WAX32M40BY",              tip: "Mașină de spălat",  material: "Oțel inoxidabil",  dimensiuni: "60 x 59 x 84.8 cm" }, images: [] },
  { kind: "HomeGarden", brand: "Samsung",  culoare: ["Inox"],   refPrice: 5999, specs: { name: "RS68A8840S9",             tip: "Side by Side",       material: "Inox",             dimensiuni: "91.2 x 178 x 71.6 cm" }, images: [] },
  { kind: "HomeGarden", brand: "Bosch",    culoare: ["Inox"],   refPrice: 2499, specs: { name: "KGN56XLDR",               tip: "Frigider",           material: "Oțel inoxidabil",  dimensiuni: "70 x 193 x 73 cm" }, images: [] },
  { kind: "HomeGarden", brand: "Dyson",    culoare: ["Galben"], refPrice: 2999, specs: { name: "V15 Detect",              tip: "Aspirator",          material: "ABS / Carbon",     dimensiuni: "25.2 x 12.3 x 127 cm" }, images: [] },
  { kind: "HomeGarden", brand: "Philips",  culoare: ["Negru"],  refPrice: 699,  specs: { name: "HD9255/90",               tip: "Friteuza cu aer",   material: "Plastic",           dimensiuni: "38.3 x 33.5 x 32.4 cm" }, images: [] },
  { kind: "HomeGarden", brand: "Nespresso",culoare: ["Negru"],  refPrice: 449,  specs: { name: "Vertuo Pop",              tip: "Espressor",          material: "Plastic ABS",      dimensiuni: "14.2 x 34.6 x 31.7 cm" }, images: [] },
  { kind: "HomeGarden", brand: "Philips",  culoare: ["Multicolor"], refPrice: 399, specs: { name: "Hue White Color Starter Kit", tip: "Bec smart", material: "Plastic / LED",    dimensiuni: "60mm" }, images: [] },
  { kind: "HomeGarden", brand: "iRobot",   culoare: ["Negru"],  refPrice: 3499, specs: { name: "Roomba j7+",              tip: "Robot aspirator",    material: "Plastic ABS",      dimensiuni: "34 x 34 x 8.9 cm" }, images: [] },
  // Mobilier (Furniture)
  { kind: "Furniture",  brand: "IKEA",    culoare: ["Alb", "Negru", "Nuc"],       refPrice: 499,  specs: { name: "BILLY",     material: "PAL melaminat",       dimensiuni: "80 x 28 x 202 cm", stil: "Scandinav" }, images: [] },
  { kind: "Furniture",  brand: "IKEA",    culoare: ["Alb", "Negru"],               refPrice: 749,  specs: { name: "KALLAX",    material: "PAL melaminat",       dimensiuni: "77 x 39 x 77 cm",  stil: "Modern" }, images: [] },
  { kind: "Furniture",  brand: "IKEA",    culoare: ["Bej", "Gri", "Albastru"],     refPrice: 2999, specs: { name: "SÖDERHAMN", material: "Lemn / Poliester",    dimensiuni: "198 x 99 x 83 cm", stil: "Scandinav", nrLocuri: 3 }, images: [] },
  { kind: "Furniture",  brand: "IKEA",    culoare: ["Alb", "Stejar"],              refPrice: 1099, specs: { name: "MALM",      material: "PAL melaminat",       dimensiuni: "160 x 200 cm",     stil: "Scandinav" }, images: [] },
  { kind: "Furniture",  brand: "IKEA",    culoare: ["Alb", "Gri"],                 refPrice: 1399, specs: { name: "HEMNES",    material: "Lemn masiv de pin",   dimensiuni: "90 x 197 cm",      stil: "Clasic" }, images: [] },
  { kind: "Furniture",  brand: "IKEA",    culoare: ["Negru", "Alb", "Stejar"],     refPrice: 299,  specs: { name: "LACK",      material: "PAL melaminat",       dimensiuni: "90 x 55 x 45 cm",  stil: "Modern" }, images: [] },
  // Imbracaminte (Clothing)
  { kind: "Clothing", brand: "Nike",    culoare: ["Negru", "Alb", "Roșu", "Albastru", "Gri"],            refPrice: 699,  specs: { name: "Air Max 270",          tip: "Incaltaminte", gen: "Unisex",  material: "Mesh + TPU",               talpa: "Air Max",  inchidere: "Siret" },           images: [] },
  { kind: "Clothing", brand: "Nike",    culoare: ["Negru", "Gri", "Albastru", "Verde"],                   refPrice: 499,  specs: { name: "Tech Fleece Hoodie",   tip: "Hanorac",      gen: "Barbati", material: "65% bumbac / 35% poliester", fit: "Slim",       inchidere: "Fermoar complet" }, images: [] },
  { kind: "Clothing", brand: "Adidas",  culoare: ["Negru", "Alb", "Gri", "Albastru"],                    refPrice: 749,  specs: { name: "Ultraboost 22",        tip: "Incaltaminte", gen: "Unisex",  material: "Primeknit+",               talpa: "Boost",    inchidere: "Siret" },           images: [] },
  { kind: "Clothing", brand: "Adidas",  culoare: ["Negru", "Albastru", "Verde"],                          refPrice: 349,  specs: { name: "Tiro 21 Track Jacket", tip: "Jacheta",      gen: "Barbati", material: "100% reciclat poliester",   fit: "Regular",    inchidere: "Fermoar complet" }, images: [] },
  { kind: "Clothing", brand: "Zara",    culoare: ["Alb", "Bej", "Albastru", "Verde"],                     refPrice: 199,  specs: { name: "Linen Blend Shirt",    tip: "Camasa",       gen: "Barbati", material: "55% in / 45% bumbac",      fit: "Regular",    inchidere: "Nasturi" },         images: [] },
  { kind: "Clothing", brand: "Zara",    culoare: ["Negru", "Bej", "Maro"],                                refPrice: 179,  specs: { name: "Wide Leg Trousers",    tip: "Pantalon",     gen: "Femei",   material: "Poliester",                fit: "Wide leg",   inchidere: "Fermoar lateral" }, images: [] },
  { kind: "Clothing", brand: "H&M",     culoare: ["Bej", "Negru", "Maro", "Gri"],                        refPrice: 149,  specs: { name: "Slim Fit Chinos",      tip: "Pantalon",     gen: "Barbati", material: "98% bumbac / 2% elastan",  fit: "Slim",       inchidere: "Fermoar + nasture" }, images: [] },
  { kind: "Clothing", brand: "H&M",     culoare: ["Alb", "Negru", "Gri", "Albastru", "Verde", "Roșu"],   refPrice: 79,   specs: { name: "Oversized Cotton Tee", tip: "Tricou",       gen: "Unisex",  material: "100% bumbac organic",      fit: "Oversized",  inchidere: null },              images: [] },
  { kind: "Clothing", brand: "Puma",    culoare: ["Negru", "Alb", "Gri", "Albastru"],                    refPrice: 449,  specs: { name: "Suede Classic XXI",    tip: "Incaltaminte", gen: "Unisex",  material: "Suede",                    talpa: "Cauciuc",  inchidere: "Siret" },           images: [] },
  { kind: "Clothing", brand: "Levi's",  culoare: ["Albastru", "Negru", "Gri"],                            refPrice: 299,  specs: { name: "511 Slim Fit Jeans",   tip: "Blugi",        gen: "Barbati", material: "99% bumbac / 1% elastan",  fit: "Slim",       inchidere: "Fermoar + nasture" }, images: [] },
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

// ─── Reviews pentru Electronics ───────────────────────────────────────────────

const electronicsReviewTemplates = [
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
  // Motorola Edge 50 Pro
  [
    { value: 4, comment: "125W incarcare si display pOLED sunt argumentele principale. Stoc zero e o pierdere." },
    { value: 4, comment: "L-am prins cand era in stoc. Camera cu OIS merge excelent noaptea, design premium." },
    { value: 5, comment: "Best Motorola ever. Sper sa revina in stoc cat mai repede!" },
  ],
  // MacBook Pro 14 M3
  [
    { value: 5, comment: "M3 Pro e o revolutie. Editez video 4K si batereia tine toata ziua. Absolut incredibil." },
    { value: 5, comment: "Display-ul Liquid Retina XDR e cel mai frumos ecran de laptop de pe piata. Meritat fiecare ban." },
    { value: 4, comment: "Performante de workstation intr-un laptop subtire. Singurul minus e pretul ridicat." },
  ],
  // MacBook Air 13 M3
  [
    { value: 5, comment: "Cel mai bun laptop pentru uz general. Silentios, rapid, baterie de 18h. Perfect." },
    { value: 5, comment: "Fara ventilator dar fara throttling. M3 e impresionant pentru un laptop fanless." },
    { value: 4, comment: "Ideal pentru studenti si profesionisti. Pretul e ridicat dar longevitatea Apple merita." },
  ],
  // Dell XPS 15
  [
    { value: 5, comment: "Display-ul OLED 3.5K e absolut spectaculos pentru editare foto si video. Culorile sunt vii." },
    { value: 4, comment: "RTX 4060 se descurca bine la gaming moderat. Constructia din aluminiu e premium." },
    { value: 4, comment: "Performant si elegant. Tastatura e o placere, trackpad-ul e excelent." },
  ],
  // ASUS ROG Zephyrus G14
  [
    { value: 5, comment: "Cel mai puternic laptop de gaming compact. RTX 4070 + Ryzen 9 e o combinatie letala." },
    { value: 5, comment: "Display OLED 2.8K la 120Hz e o bucurie pentru ochi. Jocurile arata cinematografic." },
    { value: 4, comment: "Batereia tine 6h in uz normal - bun pentru un gaming laptop. Performante de desktop." },
  ],
  // Samsung Neo QLED QN90C
  [
    { value: 5, comment: "Calitate imagine impecabila. Mini LED-urile fac o diferenta enorma la zone de negru." },
    { value: 5, comment: "144Hz se simte fantastic la gaming. HDMI 2.1 pe toate 4 porturile e un mare plus." },
    { value: 4, comment: "Display superb, sunetul e decent dar am conectat un soundbar oricum." },
  ],
  // LG OLED C3
  [
    { value: 5, comment: "OLED evo e pur si simplu incomparabil. Negrul perfect si culorile vibrante te captiveaza." },
    { value: 5, comment: "Cel mai bun TV pe care l-am cumparat vreodata. G-Sync si VRR la 120Hz pentru gaming e vis." },
    { value: 5, comment: "webOS e intuitiv si responsive. Calitatea imaginii la filme HDR e cinematografica." },
  ],
  // Sony Bravia XR A80L
  [
    { value: 5, comment: "Acoustic Surface Audio+ e o nebunie - sunetul vine din ecran. Imersie totala." },
    { value: 4, comment: "Google TV cu Android e flexibil. Procesorul XR face culorile naturale si realiste." },
    { value: 5, comment: "Calitate Sony, nu deceptioneaza niciodata. Cel mai natural look pentru filme." },
  ],
  // Philips 55PUS8808 Ambilight
  [
    { value: 5, comment: "Ambilight transforma total experienta. Seara, lumina ambientala e magica." },
    { value: 4, comment: "Google TV si Ambilight intr-un pachet accesibil. Raport calitate-pret excelent." },
    { value: 4, comment: "Bun pentru dimensiunea lui. Ambilight pe 3 laturi e spectaculos in camera intunecata." },
  ],
  // TCL 65C745
  [
    { value: 4, comment: "65 inch la pretul asta e de necrezut. QLED face culorile sa sara din ecran." },
    { value: 5, comment: "144Hz la gaming e o adevarata placere. Game Master Pro 2.0 reduce latenta la minimum." },
    { value: 4, comment: "Raport calitate-pret imbatabil. Google TV functioneaza fluid si are toate app-urile." },
  ],
  // Sony WH-1000XM5
  [
    { value: 5, comment: "Cel mai bun noise cancelling din piata. Aerul din birou dispare complet." },
    { value: 5, comment: "Sunet cald si detaliat, confort pe 8+ ore fara oboseala. Premium total." },
    { value: 4, comment: "XM5 merita fiecare ban. Singurul minus: nu se pliaza la fel ca XM4." },
  ],
  // JBL Charge 5
  [
    { value: 5, comment: "Bas puternic pentru dimensiunile lui. IP67 e esential la plaja si la piscina." },
    { value: 4, comment: "Sunet clar si puternic, power bank e super util. Autonomia de 20h e reala." },
    { value: 5, comment: "Cel mai bun Bluetooth speaker la pret asta. L-am dus la camping si a tinut 3 zile." },
  ],
  // Apple AirPods Pro 2
  [
    { value: 5, comment: "Adaptive Audio e genial - trece automat intre ANC si Transparency in functie de context." },
    { value: 5, comment: "Spatialul Audio personalizat e o diferenta reala. Muzica suna ca in concert." },
    { value: 4, comment: "Cel mai bun produs Apple dupa iPhone. Integrarea cu ecosistemul e perfecta." },
  ],
  // Samsung HW-Q800C
  [
    { value: 5, comment: "Dolby Atmos 3.1.2 canale transforma orice film in experienta de cinema." },
    { value: 4, comment: "Q-Symphony cu TV-ul Samsung e o minune. Sunetul umple toata camera." },
    { value: 5, comment: "Subwooferul wireless e puternic fara sa deranjeze. Instalare simpla." },
  ],
];

// ─── Reviews pentru Accesorii Telefon ────────────────────────────────────────

const accessoriesReviewTemplates = [
  // Anker Nano Pro 65W
  [{ value: 5, comment: "Mic, rapid, puternic. Telefonul se incarca de la 0 la 100% in 55 de minute. Nu mai car adaptorul original." },
   { value: 5, comment: "GaN face diferenta. Aceeasi putere ca un incarcator de 3 ori mai mare dar cat o cutie de chibrituri." }],
  // Samsung 45W
  [{ value: 4, comment: "Merge perfect cu Galaxy S24. Incarcare Super Fast vizibila, de la 20% la 80% in jumatate de ora." },
   { value: 5, comment: "Official Samsung, calitate buna. Recomand tuturor posesorilor de Samsung." }],
  // Apple 20W
  [{ value: 5, comment: "Fast Charge pe iPhone 15 functioneaza impecabil. Exact ce trebuia sa fie in cutia telefonului de la inceput." },
   { value: 4, comment: "Mic si eficient. Pretul e ok pentru un adaptor Apple original." }],
  // Spigen Tough Armor
  [{ value: 5, comment: "Am scapat telefonul de la 1.5m pe beton. Zero zgarieturi, husa a absorbit tot impactul. Merita pretul." },
   { value: 5, comment: "Prindere perfecta, nu alunega din mana. Butoanele se apasa usor prin husa." },
   { value: 4, comment: "Adauga ceva volum dar protectia e de top. Tradeoff acceptabil." }],
  // UGREEN Frosted Shield
  [{ value: 4, comment: "Transparenta, subtire, nu isi pierde culoarea dupa 3 luni. Surprinzator de buna pentru pret." },
   { value: 4, comment: "Apasa perfect pe butoane, prindere sigura. Nu se ingalbeneste deloc." }],
  // Ringke Fusion
  [{ value: 5, comment: "Transparenta perfecta, telefonul arata exact ca original. Margini TPU care absorb socurile." },
   { value: 4, comment: "Ieftina si buna. Ce vrei mai mult de la o husa?" }],
  // Spigen GlassTR
  [{ value: 5, comment: "Aplicare perfecta din prima cu rama de aliniere. Zero bule de aer, touch la fel de sensibil." },
   { value: 5, comment: "9H rezistenta, am pus cheile in acelasi buzunar si nu s-a zgariat nimic in 3 luni." }],
  // 3MK HardGlass Max
  [{ value: 4, comment: "Full screen, acopera tot ecranul pana la margini. Calitate buna pentru pret." },
   { value: 5, comment: "Nu lasa amprente vizibile, sticla e curata mereu. Foarte multumit." }],
  // Anker Cablu USB-C
  [{ value: 5, comment: "100W real, am testat cu multimetru. Calitate premium, impletit rezistent, lung cat trebuie." },
   { value: 5, comment: "Cel mai bun cablu pe care l-am cumparat. Anker nu dezamageste niciodata." }],
  // Baseus Cablu
  [{ value: 4, comment: "2m e lungimea perfecta pentru pat. Transfer rapid, incarcare 100W functioneaza." },
   { value: 4, comment: "Raport calitate/pret excelent. Am luat 3 bucati pentru toata casa." }],
  // Anker 737 Power Bank
  [{ value: 5, comment: "140W iesire = incarcare laptop + 2 telefoane simultan. Ecranul digital e super util." },
   { value: 4, comment: "Mare si greu, dar pentru calatorii lungi e indispensabil. Certif. avion e un plus." }],
  // Xiaomi Power Bank 10000
  [{ value: 5, comment: "Cel mai compact 10000mAh de pe piata. Incape in orice buzunar, incarcare rapida pe ambele porturi." },
   { value: 5, comment: "Design elegant din aluminiu, incarcare rapida 22.5W. Recomand cu incredere." }],
  // Joby GorillaPod
  [{ value: 5, comment: "Picioarele se prind de orice. Stalpi, garduri, ramuri. Creativitate la maxim pentru vlogging." },
   { value: 4, comment: "Solid, nu se misca dupa ce l-ai fixat. Capatul de bila permite orice unghi." }],
  // DJI OM 6
  [{ value: 5, comment: "Prinderea magnetica e o revelatie. 3 secunde si telefonul e atasat si stabilizat." },
   { value: 5, comment: "ActiveTrack 6.0 urmareste subiectul perfect chiar si in miscare rapida. Wow." },
   { value: 4, comment: "Scump dar merita. Calitatea video s-a imbunatatit radical fata de fara gimbal." }],
  // Rode Wireless GO II
  [{ value: 5, comment: "200m raza in conditii reale, sunet clar, latenta 0. Standard de industrie pentru un motiv bun." },
   { value: 5, comment: "Inregistrare interna de rezerva pe transmitator. Feature care mi-a salvat un interviu important." }],
  // Moment Wide Lens
  [{ value: 4, comment: "Optica de sticla face diferenta fata de lentilele plastice ieftine. Distorsiune minima la margini." },
   { value: 5, comment: "Investitie pentru fotografi seriosi. Combinatia cu app Moment da rezultate profesionale." }],
  // GameSir T4 Mini
  [{ value: 5, comment: "Hall Effect = fara drift garantat. Dupa 6 luni de gaming zilnic, joystick-urile sunt perfecte." },
   { value: 5, comment: "Cel mai bun controller compact pentru telefon. Se simte premium in mana." }],
  // Black Shark FunCooler 3
  [{ value: 4, comment: "Temperatura a scazut de la 48°C la 29°C in 30 secunde. Impresionant pentru gaming sesiuni lungi." },
   { value: 5, comment: "Zgomotul ventilatorului e minimal. Prinderea pe telefon e sigura, nu se misca in timp ce joci." }],
  // HyperX Cloud Alpha
  [{ value: 5, comment: "300 de ore baterie e incredibil. Le-am incarcat o data si nu am mai gandit la baterie 2 saptamani." },
   { value: 5, comment: "Sunetul dual chamber e o alta dimensiune. Bas profund fara sa acopere detaliile." }],
  // Logitech K380
  [{ value: 5, comment: "Conectare la 3 dispozitive si switch intre ele in 1 secunda. Workflow transformat complet." },
   { value: 4, comment: "Layout compact dar nu te simti strangherit dupa o zi de utilizare. Bateria tine intr-adevar 2 ani." }],
  // Anker Hub 7-in-1
  [{ value: 5, comment: "HDMI 4K, 2 USB-A, USB-C 85W, SD si microSD - totul dintr-un singur port USB-C. Magic." },
   { value: 4, comment: "Plug and play pe toate platformele. Nu incalzeste excesiv nici la incarcare simultana." }],
  // Baseus Car Mount
  [{ value: 5, comment: "Magnetul MagSafe tine telefonul chiar si pe drumuri cu gropi. Nu a cazut niciodata." },
   { value: 5, comment: "Instalare 30 secunde, rotatie perfecta. Cel mai bun suport auto pe care l-am folosit." }],
  // Anker Car Charger
  [{ value: 5, comment: "Incarc telefonul si tableta simultan la viteza maxima. Perfect pentru calatorii lungi." },
   { value: 4, comment: "Slim, nu iese mult din priza auto. Design discret si eficient." }],
];

// ─── Reviews pentru HomeGarden ────────────────────────────────────────────────

const homeReviewTemplates = [
  // Bosch WAX32M40BY
  [
    { value: 5, comment: "Silentioasa ca un sarpe. Merge si noaptea fara sa trezesc pe nimeni." },
    { value: 5, comment: "9kg incap fara probleme, clasa A economiseste curentul. Perfecta." },
    { value: 4, comment: "Home Connect e util, programezi din telefon. Buna achizitie." },
  ],
  // Samsung RS68A8840S9
  [
    { value: 5, comment: "Family Hub e o idee geniala. Camerele interne ma ajuta sa vad ce am fara sa deschid usa." },
    { value: 4, comment: "Spatiu enorm, dozatorul de apa si gheata functioneaza perfect." },
    { value: 5, comment: "Arata spectaculos in bucatarie si raceste uniform si rapid." },
  ],
  // Bosch KGN56XLDR
  [
    { value: 5, comment: "NoFrost inseamna zero formare de gheata. Nu mai dezghet de cand l-am luat." },
    { value: 4, comment: "Silentios si eficient. VitaFresh chiar mentine legumele proaspete mai mult." },
    { value: 5, comment: "Calitate Bosch, nu m-a dezamagit. Inox-ul arata impecabil dupa luni de zile." },
  ],
  // Dyson V15 Detect
  [
    { value: 5, comment: "Laserul detecteaza praful pe care nu il vedeam. Absolut uimitor." },
    { value: 5, comment: "Putere de aspirare incredibila, senzorul piezoelectric arata exact ce aspiri." },
    { value: 4, comment: "Greu la 3.1kg, dar performanta justifica. Cel mai bun aspirator fara fir." },
  ],
  // Philips HD9255/90 Airfryer
  [
    { value: 5, comment: "Cartofii prajiti ies crocanti ca la friteuza clasica dar fara ulei. Revolutionar." },
    { value: 4, comment: "Capacitate mare, 7.3L ajunge pentru intreaga familie. Usor de curatat." },
    { value: 5, comment: "Gatesc in el zilnic: pui, legume, chiar prajituri. Cel mai folosit aparat din bucatarie." },
  ],
  // Nespresso Vertuo Pop
  [
    { value: 5, comment: "Cafeaua cu crema abundenta e mai buna decat la cafenele. Rapid si simplu." },
    { value: 4, comment: "Silentios, compact si elegant. Capsulele se gasesc usor." },
    { value: 5, comment: "Prima cafea dimineata in 30 de secunde. Schimbator de viata." },
  ],
  // Philips Hue Starter Kit
  [
    { value: 5, comment: "Atmosfera in camera e complet diferita cu Hue. 16 milioane de culori nu e marketing." },
    { value: 4, comment: "Integrare perfecta cu Alexa si Google. Automatizarile functioneaza impecabil." },
    { value: 5, comment: "Seara, culorile de relaxare coboara stresul instantaneu. Meritat 100%." },
  ],
  // iRobot Roomba j7+
  [
    { value: 5, comment: "Evita firele si sosetele cu o precizie uimitoare. AI-ul chiar functioneaza." },
    { value: 5, comment: "Golirea automata e o binecuvantare. Il pornesc din app si casa e curata cand ajung." },
    { value: 4, comment: "Cel mai inteligent aspirator robot din piata. Cartografierea e precisa si detaliata." },
  ],
];

// ─── Reviews pentru Furniture ─────────────────────────────────────────────────

const furnitureReviewTemplates = [
  // IKEA BILLY
  [
    { value: 5, comment: "Clasic IKEA: usor de asamblat, arata bine si tine cartile fara probleme." },
    { value: 4, comment: "Rafturile ajustabile sunt un mare plus. Ocupa perfect un perete intreg." },
    { value: 5, comment: "Cel mai vandut produs IKEA pentru un motiv. Raport calitate-pret imbatabil." },
  ],
  // IKEA KALLAX
  [
    { value: 5, comment: "Versatil - orizontal ca bancuta TV, vertical ca raft. Perfect in living." },
    { value: 4, comment: "Solid pentru PAL. Cutiile decorative se potrivesc perfect in compartimente." },
    { value: 5, comment: "L-am folosit ca separator de camera. Arata modern si e functional." },
  ],
  // IKEA SÖDERHAMN
  [
    { value: 5, comment: "Confortul dupa o zi lunga de munca. Adanca si moale, te imbraca." },
    { value: 4, comment: "Husa lavabila e un must. Asamblarea e simpla, in 2 ore e gata." },
    { value: 4, comment: "Design scandinav elegant. Se combina bine cu orice stil de interior." },
  ],
  // IKEA MALM Pat
  [
    { value: 5, comment: "Spatiile de depozitare de sub pat sunt geniale. Economisesc loc de dulap." },
    { value: 4, comment: "Tablul inalt arata premium. Asamblarea dureaza dar rezultatul merita." },
    { value: 5, comment: "Pat solid, fara scartaituri dupa un an. IKEA livreaza calitate." },
  ],
  // IKEA HEMNES Dulap
  [
    { value: 5, comment: "Lemn masiv de pin, nu PAL - simti diferenta imediat. Solid si miroase frumos." },
    { value: 4, comment: "Oglinda interioara e un plus mare. Asamblarea e mai dificila dar merita." },
    { value: 5, comment: "Clasic si durabil. Il am de 5 ani si arata ca nou." },
  ],
  // IKEA LACK Masuta
  [
    { value: 4, comment: "Simplu si functional. La pretul asta e imposibil sa te plângi." },
    { value: 5, comment: "Perfect pentru un living mic. Usor de montat, ocupa putin spatiu." },
    { value: 4, comment: "Design minimal care merge cu orice. Am luat 2 si le-am aranjat in L." },
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
    CatalogProduct.deleteMany({}),
  ]);

  // 1. Create users
  console.log("Creating users...");
  const users = await Register.create(usersData);

  const admin  = users.find((u) => u.role === "admin");
  const vendor = users.find((u) => u.role === "vendor");
  const clients = users.filter((u) => u.role === "client");
  const city = vendor.vendorProfile?.orasDepozit || "";

  console.log(`  admin:  ${admin.email}`);
  console.log(`  vendor: ${vendor.email} (${city})`);
  clients.forEach((c) => console.log(`  client: ${c.email}`));

  // 2. Create categories
  console.log("Creating categories...");
  await Category.create(categoriesData);
  console.log(`  ${categoriesData.length} categories created`);

  // 3. Create catalog entries
  console.log("\nCreating catalog entries...");
  const catalog = await CatalogProduct.create(catalogData);
  const byKind = (k) => catalog.filter((c) => c.kind === k).length;
  console.log(`  ${catalog.length} catalog entries — Electronics: ${byKind("Electronics")}, HomeGarden: ${byKind("HomeGarden")}, Furniture: ${byKind("Furniture")}, Clothing: ${byKind("Clothing")}`);

  const findElecCatalog  = (brand, model) => catalog.find((c) => c.brand === brand && c.specs?.model === model);
  const findOtherCatalog = (brand, name)  => catalog.find((c) => c.brand === brand && c.specs?.name  === name);

  // 4a. Create Electronics products (phones + laptops + TVs + audio + accessories)
  console.log("\nCreating electronics products...");
  const allElecData = [...phonesLaptopsData(vendor._id), ...tvAudioData(vendor._id), ...phoneAccessoriesData(vendor._id)];
  const electronics = await Electronics.create(
    allElecData.map((p) => {
      const catalogEntry = findElecCatalog(p.brand, p.model);
      return {
        ...p,
        listingStatus: "approved",
        publishStatus: "published",
        sku: generateSku(p.brand, city, p.model || ""),
        ...(catalogEntry && { catalogRef: catalogEntry._id }),
      };
    })
  );
  console.log(`  ${electronics.length} electronics created`);

  // 4b. Create HomeGarden products
  console.log("Creating home & garden products...");
  const home = await HomeGarden.create(
    homeData(vendor._id).map((p) => {
      const catalogEntry = findOtherCatalog(p.brand, p.name);
      return {
        ...p,
        listingStatus: "approved",
        publishStatus: "published",
        sku: generateSku(p.brand, city, p.name || ""),
        ...(catalogEntry && { catalogRef: catalogEntry._id }),
      };
    })
  );
  console.log(`  ${home.length} home products created`);

  // 4c. Create Furniture products
  console.log("Creating furniture products...");
  const furniture = await Furniture.create(
    furnitureData(vendor._id).map((p) => {
      const catalogEntry = findOtherCatalog(p.brand, p.name);
      return {
        ...p,
        listingStatus: "approved",
        publishStatus: "published",
        sku: generateSku(p.brand, city, p.name || ""),
        ...(catalogEntry && { catalogRef: catalogEntry._id }),
      };
    })
  );
  console.log(`  ${furniture.length} furniture created`);

  // 5. Create reviews
  console.log("\nCreating reviews...");
  let totalReviews = 0;

  const addReviews = async (products, templates) => {
    for (let i = 0; i < products.length; i++) {
      const tmpl = templates[i];
      if (!tmpl) continue;
      for (let j = 0; j < tmpl.length; j++) {
        await Review.create({
          product: products[i]._id,
          user: clients[j % clients.length]._id,
          value: tmpl[j].value,
          comment: tmpl[j].comment,
        });
        totalReviews++;
      }
    }
  };

  const phonesAndTvCount = phonesLaptopsData(vendor._id).length + tvAudioData(vendor._id).length;
  const coreElectronics  = electronics.slice(0, phonesAndTvCount);
  const accessories      = electronics.slice(phonesAndTvCount);

  await addReviews(coreElectronics, electronicsReviewTemplates);
  await addReviews(accessories,     accessoriesReviewTemplates);
  await addReviews(home,            homeReviewTemplates);
  await addReviews(furniture,       furnitureReviewTemplates);

  console.log(`  ${totalReviews} reviews created`);

  // 6. Final summary
  console.log("\nFinal product ratings:");
  const finalProducts = await Product.find().sort("brand");
  finalProducts.forEach((p) => {
    const name = p.get("model") || p.get("name") || "";
    console.log(`  ${p.brand} ${name}: ★ ${p.rating.average} (${p.rating.count} reviews) — ${p.stock?.availability}`);
  });

  const total = electronics.length + home.length + furniture.length;
  console.log(`\n✓ Seed complete! ${total} produse, ${totalReviews} recenzii.`);
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
