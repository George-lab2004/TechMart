import { ADD_ADDRESS_URL, PROFILE_URL } from "@/constants"
import { apiSlice } from "./apiSlice"

export interface user {
    _id: string,
    name: string,
    email: string,
    password: string,
    isAdmin: boolean,
    createdAt: string,
    updatedAt: string
    confirmedEmail: boolean,
    delivery: {
        title: string
        address: {
            streetNumber?: string
            buildingNumber?: string
            floorNumber?: string
            apartmentNumber?: string
            city?: string
            country?: string
            landmark?: string
            notes?: string
            postalCode?: number
        }[]
        phone?: string
    }[]
}
export const profileApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getProfile: builder.query<user, void>({
            query: () => ({ url: PROFILE_URL }),
            providesTags: ['User'],
        }),

        updateProfile: builder.mutation<user, Partial<user>>({
            query: (data) => ({
                url: PROFILE_URL,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),

        addAddress: builder.mutation<user, any>({
            query: (address) => ({
                url: ADD_ADDRESS_URL,
                method: 'POST',
                body: address,
            }),
            invalidatesTags: ['User'],
        }),

        updateAddress: builder.mutation<user, any>({
            query: (data) => ({
                url: ADD_ADDRESS_URL,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),

        deleteAddress: builder.mutation<user, string>({
            query: (id) => ({
                url: `${ADD_ADDRESS_URL}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),

    }),
});

export const { useGetProfileQuery, useUpdateProfileMutation, useAddAddressMutation, useUpdateAddressMutation, useDeleteAddressMutation } = profileApiSlice;