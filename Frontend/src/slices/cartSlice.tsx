import { createSlice } from "@reduxjs/toolkit";

type CartState = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cartItems: any[];
};

const getCartFromStorage = (): CartState => {
  const storedCart = localStorage.getItem("cart");

  if (storedCart) {
    try {
      return JSON.parse(storedCart);
    } catch {
      return { cartItems: [] };
    }
  }

  return { cartItems: [] };
};

const cartSlice = createSlice({
  name: "cart",
  initialState: getCartFromStorage(),
  reducers: {},
});

export default cartSlice.reducer;