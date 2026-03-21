import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import './App.css'
import UserLayout from '@/layouts/UserLayout'
import Error from '@/Components/Error'
import  { Toaster } from 'react-hot-toast'

// Lazy-loaded pages — defined outside the component so they're never recreated
const Home = lazy(() => import('./pages/Home/Home'))
const Products = lazy(()=> import('./pages/Products/Products'))
const ProductDetails = lazy(()=> import('./pages/ProductDetails/productDetails'))
const Cart = lazy(()=> import('./pages/Cart/Cart'))
const Login = lazy(()=> import('./pages/authentication/Login'))
const ForgetPassword = lazy(()=> import('./pages/authentication/ForgetPassword'))

// Router defined outside the component — same reason as above
const router = createBrowserRouter([
  {
    path: '/',
    element: <UserLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={null}>
            <Home />
          </Suspense>
        ),
      },
      {path:"products",
        element:(
          <Suspense fallback ={null}>
            <Products/>
          </Suspense>
        )
      },
            {path:"products/:id",
        element:(
          <Suspense fallback ={null}>
            <ProductDetails/>
          </Suspense>
        )
      },
                  {path:"cart",
        element:(
          <Suspense fallback ={null}>
            <Cart/>
          </Suspense>
        )
      },
                  {path:"login",
        element:(
          <Suspense fallback ={null}>
            <Login/>
          </Suspense>
        )
      },
      {
        path: "forget-password",
        element: (
          <Suspense fallback={null}>
            <ForgetPassword />
          </Suspense>
        )
      }
    ],
  },
])

export default function App() {
  return <>
    <RouterProvider router={router} />
    <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(13,13,31,0.95)',
            color: '#eeeeff',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '12px',
            fontFamily: 'Outfit, sans-serif',
            fontSize: '14px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          },
          success: {
            iconTheme: {
              primary: '#4fffb0',
              secondary: '#04040e',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff4f8e',
              secondary: '#04040e',
            },
          },
        }}
      />
</>
}
