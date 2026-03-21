import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// ── TYPES ──────────────────────────────────────────────────

export interface CartItem {
  _id: string
  name: string
  image: string
  price: number
  qty: number
  countInStock: number
  brand: string
  category: string
}

interface CartState {
  cartItems: CartItem[]
  itemsPrice: number
  shippingPrice: number
  taxPrice: number
  totalPrice: string
}

// ── HELPERS ────────────────────────────────────────────────

const addDecimals = (num: number): number => {
  return Math.round(num * 100) / 100
}

const saveToStorage = (state: CartState) => {
  localStorage.setItem("cart", JSON.stringify(state))
}

// ✅ CENTRALIZED CALCULATION (MOST IMPORTANT FIX)
const updateCart = (state: CartState) => {
  // Items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  )

  // Shipping
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10)

  // Tax (15%)
  state.taxPrice = addDecimals(0.15 * state.itemsPrice)

  // Total
  state.totalPrice = (
    state.itemsPrice +
    state.shippingPrice +
    state.taxPrice
  ).toFixed(2)

  // Save
  saveToStorage(state)
}

// ── INITIAL STATE ──────────────────────────────────────────

const getCartFromStorage = (): CartState => {
  const stored = localStorage.getItem("cart")

  if (stored) {
    try {
      return JSON.parse(stored) as CartState
    } catch {
      return {
        cartItems: [],
        itemsPrice: 0,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: "0",
      }
    }
  }

  return {
    cartItems: [],
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: "0",
  }
}

// ── SLICE ──────────────────────────────────────────────────

const cartSlice = createSlice({
  name: "cart",
  initialState: getCartFromStorage(),
  reducers: {

    // ✅ ADD OR UPDATE ITEM
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload

      const existItem = state.cartItems.find(
        (i) => i._id === item._id
      )

      if (existItem) {
        state.cartItems = state.cartItems.map((i) =>
          i._id === existItem._id ? item : i
        )
      } else {
        state.cartItems = [...state.cartItems, item]
      }

      updateCart(state)
    },

    // ✅ REMOVE ITEM (FIXED BUG HERE)
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      )

      updateCart(state)
    },

    // ✅ CLEAR CART
    clearCart: (state) => {
      state.cartItems = []
      updateCart(state)
      localStorage.removeItem("cart")
    },

  },
})

// ── EXPORTS ────────────────────────────────────────────────

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer