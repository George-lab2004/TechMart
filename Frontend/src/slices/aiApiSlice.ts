import { apiSlice } from "./apiSlice";

export const aiApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        sendMessage: builder.mutation({
            query: (body) => ({
                url: "/api/ai/chat",
                method: "POST",
                body
            })
        }),
        sendAdminMessage: builder.mutation({
            query: (body) => ({
                url: "/api/admin-ai/chat",
                method: "POST",
                body
            })
        })
    })
});

export const { useSendMessageMutation, useSendAdminMessageMutation } = aiApiSlice;