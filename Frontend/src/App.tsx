import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import './App.css'
import UserLayout from '@/layouts/UserLayout'
import Error from '@/Components/Error'
import { Toaster } from 'react-hot-toast'
import PrivateRoutes from './Components/security/PrivateRoutes'
import AdminRoutes from './Components/security/AdminRoutes'
import AdminLayout from './layouts/AdminLayout'
import Cart from './pages/Cart/Cart'
import PageLoader from './Components/PageLoader'

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home/Home'))
const Products = lazy(() => import('./pages/Products/Products'))
const ProductDetails = lazy(() => import('./pages/ProductDetails/productDetails'))
const Login = lazy(() => import('./pages/authentication/Login'))
const ForgetPassword = lazy(() => import('./pages/authentication/ForgetPassword'))
const VerifyEmail = lazy(() => import('./pages/authentication/VerifyEmail'))
const Profile = lazy(() => import('./pages/Profile/Profile'))
const Checkout = lazy(() => import('./pages/checkout/Checkout'))
const Orders = lazy(() => import('./pages/orders/Orders'))
const Categories = lazy(() => import('./pages/categories/Categories'))
const Dashboard = lazy(() => import('./pages/admin/dashboard/Dashboard'))
const Users = lazy(() => import('./pages/admin/Users/Users'))
const AdminProducts = lazy(() => import('./pages/admin/Products/Products'))
const AdminOrders = lazy(() => import('./pages/admin/orders/Orders'))
const AdminCategories = lazy(() => import('./pages/admin/Categories/Categories'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Router defined outside the component
const router = createBrowserRouter([
  {
    path: '/',
    element: <UserLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "products",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Products />
          </Suspense>
        )
      },
      {
        path: "products/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProductDetails />
          </Suspense>
        )
      },
      {
        path: "cart",
        element: (
          <Cart />

        )
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Login />
          </Suspense>
        )
      },
      {
        path: "forget-password",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ForgetPassword />
          </Suspense>
        )
      },
      {
        path: "verify-email/:email",
        element: (
          <Suspense fallback={<PageLoader />}>
            <VerifyEmail />
          </Suspense>
        )
      },
      {
        path: "categories",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Categories />
          </Suspense>
        )
      },
      // REGISTERED PROTECTED ROUTES
      {
        path: '',
        element: <PrivateRoutes />,
        children: [
          {
            path: 'profile',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Profile />
              </Suspense>
            )
          },
          {
            path: "checkout",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Checkout />
              </Suspense>
            )
          },
          {
            path: "orders",
            element: (
              <Suspense fallback={null}>
                <Orders />
              </Suspense>
            )
          }
        ]
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminRoutes />, // handles auth + role
    children: [
      {
        element: <AdminLayout />, 
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          {
            path: "dashboard", element: <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          },
          {
            path: "products", element: <Suspense fallback={<PageLoader />}>
              <AdminProducts />
            </Suspense>
          },
          {
            path: "orders", element: <Suspense fallback={<PageLoader />}>
              <AdminOrders />
            </Suspense>
          },
          {
            path: "categories", element: <Suspense fallback={<PageLoader />}>
              <AdminCategories />
            </Suspense>
          },
          {
            path: "users", element: <Suspense fallback={<PageLoader />}>
              <Users />
            </Suspense>
          },
        ]
      }
    ]
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFound />
      </Suspense>
    ),
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
