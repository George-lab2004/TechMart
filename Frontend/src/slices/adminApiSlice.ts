import { apiSlice } from "./apiSlice";

export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Analytics removed
    }),
});

export const { } = adminApiSlice;
