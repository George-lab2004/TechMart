import mongoose, { Document, Schema } from "mongoose";

// Stores the payment gateway response (Stripe / PayPal) after a successful charge
const PaymentResultSchema = new Schema({
  id:           { type: String },   // gateway transaction ID
  status:       { type: String },   // gateway status e.g. "COMPLETED", "succeeded"
  updateTime:   { type: String },   // ISO timestamp from the gateway
  emailAddress: { type: String },   // payer email returned by gateway
});
const OrderSchema = new Schema(
  {
    user:        { type: Schema.Types.ObjectId, required: true, ref: "User" },
    orderNumber: { type: String, required: true },

    // ── SHIPPING ADDRESS ─────────────────────────────────
    // Snapshot of the address chosen at checkout — intentionally NOT a reference.
    // If the user later edits/deletes that address, this order must still show where it was shipped.
    shippingAddress: {
      streetNumber:    { type: String },
      buildingNumber:  { type: String },
      floorNumber:     { type: String },
      apartmentNumber: { type: String },
      city:            { type: String },
      country:         { type: String },
      landmark:        { type: String },
      notes:           { type: String },
      postalCode:      { type: Number },
      phone:           { type: String },
    },

    // ── ORDER ITEMS ──────────────────────────────────────
    orderItems: [
      {
        name:      { type: String, required: true },
        qty:       { type: Number, required: true },
        image:     { type: String, required: true },
        price:     { type: Number, required: true },
        productID: { type: Schema.Types.ObjectId, ref: "Product" },
      },
    ],

    // ── STATUS ───────────────────────────────────────────
    status: {
      type:    String,
      enum:    ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    // ── PAYMENT ──────────────────────────────────────────
    paymentMethod: { type: String, required: true },           // "stripe" / "paypal" / "cod"
    paymentResult: { type: PaymentResultSchema },              // populated after gateway confirms charge
    isPaid:        { type: Boolean, default: false },
    paidAt:        { type: Date },

    // ── PRICING BREAKDOWN ───────────────────────────────
    itemsPrice:    { type: Number, default: 0.0 },             // sum of (price × qty) for all items
    taxPrice:      { type: Number, default: 0.0 },             // tax amount applied at checkout
    shippingPrice: { type: Number, default: 0.0 },             // shipping fee (0 if free shipping)
    totalPrice:    { type: Number, default: 0.0 },             // itemsPrice + taxPrice + shippingPrice
  },
  {
    timestamps: true,
  }
);

export interface IOrder extends Document {
  user:        mongoose.Types.ObjectId
  orderNumber: string
  shippingAddress: {
    streetNumber?:    string
    buildingNumber?:  string
    floorNumber?:     string
    apartmentNumber?: string
    city?:            string
    country?:         string
    landmark?:        string
    notes?:           string
    postalCode?:      number
    phone?:           string
  }
  orderItems: {
    name:      string
    qty:       number
    image:     string
    price:     number
    productID?: mongoose.Types.ObjectId
  }[]
  status:        "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentMethod: string
  paymentResult?: {
    id?:           string
    status?:       string
    updateTime?:   string
    emailAddress?: string
  }
  isPaid:        boolean
  paidAt?:       Date
  itemsPrice:    number
  taxPrice:      number
  shippingPrice: number
  totalPrice:    number
  createdAt:     Date
  updatedAt:     Date
}

const Order = mongoose.model<IOrder>("Order", OrderSchema);

export default Order;