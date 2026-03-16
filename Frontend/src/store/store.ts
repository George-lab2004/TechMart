import { apiSlice } from "@/slices/apiSlice"
import {configureStore} from"@reduxjs/toolkit"
const store = configureStore({
    reducer:{
        [apiSlice.reducerPath]:apiSlice.reducer
    },
    middleware:(getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    // devTools:import.meta.env.NODE_ENV !== 'production'
    devTools:true
})
export default store