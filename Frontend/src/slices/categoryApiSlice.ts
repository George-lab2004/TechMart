
import { apiSlice } from "./apiSlice";
import { CATEGORIES_URL } from "@/constants";

export interface category {
    _id: string
    name: string
    slug: string
    images: { url: string; alt: string }[]
    description?: string
    color?: string
    glowColor?: string
    productCount?: number
}
interface CategroyResponse {
    message: string,
    result: category[]
}

export const categoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<CategroyResponse, void>({
            query: () => ({
                url: CATEGORIES_URL
            }),
            providesTags: ['Category'],
            keepUnusedDataFor: 5
        }),
        createCategory: builder.mutation<category, Partial<category>>({
            query: (data) => ({
                url: CATEGORIES_URL,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Category'],
        }),
        updateCategory: builder.mutation<category, Partial<category>>({
            query: (data) => ({
                url: `${CATEGORIES_URL}/${data._id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Category', 'Product'],
        }),
        deleteCategory: builder.mutation<void, string>({
            query: (categoryId) => ({
                url: `${CATEGORIES_URL}/${categoryId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category', 'Product'],
        }),
    })
})
export const { 
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation
} = categoryApiSlice