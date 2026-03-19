import { apiSlice } from "@/slices/apiSlice"
import { configureStore } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import cartSlicereducer from "@/slices/cartSlice"

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSlicereducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
})

export type RootState = ReturnType<typeof store.getState>
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector)

export default store