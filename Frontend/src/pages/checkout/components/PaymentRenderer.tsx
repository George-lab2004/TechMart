import { PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "react-hot-toast";
import StripeCheckout from "./Stripecheckout";
import { AlertCircle } from "lucide-react";

interface Props {
    method: string;
    total: number;
    cart: any;
    address: any;
    onOrderSuccess: (order: any) => void;
}

export default function PaymentRenderer({ method, total, cart, address, onOrderSuccess }: Props) {
    if (!address) {
        return (
            <div className="bg-ag p-4 rounded-2xl border border-gb flex items-start gap-3 mt-6">
                <AlertCircle className="text-a mt-0.5" size={16} />
                <p className="text-[10px] leading-relaxed text-text2 font-bold uppercase tracking-wider">
                    Shipping Address Required. Please go back to step 1.
                </p>
            </div>
        )
    }

    if (method === "card") {
        return (
            <div className="mt-6 space-y-4">
                <div className="text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-text2 opacity-50 mb-2">Secure Credit Card</p>
                </div>
                <StripeCheckout
                    total={cart.totalPrice}
                    onOrderSuccess={(paymentMethodObject: any) => {
                        onOrderSuccess({
                            paymentMethod: "stripe",
                            paymentResult: {
                                id: paymentMethodObject.id,
                                status: "succeeded",
                                updateTime: new Date().toISOString(),
                                emailAddress: paymentMethodObject.billing_details?.email || ""
                            }
                        });
                    }}
                />
            </div>
        )
    }

    if (method === "paypal") {
        return (
            <div className="mt-6">
                <PayPalButtons
                    style={{
                        layout: "vertical",
                        color: "blue",
                        shape: "rect",
                        label: "checkout",
                    }}
                    createOrder={(_data, actions) => {
                        return actions.order.create({
                            intent: "CAPTURE",
                            purchase_units: [
                                {
                                    amount: {
                                        currency_code: "USD",
                                        value: total.toFixed(2),
                                    },
                                },
                            ],
                        });
                    }}
                    onApprove={async (_data, actions) => {
                        if (actions.order) {
                            const details = await actions.order.capture();
                            onOrderSuccess({
                                paymentMethod: 'paypal',
                                paymentResult: {
                                    id: details.id,
                                    status: details.status,
                                    updateTime: details.update_time,
                                    emailAddress: details?.payer?.email_address
                                }
                            });
                        }
                    }}
                    onError={(err) => {
                        console.error("PayPal Error:", err);
                        toast.error("An error occurred during the payment processing.");
                    }}
                />
            </div>
        )
    }

    if (method === "cod") {
        return (
            <div className="bg-card p-6 rounded-2xl border border-gb flex flex-col items-center gap-4 text-center">
                <p className="text-xs uppercase tracking-[0.2em] font-black text-a">Pay on Delivery</p>
                <p className="text-[10px] text-text2 opacity-70">Please have ${total} ready upon arrival.</p>
            </div>
        )
    }

    return null;
}