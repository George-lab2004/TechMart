import { ORDERS_URL } from "@/constants"
import { apiSlice } from "./apiSlice"
export interface IOrder {
    _id: string
    user: {
        _id: string
        name: string
        email: string
    }
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
    deliveredAt?: Date
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
        getOrders: builder.query<IOrder[], void>({
            query: () => ({
                url: ORDERS_URL,
            }),
            providesTags: ['Order'],
            keepUnusedDataFor: 5,
        }),
        deliverOrder: builder.mutation<IOrder, string>({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}/deliver`,
                method: 'PUT',
            }),
            invalidatesTags: ['Order'],
        }),
        payOrder: builder.mutation<IOrder, { orderId: string; details: any }>({
            query: ({ orderId, details }) => ({
                url: `${ORDERS_URL}/${orderId}/pay`,
                method: 'PUT',
                body: details,
            }),
            invalidatesTags: ['Order'],
        }),
        updateOrderStatus: builder.mutation<IOrder, { orderId: string; status: string }>({
            query: ({ orderId, status }) => ({
                url: `${ORDERS_URL}/${orderId}/status`,
                method: 'PUT',
                body: { status },
            }),
            invalidatesTags: ['Order'],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetMyOrdersQuery,
    useGetOrderDetailsQuery,
    useGetOrdersQuery,
    useDeliverOrderMutation,
    usePayOrderMutation,
    useUpdateOrderStatusMutation,
} = ordersApiSlice;

