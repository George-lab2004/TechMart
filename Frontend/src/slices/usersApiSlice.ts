import { USERS_URL, SIGNIN_URL, SIGNUP_URL, LOG_OUT, FORGET_PASSWORD_URL, VERIFY_OTP_URL, RESET_PASSWORD_URL } from "@/constants";
import { apiSlice } from "./apiSlice";

// export const usersApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     login: builder.mutation({
//       query: (data) => ({
//         url: SIGNIN_URL, // This is '/api/signIn' in your constants
//         method: 'POST',
//         body: data,
//       }),
//     }),
//     logout: builder.mutation({
//       query: () => ({
//         url: LOG_OUT,
//         method: 'POST',
//       }),
//     }),
//     register: builder.mutation({
//       query: (data) => ({
//         url: SIGNUP_URL, // This is '/api/signUp' in your constants
//         method: 'POST',
//         body: data,
//       }),
//     }),
//   }),
// });

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: SIGNIN_URL,
        method: 'POST',
        body: data
      }),

    }),
    register: builder.mutation({
      query: (data) => ({
        url: SIGNUP_URL,
        method: 'POST',
        body: data
      }),

    }),
    logout: builder.mutation({
      query: () => ({
        url: LOG_OUT,
        method: 'POST',
      })
    }),
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: FORGET_PASSWORD_URL,
        method: 'POST',
        body: data
      })
    }),
    verifyOTP: builder.mutation({
      query: (data) => ({
        url: VERIFY_OTP_URL,
        method: 'POST',
        body: data
      })
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: RESET_PASSWORD_URL,
        method: 'POST',
        body: data
      })
    })
  })
})
export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useForgetPasswordMutation, useVerifyOTPMutation, useResetPasswordMutation } = usersApiSlice;
