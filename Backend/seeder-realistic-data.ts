import mongoose from "mongoose"
import dotenv from "dotenv"
import path from "path"
import Product from "./Models/productModel.js"
import User from "./Models/userModel.js"
import { USER_IDS } from "./data/users.js"
import bcrypt from "bcryptjs"
import usersData from "./data/users.js"

dotenv.config({ path: path.resolve(process.cwd(), "Backend/.env") })

const MONGO_URI = process.env.MONGO_URI || ""
const ADMIN_ID = new mongoose.Types.ObjectId("65b000000000000000000001")

const CATEGORY_IDS = {
  laptops: new mongoose.Types.ObjectId("65c000000000000000000001"),
  phones: new mongoose.Types.ObjectId("65c000000000000000000002"),
  audio: new mongoose.Types.ObjectId("65c000000000000000000003"),
  gaming: new mongoose.Types.ObjectId("65c000000000000000000004"),
  cameras: new mongoose.Types.ObjectId("65c000000000000000000005"),
  wearables: new mongoose.Types.ObjectId("65c000000000000000000006"),
  monitors: new mongoose.Types.ObjectId("65c000000000000000000007"),
  tablets: new mongoose.Types.ObjectId("65c000000000000000000008"),
  headphones: new mongoose.Types.ObjectId("65c000000000000000000009"),
}

// 👤 USERS (REAL POOL)
const USERS = [
  { id: USER_IDS.user1, name: "Ahmed Al-Rashid", type: "practical" },
  { id: USER_IDS.user2, name: "Sarah Mitchell", type: "balanced" },
  { id: USER_IDS.user3, name: "Yuki Tanaka", type: "technical" },
  { id: USER_IDS.user4, name: "Carlos Mendes", type: "casual" },
  { id: USER_IDS.user5, name: "Ethan Walker", type: "practical" },
  { id: USER_IDS.user6, name: "Sofia Alvarez", type: "balanced" },
  { id: USER_IDS.user7, name: "Arjun Mehta", type: "technical" },
  { id: USER_IDS.user8, name: "Yara Hassan", type: "casual" },
  { id: USER_IDS.user9, name: "Lucas Pereira", type: "practical" },
  { id: USER_IDS.user10, name: "Hiroshi Sato", type: "balanced" },
  { id: USER_IDS.user11, name: "Oliver Brown", type: "technical" },
  { id: USER_IDS.user12, name: "Emma Fischer", type: "casual" },
  { id: USER_IDS.user13, name: "Daniel Kim", type: "practical" },
  { id: USER_IDS.user14, name: "Isabella Rossi", type: "balanced" },
  { id: USER_IDS.user15, name: "Chloe Lefebvre", type: "technical" },
  { id: USER_IDS.user16, name: "Liam Nguyen", type: "casual" },
  { id: USER_IDS.user17, name: "Jack Thompson", type: "practical" },
  { id: USER_IDS.user18, name: "Sophie Chen", type: "balanced" },
  { id: USER_IDS.user19, name: "Omar Al-Fayed", type: "technical" },
  { id: USER_IDS.user20, name: "Elena Petrova", type: "casual" },
  { id: USER_IDS.user21, name: "Noah Smith", type: "practical" },
  { id: USER_IDS.user22, name: "Fatimah Zahra", type: "balanced" },
  { id: USER_IDS.user23, name: "Zoe Miller", type: "technical" },
  { id: USER_IDS.user24, name: "Jean-Pierre", type: "casual" },
]

// 🧠 REALISTIC REVIEWS GENERATOR
function generateReviews() {
  const shuffled = [...USERS].sort(() => 0.5 - Math.random()).slice(0, 3 + Math.floor(Math.random() * 2))

  return shuffled.map(user => {
    let comment = ""
    switch (user.type) {
      case "practical": comment = "Actually exceeds expectations. Battery life and build quality are top-notch."; break
      case "balanced": comment = "Perfect for my needs. The design is sleek and performance is very smooth."; break
      case "technical": comment = "Impressive hardware specs. Benchmarked it and it handles stress tests like a champ."; break
      case "casual": comment = "Absolutely love it! The camera is amazing and it looks so premium in person."; break
    }
    return {
      user: user.id,
      name: user.name,
      title: "Excellent Qualtiy",
      rating: Math.random() > 0.2 ? 5 : 4,
      comment
    }
  })
}

function calcRating(reviews: any[]) {
  if (reviews.length === 0) return 0
  return reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
}

const RAW_PRODUCTS: any[] = [
  {
    name: "MacBook Pro 14-inch M4 Pro",
    slug: "macbook-pro-14-m4-pro",
    brand: "Apple",
    category: CATEGORY_IDS.laptops,
    user: ADMIN_ID,
    badge: "New 2025",
    sku: "APL-MBP14-M4P-24-512",
    tags: ["laptop", "apple", "m4", "pro", "macos", "creative"],
    description: "The most powerful MacBook Pro ever. M4 Pro chip with 14-core CPU and 20-core GPU.",
    images: [
      { url: "https://www.apple.com/newsroom/images/2024/10/new-macbook-pro/article/Apple-MacBook-Pro-M4-hero_big.jpg.large.jpg", alt: "MacBook Pro 14 M4 Pro Space Black", isPrimary: true },
      { url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-silver-select-202410?wid=904&hei=840&fmt=jpeg&qlt=90", alt: "MacBook Pro 14 M4 Pro Silver", isPrimary: false },
    ],
    price: 1999, originalPrice: 2199, currency: "USD",
    countInStock: 28, soldCount: 412,
    variantGroups: [
      { name: "Storage", options: [{ label: "512GB", value: "512gb", priceModifier: 0, inStock: true }, { label: "1TB", value: "1tb", priceModifier: 200, inStock: true }, { label: "2TB", value: "2tb", priceModifier: 400, inStock: false }] },
      { name: "Memory", options: [{ label: "24GB", value: "24gb", priceModifier: 0, inStock: true }, { label: "48GB", value: "48gb", priceModifier: 200, inStock: true }] },
    ],
    colors: [{ name: "Space Black", hex: "#1c1c1e" }, { name: "Silver", hex: "#e3e4e6" }],
    quickSpecs: [
      { icon: "⚡", label: "Chip", value: "M4 Pro" },
      { icon: "🔋", label: "Battery", value: "22 hrs" },
      { icon: "🖥️", label: "Display", value: "14.2\" Liquid Retina XDR" },
      { icon: "⚖️", label: "Weight", value: "1.6 kg" },
    ],
    specs: [
      { icon: "🧠", label: "CPU", value: "14-core", description: "14-core CPU with 10 performance and 4 efficiency cores." },
      { icon: "🎮", label: "GPU", value: "20-core", description: "20-core GPU for pro-level graphics performance." },
      { icon: "💾", label: "Memory", value: "24 GB", description: "Unified memory for seamless multitasking." },
      { icon: "📦", label: "Storage", value: "512 GB SSD", description: "Up to 7.4GB/s read speeds." },
      { icon: "📡", label: "Connectivity", value: "Wi-Fi 6E", description: "Wi-Fi 6E and Bluetooth 5.3." },
      { icon: "🔌", label: "Ports", value: "3× Thunderbolt 5", description: "Three Thunderbolt 5 ports plus HDMI, SD card." },
    ],
    boxItems: [{ icon: "💻", name: "MacBook Pro 14-inch", quantity: "×1" }, { icon: "🔌", name: "140W USB-C Power Adapter", quantity: "×1" }, { icon: "🔗", name: "USB-C to MagSafe 3 Cable", quantity: "×1" }],
    rating: 4.9, numReviews: 2847,
    ratingBreakdown: { five: 2416, four: 312, three: 84, two: 23, one: 12 },
    deliveryDate: "Dec 24", returnDays: 30, warrantyYears: 1,
    cardBgColor: "#0a0a0f", cardGlowColor: "rgba(79,142,255,0.22)",
    relatedProducts: [],
  },

  {
    name: "MacBook Air 13-inch M3",
    slug: "macbook-air-13-m3",
    brand: "Apple",
    category: CATEGORY_IDS.laptops,
    user: ADMIN_ID,
    badge: "Best Seller",
    sku: "APL-MBA13-M3-8-256",
    tags: ["laptop", "apple", "m3", "air", "thin", "lightweight"],
    description: "Impossibly thin, strikingly fast. The MacBook Air with M3 chip.",
    images: [
      { url: "https://www.apple.com/newsroom/images/2024/03/apple-unveils-the-new-13-and-15-inch-macbook-air-with-the-powerful-m3-chip/tile/Apple-MacBook-Air-2-up-hero-240304-lp.jpg.landing-big_2x.jpg", alt: "MacBook Air 13 M3 Midnight", isPrimary: true },
      { url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-starlight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90", alt: "MacBook Air 13 M3 Starlight", isPrimary: false },
    ],
    price: 1099, originalPrice: 1299, currency: "USD",
    countInStock: 54, soldCount: 1820,
    variantGroups: [
      { name: "Storage", options: [{ label: "256GB", value: "256gb", priceModifier: 0, inStock: true }, { label: "512GB", value: "512gb", priceModifier: 200, inStock: true }] },
      { name: "Memory", options: [{ label: "8GB", value: "8gb", priceModifier: 0, inStock: true }, { label: "16GB", value: "16gb", priceModifier: 200, inStock: true }] },
    ],
    colors: [{ name: "Midnight", hex: "#2a2d3a" }, { name: "Starlight", hex: "#e8dcc8" }, { name: "Space Grey", hex: "#6e6e73" }, { name: "Silver", hex: "#e3e4e6" }],
    quickSpecs: [
      { icon: "⚡", label: "Chip", value: "M3" },
      { icon: "🔋", label: "Battery", value: "18 hrs" },
      { icon: "🖥️", label: "Display", value: "13.6\" Liquid Retina" },
      { icon: "⚖️", label: "Weight", value: "1.24 kg" },
    ],
    specs: [
      { icon: "🧠", label: "CPU", value: "8-core", description: "8-core CPU with 4 performance and 4 efficiency cores." },
      { icon: "🎮", label: "GPU", value: "10-core", description: "10-core GPU for everyday graphics." },
      { icon: "💾", label: "Memory", value: "8 GB", description: "Unified memory for fluid performance." },
      { icon: "📦", label: "Storage", value: "256 GB SSD", description: "Fast SSD storage." },
      { icon: "📡", label: "Connectivity", value: "Wi-Fi 6E", description: "Wi-Fi 6E and Bluetooth 5.3." },
      { icon: "🔌", label: "Ports", value: "2× Thunderbolt 3", description: "Two Thunderbolt / USB 4 ports." },
    ],
    boxItems: [{ icon: "💻", name: "MacBook Air 13-inch", quantity: "×1" }, { icon: "🔌", name: "35W Dual USB-C Power Adapter", quantity: "×1" }, { icon: "🔗", name: "USB-C to MagSafe 3 Cable", quantity: "×1" }],
    rating: 4.8, numReviews: 5621,
    ratingBreakdown: { five: 4721, four: 621, three: 180, two: 62, one: 37 },
    deliveryDate: "Dec 23", returnDays: 30, warrantyYears: 1,
    cardBgColor: "#05050a", cardGlowColor: "rgba(100,120,255,0.18)",
    relatedProducts: [],
  },



  {
    name: "MacBook Pro 16-inch M4 Max",
    slug: "macbook-pro-16-m4-max",
    brand: "Apple",
    category: CATEGORY_IDS.laptops,
    user: ADMIN_ID,
    badge: "Pro",
    sku: "APL-MBP16-M4MAX-36-1T",
    tags: ["laptop", "apple", "m4", "max", "pro", "video", "music"],
    description: "The ultimate MacBook Pro for professionals who demand the most.",
    images: [{ url: "https://cdn.mos.cms.futurecdn.net/jeihtTYzdMR5EQA6HcSNiV.jpg", alt: "MacBook Pro 16 M4 Max Space Black", isPrimary: true }],
    price: 3499, originalPrice: 3699, currency: "USD",
    countInStock: 12, soldCount: 289,
    variantGroups: [
      { name: "Storage", options: [{ label: "1TB", value: "1tb", priceModifier: 0, inStock: true }, { label: "2TB", value: "2tb", priceModifier: 200, inStock: true }, { label: "4TB", value: "4tb", priceModifier: 600, inStock: false }] },
      { name: "Memory", options: [{ label: "36GB", value: "36gb", priceModifier: 0, inStock: true }, { label: "128GB", value: "128gb", priceModifier: 800, inStock: true }] },
    ],
    colors: [{ name: "Space Black", hex: "#1c1c1e" }, { name: "Silver", hex: "#e3e4e6" }],
    quickSpecs: [
      { icon: "⚡", label: "Chip", value: "M4 Max" },
      { icon: "🔋", label: "Battery", value: "24 hrs" },
      { icon: "🖥️", label: "Display", value: "16.2\" Liquid Retina XDR" },
      { icon: "⚖️", label: "Weight", value: "2.14 kg" },
    ],
    specs: [
      { icon: "🧠", label: "CPU", value: "16-core", description: "16-core CPU with breakthrough performance." },
      { icon: "🎮", label: "GPU", value: "40-core", description: "40-core GPU for extreme graphics workloads." },
      { icon: "💾", label: "Memory", value: "36 GB", description: "High-bandwidth unified memory." },
      { icon: "📦", label: "Storage", value: "1 TB SSD", description: "Blazing fast SSD." },
      { icon: "📡", label: "Connectivity", value: "Wi-Fi 6E", description: "Wi-Fi 6E, Bluetooth 5.3." },
      { icon: "🔌", label: "Ports", value: "3× Thunderbolt 5", description: "Three Thunderbolt 5 plus HDMI 2.1, SD card." },
    ],
    boxItems: [{ icon: "💻", name: "MacBook Pro 16-inch", quantity: "×1" }, { icon: "🔌", name: "140W USB-C Power Adapter", quantity: "×1" }, { icon: "🔗", name: "USB-C to MagSafe 3 Cable", quantity: "×1" }],
    rating: 4.9, numReviews: 892,
    ratingBreakdown: { five: 780, four: 82, three: 20, two: 6, one: 4 },
    deliveryDate: "Dec 25", returnDays: 30, warrantyYears: 1,
    cardBgColor: "#070710", cardGlowColor: "rgba(100,80,255,0.2)",
    relatedProducts: [],
  },

  {
    name: "Lenovo ThinkPad X1 Carbon Gen 12",
    slug: "lenovo-thinkpad-x1-carbon-gen12",
    brand: "Lenovo",
    category: CATEGORY_IDS.laptops,
    user: ADMIN_ID,
    sku: "LEN-X1C-G12-I7-32-1T",
    tags: ["laptop", "lenovo", "thinkpad", "business", "ultralight"],
    description: "The legendary business ultrabook. Featherlight at 1.12kg with Intel Core Ultra 7.",
    images: [{ url: "https://psrefstuff.lenovo.com/syspool/Sys/Image/ThinkPad/ThinkPad_X1_Carbon_Gen_12/Compressedimage/ThinkPad_X1_Carbon_Gen_12_CT2_06.png", alt: "Lenovo ThinkPad X1 Carbon Gen 12 Black", isPrimary: true }],
    price: 1599, originalPrice: 1799, currency: "USD",
    countInStock: 22, soldCount: 478,
    variantGroups: [
      { name: "Storage", options: [{ label: "512GB", value: "512gb", priceModifier: 0, inStock: true }, { label: "1TB", value: "1tb", priceModifier: 150, inStock: true }] },
      { name: "Memory", options: [{ label: "16GB", value: "16gb", priceModifier: 0, inStock: true }, { label: "32GB", value: "32gb", priceModifier: 200, inStock: true }] },
    ],
    colors: [{ name: "Deep Black", hex: "#1a1a1c" }],
    quickSpecs: [
      { icon: "⚡", label: "CPU", value: "Core Ultra 7 165U" },
      { icon: "🔋", label: "Battery", value: "15 hrs" },
      { icon: "🖥️", label: "Display", value: "14\" 2.8K OLED" },
      { icon: "⚖️", label: "Weight", value: "1.12 kg" },
    ],
    specs: [
      { icon: "🧠", label: "CPU", value: "Intel Core Ultra 7 165U", description: "12-core Intel Core Ultra 7." },
      { icon: "🎮", label: "GPU", value: "Intel Arc", description: "Integrated Intel Arc graphics." },
      { icon: "💾", label: "Memory", value: "32 GB LPDDR5x", description: "Soldered 7467MHz memory." },
      { icon: "📦", label: "Storage", value: "1 TB PCIe 4 SSD", description: "M.2 PCIe Gen 4 SSD." },
      { icon: "🛡️", label: "Security", value: "ThinkShield", description: "Enterprise-grade security with dTPM 2.0." },
      { icon: "🔌", label: "Ports", value: "2× Thunderbolt 4", description: "Plus 2× USB-A, HDMI 2.1, headphone jack." },
    ],
    boxItems: [{ icon: "💻", name: "ThinkPad X1 Carbon", quantity: "×1" }, { icon: "🔌", name: "65W USB-C Slim Charger", quantity: "×1" }],
    rating: 4.7, numReviews: 789,
    ratingBreakdown: { five: 590, four: 130, three: 48, two: 14, one: 7 },
    deliveryDate: "Dec 28", returnDays: 30, warrantyYears: 3,
    cardBgColor: "#080810", cardGlowColor: "rgba(80,100,255,0.18)",
    relatedProducts: [],
  },

  {
    name: "ASUS ROG Zephyrus G16 2025",
    slug: "asus-rog-zephyrus-g16-2025",
    brand: "ASUS",
    category: CATEGORY_IDS.laptops,
    user: ADMIN_ID,
    badge: "Gaming",
    sku: "ASUS-ROG-G16-R9-32-1T",
    tags: ["laptop", "asus", "rog", "gaming", "rtx4090", "240hz"],
    description: "Extreme gaming performance in a 1.85kg chassis. RTX 4090 laptop GPU.",
    images: [{ url: "https://dlcdnwebimgs.asus.com/gain/78355552-D7DD-49C2-BF03-977985D4768F/w1000/h732", alt: "ASUS ROG Zephyrus G16 Eclipse Gray", isPrimary: true }],
    price: 2499, originalPrice: 2699, currency: "USD",
    countInStock: 9, soldCount: 312,
    variantGroups: [
      { name: "Storage", options: [{ label: "1TB", value: "1tb", priceModifier: 0, inStock: true }, { label: "2TB", value: "2tb", priceModifier: 250, inStock: false }] },
    ],
    colors: [{ name: "Eclipse Gray", hex: "#2a2a2c" }, { name: "Platinum White", hex: "#f0f0f2" }],
    quickSpecs: [
      { icon: "⚡", label: "CPU", value: "Ryzen 9 8945HS" },
      { icon: "🎮", label: "GPU", value: "RTX 4090 Laptop" },
      { icon: "🖥️", label: "Display", value: "16\" 2.5K 240Hz OLED" },
      { icon: "⚖️", label: "Weight", value: "1.85 kg" },
    ],
    specs: [
      { icon: "🧠", label: "CPU", value: "AMD Ryzen 9 8945HS", description: "8-core, 16-thread, up to 5.2GHz." },
      { icon: "🎮", label: "GPU", value: "NVIDIA RTX 4090 16GB", description: "175W TGP for maximum gaming performance." },
      { icon: "💾", label: "Memory", value: "32 GB DDR5", description: "6400MHz dual-channel DDR5." },
      { icon: "📦", label: "Storage", value: "1 TB PCIe 4 SSD", description: "PCIe Gen 4 NVMe SSD." },
      { icon: "🖥️", label: "Display", value: "2560×1600 240Hz OLED", description: "100% DCI-P3, 0.2ms response." },
      { icon: "🔌", label: "Ports", value: "Thunderbolt 4 + USB-A ×3", description: "Full connectivity suite." },
    ],
    boxItems: [{ icon: "💻", name: "ROG Zephyrus G16", quantity: "×1" }, { icon: "🔌", name: "240W Power Adapter", quantity: "×1" }, { icon: "🎒", name: "ROG Bag", quantity: "×1" }],
    rating: 4.8, numReviews: 634,
    ratingBreakdown: { five: 510, four: 88, three: 26, two: 7, one: 3 },
    deliveryDate: "Dec 27", returnDays: 30, warrantyYears: 1,
    cardBgColor: "#0a050f", cardGlowColor: "rgba(180,50,255,0.2)",
    relatedProducts: [],
  },

  {
    name: "Microsoft Surface Laptop 6",
    slug: "microsoft-surface-laptop-6",
    brand: "Microsoft",
    category: CATEGORY_IDS.laptops,
    user: ADMIN_ID,
    sku: "MS-SL6-I7-16-512",
    tags: ["laptop", "microsoft", "surface", "windows", "slim"],
    description: "Elegant, powerful, and fast. The Surface Laptop 6 with Intel Core Ultra 7.",
    images: [{ url: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/Content-Card-Surface-Laptop-6-Platinum-Front-001-COMMR?wid=834&hei=470&fit=crop&resSharp=1", alt: "Microsoft Surface Laptop 6 Sapphire", isPrimary: true }],
    price: 1299, originalPrice: 1499, currency: "USD",
    countInStock: 31, soldCount: 567,
    variantGroups: [
      { name: "Storage", options: [{ label: "256GB", value: "256gb", priceModifier: 0, inStock: true }, { label: "512GB", value: "512gb", priceModifier: 200, inStock: true }] },
      { name: "Memory", options: [{ label: "16GB", value: "16gb", priceModifier: 0, inStock: true }, { label: "32GB", value: "32gb", priceModifier: 300, inStock: true }] },
    ],
    colors: [{ name: "Sapphire", hex: "#2455a4" }, { name: "Platinum", hex: "#c8c8c8" }, { name: "Black", hex: "#1a1a1c" }],
    quickSpecs: [
      { icon: "⚡", label: "CPU", value: "Core Ultra 7 165H" },
      { icon: "🔋", label: "Battery", value: "20 hrs" },
      { icon: "🖥️", label: "Display", value: "13.8\" PixelSense Touch" },
      { icon: "⚖️", label: "Weight", value: "1.34 kg" },
    ],
    specs: [
      { icon: "🧠", label: "CPU", value: "Intel Core Ultra 7 165H", description: "16 cores up to 5.0GHz." },
      { icon: "🎮", label: "GPU", value: "Intel Arc", description: "Integrated Arc graphics." },
      { icon: "💾", label: "Memory", value: "16 GB LPDDR5x", description: "Soldered high-speed memory." },
      { icon: "📦", label: "Storage", value: "512 GB SSD", description: "Removable SSD for upgradeability." },
      { icon: "🖥️", label: "Display", value: "2304×1536 PixelSense", description: "3:2 aspect ratio, 120Hz refresh." },
      { icon: "🔌", label: "Ports", value: "USB-C × 2, USB-A, Surface Connect", description: "Plus 3.5mm headphone jack." },
    ],
    boxItems: [{ icon: "💻", name: "Surface Laptop 6", quantity: "×1" }, { icon: "🔌", name: "65W Power Supply", quantity: "×1" }],
    rating: 4.6, numReviews: 892,
    ratingBreakdown: { five: 634, four: 178, three: 56, two: 16, one: 8 },
    deliveryDate: "Dec 26", returnDays: 30, warrantyYears: 1,
    cardBgColor: "#04080e", cardGlowColor: "rgba(36,85,164,0.2)",
    relatedProducts: [],
  },

  {
    name: "HP Spectre x360 14",
    slug: "hp-spectre-x360-14-2025",
    brand: "HP",
    category: CATEGORY_IDS.laptops,
    user: ADMIN_ID,
    sku: "HP-SPX360-14-I7-16-1T",
    tags: ["laptop", "hp", "spectre", "2-in-1", "convertible", "oled"],
    description: "The world's most premium 2-in-1 convertible laptop with stunning OLED display.",
    images: [{ url: "https://www.hp.com/content/dam/sites/worldwide/personal-computers/consumer/laptops-and-2-n-1s/spectre/version-2023/HP%20Spectre%20x360%2014__Mobile@2x.png", alt: "HP Spectre x360 14 Nightfall Black", isPrimary: true }],
    price: 1699, originalPrice: 1899, currency: "USD",
    countInStock: 16, soldCount: 389,
    variantGroups: [
      { name: "Storage", options: [{ label: "1TB", value: "1tb", priceModifier: 0, inStock: true }, { label: "2TB", value: "2tb", priceModifier: 300, inStock: true }] },
    ],
    colors: [{ name: "Nightfall Black", hex: "#1a1c22" }, { name: "Natural Silver", hex: "#d0d0d4" }],
    quickSpecs: [
      { icon: "⚡", label: "CPU", value: "Core Ultra 7 155H" },
      { icon: "🔋", label: "Battery", value: "17 hrs" },
      { icon: "🖥️", label: "Display", value: "14\" 2.8K OLED Touch" },
      { icon: "⚖️", label: "Weight", value: "1.41 kg" },
    ],
    specs: [
      { icon: "🧠", label: "CPU", value: "Intel Core Ultra 7 155H", description: "16 cores up to 4.8GHz." },
      { icon: "🎮", label: "GPU", value: "Intel Arc", description: "Intel Arc integrated graphics." },
      { icon: "💾", label: "Memory", value: "16 GB LPDDR5x", description: "7467MHz low-power memory." },
      { icon: "📦", label: "Storage", value: "1 TB PCIe 4 SSD", description: "Fast read/write NVMe." },
      { icon: "🖥️", label: "Display", value: "2880×1800 OLED", description: "2800K nits peak brightness, 100% DCI-P3." },
      { icon: "✏️", label: "Pen", value: "HP Tilt Pen", description: "Included tilt-sensitive stylus." },
    ],
    boxItems: [{ icon: "💻", name: "HP Spectre x360 14", quantity: "×1" }, { icon: "🔌", name: "65W USB-C Charger", quantity: "×1" }, { icon: "✏️", name: "HP Tilt Pen", quantity: "×1" }],
    rating: 4.7, numReviews: 542,
    ratingBreakdown: { five: 398, four: 98, three: 32, two: 9, one: 5 },
    deliveryDate: "Dec 27", returnDays: 30, warrantyYears: 1,
    cardBgColor: "#08080e", cardGlowColor: "rgba(80,80,200,0.18)",
    relatedProducts: [],
  },

  {
    name: "LG Gram 16 2025",
    slug: "lg-gram-16-2025",
    brand: "LG",
    category: CATEGORY_IDS.laptops,
    user: ADMIN_ID,
    sku: "LG-GRAM16-I7-16-512",
    tags: ["laptop", "lg", "gram", "ultralight", "business"],
    description: "Impossibly light at 1.19kg. Military-grade durability meets 22-hour battery life.",
    images: [{ url: "https://m.media-amazon.com/images/I/71-KbkIcdxL.jpg", alt: "LG Gram 16 White", isPrimary: true }],
    price: 1349, originalPrice: 1499, currency: "USD",
    countInStock: 24, soldCount: 298,
    variantGroups: [
      { name: "Memory", options: [{ label: "16GB", value: "16gb", priceModifier: 0, inStock: true }, { label: "32GB", value: "32gb", priceModifier: 200, inStock: true }] },
    ],
    colors: [{ name: "White", hex: "#f5f5f7" }, { name: "Charcoal Gray", hex: "#3a3a3c" }],
    quickSpecs: [
      { icon: "⚡", label: "CPU", value: "Core Ultra 7 155H" },
      { icon: "🔋", label: "Battery", value: "22 hrs" },
      { icon: "🖥️", label: "Display", value: "16\" WQXGA IPS" },
      { icon: "⚖️", label: "Weight", value: "1.19 kg" },
    ],
    specs: [
      { icon: "🧠", label: "CPU", value: "Intel Core Ultra 7 155H", description: "16-core Intel Core Ultra 7." },
      { icon: "🎮", label: "GPU", value: "Intel Arc", description: "Intel Arc integrated graphics." },
      { icon: "💾", label: "Memory", value: "16 GB LPDDR5", description: "Dual-channel LPDDR5." },
      { icon: "📦", label: "Storage", value: "512 GB NVMe", description: "Upgradable M.2 SSD." },
      { icon: "🛡️", label: "Durability", value: "MIL-STD-810H", description: "Military-grade certified for 7 categories." },
      { icon: "🔌", label: "Ports", value: "Thunderbolt 4 × 2", description: "Plus 2× USB-A, HDMI, SD card." },
    ],
    boxItems: [{ icon: "💻", name: "LG Gram 16", quantity: "×1" }, { icon: "🔌", name: "65W USB-C Charger", quantity: "×1" }],
    rating: 4.6, numReviews: 412,
    ratingBreakdown: { five: 296, four: 82, three: 24, two: 7, one: 3 },
    deliveryDate: "Dec 29", returnDays: 30, warrantyYears: 1,
    cardBgColor: "#080a10", cardGlowColor: "rgba(60,100,200,0.18)",
    relatedProducts: [],
  },

  {
    name: "Razer Blade 16 2025",
    slug: "razer-blade-16-2025",
    brand: "Razer",
    category: CATEGORY_IDS.laptops,
    user: ADMIN_ID,
    badge: "Limited",
    sku: "RZR-BL16-I9-32-2T",
    tags: ["laptop", "razer", "gaming", "rtx5080", "oled", "premium"],
    description: "The world's most advanced gaming laptop. RTX 5080 in a sleek aluminium body.",
    images: [{ url: "https://i.pcmag.com/imagery/articles/036Wnuiwey97jM83MMCWS3X-1..v1736178719.png", alt: "Razer Blade 16 Black", isPrimary: true }],
    price: 3499, originalPrice: 3799, currency: "USD",
    countInStock: 6, soldCount: 124,
    variantGroups: [
      { name: "Storage", options: [{ label: "2TB", value: "2tb", priceModifier: 0, inStock: true }, { label: "4TB", value: "4tb", priceModifier: 400, inStock: false }] },
    ],
    colors: [{ name: "Matte Black", hex: "#111114" }],
    quickSpecs: [
      { icon: "⚡", label: "CPU", value: "Intel Core i9-14900HX" },
      { icon: "🎮", label: "GPU", value: "RTX 5080 Laptop" },
      { icon: "🖥️", label: "Display", value: "16\" 4K OLED 240Hz" },
      { icon: "⚖️", label: "Weight", value: "2.14 kg" },
    ],
    specs: [
      { icon: "🧠", label: "CPU", value: "Intel Core i9-14900HX", description: "24 cores, 5.8GHz max boost." },
      { icon: "🎮", label: "GPU", value: "NVIDIA RTX 5080 16GB", description: "Flagship laptop GPU." },
      { icon: "💾", label: "Memory", value: "32 GB DDR5", description: "6400MHz DDR5." },
      { icon: "📦", label: "Storage", value: "2 TB PCIe 5 SSD", description: "PCIe Gen 5 for extreme speeds." },
      { icon: "🖥️", label: "Display", value: "4K OLED 240Hz", description: "3840×2400 with 100% DCI-P3." },
      { icon: "💡", label: "Lighting", value: "Per-key RGB", description: "Chroma RGB backlit keyboard." },
    ],
    boxItems: [{ icon: "💻", name: "Razer Blade 16", quantity: "×1" }, { icon: "🔌", name: "330W Power Adapter", quantity: "×1" }],
    rating: 4.8, numReviews: 289,
    ratingBreakdown: { five: 234, four: 38, three: 11, two: 4, one: 2 },
    deliveryDate: "Jan 5", returnDays: 30, warrantyYears: 1,
    cardBgColor: "#06060c", cardGlowColor: "rgba(0,255,100,0.15)",
    relatedProducts: [],
  },

  {
    name: "Samsung Galaxy Book4 Ultra",
    slug: "samsung-galaxy-book4-ultra",
    brand: "Samsung",
    category: CATEGORY_IDS.laptops,
    user: ADMIN_ID,
    sku: "SAM-GB4U-I9-32-1T",
    tags: ["laptop", "samsung", "galaxy", "windows", "amoled", "creative"],
    description: "Galaxy AI on a laptop. Stunning 3K AMOLED display with Intel Core Ultra 9.",
    images: [{ url: "https://image-us.samsung.com/SamsungUS/home/computing/galaxy-books/gb4-series/gallery-images/SDSAC-9308-GB4Ultra-configurator-800x600.jpg", alt: "Samsung Galaxy Book4 Ultra Moonstone Gray", isPrimary: true }],
    price: 2399, originalPrice: 2599, currency: "USD",
    countInStock: 14, soldCount: 234,
    variantGroups: [
      { name: "Storage", options: [{ label: "1TB", value: "1tb", priceModifier: 0, inStock: true }, { label: "2TB", value: "2tb", priceModifier: 300, inStock: true }] },
    ],
    colors: [{ name: "Moonstone Gray", hex: "#9090a0" }, { name: "Titan Black", hex: "#1a1a20" }],
    quickSpecs: [
      { icon: "⚡", label: "CPU", value: "Core Ultra 9 185H" },
      { icon: "🎮", label: "GPU", value: "RTX 4070 Laptop" },
      { icon: "🖥️", label: "Display", value: "16\" 3K AMOLED 120Hz" },
      { icon: "⚖️", label: "Weight", value: "1.86 kg" },
    ],
    specs: [
      { icon: "🧠", label: "CPU", value: "Intel Core Ultra 9 185H", description: "16 cores, 5.1GHz boost." },
      { icon: "🎮", label: "GPU", value: "RTX 4070 8GB", description: "NVIDIA RTX 4070 Laptop GPU." },
      { icon: "💾", label: "Memory", value: "32 GB LPDDR5x", description: "7467MHz soldered memory." },
      { icon: "📦", label: "Storage", value: "1 TB NVMe SSD", description: "PCIe Gen 4 SSD." },
      { icon: "🖥️", label: "Display", value: "2880×1800 AMOLED", description: "3K resolution, 120Hz, 400nits." },
      { icon: "🤖", label: "AI", value: "Galaxy AI", description: "Built-in AI features powered by Samsung." },
    ],
    boxItems: [{ icon: "💻", name: "Galaxy Book4 Ultra", quantity: "×1" }, { icon: "🔌", name: "140W USB-C Charger", quantity: "×1" }],
    rating: 4.7, numReviews: 378,
    ratingBreakdown: { five: 278, four: 68, three: 22, two: 6, one: 4 },
    deliveryDate: "Dec 28", returnDays: 30, warrantyYears: 1,
    cardBgColor: "#07080f", cardGlowColor: "rgba(30,130,255,0.18)",
    relatedProducts: [],
  },

  {
    name: "Lenovo Legion 7 Gen 9",
    slug: "lenovo-legion-7-gen9",
    brand: "Lenovo",
    category: CATEGORY_IDS.laptops,
    user: ADMIN_ID,
    badge: "Gaming",
    sku: "LEN-LEG7-R9-32-1T",
    tags: ["laptop", "lenovo", "legion", "gaming", "amd", "240hz"],
    description: "Dominate every game. AMD Ryzen 9 with RTX 4080 in a carbon-fiber chassis.",
    images: [{ url: "https://p1-ofp.static.pub//fes/cms/2024/09/12/q6fb2891avf5ok5et6ppuhuuilu0cq939626.png", alt: "Lenovo Legion 7 Gen 9 Eclipse Black", isPrimary: true }],
    price: 2199, originalPrice: 2399, currency: "USD",
    countInStock: 11, soldCount: 267,
    variantGroups: [
      { name: "Storage", options: [{ label: "1TB", value: "1tb", priceModifier: 0, inStock: true }, { label: "2TB", value: "2tb", priceModifier: 200, inStock: true }] },
    ],
    colors: [{ name: "Eclipse Black", hex: "#141416" }, { name: "Luna Grey", hex: "#a0a4ac" }],
    quickSpecs: [
      { icon: "⚡", label: "CPU", value: "Ryzen 9 8945HX" },
      { icon: "🎮", label: "GPU", value: "RTX 4080 Laptop" },
      { icon: "🖥️", label: "Display", value: "16\" 3.2K 165Hz OLED" },
      { icon: "⚖️", label: "Weight", value: "2.5 kg" },
    ],
    specs: [
      { icon: "🧠", label: "CPU", value: "AMD Ryzen 9 8945HX", description: "8 cores, 5.2GHz max boost." },
      { icon: "🎮", label: "GPU", value: "NVIDIA RTX 4080 12GB", description: "175W TGP with Advanced Optimus." },
      { icon: "💾", label: "Memory", value: "32 GB DDR5", description: "Dual-channel 5600MHz DDR5." },
      { icon: "📦", label: "Storage", value: "1 TB PCIe 4 SSD", description: "Upgradable dual M.2 slots." },
      { icon: "🌡️", label: "Cooling", value: "Coldfront 5.0", description: "Vapor chamber + liquid metal." },
      { icon: "🔌", label: "Ports", value: "Thunderbolt 4 + USB-C ×2", description: "Full I/O suite." },
    ],
    boxItems: [{ icon: "💻", name: "Legion 7 Gen 9", quantity: "×1" }, { icon: "🔌", name: "300W Power Adapter", quantity: "×1" }],
    rating: 4.8, numReviews: 445,
    ratingBreakdown: { five: 356, four: 62, three: 18, two: 6, one: 3 },
    deliveryDate: "Dec 29", returnDays: 30, warrantyYears: 1,
    cardBgColor: "#080a12", cardGlowColor: "rgba(220,60,255,0.18)",
    relatedProducts: [],
  },

  // ─── PHONES (12) ───────────────────────────────────────────────────────────
  {
    name: "iPhone 16 Pro Max",
    slug: "iphone-16-pro-max",
    brand: "Apple",
    category: CATEGORY_IDS.phones,
    user: ADMIN_ID,
    badge: "New 2025",
    sku: "APL-IP16PM-NT-256",
    tags: ["phone", "apple", "iphone", "5g", "camera", "pro"],
    description: "The ultimate iPhone with A18 Pro chip and the most powerful camera system ever.",
    images: [
      { url: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro-max.jpg", alt: "iPhone 16 Pro Max Natural Titanium", isPrimary: true },
    ],
    price: 1199, originalPrice: 1299, currency: "USD",
    countInStock: 48, soldCount: 4821,
    variantGroups: [
      { name: "Storage", options: [{ label: "256GB", value: "256gb", priceModifier: 0, inStock: true }, { label: "512GB", value: "512gb", priceModifier: 100, inStock: true }, { label: "1TB", value: "1tb", priceModifier: 200, inStock: true }] },
    ],
    colors: [{ name: "Natural Titanium", hex: "#c4a882" }, { name: "Black Titanium", hex: "#2c2c2e" }, { name: "White Titanium", hex: "#f0ede8" }, { name: "Desert Titanium", hex: "#c8aa78" }],
    quickSpecs: [
      { icon: "⚡", label: "Chip", value: "A18 Pro" },
      { icon: "📷", label: "Camera", value: "48MP Triple" },
      { icon: "🔋", label: "Battery", value: "33 hrs video" },
      { icon: "🖥️", label: "Display", value: "6.9\" Super Retina XDR" },
    ],
    specs: [
      { icon: "⚡", label: "Chip", value: "A18 Pro", description: "3nm chip with 6-core CPU and 6-core GPU." },
      { icon: "📷", label: "Main Camera", value: "48MP Fusion", description: "48MP main + 48MP ultrawide + 12MP 5× telephoto." },
      { icon: "🔋", label: "Battery", value: "33 hrs video playback", description: "MagSafe and Qi2 wireless charging." },
      { icon: "🖥️", label: "Display", value: "6.9\" OLED ProMotion", description: "2868×1320, 1-120Hz ProMotion, Always-On." },
      { icon: "💾", label: "Storage", value: "256 GB", description: "NVMe-class storage." },
      { icon: "🌐", label: "Connectivity", value: "5G + Wi-Fi 7", description: "5G, Wi-Fi 7, Bluetooth 5.3, UWB." },
    ],
    boxItems: [{ icon: "📱", name: "iPhone 16 Pro Max", quantity: "×1" }, { icon: "🔗", name: "USB-C Cable (1m)", quantity: "×1" }, { icon: "📚", name: "Documentation", quantity: "×1" }],
    rating: 4.9, numReviews: 12847,
    ratingBreakdown: { five: 11200, four: 1200, three: 280, two: 100, one: 67 },
    deliveryDate: "Dec 23", returnDays: 14, warrantyYears: 1,
    cardBgColor: "#0a0808", cardGlowColor: "rgba(255,180,80,0.2)",
    relatedProducts: [],
  },

  {
    name: "Samsung Galaxy S25 Ultra",
    slug: "samsung-galaxy-s25-ultra",
    brand: "Samsung",
    category: CATEGORY_IDS.phones,
    user: ADMIN_ID,
    badge: "Hot",
    sku: "SAM-S25U-TBK-256",
    tags: ["phone", "samsung", "galaxy", "android", "s-pen", "ai"],
    description: "Galaxy AI at its most powerful. Snapdragon 8 Elite, 200MP camera, built-in S Pen.",
    images: [{ url: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s25-ultra-sm-s938-1.jpg", alt: "Samsung Galaxy S25 Ultra Titanium Black", isPrimary: true }],
    price: 1299, originalPrice: 1399, currency: "USD",
    countInStock: 38, soldCount: 3214,
    variantGroups: [
      { name: "Storage", options: [{ label: "256GB", value: "256gb", priceModifier: 0, inStock: true }, { label: "512GB", value: "512gb", priceModifier: 120, inStock: true }, { label: "1TB", value: "1tb", priceModifier: 240, inStock: true }] },
    ],
    colors: [{ name: "Titanium Black", hex: "#2c2c34" }, { name: "Titanium Gray", hex: "#808088" }, { name: "Titanium Whitesilver", hex: "#e8e8f0" }, { name: "Titanium Jade", hex: "#7a9c8c" }],
    quickSpecs: [
      { icon: "⚡", label: "Chip", value: "Snapdragon 8 Elite" },
      { icon: "📷", label: "Camera", value: "200MP Quad" },
      { icon: "🔋", label: "Battery", value: "5,000 mAh" },
      { icon: "🖥️", label: "Display", value: "6.9\" Dynamic AMOLED" },
    ],
    specs: [
      { icon: "⚡", label: "Chip", value: "Snapdragon 8 Elite", description: "The fastest mobile chip, built for AI." },
      { icon: "📷", label: "Camera", value: "200MP ProVisual", description: "200MP main, 50MP ultrawide, 50MP 5× telephoto, 10MP 3× telephoto." },
      { icon: "🔋", label: "Battery", value: "5,000 mAh", description: "45W wired, 15W wireless, 4.5W reverse wireless." },
      { icon: "🖥️", label: "Display", value: "6.9\" QHD+ 120Hz", description: "1-120Hz adaptive, 2600 nits peak, titanium frame." },
      { icon: "✏️", label: "S Pen", value: "Built-in", description: "Integrated S Pen with AI writing tools." },
      { icon: "🤖", label: "AI", value: "Galaxy AI 3.0", description: "On-device and cloud AI features." },
    ],
    boxItems: [{ icon: "📱", name: "Galaxy S25 Ultra", quantity: "×1" }, { icon: "✏️", name: "S Pen", quantity: "×1" }, { icon: "🔗", name: "USB-C Cable", quantity: "×1" }],
    rating: 4.8, numReviews: 8934,
    ratingBreakdown: { five: 7400, four: 1100, three: 280, two: 98, one: 56 },
    deliveryDate: "Dec 24", returnDays: 14, warrantyYears: 1,
    cardBgColor: "#08080e", cardGlowColor: "rgba(100,80,255,0.2)",
    relatedProducts: [],
  },

  {
    name: "Google Pixel 9 Pro XL",
    slug: "google-pixel-9-pro-xl",
    brand: "Google",
    category: CATEGORY_IDS.phones,
    user: ADMIN_ID,
    badge: "AI Camera",
    sku: "GOO-P9PXL-OB-256",
    tags: ["phone", "google", "pixel", "android", "ai", "camera"],
    description: "The best Google AI in your pocket. Tensor G4 chip with the most advanced Pixel camera ever.",
    images: [{ url: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8-pro.jpg", alt: "Google Pixel 9 Pro XL Obsidian", isPrimary: true }],
    price: 1099, originalPrice: 1199, currency: "USD",
    countInStock: 32, soldCount: 2134,
    variantGroups: [
      { name: "Storage", options: [{ label: "256GB", value: "256gb", priceModifier: 0, inStock: true }, { label: "512GB", value: "512gb", priceModifier: 100, inStock: true }, { label: "1TB", value: "1tb", priceModifier: 200, inStock: true }] },
    ],
    colors: [{ name: "Obsidian", hex: "#1c1c20" }, { name: "Porcelain", hex: "#f0ece4" }, { name: "Hazel", hex: "#8c9c80" }, { name: "Rose Quartz", hex: "#e8c8c0" }],
    quickSpecs: [
      { icon: "⚡", label: "Chip", value: "Tensor G4" },
      { icon: "📷", label: "Camera", value: "50MP Triple" },
      { icon: "🔋", label: "Battery", value: "5,060 mAh" },
      { icon: "🖥️", label: "Display", value: "6.8\" LTPO OLED" },
    ],
    specs: [
      { icon: "⚡", label: "Chip", value: "Google Tensor G4", description: "Custom Google chip optimized for AI." },
      { icon: "📷", label: "Camera", value: "50MP Triple System", description: "50MP main, 48MP ultrawide, 48MP 5× telephoto." },
      { icon: "🔋", label: "Battery", value: "5,060 mAh", description: "37W wired, 23W wireless." },
      { icon: "🖥️", label: "Display", value: "6.8\" LTPO OLED", description: "1-120Hz LTPO, 3000 nits, Corning Gorilla Glass Victus 2." },
      { icon: "🤖", label: "AI", value: "Gemini Nano", description: "On-device Gemini for smart suggestions." },
      { icon: "🌐", label: "Connectivity", value: "5G + Wi-Fi 7", description: "mmWave 5G, Wi-Fi 7, UWB." },
    ],
    boxItems: [{ icon: "📱", name: "Pixel 9 Pro XL", quantity: "×1" }, { icon: "🔗", name: "USB-C Cable (1m)", quantity: "×1" }],
    rating: 4.7, numReviews: 4521,
    ratingBreakdown: { five: 3600, four: 620, three: 200, two: 68, one: 33 },
    deliveryDate: "Dec 25", returnDays: 14, warrantyYears: 1,
    cardBgColor: "#060808", cardGlowColor: "rgba(60,200,100,0.18)",
    relatedProducts: [],
  },

  {
    name: "Samsung Galaxy S25+",
    slug: "samsung-galaxy-s25-plus",
    brand: "Samsung",
    category: CATEGORY_IDS.phones,
    user: ADMIN_ID,
    sku: "SAM-S25P-SB-256",
    tags: ["phone", "samsung", "galaxy", "android", "ai", "5g"],
    description: "The perfect balance of size, power, and AI. Snapdragon 8 Elite with Galaxy AI.",
    images: [{ url: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s25-plus-sm-s936-1.jpg", alt: "Samsung Galaxy S25+ Icy Blue", isPrimary: true }],
    price: 999, originalPrice: 1099, currency: "USD",
    countInStock: 42, soldCount: 2891,
    variantGroups: [
      { name: "Storage", options: [{ label: "256GB", value: "256gb", priceModifier: 0, inStock: true }, { label: "512GB", value: "512gb", priceModifier: 120, inStock: true }] },
    ],
    colors: [{ name: "Icy Blue", hex: "#a0c0d8" }, { name: "Silver Shadow", hex: "#b8b8c0" }, { name: "Mint", hex: "#a0c0a0" }, { name: "Navy", hex: "#202840" }],
    quickSpecs: [
      { icon: "⚡", label: "Chip", value: "Snapdragon 8 Elite" },
      { icon: "📷", label: "Camera", value: "50MP Triple" },
      { icon: "🔋", label: "Battery", value: "4,900 mAh" },
      { icon: "🖥️", label: "Display", value: "6.7\" Dynamic AMOLED" },
    ],
    specs: [
      { icon: "⚡", label: "Chip", value: "Snapdragon 8 Elite", description: "World's fastest mobile processor." },
      { icon: "📷", label: "Camera", value: "50MP Triple", description: "50MP main, 12MP ultrawide, 10MP 3× telephoto." },
      { icon: "🔋", label: "Battery", value: "4,900 mAh", description: "45W wired, 15W wireless." },
      { icon: "🖥️", label: "Display", value: "6.7\" QHD+ 120Hz", description: "Dynamic AMOLED 2X, 2600 nits." },
      { icon: "🤖", label: "AI", value: "Galaxy AI 3.0", description: "Full Galaxy AI feature set." },
      { icon: "🌐", label: "Connectivity", value: "5G + Wi-Fi 7", description: "Wi-Fi 7, Bluetooth 5.4." },
    ],
    boxItems: [{ icon: "📱", name: "Galaxy S25+", quantity: "×1" }, { icon: "🔗", name: "USB-C Cable", quantity: "×1" }],
    rating: 4.8, numReviews: 5621,
    ratingBreakdown: { five: 4600, four: 720, three: 200, two: 70, one: 31 },
    deliveryDate: "Dec 24", returnDays: 14, warrantyYears: 1,
    cardBgColor: "#060810", cardGlowColor: "rgba(80,160,220,0.2)",
    relatedProducts: [],
  },

  {
    name: "iPhone 16",
    slug: "iphone-16",
    brand: "Apple",
    category: CATEGORY_IDS.phones,
    user: ADMIN_ID,
    sku: "APL-IP16-BLK-128",
    tags: ["phone", "apple", "iphone", "5g", "camera", "standard"],
    description: "A18 chip, Action button, and Camera Control. iPhone 16.",
    images: [{ url: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15.jpg", alt: "iPhone 16 Black", isPrimary: true }],
    price: 799, originalPrice: 899, currency: "USD",
    countInStock: 65, soldCount: 6412,
    variantGroups: [
      { name: "Storage", options: [{ label: "128GB", value: "128gb", priceModifier: 0, inStock: true }, { label: "256GB", value: "256gb", priceModifier: 100, inStock: true }, { label: "512GB", value: "512gb", priceModifier: 200, inStock: true }] },
    ],
    colors: [{ name: "Black", hex: "#1c1c1e" }, { name: "White", hex: "#f5f5f7" }, { name: "Pink", hex: "#e8b4b8" }, { name: "Teal", hex: "#4a9c9c" }, { name: "Ultramarine", hex: "#3050a0" }],
    quickSpecs: [
      { icon: "⚡", label: "Chip", value: "A18" },
      { icon: "📷", label: "Camera", value: "48MP Dual" },
      { icon: "🔋", label: "Battery", value: "22 hrs video" },
      { icon: "🖥️", label: "Display", value: "6.1\" Super Retina XDR" },
    ],
    specs: [
      { icon: "⚡", label: "Chip", value: "A18", description: "3nm chip with 6-core CPU." },
      { icon: "📷", label: "Camera", value: "48MP Fusion", description: "48MP main + 12MP ultrawide with 4K 120fps." },
      { icon: "🔋", label: "Battery", value: "22 hrs video", description: "MagSafe charging up to 25W." },
      { icon: "🖥️", label: "Display", value: "6.1\" OLED", description: "2556×1179, 460ppi." },
      { icon: "🎛️", label: "Controls", value: "Camera Control", description: "New capacitive Camera Control button." },
      { icon: "🌐", label: "Connectivity", value: "5G + Wi-Fi 7", description: "Wi-Fi 7, Bluetooth 5.3." },
    ],
    boxItems: [{ icon: "📱", name: "iPhone 16", quantity: "×1" }, { icon: "🔗", name: "USB-C Cable (1m)", quantity: "×1" }],
    rating: 4.8, numReviews: 9234,
    ratingBreakdown: { five: 7800, four: 1000, three: 300, two: 84, one: 50 },
    deliveryDate: "Dec 23", returnDays: 14, warrantyYears: 1,
    cardBgColor: "#060606", cardGlowColor: "rgba(120,120,255,0.18)",
    relatedProducts: [],
  },

  {
    name: "OnePlus 13",
    slug: "oneplus-13",
    brand: "OnePlus",
    category: CATEGORY_IDS.phones,
    user: ADMIN_ID,
    badge: "Value Pick",
    sku: "OP-13-BLK-256",
    tags: ["phone", "oneplus", "android", "fast-charge", "snapdragon"],
    description: "Flagship killer. Snapdragon 8 Elite with 100W charging and a stunning 6.82\" AMOLED.",
    images: [{ url: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-13.jpg", alt: "OnePlus 13 Midnight Ocean", isPrimary: true }],
    price: 899, originalPrice: 999, currency: "USD",
    countInStock: 28, soldCount: 1892,
    variantGroups: [
      { name: "Storage", options: [{ label: "256GB", value: "256gb", priceModifier: 0, inStock: true }, { label: "512GB", value: "512gb", priceModifier: 100, inStock: true }] },
    ],
    colors: [{ name: "Midnight Ocean", hex: "#002040" }, { name: "Arctic Dawn", hex: "#c8d8e8" }, { name: "Black Eclipse", hex: "#0e0e12" }],
    quickSpecs: [
      { icon: "⚡", label: "Chip", value: "Snapdragon 8 Elite" },
      { icon: "📷", label: "Camera", value: "50MP Hasselblad" },
      { icon: "🔋", label: "Battery", value: "6,000 mAh" },
      { icon: "🖥️", label: "Display", value: "6.82\" LTPO AMOLED" },
    ],
    specs: [
      { icon: "⚡", label: "Chip", value: "Snapdragon 8 Elite", description: "Latest Qualcomm flagship chip." },
      { icon: "📷", label: "Camera", value: "Hasselblad 50MP", description: "Hasselblad-tuned 50MP main, 50MP ultrawide, 50MP 3× telephoto." },
      { icon: "🔋", label: "Battery", value: "6,000 mAh", description: "100W SUPERVOOC wired, 50W wireless." },
      { icon: "🖥️", label: "Display", value: "6.82\" 2K 120Hz", description: "LTPO 1-120Hz, 4500 nits peak." },
      { icon: "🌐", label: "Connectivity", value: "5G + Wi-Fi 7", description: "Wi-Fi 7, Bluetooth 5.4." },
      { icon: "🎨", label: "Design", value: "Quad-curved", description: "Quad-curved ceramic back with Gorilla Glass Victus 2." },
    ],
    boxItems: [{ icon: "📱", name: "OnePlus 13", quantity: "×1" }, { icon: "🔌", name: "100W SUPERVOOC Charger", quantity: "×1" }, { icon: "🔗", name: "USB-C Cable", quantity: "×1" }],
    rating: 4.7, numReviews: 3421,
    ratingBreakdown: { five: 2700, four: 500, three: 150, two: 48, one: 23 },
    deliveryDate: "Dec 26", returnDays: 14, warrantyYears: 1,
    cardBgColor: "#040810", cardGlowColor: "rgba(0,60,120,0.2)",
    relatedProducts: [],
  },



  {
    name: "iPhone 16 Pro",
    slug: "iphone-16-pro",
    brand: "Apple",
    category: CATEGORY_IDS.phones,
    user: ADMIN_ID,
    sku: "APL-IP16P-DBT-128",
    tags: ["phone", "apple", "iphone", "pro", "5g", "titanium"],
    description: "A18 Pro. Titanium. Pro camera with 5× optical zoom.",
    images: [{ url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch_GEO_US?wid=5120&hei=2880&fmt=jpeg&qlt=90", alt: "iPhone 16 Pro Desert Titanium", isPrimary: true }],
    price: 999, originalPrice: 1099, currency: "USD",
    countInStock: 55, soldCount: 5821,
    variantGroups: [
      { name: "Storage", options: [{ label: "128GB", value: "128gb", priceModifier: 0, inStock: true }, { label: "256GB", value: "256gb", priceModifier: 100, inStock: true }, { label: "512GB", value: "512gb", priceModifier: 200, inStock: true }, { label: "1TB", value: "1tb", priceModifier: 300, inStock: true }] },
    ],
    colors: [{ name: "Black Titanium", hex: "#2c2c2e" }, { name: "White Titanium", hex: "#f0ede8" }, { name: "Natural Titanium", hex: "#c4a882" }, { name: "Desert Titanium", hex: "#c8aa78" }],
    quickSpecs: [
      { icon: "⚡", label: "Chip", value: "A18 Pro" },
      { icon: "📷", label: "Camera", value: "48MP Triple + 5×" },
      { icon: "🔋", label: "Battery", value: "27 hrs video" },
      { icon: "🖥️", label: "Display", value: "6.3\" Super Retina XDR" },
    ],
    specs: [
      { icon: "⚡", label: "Chip", value: "A18 Pro", description: "First iPhone chip with hardware ray tracing." },
      { icon: "📷", label: "Camera", value: "48MP + 48MP + 12MP 5×", description: "ProRAW, ProRes 4K 120fps." },
      { icon: "🔋", label: "Battery", value: "27 hrs video playback", description: "MagSafe up to 25W." },
      { icon: "🖥️", label: "Display", value: "6.3\" ProMotion Always-On", description: "2622×1206, 1-120Hz." },
      { icon: "🎛️", label: "Controls", value: "Action + Camera Control", description: "Two customizable hardware buttons." },
      { icon: "🌐", label: "Connectivity", value: "5G + Wi-Fi 7", description: "Wi-Fi 7, Bluetooth 5.3, UWB." },
    ],
    boxItems: [{ icon: "📱", name: "iPhone 16 Pro", quantity: "×1" }, { icon: "🔗", name: "USB-C Cable (1m)", quantity: "×1" }],
    rating: 4.9, numReviews: 8921,
    ratingBreakdown: { five: 7800, four: 820, three: 210, two: 60, one: 31 },
    deliveryDate: "Dec 23", returnDays: 14, warrantyYears: 1,
    cardBgColor: "#0a0808", cardGlowColor: "rgba(200,160,80,0.18)",
    relatedProducts: [],
  },

  {
    name: "Sony Xperia 1 VII",
    slug: "sony-xperia-1-vii",
    brand: "Sony",
    category: CATEGORY_IDS.phones,
    user: ADMIN_ID,
    sku: "SON-XP1VII-BLK-256",
    tags: ["phone", "sony", "xperia", "4k-display", "camera", "professional"],
    description: "Professional-grade photography with Zeiss optics and the world's first 4K OLED 120Hz phone display.",
    images: [{ url: "https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-1-vi.jpg", alt: "Sony Xperia 1 VII Black", isPrimary: true }],
    price: 1299, originalPrice: 1399, currency: "USD",
    countInStock: 14, soldCount: 456,
    variantGroups: [
      { name: "Storage", options: [{ label: "256GB", value: "256gb", priceModifier: 0, inStock: true }, { label: "512GB", value: "512gb", priceModifier: 100, inStock: false }] },
    ],
    colors: [{ name: "Black", hex: "#0e0e10" }, { name: "Khaki Green", hex: "#6a7c58" }, { name: "Platinum Silver", hex: "#c8c8d0" }],
    quickSpecs: [
      { icon: "⚡", label: "Chip", value: "Snapdragon 8 Elite" },
      { icon: "📷", label: "Camera", value: "52MP Zeiss Triple" },
      { icon: "🔋", label: "Battery", value: "5,000 mAh" },
      { icon: "🖥️", label: "Display", value: "6.5\" 4K OLED 120Hz" },
    ],
    specs: [
      { icon: "⚡", label: "Chip", value: "Snapdragon 8 Elite", description: "Flagship Snapdragon in Sony's thinnest flagship." },
      { icon: "📷", label: "Camera", value: "Zeiss 52MP Triple", description: "Zeiss T* optics, 52MP main, 52MP ultrawide, 85-170mm periscope." },
      { icon: "🔋", label: "Battery", value: "5,000 mAh", description: "65W wired fast charging." },
      { icon: "🖥️", label: "Display", value: "6.5\" 4K 120Hz OLED", description: "3840×1644 — only 4K phone display." },
      { icon: "🎬", label: "Video", value: "4K 120fps", description: "Cinema Pro and Video Pro apps included." },
      { icon: "🌐", label: "Connectivity", value: "5G + Wi-Fi 7", description: "Wi-Fi 7, Bluetooth 5.4." },
    ],
    boxItems: [{ icon: "📱", name: "Xperia 1 VII", quantity: "×1" }, { icon: "🔌", name: "65W USB-C Charger", quantity: "×1" }, { icon: "🔗", name: "USB-C Cable", quantity: "×1" }],
    rating: 4.6, numReviews: 892,
    ratingBreakdown: { five: 634, four: 178, three: 56, two: 16, one: 8 },
    deliveryDate: "Dec 29", returnDays: 14, warrantyYears: 1,
    cardBgColor: "#060606", cardGlowColor: "rgba(60,80,180,0.18)",
    relatedProducts: [],
  },




  // ─── GAMING (10) ────────────────────────────────────────────────────────────
  {
    name: "PlayStation 5 Pro",
    slug: "playstation-5-pro",
    brand: "Sony",
    category: CATEGORY_IDS.gaming,
    user: ADMIN_ID,
    badge: "New",
    sku: "SON-PS5PRO-CFI",
    tags: ["gaming", "sony", "ps5", "console", "4k", "raytracing"],
    description: "PS5 Pro with 45% faster rendering, 2× ray tracing, and PlayStation Spectral Super Resolution.",
    images: [{ url: "http://smartkoshk.com/cdn/shop/files/ps5-slim-model-hero-new.webp?v=1726950752", alt: "PlayStation 5 Pro White", isPrimary: true }],
    price: 699, originalPrice: 799, currency: "USD",
    countInStock: 24, soldCount: 8921,
    variantGroups: [
      { name: "Storage", options: [{ label: "2TB", value: "2tb", priceModifier: 0, inStock: true }] },
    ],
    colors: [{ name: "White / Black", hex: "#f0f0f0" }],
    quickSpecs: [
      { icon: "⚡", label: "CPU", value: "AMD Zen 2 8-core" },
      { icon: "🎮", label: "GPU", value: "Radeon RDNA 4" },
      { icon: "🖥️", label: "Resolution", value: "Up to 8K" },
      { icon: "💾", label: "Storage", value: "2TB SSD" },
    ],
    specs: [
      { icon: "⚡", label: "CPU", value: "AMD Zen 2 8-core 3.85GHz", description: "Custom 8-core AMD Zen 2 CPU." },
      { icon: "🎮", label: "GPU", value: "AMD RDNA 4 33.5 TFLOPS", description: "67% more powerful than standard PS5." },
      { icon: "💾", label: "Storage", value: "2TB custom NVMe SSD", description: "5.5GB/s raw throughput." },
      { icon: "🖥️", label: "Output", value: "4K 120fps / 8K", description: "HDMI 2.1, VRR, ALLM support." },
      { icon: "🔊", label: "Audio", value: "Tempest 3D AudioTech", description: "3D spatial audio through TV speakers." },
      { icon: "🎮", label: "Controller", value: "DualSense included", description: "Haptic feedback and adaptive triggers." },
    ],
    boxItems: [{ icon: "🎮", name: "PlayStation 5 Pro", quantity: "×1" }, { icon: "🕹️", name: "DualSense Controller", quantity: "×1" }, { icon: "🔗", name: "HDMI 2.1 Cable", quantity: "×1" }, { icon: "🔌", name: "AC Power Cord", quantity: "×1" }],
    rating: 4.9, numReviews: 18432,
    ratingBreakdown: { five: 16000, four: 1800, three: 400, two: 140, one: 92 },
    deliveryDate: "Dec 24", returnDays: 14, warrantyYears: 1,
    cardBgColor: "#060610", cardGlowColor: "rgba(60,80,200,0.2)",
    relatedProducts: [],
  },

  {
    name: "Xbox Series X",
    slug: "xbox-series-x",
    brand: "Microsoft",
    category: CATEGORY_IDS.gaming,
    user: ADMIN_ID,
    sku: "MS-XSX-BLK-1T",
    tags: ["gaming", "microsoft", "xbox", "console", "4k", "game-pass"],
    description: "The fastest, most powerful Xbox ever. 4K 60fps, up to 120fps, with 12 teraflops of GPU power.",
    images: [{ url: "https://images.unsplash.com/photo-1683823362932-6f7599661d22?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Xbox Series X Black", isPrimary: true }],
    price: 499, originalPrice: 549, currency: "USD",
    countInStock: 38, soldCount: 12421,
    variantGroups: [],
    colors: [{ name: "Carbon Black", hex: "#1a1a1c" }],
    quickSpecs: [
      { icon: "⚡", label: "CPU", value: "8-core Zen 2 3.8GHz" },
      { icon: "🎮", label: "GPU", value: "12 TFLOPS RDNA 2" },
      { icon: "💾", label: "Storage", value: "1TB SSD" },
      { icon: "🖥️", label: "Resolution", value: "4K 60fps / 120fps" },
    ],
    specs: [
      { icon: "⚡", label: "CPU", value: "8-core AMD Zen 2 3.8GHz", description: "Custom processor with 8 cores at 3.8GHz." },
      { icon: "🎮", label: "GPU", value: "12 TFLOPS AMD RDNA 2", description: "12 teraflops for 4K gaming." },
      { icon: "💾", label: "Storage", value: "1TB NVMe SSD", description: "Custom NVMe SSD with DirectStorage." },
      { icon: "🖥️", label: "Output", value: "4K 120fps, 8K capable", description: "HDMI 2.1 with VRR and ALLM." },
      { icon: "🔊", label: "Audio", value: "Dolby Atmos", description: "Spatial sound via Dolby Atmos." },
      { icon: "💿", label: "Disc Drive", value: "4K UHD Blu-ray", description: "Built-in 4K UHD Blu-ray drive." },
    ],
    boxItems: [{ icon: "🎮", name: "Xbox Series X", quantity: "×1" }, { icon: "🕹️", name: "Xbox Wireless Controller", quantity: "×1" }, { icon: "🔗", name: "HDMI Cable", quantity: "×1" }, { icon: "🔌", name: "Power Cable", quantity: "×1" }],
    rating: 4.8, numReviews: 15234,
    ratingBreakdown: { five: 12800, four: 1800, three: 450, two: 120, one: 64 },
    deliveryDate: "Dec 24", returnDays: 14, warrantyYears: 1,
    cardBgColor: "#060a06", cardGlowColor: "rgba(20,180,20,0.18)",
    relatedProducts: [],
  },

]

async function seed() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log("Connected to MongoDB...")

    /* // 👤 STEP 1: REPLACE USERS
    console.log("Clearing and replacing users...")
    await User.deleteMany({})
    for (const u of usersData) {
      const hashedPassword = await bcrypt.hash(u.password, 10)
      await User.create({
        ...u,
        password: hashedPassword
      })
    }
    console.log("Users seeded.") */

    // 🔥 STEP 2: REPLACE PRODUCTS
    await Product.deleteMany({})
    console.log("Old products cleared.")

    const products = RAW_PRODUCTS.slice(0, 34).map((p, i) => {
      const generatedReviews = generateReviews()
      const newReviewAvg = calcRating(generatedReviews)
      
      const baseNumReviews = p.numReviews || 0
      const baseRating = p.rating || 5.0 // Default to 5.0 if no base rating
      
      const totalNumReviews = baseNumReviews + generatedReviews.length
      const finalRating = totalNumReviews > 0 
        ? (baseRating * baseNumReviews + newReviewAvg * generatedReviews.length) / totalNumReviews 
        : baseRating

      const idValue = 200 + i;
      const idHex = idValue.toString(16).padStart(3, '0');
      const _id = new mongoose.Types.ObjectId("65d000000000000000000" + idHex);

      return {
        ...p,
        _id,
        user: ADMIN_ID,
        reviews: generatedReviews,
        rating: finalRating,
        numReviews: totalNumReviews,
        slug: `${p.slug}-${idValue}`
      }
    })

    await Product.insertMany(products)
    console.log(`🔥 SUCCESS: ${products.length} high-fidelity products seeded with 24-user randomized reviews!`)
    process.exit()
  } catch (error: any) {
    console.error("❌ Seeding failed!");
    if (error.name === 'ValidationError') {
      for (const field in error.errors) {
        console.error(`- Field: ${field}, Type: ${error.errors[field].kind}, Message: ${error.errors[field].message}`);
        // Log the actual document that failed if possible
        if (error.errors[field].value) {
          console.error(`- problematic value:`, error.errors[field].value);
        }
      }
    } else {
      console.error(error);
    }
    process.exit(1)
  }
}

seed()
