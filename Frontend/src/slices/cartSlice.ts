import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// ── TYPES ──────────────────────────────────────────────────

export interface CartItem {
  _id:          string
  name:         string
  image:        string
  price:        number
  qty:          number
  countInStock: number
  brand:        string
  category:     string
}

interface CartState {
  cartItems:  CartItem[]
  itemsPrice: number
  shippingPrice:number 
  taxPrice : number
  totalPrice: string
}

// ── HELPERS ────────────────────────────────────────────────

const addDecimals = (num: number): number => {
  return Math.round(num * 100) / 100
}

const saveToStorage = (state: CartState) => {
  localStorage.setItem("cart", JSON.stringify(state))
}

// ── INITIAL STATE ──────────────────────────────────────────

const getCartFromStorage = (): CartState => {
  const stored = localStorage.getItem("cart")

  if (stored) {
    try {
      return JSON.parse(stored) as CartState
    } catch {
      return { cartItems: [], itemsPrice: 0, shippingPrice: 0, taxPrice: 0, totalPrice: "0" }
    }
  }

  return { cartItems: [], itemsPrice: 0, shippingPrice: 0, taxPrice: 0, totalPrice: "0" }
}

// ── SLICE ──────────────────────────────────────────────────

const cartSlice = createSlice({
  name: "cart",
  initialState: getCartFromStorage(),
  reducers: {

    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item      = action.payload
      const existItem = state.cartItems.find((i) => i._id === item._id)

      if (existItem) {
        // item already in cart — update it
        state.cartItems = state.cartItems.map((i) =>
          i._id === existItem._id ? item : i
        )
      } else {
        // new item — add it
        state.cartItems = [...state.cartItems, item]
      }

      // recalculate total price
      state.itemsPrice = addDecimals(
        state.cartItems.reduce((acc, i) => acc + i.price * i.qty, 0)
      )
// shipping above 100 is free
state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10)
// tax
state.taxPrice = addDecimals(0.15 * state.itemsPrice)
state.totalPrice = (  Number(state.itemsPrice) +
  Number(state.shippingPrice) +
  Number(state.taxPrice) 
    ).toFixed(2)
localStorage.setItem("cart", JSON.stringify(state))    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((i) => i._id !== action.payload)

      state.itemsPrice = addDecimals(
        state.cartItems.reduce((acc, i) => acc + i.price * i.qty, 0)
      )

      saveToStorage(state)
    },

    clearCart: (state) => {
      state.cartItems  = []
      state.itemsPrice = 0
      localStorage.removeItem("cart")
    },

  },
})

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer