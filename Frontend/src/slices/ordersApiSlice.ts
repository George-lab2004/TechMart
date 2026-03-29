import { ORDERS_URL } from "@/constants"
import { apiSlice } from "./apiSlice"
export interface IOrder {
    _id: string
    user: string
    orderNumber: string
    shippingAddress: {
        streetNumber?: string
        buildingNumber?: string
        floorNumber?: string
        apartmentNumber?: string
        city?: string
        country?: string
        landmark?: string
        notes?: string
        postalCode?: number
        phone?: string
    }
    orderItems: {
        name: string
        qty: number
        image: string
        price: number
        productID?: string
    }[]
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
    paymentMethod: string
    paymentResult?: {
        id?: string
        status?: string
        updateTime?: string
        emailAddress?: string
    }
    isPaid: boolean
    paidAt?: Date
    itemsPrice: number
    taxPrice: number
    shippingPrice: number
    totalPrice: number
    createdAt: Date
    updatedAt: Date
}
export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation<IOrder, any>({
            query: (order) => ({
                url: ORDERS_URL,
                method: 'POST',
                body: order,
            }),
            invalidatesTags: ['Order'],
        }),
        getMyOrders: builder.query<IOrder[], void>({
            query: () => ({
                url: `${ORDERS_URL}/mine`,
            }),
            providesTags: ['Order'],
        }),
        getOrderDetails: builder.query<IOrder, string>({
            query: (id) => ({
                url: `${ORDERS_URL}/${id}`,
            }),
            providesTags: ['Order'],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetMyOrdersQuery,
    useGetOrderDetailsQuery
} = ordersApiSlice;
