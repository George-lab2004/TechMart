import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import toast from "react-hot-toast";

interface StripeCheckoutProps {
    total: number;
    onOrderSuccess: (result: any) => void;
}

export default function StripeCheckout({ total, onOrderSuccess }: StripeCheckoutProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements || !isComplete) return;

        setLoading(true);

        try {
            const card = elements.getElement(CardElement);
            if (!card) return;

            const { paymentMethod, error } = await stripe.createPaymentMethod({
                type: "card",
                card
            });

            if (error) {
                toast.error(error.message || "Payment failed");
            } else {
                onOrderSuccess(paymentMethod);
            }
        } catch (err) {
            toast.error("Something went wrong");
            console.error(err);
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="p-4 border border-[var(--gb)] rounded-2xl bg-[var(--ag)] shadow-inner">
                <CardElement 
                    onChange={(e) => setIsComplete(e.complete)}
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: 'var(--text)',
                                '::placeholder': {
                                    color: 'var(--text2)',
                                },
                            },
                        },
                    }}
                />
            </div>
            <button
                type="submit"
                disabled={!stripe || loading || !isComplete}
                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all
                    ${!stripe || loading || !isComplete ? 'bg-[var(--gb)] text-[var(--muted)] opacity-50 cursor-not-allowed' : 'bg-[var(--a)] text-white hover:scale-[1.01] shadow-lg shadow-[var(--a)]/20'}`}
            >
                {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
            </button>
        </form>
    );
}