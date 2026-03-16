import mongoose from "mongoose"

// ── Pre-assigned _ids so products.ts can reference them safely ───────────────
export const CATEGORY_IDS = {
  laptops:    new mongoose.Types.ObjectId("65c000000000000000000001"),
  phones:     new mongoose.Types.ObjectId("65c000000000000000000002"),
  audio:      new mongoose.Types.ObjectId("65c000000000000000000003"),
  gaming:     new mongoose.Types.ObjectId("65c000000000000000000004"),
  cameras:    new mongoose.Types.ObjectId("65c000000000000000000005"),
  wearables:  new mongoose.Types.ObjectId("65c000000000000000000006"),
  monitors:   new mongoose.Types.ObjectId("65c000000000000000000007"),
  tablets:    new mongoose.Types.ObjectId("65c000000000000000000008"),
  headphones: new mongoose.Types.ObjectId("65c000000000000000000009"),
}

const categories = [
  {
    _id:         CATEGORY_IDS.laptops,
    name:        "Laptops",
    slug:        "laptops",
    description: "Ultra-thin, ultra-powerful laptops for creators, engineers, and professionals.",
    images: [
      { url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80", alt: "Laptops category" },
    ],
    color:     "#0a1628",
    glowColor: "rgba(0,122,255,0.25)",
  },
  {
    _id:         CATEGORY_IDS.phones,
    name:        "Phones",
    slug:        "phones",
    description: "The latest flagship smartphones from the world's top brands.",
    images: [
      { url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80", alt: "Phones category" },
    ],
    color:     "#1a0810",
    glowColor: "rgba(255,79,142,0.22)",
  },
  {
    _id:         CATEGORY_IDS.audio,
    name:        "Audio",
    slug:        "audio",
    description: "Premium headphones, earbuds, and speakers for audiophiles.",
    images: [
      { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", alt: "Audio category" },
    ],
    color:     "#0d1a0d",
    glowColor: "rgba(52,199,89,0.22)",
  },
  {
    _id:         CATEGORY_IDS.gaming,
    name:        "Gaming",
    slug:        "gaming",
    description: "Consoles, controllers, and accessories for the ultimate gaming experience.",
    images: [
      { url: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80", alt: "Gaming category" },
    ],
    color:     "#1a0d00",
    glowColor: "rgba(255,149,0,0.25)",
  },
  {
    _id:         CATEGORY_IDS.cameras,
    name:        "Cameras",
    slug:        "cameras",
    description: "Mirrorless, DSLR, and compact cameras for every type of photographer.",
    images: [
      { url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80", alt: "Cameras category" },
    ],
    color:     "#0d0d1a",
    glowColor: "rgba(88,86,214,0.25)",
  },
  {
    _id:         CATEGORY_IDS.wearables,
    name:        "Wearables",
    slug:        "wearables",
    description: "Smartwatches and fitness trackers to keep you connected and healthy.",
    images: [
      { url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80", alt: "Wearables category" },
    ],
    color:     "#0e1018",
    glowColor: "rgba(0,122,255,0.2)",
  },
  {
    _id:         CATEGORY_IDS.monitors,
    name:        "Monitors",
    slug:        "monitors",
    description: "High-refresh-rate and ultra-wide displays for gaming, design, and productivity.",
    images: [
      { url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80", alt: "Monitors category" },
    ],
    color:     "#080c12",
    glowColor: "rgba(30,200,255,0.22)",
  },
  {
    _id:         CATEGORY_IDS.tablets,
    name:        "Tablets",
    slug:        "tablets",
    description: "Powerful tablets for creativity, entertainment, and on-the-go productivity.",
    images: [
      { url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80", alt: "Tablets category" },
    ],
    color:     "#0e0e18",
    glowColor: "rgba(100,80,255,0.22)",
  },
  {
    _id:         CATEGORY_IDS.headphones,
    name:        "Headphones",
    slug:        "headphones",
    description: "Over-ear and on-ear headphones with industry-leading sound and noise cancellation.",
    images: [
      { url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80", alt: "Headphones category" },
    ],
    color:     "#0e0c08",
    glowColor: "rgba(255,200,0,0.2)",
  },
]

export default categories