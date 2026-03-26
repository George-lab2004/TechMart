import { CART_URL } from '../constants'
import { apiSlice } from './apiSlice'

// ── TYPES ─────────────────────────────────────────

import type { CartItem } from './cartSlice'

export interface ICart {
    _id?: string
    user: string
    cartItems: CartItem[]
    itemsPrice: number
    shippingPrice: number
    taxPrice: number
    totalPrice: number
}

// ── API SLICE ─────────────────────────────────────

export const cartApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        // ── USER ─────────────────────

        getCart: builder.query<ICart, void>({
            query: () => ({
                url: CART_URL,
            }),
            providesTags: ['Cart'],
        }),

        addToCart: builder.mutation<ICart, CartItem>({
            query: (item) => ({
                url: CART_URL,
                method: 'POST',
                body: item,
            }),
            invalidatesTags: ['Cart'],
        }),

        removeFromCart: builder.mutation<ICart, string>({
            query: (productId) => ({
                url: `${CART_URL}/${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Cart'],
        }),

        syncCart: builder.mutation<ICart, CartItem[]>({
            query: (items) => ({
                url: `${CART_URL}/sync`,
                method: 'POST',
                body: items,
            }),
            invalidatesTags: ['Cart'],
        }),

        clearCart: builder.mutation<void, void>({
            query: () => ({
                url: CART_URL,
                method: 'DELETE',
            }),
            invalidatesTags: ['Cart'],
        }),

        // ── ADMIN ─────────────────────

        getAllCarts: builder.query<ICart[], void>({
            query: () => ({
                url: `${CART_URL}/admin`, // 🔥 IMPORTANT: separate route
            }),
            providesTags: ['Cart'],
        }),

        deleteCartByAdmin: builder.mutation<void, string>({
            query: (cartId) => ({
                url: `${CART_URL}/admin/${cartId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Cart'],
        }),

    }),
})

// ── EXPORTS ───────────────────────────────────────

export const {
    useGetCartQuery,
    useAddToCartMutation,
    useRemoveFromCartMutation,
    useSyncCartMutation,
    useClearCartMutation,

    // ✅ ADMIN
    useGetAllCartsQuery,
    useDeleteCartByAdminMutation,

} = cartApiSlice