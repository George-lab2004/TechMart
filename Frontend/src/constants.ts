export const BASE_URL = import.meta.env.DEV 
  ? "http://localhost:8000"  // your local backend port
  : "https://tech-mart-theta.vercel.app"  // your deployed backend
 export const PRODUCTS_URL = '/api/products'

export const USERS_URL = '/api/users'
export const ORDERS_URL = '/api/orders'
export const PAYPAL_URL = '/api/config/paypal'