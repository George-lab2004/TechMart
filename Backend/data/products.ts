import mongoose from "mongoose"
import { CATEGORY_IDS } from "./categories.js"

// ── Pre-assigned IDs so relatedProducts cross-references work ──────────────
const ID = {
  rogStrixG16:     new mongoose.Types.ObjectId("65d000000000000000000011"),
  macbookM3:       new mongoose.Types.ObjectId("65d000000000000000000012"),
  galaxyS24Ultra:  new mongoose.Types.ObjectId("65d000000000000000000013"),
  sonyWH1000XM5:   new mongoose.Types.ObjectId("65d000000000000000000014"),
  ipadPro12:       new mongoose.Types.ObjectId("65d000000000000000000015"),
  dellXPS15:       new mongoose.Types.ObjectId("65d000000000000000000016"),
  iPhone15Pro:     new mongoose.Types.ObjectId("65d000000000000000000017"),
  samsungOdyssey:  new mongoose.Types.ObjectId("65d000000000000000000018"),
  appleWatch9:     new mongoose.Types.ObjectId("65d000000000000000000019"),
  razerBladeStudio:new mongoose.Types.ObjectId("65d000000000000000000020"),
}

const products = [

  // ════════════════════════════════════════════════════════
  // LAPTOPS
  // ════════════════════════════════════════════════════════
  {
    _id: ID.rogStrixG16,
    name: "ASUS ROG Strix G16",
    slug: "asus-rog-strix-g16",
    brand: "ASUS",
    category: CATEGORY_IDS.laptops,
    badge: "Hot",
    sku: "ASUS-G16-4060",
    tags: ["gaming","laptop","rog","rtx","intel"],
    description: "High-performance gaming laptop powered by Intel Core i9 and NVIDIA RTX graphics for modern AAA gaming.",

    images: [
      { url: "https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?w=900&q=80", alt: "ROG laptop front", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&q=80", alt: "ROG keyboard", isPrimary: false },
    ],

    price: 1899,
    originalPrice: 2099,
    currency: "USD",
    countInStock: 15,
    soldCount: 640,

    variantGroups: [
      {
        name: "Memory",
        options: [
          { label: "16 GB", value: "16gb", priceModifier: 0, inStock: true },
          { label: "32 GB", value: "32gb", priceModifier: 200, inStock: true },
        ],
      },
      {
        name: "Storage",
        options: [
          { label: "512 GB", value: "512gb", priceModifier: 0, inStock: true },
          { label: "1 TB", value: "1tb", priceModifier: 150, inStock: true },
        ],
      },
    ],

    colors: [
      { name: "Eclipse Gray", hex: "#2c2c2c" },
    ],

    quickSpecs: [
      { icon: "⚡", label: "CPU", value: "Intel i9-13980HX" },
      { icon: "🎮", label: "GPU", value: "RTX 4060" },
      { icon: "🖥️", label: "Display", value: "16\" 240Hz" },
      { icon: "⚖️", label: "Weight", value: "2.5 kg" },
    ],

    specs: [
      { icon: "🧠", label: "Processor", value: "Intel i9-13980HX", description: "24-core flagship Intel CPU built for heavy gaming and development workloads." },
      { icon: "🎮", label: "GPU", value: "NVIDIA RTX 4060", description: "Ada Lovelace GPU for ray tracing and DLSS gaming." },
      { icon: "💾", label: "Memory", value: "32 GB DDR5", description: "High-speed DDR5 memory for multitasking." },
      { icon: "💿", label: "Storage", value: "1 TB NVMe SSD", description: "Ultra-fast Gen4 NVMe storage." },
      { icon: "🔋", label: "Battery", value: "90Wh", description: "Large battery designed for long gaming sessions." },
      { icon: "📶", label: "Connectivity", value: "Wi-Fi 6E", description: "Fast wireless connectivity with Bluetooth 5.3." },
    ],

    boxItems: [
      { icon: "💻", name: "ROG Strix G16 Laptop", quantity: "×1" },
      { icon: "🔌", name: "240W Power Adapter", quantity: "×1" },
    ],

    rating: 4.8,
    numReviews: 1520,
    ratingBreakdown: { five: 80, four: 15, three: 3, two: 1, one: 1 },

    deliveryDate: "Apr 16",
    returnDays: 30,
    warrantyYears: 2,
    cardBgColor: "#0f1014",
    cardGlowColor: "rgba(255,0,80,0.2)",

    relatedProducts: [
      { product: ID.macbookM3, name: "MacBook Pro M3", brand: "Apple", price: 2199, badge: "New", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80", category: "laptops" },
      { product: ID.dellXPS15, name: "Dell XPS 15", brand: "Dell", price: 1749, badge: "Sale", image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80", category: "laptops" },
    ],
  },

  // ────────────────────────────────────────────────────────
  {
    _id: ID.macbookM3,
    name: "MacBook Pro M3",
    slug: "macbook-pro-m3",
    brand: "Apple",
    category: CATEGORY_IDS.laptops,
    badge: "New",
    sku: "APL-MBP-M3",

    tags: ["apple","laptop","m3","creator","macbook"],
    description: "Apple MacBook Pro powered by the new M3 chip delivering exceptional performance and incredible battery life.",

    images: [
      { url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&q=80", alt: "MacBook Pro open", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=80", alt: "MacBook keyboard", isPrimary: false },
    ],

    price: 2199,
    originalPrice: 2399,
    currency: "USD",
    countInStock: 12,
    soldCount: 820,

    variantGroups: [
      {
        name: "Storage",
        options: [
          { label: "512 GB", value: "512gb", priceModifier: 0, inStock: true },
          { label: "1 TB", value: "1tb", priceModifier: 200, inStock: true },
        ],
      },
    ],

    colors: [
      { name: "Space Black", hex: "#1c1c1e" },
      { name: "Silver", hex: "#e8e8ed" },
    ],

    quickSpecs: [
      { icon: "⚡", label: "Chip", value: "Apple M3" },
      { icon: "🖥️", label: "Display", value: "Liquid Retina XDR" },
      { icon: "🔋", label: "Battery", value: "22 hrs" },
      { icon: "⚖️", label: "Weight", value: "1.6 kg" },
    ],

    specs: [
      { icon: "🧠", label: "Memory", value: "18 GB", description: "Unified Apple memory architecture." },
      { icon: "💾", label: "Storage", value: "1 TB SSD", description: "Extremely fast NVMe storage." },
      { icon: "🎥", label: "Camera", value: "1080p", description: "Studio quality webcam." },
      { icon: "🌐", label: "Connectivity", value: "Wi-Fi 6E", description: "High speed networking." },
      { icon: "🔋", label: "Battery", value: "22 hours", description: "All-day productivity battery." },
      { icon: "🖥️", label: "Display", value: "14.2\" XDR", description: "Mini-LED HDR display with ProMotion." },
    ],

    boxItems: [
      { icon: "💻", name: "MacBook Pro", quantity: "×1" },
      { icon: "🔌", name: "USB-C Power Adapter", quantity: "×1" },
    ],

    rating: 4.9,
    numReviews: 2847,
    ratingBreakdown: { five: 88, four: 9, three: 2, two: 1, one: 0 },

    deliveryDate: "Apr 15",
    returnDays: 30,
    warrantyYears: 1,
    cardBgColor: "#111214",
    cardGlowColor: "rgba(0,122,255,0.2)",

    relatedProducts: [
      { product: ID.rogStrixG16, name: "ASUS ROG Strix G16", brand: "ASUS", price: 1899, badge: "Hot", image: "https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?w=400&q=80", category: "laptops" },
      { product: ID.ipadPro12, name: "iPad Pro 12.9\"", brand: "Apple", price: 1099, badge: "New", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80", category: "tablets" },
    ],
  },

  // ════════════════════════════════════════════════════════
  // PHONES
  // ════════════════════════════════════════════════════════
  {
    _id: ID.galaxyS24Ultra,
    name: "Samsung Galaxy S24 Ultra",
    slug: "galaxy-s24-ultra",
    brand: "Samsung",
    category: CATEGORY_IDS.phones,
    badge: "Flagship",
    sku: "SMSNG-S24U",

    tags: ["mobile","android","samsung","flagship"],
    description: "Samsung flagship smartphone with 200MP camera, Snapdragon 8 Gen 3 processor and AI photography.",

    images: [
      { url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=900&q=80", alt: "Galaxy phone", isPrimary: true },
    ],

    price: 1199,
    currency: "USD",
    countInStock: 20,
    soldCount: 1500,

    variantGroups: [
      {
        name: "Storage",
        options: [
          { label: "256 GB", value: "256gb", priceModifier: 0, inStock: true },
          { label: "512 GB", value: "512gb", priceModifier: 120, inStock: true },
        ],
      },
    ],

    colors: [
      { name: "Titanium Black", hex: "#1c1c1e" },
      { name: "Titanium Violet", hex: "#6b5cff" },
    ],

    quickSpecs: [
      { icon: "📱", label: "Display", value: "6.8\" AMOLED" },
      { icon: "📸", label: "Camera", value: "200MP" },
      { icon: "⚡", label: "Chip", value: "Snapdragon 8 Gen 3" },
      { icon: "🔋", label: "Battery", value: "5000mAh" },
    ],

    specs: [
      { icon: "📸", label: "Camera", value: "200MP", description: "Ultra high resolution flagship camera." },
      { icon: "⚡", label: "Chipset", value: "Snapdragon 8 Gen 3", description: "Top Android flagship chip." },
      { icon: "📱", label: "Display", value: "120Hz AMOLED", description: "Smooth and bright screen." },
      { icon: "🔋", label: "Battery", value: "5000mAh", description: "All-day battery life." },
      { icon: "🧠", label: "RAM", value: "12GB", description: "High multitasking performance." },
      { icon: "💾", label: "Storage", value: "512GB", description: "Large storage capacity." },
    ],

    boxItems: [
      { icon: "📱", name: "Galaxy S24 Ultra", quantity: "×1" },
      { icon: "🪢", name: "USB-C Cable", quantity: "×1" },
    ],

    rating: 4.8,
    numReviews: 2600,
    ratingBreakdown: { five: 84, four: 10, three: 3, two: 2, one: 1 },

    deliveryDate: "Apr 14",
    returnDays: 30,
    warrantyYears: 1,
    cardBgColor: "#0d0d18",
    cardGlowColor: "rgba(100,80,200,0.22)",

    relatedProducts: [
      { product: ID.macbookM3, name: "MacBook Pro M3", brand: "Apple", price: 2199, badge: "New", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80", category: "laptops" },
      { product: ID.iPhone15Pro, name: "iPhone 15 Pro", brand: "Apple", price: 999, badge: "New", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80", category: "phones" },
    ],
  },

  // ════════════════════════════════════════════════════════
  // NEW PRODUCTS ─ 7 additions below
  // ════════════════════════════════════════════════════════

  // ── HEADPHONES ──────────────────────────────────────────
  {
    _id: ID.sonyWH1000XM5,
    name: "Sony WH-1000XM5",
    slug: "sony-wh-1000xm5",
    brand: "Sony",
    category: CATEGORY_IDS.headphones, 
    badge: "Best Seller",
    sku: "SNY-WH1000XM5",

    tags: ["headphones","noise-cancelling","sony","wireless","audio"],
    description: "Industry-leading noise cancelling wireless headphones with up to 30-hour battery life and exceptional sound quality.",

    images: [
      { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80", alt: "Sony WH-1000XM5 headphones", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900&q=80", alt: "Headphones side view", isPrimary: false },
    ],

    price: 349,
    originalPrice: 399,
    currency: "USD",
    countInStock: 45,
    soldCount: 3200,

    variantGroups: [
      {
        name: "Color",
        options: [
          { label: "Black", value: "black", priceModifier: 0, inStock: true },
          { label: "Platinum Silver", value: "silver", priceModifier: 0, inStock: true },
        ],
      },
    ],

    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Platinum Silver", hex: "#c8c8c8" },
    ],

    quickSpecs: [
      { icon: "🎵", label: "Driver", value: "30mm" },
      { icon: "🔇", label: "ANC", value: "Industry-leading" },
      { icon: "🔋", label: "Battery", value: "30 hrs" },
      { icon: "📶", label: "Bluetooth", value: "5.2" },
    ],

    specs: [
      { icon: "🎵", label: "Driver Unit", value: "30mm", description: "Carbon fibre composite driver for clear highs and deep bass." },
      { icon: "🔇", label: "Noise Cancelling", value: "Dual Noise Sensor", description: "Two microphones on each earcup capture and cancel ambient sound." },
      { icon: "🔋", label: "Battery Life", value: "30 hours ANC on", description: "3-min charge gives 3 hours of playback." },
      { icon: "📶", label: "Bluetooth", value: "5.2 Multipoint", description: "Connect two devices simultaneously." },
      { icon: "🎙️", label: "Mic", value: "8 mics total", description: "Crystal clear hands-free calling." },
      { icon: "⚖️", label: "Weight", value: "250 g", description: "Ultra-lightweight foldable design." },
    ],

    boxItems: [
      { icon: "🎧", name: "WH-1000XM5 Headphones", quantity: "×1" },
      { icon: "🪢", name: "USB-C Charging Cable", quantity: "×1" },
      { icon: "🎵", name: "3.5mm Audio Cable", quantity: "×1" },
      { icon: "🧳", name: "Carrying Case", quantity: "×1" },
    ],

    rating: 4.9,
    numReviews: 5840,
    ratingBreakdown: { five: 91, four: 7, three: 1, two: 1, one: 0 },

    deliveryDate: "Apr 13",
    returnDays: 30,
    warrantyYears: 1,
    cardBgColor: "#0e0e0e",
    cardGlowColor: "rgba(255,200,0,0.15)",

    relatedProducts: [
      { product: ID.galaxyS24Ultra, name: "Samsung Galaxy S24 Ultra", brand: "Samsung", price: 1199, badge: "Flagship", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80", category: "phones" },
      { product: ID.appleWatch9, name: "Apple Watch Series 9", brand: "Apple", price: 399, badge: "New", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80", category: "wearables" },
    ],
  },

  // ── TABLETS ─────────────────────────────────────────────
  {
    _id: ID.ipadPro12,
    name: "iPad Pro 12.9\"",
    slug: "ipad-pro-12-9",
    brand: "Apple",
    category: CATEGORY_IDS.tablets, 
    badge: "New",
    sku: "APL-IPADPRO-129",

    tags: ["apple","tablet","ipad","m2","creative"],
    description: "The ultimate iPad experience with the powerful M2 chip, Liquid Retina XDR display, and support for Apple Pencil Pro.",

    images: [
      { url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=900&q=80", alt: "iPad Pro front", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=900&q=80", alt: "iPad Pro with Pencil", isPrimary: false },
    ],

    price: 1099,
    originalPrice: 1199,
    currency: "USD",
    countInStock: 18,
    soldCount: 980,

    variantGroups: [
      {
        name: "Storage",
        options: [
          { label: "128 GB", value: "128gb", priceModifier: 0, inStock: true },
          { label: "256 GB", value: "256gb", priceModifier: 100, inStock: true },
          { label: "512 GB", value: "512gb", priceModifier: 200, inStock: true },
          { label: "1 TB", value: "1tb", priceModifier: 400, inStock: false },
        ],
      },
      {
        name: "Connectivity",
        options: [
          { label: "Wi-Fi", value: "wifi", priceModifier: 0, inStock: true },
          { label: "Wi-Fi + Cellular", value: "cellular", priceModifier: 150, inStock: true },
        ],
      },
    ],

    colors: [
      { name: "Space Gray", hex: "#3a3a3c" },
      { name: "Silver", hex: "#e8e8ed" },
    ],

    quickSpecs: [
      { icon: "⚡", label: "Chip", value: "Apple M2" },
      { icon: "🖥️", label: "Display", value: "12.9\" Liquid Retina XDR" },
      { icon: "📸", label: "Camera", value: "12MP Wide + 10MP Ultra" },
      { icon: "⚖️", label: "Weight", value: "682 g" },
    ],

    specs: [
      { icon: "⚡", label: "Chip", value: "Apple M2", description: "Desktop-class performance in a tablet form factor." },
      { icon: "🖥️", label: "Display", value: "12.9\" Liquid Retina XDR", description: "ProMotion 120Hz, HDR, True Tone, P3 wide color." },
      { icon: "📸", label: "Rear Camera", value: "12MP Wide + 10MP Ultra Wide", description: "Pro photo and video capabilities." },
      { icon: "🎥", label: "Front Camera", value: "12MP TrueDepth", description: "Landscape front camera with Center Stage." },
      { icon: "🔋", label: "Battery", value: "Up to 10 hours", description: "All-day battery for work and play." },
      { icon: "📶", label: "Connectivity", value: "Wi-Fi 6E + 5G (optional)", description: "Superfast wireless and optional 5G." },
    ],

    boxItems: [
      { icon: "📱", name: "iPad Pro 12.9\"", quantity: "×1" },
      { icon: "🔌", name: "USB-C Charge Cable (1m)", quantity: "×1" },
      { icon: "📄", name: "Documentation", quantity: "×1" },
    ],

    rating: 4.8,
    numReviews: 1730,
    ratingBreakdown: { five: 83, four: 12, three: 3, two: 1, one: 1 },

    deliveryDate: "Apr 15",
    returnDays: 30,
    warrantyYears: 1,
    cardBgColor: "#101014",
    cardGlowColor: "rgba(0,122,255,0.18)",

    relatedProducts: [
      { product: ID.macbookM3, name: "MacBook Pro M3", brand: "Apple", price: 2199, badge: "New", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80", category: "laptops" },
      { product: ID.appleWatch9, name: "Apple Watch Series 9", brand: "Apple", price: 399, badge: "New", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80", category: "wearables" },
    ],
  },

  // ── LAPTOPS ─────────────────────────────────────────────
  {
    _id: ID.dellXPS15,
    name: "Dell XPS 15 OLED",
    slug: "dell-xps-15-oled",
    brand: "Dell",
    category: CATEGORY_IDS.laptops,
    badge: "Sale",
    sku: "DELL-XPS15-9530",

    tags: ["laptop","dell","xps","oled","creator","intel"],
    description: "Dell's premium thin-and-light powerhouse with a stunning 15.6\" 3.5K OLED display and Intel Core i7 performance.",

    images: [
      { url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=900&q=80", alt: "Dell XPS 15 open", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=900&q=80", alt: "Dell XPS keyboard closeup", isPrimary: false },
    ],

    price: 1749,
    originalPrice: 1999,
    currency: "USD",
    countInStock: 10,
    soldCount: 470,

    variantGroups: [
      {
        name: "Memory",
        options: [
          { label: "16 GB", value: "16gb", priceModifier: 0, inStock: true },
          { label: "32 GB", value: "32gb", priceModifier: 250, inStock: true },
        ],
      },
      {
        name: "Storage",
        options: [
          { label: "512 GB", value: "512gb", priceModifier: 0, inStock: true },
          { label: "1 TB", value: "1tb", priceModifier: 180, inStock: true },
        ],
      },
    ],

    colors: [
      { name: "Platinum Silver", hex: "#c0c0c0" },
      { name: "Frost", hex: "#e9e9e9" },
    ],

    quickSpecs: [
      { icon: "⚡", label: "CPU", value: "Intel i7-13700H" },
      { icon: "🎮", label: "GPU", value: "RTX 4060" },
      { icon: "🖥️", label: "Display", value: "15.6\" 3.5K OLED" },
      { icon: "⚖️", label: "Weight", value: "1.86 kg" },
    ],

    specs: [
      { icon: "🧠", label: "Processor", value: "Intel Core i7-13700H", description: "14-core Intel processor with Turbo Boost up to 5.0 GHz." },
      { icon: "🎮", label: "GPU", value: "NVIDIA RTX 4060 8 GB", description: "Efficient Ada Lovelace GPU for creative workloads and gaming." },
      { icon: "🖥️", label: "Display", value: "15.6\" 3.5K OLED 60Hz", description: "100% DCI-P3 colour gamut, true blacks, factory calibrated." },
      { icon: "💾", label: "Memory", value: "32 GB DDR5", description: "Dual-channel 4800MHz RAM." },
      { icon: "💿", label: "Storage", value: "1 TB Gen4 NVMe SSD", description: "Blazing fast read/write speeds." },
      { icon: "🔋", label: "Battery", value: "86Wh", description: "Up to 13 hours of productivity use." },
    ],

    boxItems: [
      { icon: "💻", name: "XPS 15 Laptop", quantity: "×1" },
      { icon: "🔌", name: "130W USB-C Adapter", quantity: "×1" },
    ],

    rating: 4.7,
    numReviews: 890,
    ratingBreakdown: { five: 76, four: 17, three: 5, two: 1, one: 1 },

    deliveryDate: "Apr 17",
    returnDays: 30,
    warrantyYears: 1,
    cardBgColor: "#111316",
    cardGlowColor: "rgba(0,200,150,0.15)",

    relatedProducts: [
      { product: ID.rogStrixG16, name: "ASUS ROG Strix G16", brand: "ASUS", price: 1899, badge: "Hot", image: "https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?w=400&q=80", category: "laptops" },
      { product: ID.macbookM3, name: "MacBook Pro M3", brand: "Apple", price: 2199, badge: "New", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80", category: "laptops" },
    ],
  },

  // ── PHONES ──────────────────────────────────────────────
  {
    _id: ID.iPhone15Pro,
    name: "iPhone 15 Pro",
    slug: "iphone-15-pro",
    brand: "Apple",
    category: CATEGORY_IDS.phones,
    badge: "New",
    sku: "APL-IP15PRO",

    tags: ["apple","iphone","ios","5g","flagship","smartphone"],
    description: "Apple iPhone 15 Pro featuring the A17 Pro chip, titanium design, and a pro camera system with 48MP main sensor.",

    images: [
      { url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=900&q=80", alt: "iPhone 15 Pro front", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900&q=80", alt: "iPhone 15 Pro camera", isPrimary: false },
    ],

    price: 999,
    originalPrice: 1099,
    currency: "USD",
    countInStock: 25,
    soldCount: 4100,

    variantGroups: [
      {
        name: "Storage",
        options: [
          { label: "128 GB", value: "128gb", priceModifier: 0, inStock: true },
          { label: "256 GB", value: "256gb", priceModifier: 100, inStock: true },
          { label: "512 GB", value: "512gb", priceModifier: 300, inStock: true },
          { label: "1 TB", value: "1tb", priceModifier: 500, inStock: false },
        ],
      },
    ],

    colors: [
      { name: "Black Titanium", hex: "#2e2b28" },
      { name: "White Titanium", hex: "#f0eeea" },
      { name: "Natural Titanium", hex: "#b0a89c" },
      { name: "Blue Titanium", hex: "#4a5568" },
    ],

    quickSpecs: [
      { icon: "⚡", label: "Chip", value: "A17 Pro" },
      { icon: "📸", label: "Camera", value: "48MP Main" },
      { icon: "🖥️", label: "Display", value: "6.1\" Super Retina XDR" },
      { icon: "🔋", label: "Battery", value: "Up to 23 hrs" },
    ],

    specs: [
      { icon: "⚡", label: "Chip", value: "A17 Pro", description: "First 3-nanometer chip in a smartphone, with 6-core GPU." },
      { icon: "📸", label: "Main Camera", value: "48MP Fusion", description: "Second-generation sensor-shift OIS, 100% Focus Pixels." },
      { icon: "🔭", label: "Telephoto", value: "12MP 3× Optical Zoom", description: "Tetraprism design for up to 15× digital zoom." },
      { icon: "🖥️", label: "Display", value: "6.1\" 2556×1179 OLED", description: "ProMotion 1-120Hz, Always-On, HDR." },
      { icon: "🔋", label: "Battery", value: "Up to 23 hrs video", description: "USB 3 fast transfer and fast charging support." },
      { icon: "🛡️", label: "Build", value: "Grade 5 Titanium", description: "Lightest Pro iPhone ever with Ceramic Shield front." },
    ],

    boxItems: [
      { icon: "📱", name: "iPhone 15 Pro", quantity: "×1" },
      { icon: "🪢", name: "USB-C Cable (1m)", quantity: "×1" },
      { icon: "📄", name: "Documentation", quantity: "×1" },
    ],

    rating: 4.9,
    numReviews: 6200,
    ratingBreakdown: { five: 89, four: 8, three: 2, two: 1, one: 0 },

    deliveryDate: "Apr 14",
    returnDays: 30,
    warrantyYears: 1,
    cardBgColor: "#0e0e10",
    cardGlowColor: "rgba(180,160,120,0.2)",

    relatedProducts: [
      { product: ID.galaxyS24Ultra, name: "Samsung Galaxy S24 Ultra", brand: "Samsung", price: 1199, badge: "Flagship", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80", category: "phones" },
      { product: ID.appleWatch9, name: "Apple Watch Series 9", brand: "Apple", price: 399, badge: "New", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80", category: "wearables" },
    ],
  },

  // ── MONITORS ────────────────────────────────────────────
  {
    _id: ID.samsungOdyssey,
    name: "Samsung Odyssey G9 49\"",
    slug: "samsung-odyssey-g9",
    brand: "Samsung",
    category: CATEGORY_IDS.monitors, 
    badge: "Epic",
    sku: "SMSNG-G9-49",

    tags: ["monitor","gaming","ultrawide","samsung","curved","240hz"],
    description: "Immersive 49\" Dual QHD curved gaming monitor with 240Hz refresh rate and QLED colour technology.",

    images: [
      { url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=900&q=80", alt: "Samsung Odyssey G9 monitor", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1593640408182-31c228c5a8cf?w=900&q=80", alt: "Ultrawide gaming setup", isPrimary: false },
    ],

    price: 1299,
    originalPrice: 1499,
    currency: "USD",
    countInStock: 8,
    soldCount: 310,

    variantGroups: [
      {
        name: "Stand",
        options: [
          { label: "Standard Stand", value: "standard", priceModifier: 0, inStock: true },
          { label: "Ergonomic Stand", value: "ergo", priceModifier: 80, inStock: true },
        ],
      },
    ],

    colors: [
      { name: "White", hex: "#f5f5f5" },
    ],

    quickSpecs: [
      { icon: "🖥️", label: "Panel", value: "49\" Curved QLED" },
      { icon: "⚡", label: "Refresh Rate", value: "240Hz" },
      { icon: "📐", label: "Resolution", value: "5120×1440 DQHD" },
      { icon: "🎨", label: "Colour", value: "1 billion colours" },
    ],

    specs: [
      { icon: "🖥️", label: "Panel", value: "49\" VA Curved QLED", description: "1800R curvature for fully immersive gameplay." },
      { icon: "📐", label: "Resolution", value: "5120×1440 DQHD", description: "Equivalent to two 27\" QHD monitors side by side." },
      { icon: "⚡", label: "Refresh Rate", value: "240Hz", description: "Ultrasmooth motion with 1ms GtG response time." },
      { icon: "🎨", label: "Colour Volume", value: "125% sRGB, 95% DCI-P3", description: "Quantum dot technology for vivid accurate colour." },
      { icon: "🎮", label: "Sync", value: "AMD FreeSync Premium Pro", description: "Tear-free variable refresh rate up to 240Hz." },
      { icon: "🔌", label: "Ports", value: "2× HDMI 2.1 + 1× DP 1.4", description: "Plus 2× USB 3.0 hub ports." },
    ],

    boxItems: [
      { icon: "🖥️", name: "Odyssey G9 Monitor", quantity: "×1" },
      { icon: "🔌", name: "DisplayPort 1.4 Cable", quantity: "×1" },
      { icon: "🔌", name: "Power Cable", quantity: "×1" },
      { icon: "🔩", name: "Stand Assembly", quantity: "×1" },
    ],

    rating: 4.7,
    numReviews: 740,
    ratingBreakdown: { five: 78, four: 14, three: 5, two: 2, one: 1 },

    deliveryDate: "Apr 18",
    returnDays: 30,
    warrantyYears: 3,
    cardBgColor: "#0a0c10",
    cardGlowColor: "rgba(30,200,255,0.18)",

    relatedProducts: [
      { product: ID.rogStrixG16, name: "ASUS ROG Strix G16", brand: "ASUS", price: 1899, badge: "Hot", image: "https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?w=400&q=80", category: "laptops" },
      { product: ID.razerBladeStudio, name: "Razer Blade 18 Studio", brand: "Razer", price: 3499, badge: "Pro", image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&q=80", category: "laptops" },
    ],
  },

  // ── WEARABLES ───────────────────────────────────────────
  {
    _id: ID.appleWatch9,
    name: "Apple Watch Series 9",
    slug: "apple-watch-series-9",
    brand: "Apple",
    category: CATEGORY_IDS.wearables,
    badge: "New",
    sku: "APL-AW-S9-45",

    tags: ["apple","watch","wearable","fitness","smartwatch","health"],
    description: "Apple Watch Series 9 with the new S9 chip, Double Tap gesture, and Always-On Retina display in 45mm aluminium.",

    images: [
      { url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=900&q=80", alt: "Apple Watch Series 9 front", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=900&q=80", alt: "Apple Watch on wrist", isPrimary: false },
    ],

    price: 399,
    originalPrice: 429,
    currency: "USD",
    countInStock: 35,
    soldCount: 2900,

    variantGroups: [
      {
        name: "Case Size",
        options: [
          { label: "41mm", value: "41mm", priceModifier: -30, inStock: true },
          { label: "45mm", value: "45mm", priceModifier: 0, inStock: true },
        ],
      },
      {
        name: "Band",
        options: [
          { label: "Sport Band", value: "sport", priceModifier: 0, inStock: true },
          { label: "Sport Loop", value: "loop", priceModifier: 0, inStock: true },
          { label: "Milanese Loop", value: "milanese", priceModifier: 50, inStock: true },
        ],
      },
    ],

    colors: [
      { name: "Midnight", hex: "#1c1c1e" },
      { name: "Starlight", hex: "#e8e4d9" },
      { name: "Pink", hex: "#f2a7bb" },
      { name: "Product Red", hex: "#c8000a" },
    ],

    quickSpecs: [
      { icon: "⚡", label: "Chip", value: "Apple S9" },
      { icon: "🖥️", label: "Display", value: "Always-On Retina" },
      { icon: "❤️", label: "Health", value: "ECG + Blood O2" },
      { icon: "🔋", label: "Battery", value: "Up to 18 hrs" },
    ],

    specs: [
      { icon: "⚡", label: "Chip", value: "Apple S9 SiP", description: "4-core Neural Engine, 60% more powerful than S8." },
      { icon: "🖥️", label: "Display", value: "Always-On Retina LTPO OLED", description: "Up to 2000 nits brightness, 1Hz–60Hz adaptive." },
      { icon: "❤️", label: "Health Sensors", value: "ECG, Blood O2, Temperature", description: "Irregular rhythm notifications and cycle tracking." },
      { icon: "🤙", label: "New Feature", value: "Double Tap Gesture", description: "Control your watch without touching the screen." },
      { icon: "🔋", label: "Battery", value: "Up to 18 hours", description: "36 hours in Low Power Mode." },
      { icon: "💧", label: "Water Resistance", value: "WR50", description: "Swim-proof with swim tracking." },
    ],

    boxItems: [
      { icon: "⌚", name: "Apple Watch Series 9", quantity: "×1" },
      { icon: "🪢", name: "Sport Band", quantity: "×1" },
      { icon: "🔌", name: "Magnetic Fast Charger Cable", quantity: "×1" },
    ],

    rating: 4.8,
    numReviews: 3100,
    ratingBreakdown: { five: 85, four: 10, three: 3, two: 1, one: 1 },

    deliveryDate: "Apr 14",
    returnDays: 30,
    warrantyYears: 1,
    cardBgColor: "#0e0e0f",
    cardGlowColor: "rgba(0,122,255,0.2)",

    relatedProducts: [
      { product: ID.iPhone15Pro, name: "iPhone 15 Pro", brand: "Apple", price: 999, badge: "New", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80", category: "phones" },
      { product: ID.sonyWH1000XM5, name: "Sony WH-1000XM5", brand: "Sony", price: 349, badge: "Best Seller", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", category: "headphones" },
    ],
  },

  // ── LAPTOPS ─────────────────────────────────────────────
  {
    _id: ID.razerBladeStudio,
    name: "Razer Blade 18 Studio",
    slug: "razer-blade-18-studio",
    brand: "Razer",
    category: CATEGORY_IDS.laptops,
    badge: "Pro",
    sku: "RAZER-B18-4090",

    tags: ["laptop","razer","gaming","creator","rtx4090","studio"],
    description: "Razer's most powerful laptop ever — the Blade 18 Studio Edition combines Intel i9 + RTX 4090 in an ultra-premium CNC aluminium chassis.",

    images: [
      { url: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=900&q=80", alt: "Razer Blade 18 front", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=900&q=80", alt: "Razer gaming laptop open", isPrimary: false },
    ],

    price: 3499,
    originalPrice: 3799,
    currency: "USD",
    countInStock: 5,
    soldCount: 180,

    variantGroups: [
      {
        name: "Memory",
        options: [
          { label: "32 GB", value: "32gb", priceModifier: 0, inStock: true },
          { label: "64 GB", value: "64gb", priceModifier: 400, inStock: true },
        ],
      },
      {
        name: "Storage",
        options: [
          { label: "1 TB", value: "1tb", priceModifier: 0, inStock: true },
          { label: "2 TB", value: "2tb", priceModifier: 300, inStock: true },
        ],
      },
    ],

    colors: [
      { name: "Stealth Black", hex: "#0d0d0d" },
    ],

    quickSpecs: [
      { icon: "⚡", label: "CPU", value: "Intel i9-13980HX" },
      { icon: "🎮", label: "GPU", value: "RTX 4090 16 GB" },
      { icon: "🖥️", label: "Display", value: "18\" QHD+ 300Hz" },
      { icon: "⚖️", label: "Weight", value: "3.05 kg" },
    ],

    specs: [
      { icon: "🧠", label: "Processor", value: "Intel Core i9-13980HX", description: "24-core (8P+16E) flagship Intel HX CPU." },
      { icon: "🎮", label: "GPU", value: "NVIDIA GeForce RTX 4090 16 GB", description: "Full 175W Ada Lovelace GPU for 4K gaming and AI workloads." },
      { icon: "🖥️", label: "Display", value: "18\" 2560×1600 QHD+ 300Hz", description: "DCI-P3 100%, factory calibrated, matte anti-glare coating." },
      { icon: "💾", label: "Memory", value: "32 GB DDR5 5600MHz", description: "Dual-channel upgradeable to 64 GB." },
      { icon: "💿", label: "Storage", value: "1 TB Gen5 NVMe SSD", description: "Dual M.2 slots for RAID 0 config." },
      { icon: "🔋", label: "Battery", value: "95.2Wh", description: "330W GaN power adapter for extreme performance." },
    ],

    boxItems: [
      { icon: "💻", name: "Razer Blade 18 Laptop", quantity: "×1" },
      { icon: "🔌", name: "330W GaN Power Adapter", quantity: "×1" },
      { icon: "📄", name: "Quick Start Guide", quantity: "×1" },
    ],

    rating: 4.8,
    numReviews: 420,
    ratingBreakdown: { five: 82, four: 13, three: 3, two: 1, one: 1 },

    deliveryDate: "Apr 19",
    returnDays: 14,
    warrantyYears: 1,
    cardBgColor: "#070a07",
    cardGlowColor: "rgba(0,255,70,0.15)",

    relatedProducts: [
      { product: ID.rogStrixG16, name: "ASUS ROG Strix G16", brand: "ASUS", price: 1899, badge: "Hot", image: "https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?w=400&q=80", category: "laptops" },
      { product: ID.samsungOdyssey, name: "Samsung Odyssey G9 49\"", brand: "Samsung", price: 1299, badge: "Epic", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80", category: "monitors" },
    ],
  },

]

export default products