import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from "react-redux"
import store from './store/store.ts'
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

// Apply theme on load to prevent flickering before React mounts
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark");
} else if (localStorage.getItem("theme") === "light") {
  document.documentElement.classList.remove("dark");
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider options={{
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "sb",
        currency: "USD"
      }}>
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
      </PayPalScriptProvider>
    </Provider>
  </StrictMode>,
)
