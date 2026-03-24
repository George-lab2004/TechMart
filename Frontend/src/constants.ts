export const BASE_URL = import.meta.env.DEV
  ? "http://localhost:5000"  // your local backend port
  : "https://tech-mart-theta.vercel.app"  // your deployed backend
export const PRODUCTS_URL = '/api/products'

export const USERS_URL = '/api/users'
export const ORDERS_URL = '/api/orders'
export const PAYPAL_URL = '/api/config/paypal'
export const SIGNIN_URL = '/api/signIn'
export const SIGNUP_URL = '/api/signUp'
export const LOG_OUT = '/api/logout'
export const FORGET_PASSWORD_URL = '/api/forgetPassword'
export const VERIFY_OTP_URL = '/api/verifyOtp'
export const RESET_PASSWORD_URL = '/api/resetPassword'
export const CATEGORIES_URL = '/api/categories'
