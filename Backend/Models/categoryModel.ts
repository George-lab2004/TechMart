import mongoose, { Document, Schema } from "mongoose"
import mongoose, { Document, Schema } from "mongoose.js"

const CategoryImageSchema = new Schema({
  url: { type: String, required: true }, 
  alt: { type: String, required: true }, 
})

const CategorySchema = new Schema<ICategory>(
  {
    name:        { type: String, required: true },
    slug:        { type: String, required: true, unique: true }, // "laptops" — used in breadcrumb links & URL filters
    images:      { type: [CategoryImageSchema], default: [] },
    description: { type: String },

    // ── DEFAULT COLORS ───────────────────────────────────
    // Used as fallback on product cards/detail if the product has no cardBgColor / cardGlowColor set.
    // Admin sets these once per category; individual products can override.
    color:     { type: String },   // "#1a0810"              — default card background hex for this category
    glowColor: { type: String },   // "rgba(255,79,142,0.22)" — default glow color for this category
  },
  {
    timestamps: true,
  }
)

export interface ICategory extends Document {
  name:        string
  slug:        string
  images:      { url: string; alt: string }[]
  description?: string
  color?:      string
  glowColor?:  string
  createdAt:   Date
  updatedAt:   Date
}

const Category = mongoose.model<ICategory>("Category", CategorySchema)

export default Category