import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from "react-redux"
import store from './store/store.ts'

// Apply theme on load to prevent flickering before React mounts
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark");
} else if (localStorage.getItem("theme") === "light") {
  document.documentElement.classList.remove("dark");
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
