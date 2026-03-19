import { Button } from "@/Components/ui/button"
import { ArrowBigRight, Minus, Plus, TicketPlus, Trash } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { addToCart, removeFromCart, type CartItem } from "@/slices/cartSlice"
import { useGetProductsQuery } from "@/slices/productApiSlice"
import type { Product } from "@/pages/Products/components/ProductCard"

interface CartState {
  cart: {
    cartItems:     CartItem[]
    shippingPrice: number
    taxPrice:      number
    totalPrice:    string
  }
}

export default function Cart() {
  const dispatch      = useDispatch()
  const cartItems     = useSelector((state: CartState) => state.cart.cartItems)
  const shippingPrice = useSelector((state: CartState) => state.cart.shippingPrice)
  const taxPrice      = useSelector((state: CartState) => state.cart.taxPrice)
  const totalPrice    = useSelector((state: CartState) => state.cart.totalPrice)

  // ── Live stock from API ────────────────────────────────────
  const { data: productsData } = useGetProductsQuery()
  const stockMap = new Map<string, number>(
    (productsData?.result ?? []).map((p: Product) => [p._id, p.countInStock])
  )

  // Returns the authoritative stock for a cart item
  const liveStock = (item: CartItem): number =>
    stockMap.has(item._id) ? (stockMap.get(item._id) as number) : item.countInStock

  // ── Qty control ────────────────────────────────────────────
  function qtyController(item: CartItem, action: "plus" | "minus") {
    const stock = liveStock(item)
    if (action === "plus"  && item.qty >= stock) return
    if (action === "minus" && item.qty <= 1)      return

    const newQty = action === "plus" ? item.qty + 1 : item.qty - 1
    dispatch(addToCart({ ...item, qty: newQty, countInStock: stock }))
  }

  // ── Remove item ────────────────────────────────────────────
  function removeItem(itemId: string) {
    dispatch(removeFromCart(itemId))
  }

  // ── Totals ─────────────────────────────────────────────────
  const totalItems = cartItems.reduce((acc, i) => acc + i.qty, 0)
  const subtotal   = cartItems.reduce((acc, i) => acc + i.price * i.qty, 0)

  return (
    <div className="p-6 min-h-screen bg-bg dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="font-mono flex text-[0.75rem] text-muted">
        <span className="text-text2">Home</span>&nbsp;/ Cart
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between mt-5 items-start">
        <h1 className="text-5xl md:text-7xl font-bold font-display uppercase">Your Cart</h1>
        <span className="bg-blue-200 text-a dark:bg-blue-700 dark:text-blue-200 border border-blue-500 px-5 h-fit font-mono mt-4 md:mt-0 rounded-3xl">
          {totalItems} Items
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-8">
        {/* Left: Cart Items */}
        <section className="md:col-span-4 flex flex-col gap-5">
          {/* Coupon */}
          <div className="bg-surf dark:bg-gray-800 w-full p-4 rounded-2xl flex flex-col gap-3 border-t-4 border-blue-500">
            <div className="flex items-center text-blue-500 font-mono gap-2">
              <TicketPlus size={20} /> HAVE A COUPON
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 border-2 border-dashed border-blue-600 bg-blue-200 text-blue-600 rounded-xl">TECH10</span>
              <span className="px-2 py-1 border-2 border-dashed border-blue-600 bg-blue-200 text-blue-600 rounded-xl">MART20</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                className="flex-1 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium text-heading rounded-xl text-sm px-2 py-2 shadow-xs placeholder:text-body focus:ring-brand focus:border-brand"
                placeholder="Enter your code"
              />
              <Button className="bg-blue-200 text-blue-600 dark:bg-white dark:text-blue-600 hover:bg-gray-800 dark:hover:bg-gray-200">
                Apply
              </Button>
            </div>
          </div>

          {/* Cart Items */}
          {cartItems.map((item) => {
            const atMin = item.qty <= 1
            const atMax = item.qty >= item.countInStock

            return (
              <div
                key={item._id}
                className="flex flex-col md:flex-row md:justify-between gap-4 p-4 rounded-xl bg-surf dark:bg-gray-800"
              >
                {/* Left: Image + Info */}
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-40 w-40 object-cover rounded-lg"
                  />
                  <div className="flex flex-col">
                    <h3 className="text-muted font-display">{item.brand}</h3>
                    <h1 className="font-display">{item.name}</h1>
                    <div className="flex gap-2 text-sm text-muted-foreground font-body">
                      <span>{item.category}</span>
                      <span className="opacity-50">•</span>
                      <span>{item.qty}</span>
                    </div>

                    {/* Qty Control */}
                    <div className="flex items-center gap-3 mt-2 border px-3 py-1 rounded-lg w-fit">
                      <button
                        onClick={() => qtyController(item, "minus")}
                        disabled={atMin}
                        className="cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                      >
                        <Minus size={16} />
                      </button>

                      <span>{item.qty}</span>

                      <button
                        onClick={() => qtyController(item, "plus")}
                        disabled={atMax}
                        className="cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                        title={atMax ? `Max stock: ${item.countInStock}` : undefined}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {atMax && (
                      <p className="text-[10px] text-orange-500 mt-1 font-mono">
                        ⚠ Max stock reached ({item.countInStock})
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Prices + Actions */}
                <div className="flex flex-col gap-2 mt-2 md:mt-0">
                  <span className="text-sm text-muted-foreground line-through font-body">
                    ${(item.price * 1.1).toFixed(2)}
                  </span>
                  <span className="text-lg font-semibold text-green-600 dark:text-green-500 font-body">
                    ${item.price.toFixed(2)}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                    onClick={() => removeItem(item._id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </section>

        {/* Right: Order Summary */}
        <section className="md:col-span-2 flex flex-col gap-4 p-5 rounded-2xl bg-card shadow-sm dark:bg-gray-800">
          <h2 className="font-display text-2xl font-bold tracking-wide">Order Summary</h2>
          <hr className="border-muted dark:border-gray-600" />

          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>

          {/* Shipping */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            {shippingPrice === 0 ? (
              <span className="font-medium text-green-600 dark:text-green-400">Free</span>
            ) : (
              <span className="font-medium">${shippingPrice.toFixed(2)}</span>
            )}
          </div>

          {/* Free shipping banner */}
          {shippingPrice === 0 && (
            <div className="flex items-center gap-2 text-[11px] font-mono tracking-wide text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2">
              🎉 Free shipping on orders over $100!
            </div>
          )}

          {/* Tax */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (15%)</span>
            <span className="font-medium">${taxPrice.toFixed(2)}</span>
          </div>

          <hr className="border-muted dark:border-gray-600" />

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="font-semibold text-base">Total</span>
            <span className="text-2xl font-bold font-display">${Number(totalPrice).toFixed(2)}</span>
          </div>

          <button className="mt-2 w-full flex items-center justify-center gap-2 bg-black text-white dark:bg-white dark:text-black py-3 rounded-xl font-medium hover:opacity-90 transition cursor-pointer">
            Proceed to checkout
            <ArrowBigRight size={18} />
          </button>
        </section>
      </div>
    </div>
  )
}