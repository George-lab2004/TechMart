
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
            keepUnusedDataFor: 5
        })
    })
})
export const { useGetCategoriesQuery } = categoryApiSlice