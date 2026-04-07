import { PRODUCTS_URL } from "@/constants";
import { apiSlice } from "./apiSlice";
import type { Product } from "@/pages/Products/components/ProductCard";

interface ProductsResponse {
  message: string;
  result: Product[];
}

interface SingleProductResponse {
  message: string;
  result: Product;
}

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, void>({
      query: () => ({ url: PRODUCTS_URL }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),
    getSingleProduct: builder.query<SingleProductResponse, string>({
      query: (id) => ({ url: `${PRODUCTS_URL}/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation<SingleProductResponse, Partial<Product>>({
      query: (data) => ({
        url: PRODUCTS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation<SingleProductResponse, { id: string; data: Partial<Product> }>({
      query: ({ id, data }) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Product" }, { type: "Product", id }],
    }),
    deleteProduct: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
    createReview: builder.mutation<{ message: string }, { productId: string; title: string; rating: number; comment: string }>({
      query: ({ productId, ...body }) => ({
        url: `${PRODUCTS_URL}/${productId}/reviews`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { productId }) => [{ type: "Product", id: productId }],
    }),
    getProductReviews: builder.query<any, string>({
      query: (id) => ({ url: `${PRODUCTS_URL}/${id}/reviews` }),
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetSingleProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetProductReviewsQuery,
} = productApiSlice;