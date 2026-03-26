interface Props {
    method: string;
    total: number;
}

export default function PaymentRenderer({ method, total }: Props) {
    if (method === "card") {
        return (
            <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--gb)] flex flex-col items-center gap-4 text-center">
                <p className="text-xs uppercase tracking-widest font-bold opacity-50">Stripe Integration</p>
                <div className="w-full py-4 bg-[#635bff] text-white rounded-xl font-bold shadow-lg hover:brightness-110 transition-all cursor-pointer">
                    Pay {total} EGP with Card
                </div>
            </div>
        )
    }

    if (method === "paypal") {
        return (
            <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--gb)] flex flex-col items-center gap-4 text-center">
                <p className="text-xs uppercase tracking-widest font-bold opacity-50">PayPal Standard</p>
                <div className="w-full py-4 bg-[#ffc439] text-[#003087] rounded-xl font-black shadow-lg hover:brightness-105 transition-all cursor-pointer">
                    PayPal Check out
                </div>
            </div>
        )
    }

    if (method === "cod") {
        return (
            <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--gb)] flex flex-col items-center gap-4 text-center">
                <p className="text-xs uppercase tracking-[0.2em] font-black text-[var(--a)]">Pay on Delivery</p>
                <p className="text-[10px] text-[var(--text2)] opacity-70">Please have {total} EGP ready upon arrival.</p>
            </div>
        )
    }

    return null;
}