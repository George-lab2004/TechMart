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
      keepUnusedDataFor: 5,
    }),
    getSingleProduct: builder.query<SingleProductResponse, string>({
      query: (id) => ({ url: `${PRODUCTS_URL}/${id}` }),
      keepUnusedDataFor: 5,
    }),
  }),
})

export const { useGetProductsQuery, useGetSingleProductQuery } = productApiSlice;