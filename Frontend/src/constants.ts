export const BASE_URL = import.meta.env.DEV
  ? "http://localhost:5000"  // your local backend port
  : ""  // use Vercel reverse proxy in production

export const USERS_URL = '/api/users'
// PRODUCTS
export const PRODUCTS_URL = '/api/products'

// USERS
export const SIGNIN_URL = '/api/signIn'
export const SIGNUP_URL = '/api/signUp'
export const LOG_OUT = '/api/logout'

// PROFILE
export const PROFILE_URL = '/api/profile'
export const UPDATE_PROFILE_URL = '/api/profile'
export const ADD_ADDRESS_URL = '/api/profile/address'

// ADMIN USERS
export const GET_ALL_USERS_URL = '/api/allUsers'
export const UPDATE_USER_ADMIN_URL = (id: string) => `/api/${id}`
export const DELETE_USER_URL = (id: string) => `/api/${id}`

// PASSWORD RESET
export const FORGET_PASSWORD_URL = '/api/forgetPassword'
export const VERIFY_OTP_URL = '/api/verifyOtp'
export const RESET_PASSWORD_URL = '/api/resetPassword'

// ORDERS
export const ORDERS_URL = '/api/orders'

// PAYPAL
export const PAYPAL_URL = '/api/config/paypal'

// CATEGORIES
export const CATEGORIES_URL = '/api/categories'
// CART
export const CART_URL = '/api/cart'
export const CART_BY_ID_URL = (id: string) => `/api/cart/${id}`

