import { ORDERS_URL } from "@/constants"
import { apiSlice } from "./apiSlice"

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMyOrders: builder.query<any, void>({
            query: () => ({
                url: `${ORDERS_URL}/mine`,
            }),
            providesTags: ['Order'],
        }),
        getOrderDetails: builder.query<any, string>({
            query: (id) => ({
                url: `${ORDERS_URL}/${id}`,
            }),
            providesTags: ['Order'],
        }),
    }),
});

export const { useGetMyOrdersQuery, useGetOrderDetailsQuery } = ordersApiSlice;
