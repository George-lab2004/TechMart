import type { ICart } from "@/slices/cartApiSlice"

export default function OrderSummary({ cart }: { cart: ICart }) {
    if (!cart?.cartItems) return null;

    return (
        <div className="bg-[var(--glass)] p-6 md:p-8 rounded-[2rem] border border-[var(--gb)] space-y-6 shadow-2xl backdrop-blur-2xl">

            <h2 className="text-xl font-black uppercase tracking-[0.2em] text-[var(--text)] text-center flex items-center justify-center gap-2">
                Order Summary
            </h2>

            <hr className="border-[var(--gb)] opacity-50" />

            <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--text2)] font-mono uppercase tracking-widest text-[10px] sm:text-xs">Items Subtotal ({cart.cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
                    <span className="font-bold">{cart.itemsPrice} EGP</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--text2)] font-mono uppercase tracking-widest text-[10px] sm:text-xs">Shipping</span>
                    <span className="font-bold">{cart.shippingPrice} EGP</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--text2)] font-mono uppercase tracking-widest text-[10px] sm:text-xs">Tax (15%)</span>
                    <span className="font-bold text-[var(--a)]">{cart.taxPrice} EGP</span>
                </div>
            </div>

            <hr className="border-[var(--gb)] opacity-50" />

            <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-black uppercase tracking-[0.2em] text-[var(--text)]">Total Pay</span>
                <span className="text-2xl font-black text-[var(--a)]">{cart.totalPrice} <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--text2)] ml-1">EGP</span></span>
            </div>

        </div>
    )
}