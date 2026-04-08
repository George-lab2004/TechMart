import mongoose, { Document, Schema } from "mongoose"

// ─── SUB-SCHEMAS ───────────────────────────────────────────

const ProductImageSchema = new Schema({
  url: { type: String, required: true },  // "https://cdn.nexus.com/macbook-m4-front.jpg"
  alt: { type: String, required: true },  // "MacBook Pro M4 front view"
  isPrimary: { type: Boolean, default: false },  // true = shown first in 3D viewer
})

const VariantOptionSchema = new Schema({
  label: { type: String, required: true }, // "512GB" / "1TB" / "2TB"
  value: { type: String, required: true }, // "512gb" / "1tb" / "2tb"
  priceModifier: { type: Number, default: 0 },     // 200 = adds $200 to base price
  inStock: { type: Boolean, default: true },  // false = grayed out in UI
})

const VariantGroupSchema = new Schema({
  name: { type: String, required: true },       // "Storage" / "Memory" — shown as label above buttons
  options: { type: [VariantOptionSchema] },        // the clickable buttons under that label
})

const ColorSchema = new Schema({
  name: { type: String, required: true },          // "Space Black" — shown next to "Color —"
  hex: { type: String, required: true },          // "#1c1c1e" — the actual swatch circle color
})

const QuickSpecSchema = new Schema({
  icon: { type: String, required: true },         // "⚡" — emoji icon on the spec card
  label: { type: String, required: true },         // "Chip" — small uppercase label
  value: { type: String, required: true },         // "M4 Pro" — big value text
})

const SpecSchema = new Schema({
  icon: { type: String, required: true },   // "🧠" — emoji on the full spec card
  label: { type: String, required: true },   // "Memory" — uppercase label
  value: { type: String, required: true },   // "32 GB" — large display value
  description: { type: String, required: true },   // "Unified memory for seamless multitasking at scale."
})

const BoxItemSchema = new Schema({
  icon: { type: String, required: true },      // "🔌" — emoji shown on box item card
  name: { type: String, required: true },      // "140W USB-C Power Adapter"
  quantity: { type: String, required: true },      // "×1" / "×2m"
})

const RatingBreakdownSchema = new Schema({
  five: { type: Number, default: 0 },             // 82 — percentage of 5-star reviews
  four: { type: Number, default: 0 },             // 12
  three: { type: Number, default: 0 },             // 4
  two: { type: Number, default: 0 },             // 1
  one: { type: Number, default: 0 },             // 1
})

const RelatedProductSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product" }, // reference to another product
  name: { type: String, required: true },      // "iPhone 16 Pro Max"
  brand: { type: String, required: true },      // "Apple"
  price: { type: Number, required: true },      // 1199
  badge: { type: String },                      // "New" / "Hot" / "−15%" — optional
  image: { type: String, required: true },      // "https://cdn.nexus.com/iphone16.jpg"
  category: { type: String, required: true },      // "phones" — used for card background color
})

const ReviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true, trim: true },         // user's display name at time of review
  title: { type: String, required: true, trim: true },         // review headline e.g. "Best laptop I've ever owned"
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true },
}, { timestamps: true })
// ─── MAIN PRODUCT SCHEMA ───────────────────────────────────

const productSchema = new Schema<IProduct>(
  {
    // ── CORE IDENTITY ────────────────────────────────────
    name: { type: String, required: true },                // "MacBook Pro M4"
    slug: { type: String, required: true, unique: true },  // "macbook-pro-m4" — used in URL /products/macbook-pro-m4
    brand: { type: String, required: true },                // "Apple" — shown above product name
    category: { type: Schema.Types.ObjectId, required: true, ref: "Category" }, // ref → Category doc (populate to get name, slug, color, glowColor)
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },     // admin who created/owns this product listing
    badge: { type: String },                                // "New 2025" / "Hot" / "Limited" — optional pill next to brand
    sku: { type: String, unique: true, sparse: true },    // "APL-MBP-M4-16-512" — stock keeping unit, unique per variant config
    tags: { type: [String], default: [] },                 // ["laptop", "apple", "m4", "pro"] — used for search & filtering
    description: { type: String, required: true },                // short text for SEO meta tag

    // ── MEDIA ────────────────────────────────────────────
    images: { type: [ProductImageSchema], default: [] },          // array — isPrimary one shows in 3D viewer, rest are thumbnails

    // ── PRICING ──────────────────────────────────────────
    price: { type: Number, required: true },              // 2199 — current displayed price
    originalPrice: { type: Number },                              // 2499 — if exists, crossed out + "SAVE $300" computed automatically
    currency: { type: String, default: "USD" },              // "USD" — used when displaying price symbol

    // ── STOCK ────────────────────────────────────────────
    countInStock: { type: Number, required: true, default: 0 },   // 0 = "Out of Stock", >0 = green "In Stock" dot
    soldCount: { type: Number, default: 0 },                   // 1240 — shown as "1,240 sold" next to rating row

    // ── VARIANTS ─────────────────────────────────────────
    variantGroups: { type: [VariantGroupSchema], default: [] },   // Storage buttons + Memory buttons — each group renders separately
    colors: { type: [ColorSchema], default: [] },   // color swatches row with hex circles

    // ── QUICK SPECS (2×2 grid just below color swatches) ─
    quickSpecs: { type: [QuickSpecSchema], default: [] },         // exactly 4 — Chip / Battery / Display / Weight

    // ── FULL SPECIFICATIONS TAB ───────────────────────────
    specs: { type: [SpecSchema], default: [] },                   // 6 cards in the Specifications tab grid

    // ── IN THE BOX TAB ────────────────────────────────────
    boxItems: { type: [BoxItemSchema], default: [] },             // items shown in "In the Box" tab

    // ── REVIEWS & RATINGS ────────────────────────────────
    reviews: { type: [ReviewSchema], default: [] },          // embedded review documents
    rating: { type: Number, default: 0 },                // 4.9 — recomputed average every time a review is added
    numReviews: { type: Number, default: 0 },                // 2847 — shown as "(2,847 reviews)"
    ratingBreakdown: {
      type: RatingBreakdownSchema,
      default: () => ({ five: 0, four: 0, three: 0, two: 0, one: 0 }),
    },

    // ── DELIVERY INFO ─────────────────────────────────────
    deliveryDate: { type: String },                              // "Dec 28" — can be computed or manually set per product
    returnDays: { type: Number, default: 30 },                 // 30 — "30-day returns"
    warrantyYears: { type: Number, default: 1 },                  // 2 — "2-year warranty"

    // ── CARD APPEARANCE (optional) ────────────────────────
    cardBgColor: { type: String },                              // "#1a0810" — custom card bg hex, falls back to category default if absent
    cardGlowColor: { type: String },                              // "rgba(255,79,142,0.22)" — custom glow color, falls back to category default if absent

    // ── RELATED PRODUCTS ─────────────────────────────────
    relatedProducts: { type: [RelatedProductSchema], default: [] }, // 4 cards shown at the bottom of product detail page
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
)

// Add text index for AI search
productSchema.index({ 
  name: "text", 
  brand: "text", 
  description: "text", 
  tags: "text" 
}, {
  weights: {
    name: 10,
    brand: 5,
    tags: 3,
    description: 1
  },
  name: "ProductTextIndex"
});

// ─── INTERFACE ────────────────────────────────────────────

export interface IProduct extends Document {
  name: string
  slug: string
  brand: string
  category: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId   // admin who created this listing
  badge?: string
  sku?: string
  tags: string[]
  description: string
  images: { url: string; alt: string; isPrimary: boolean }[]
  price: number
  originalPrice?: number
  currency: string
  countInStock: number
  soldCount: number
  variantGroups: {
    name: string
    options: {
      label: string
      value: string
      priceModifier: number
      inStock: boolean
    }[]
  }[]
  colors: { name: string; hex: string }[]
  quickSpecs: { icon: string; label: string; value: string }[]
  specs: { icon: string; label: string; value: string; description: string }[]
  boxItems: { icon: string; name: string; quantity: string }[]
  reviews: {
    user: mongoose.Types.ObjectId
    name: string
    title: string
    rating: number
    comment: string
    createdAt: Date
    updatedAt: Date
  }[]
  rating: number
  numReviews: number
  ratingBreakdown: {
    five: number
    four: number
    three: number
    two: number
    one: number
  }
  deliveryDate?: string
  returnDays: number
  warrantyYears: number
  cardBgColor?: string
  cardGlowColor?: string
  relatedProducts: {
    product: mongoose.Types.ObjectId
    name: string
    brand: string
    price: number
    badge?: string
    image: string
    category: string
  }[]
  createdAt: Date
  updatedAt: Date
}

// ─── MODEL ────────────────────────────────────────────────

const Product = mongoose.model<IProduct>("Product", productSchema)

export default Product