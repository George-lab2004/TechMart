import mongoose, { Document, Schema } from "mongoose"

const CartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true // A user has exactly ONE cart
    },
    cartItems: [
        {
            product: { type: String, required: true }, // The ID used by Redux
            _id: { type: String, required: true },
            name: { type: String, required: true },
            image: { type: String, required: true },
            brand: { type: String, required: true },
            category: { type: String, required: true },
            countInStock: { type: Number, required: true },
            qty: { type: Number, required: true },
            price: { type: Number, required: true },
        }
    ],
    itemsPrice: { type: Number, default: 0.0 },
    shippingPrice: { type: Number, default: 0.0 },
    taxPrice: { type: Number, default: 0.0 },
    totalPrice: { type: Number, default: 0.0 },
}, { timestamps: true })

export interface ICart extends Document {
    user: mongoose.Types.ObjectId;
    cartItems: {
        product: string;
        _id: string;
        name: string;
        image: string;
        brand: string;
        category: string;
        countInStock: number;
        qty: number;
        price: number;
    }[];
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
}
const Cart = mongoose.model<ICart>("Cart", CartSchema)
export default Cart