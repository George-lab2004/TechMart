import { apiSlice } from "./apiSlice";

export const aiApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        sendMessage: builder.mutation({
            query: (body) => ({
                url: "/api/ai/chat",
                method: "POST",
                body
            })
        })
    })
});

export const { useSendMessageMutation } = aiApiSlice;