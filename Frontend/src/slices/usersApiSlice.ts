import { ADD_ADDRESS_URL, PROFILE_URL, GET_ALL_USERS_URL, DELETE_USER_URL, UPDATE_USER_ADMIN_URL } from "@/constants"
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

        // ADMIN ENDPOINTS
        getUsers: builder.query<user[], void>({
            query: () => ({
                url: GET_ALL_USERS_URL,
            }),
            providesTags: ['User'],
            keepUnusedDataFor: 5,
        }),

        deleteUser: builder.mutation<void, string>({
            query: (userId) => ({
                url: DELETE_USER_URL(userId),
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),

        updateUser: builder.mutation<user, Partial<user>>({
            query: (data) => ({
                url: UPDATE_USER_ADMIN_URL(data._id!),
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),

    }),
});

export const { 
    useGetProfileQuery, 
    useUpdateProfileMutation, 
    useAddAddressMutation, 
    useUpdateAddressMutation, 
    useDeleteAddressMutation,
    useGetUsersQuery,
    useDeleteUserMutation,
    useUpdateUserMutation
} = profileApiSlice;