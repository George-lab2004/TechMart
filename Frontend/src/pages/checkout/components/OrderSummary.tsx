import { motion } from "framer-motion"

interface Props {
    cart: any
}

export default function OrderSummary({ cart }: Props) {
    return (
        <div className="bg-[var(--card)] border border-[var(--gb)] rounded-3xl p-6 sm:p-8 sticky top-24 shadow-xl shadow-black/5 overflow-hidden">
            {/* Glossy Backdrop Effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--a)]/5 blur-[100px] rounded-full" />
            
            <h3 className="text-sm uppercase tracking-[0.3em] font-black mb-8 pb-4 border-b border-[var(--gb)] text-[var(--text)]">
                Order Summary
            </h3>

            <div className="space-y-5 relative z-10">
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-[var(--text2)]">Subtotal</span>
                        <span className="font-bold text-[var(--text)]">${cart.itemsPrice}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-[var(--text2)]">Shipping</span>
                        <span className="font-bold text-[var(--text)]">${cart.shippingPrice}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-[var(--text2)]">Tax</span>
                        <span className="font-bold text-[var(--text)]">${cart.taxPrice}</span>
                    </div>
                    <div className="pt-4 border-t border-[var(--gb)] flex justify-between items-end">
                        <span className="text-xs uppercase tracking-widest font-black text-[var(--text2)]">Total</span>
                        <div className="text-right">
                            <span className="text-2xl font-black text-[var(--a)] drop-shadow-sm">${cart.totalPrice}</span>
                            <span className="text-[10px] text-[var(--text2)] block uppercase font-mono tracking-widest mt-1 opacity-70">USD</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--ag)] p-4 rounded-2xl border border-[var(--a)]/10 flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--a)] mt-1.5 shrink-0 animate-pulse" />
                    <p className="text-[10px] leading-relaxed text-[var(--text2)] font-medium">
                        Your transaction is encrypted and secure. By placing your order, you agree to our Terms of Service.
                    </p>
                </div>
            </div>
        </div>
    )
}