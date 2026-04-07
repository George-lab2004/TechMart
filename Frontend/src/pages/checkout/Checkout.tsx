import { useState } from "react"
import { useGetCartQuery } from "@/slices/cartApiSlice"
import { useGetProfileQuery, useAddAddressMutation } from "@/slices/usersApiSlice"
import { useCreateOrderMutation } from "@/slices/ordersApiSlice"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

import Section from "@/pages/checkout/components/Section"
import InputField from "@/Components/InputField"
import OrderSummary from "@/pages/checkout/components/OrderSummary"
import Steps from "@/pages/checkout/components/Steps"
import { MapPin, Plus, CreditCard, ShoppingBag } from "lucide-react"
import PaymentRenderer from "@/pages/checkout/components/PaymentRenderer"

export default function Checkout() {
    const { data: cart, isLoading } = useGetCartQuery()
    const { data: user } = useGetProfileQuery()
    const [addAddress, { isLoading: isAddingAddress }] = useAddAddressMutation()
    const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation()
    const navigate = useNavigate()

    const [step, setStep] = useState(1)
    const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null)
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState("card")

    // New Address Form Data
    const [formData, setFormData] = useState({
        title: "", phone: "", streetNumber: "", buildingNumber: "",
        floorNumber: "", apartmentNumber: "", city: "", country: "Egypt", postalCode: ""
    })

    if (isLoading || !cart || !user) return <div className="p-20 text-center uppercase tracking-widest font-mono text-sm opacity-50">Loading Checkout...</div>

    const addresses = user?.delivery || []
    const isCairo = addresses?.[selectedAddressIndex ?? 0]?.address?.[0]?.city?.toLowerCase() === "cairo"

    const selectedAddress = selectedAddressIndex !== null ? addresses[selectedAddressIndex] : null

    const handleSaveAddressAndContinue = async () => {
        if (!formData.title || !formData.streetNumber || !formData.city) {
            return toast.error("Please fill in the required address fields")
        }
        try {
            const data = { ...formData, postalCode: Number(formData.postalCode) || undefined }
            await addAddress(data).unwrap()
            toast.success("Address saved!")
            setIsAddingNewAddress(false)
        } catch (err: any) {
            toast.error(err?.data?.message || err.error)
        }
    }

    const handleOrderSuccess = async (paymentData: any = {}) => {
        if (!selectedAddress) return toast.error("Please select a shipping address")
        
        try {
            const orderPayload = {
                orderItems: cart.cartItems,
                shippingAddress: {
                    streetNumber: selectedAddress.address[0].streetNumber,
                    buildingNumber: selectedAddress.address[0].buildingNumber,
                    floorNumber: selectedAddress.address[0].floorNumber,
                    apartmentNumber: selectedAddress.address[0].apartmentNumber,
                    city: selectedAddress.address[0].city,
                    country: selectedAddress.address[0].country,
                    postalCode: selectedAddress.address[0].postalCode,
                    phone: selectedAddress.phone,
                },
                paymentMethod: paymentData.paymentMethod || paymentMethod,
                paymentResult: paymentData.paymentResult,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            }

            await createOrder(orderPayload).unwrap()
            toast.success("Order Placed Successfully!")
            navigate(`/`) // Or navigate to order success page if available
        } catch (err: any) {
            toast.error(err?.data?.message || err.error || "Failed to place order")
        }
    }

    const handlePlaceOrder = () => {
        if (paymentMethod === 'cod') {
            handleOrderSuccess({ paymentMethod: 'cod' })
        }
    }

    return (
        <PayPalScriptProvider options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "sb", currency: "USD" }}>
        <Elements stripe={stripePromise}>
        <div className="container mx-auto py-8 md:py-12 px-4 max-w-7xl font-body">

            {/* STEP INDICATOR */}
            <Steps step={step} />

            <div className="grid lg:grid-cols-[1fr_400px] gap-8">

                {/* LEFT */}
                <div className="space-y-6">

                    {/* STEP 1: SHIPPING */}
                    <Section
                        number="1" title="Shipping Address"
                        isActive={step === 1}
                        isCompleted={step > 1}
                        onEdit={() => setStep(1)}
                        summary={selectedAddress ? (
                            <div className="flex items-center gap-4 bg-card p-4 rounded-2xl border border-gb">
                                <div className="w-10 h-10 rounded-full bg-a/10 text-a flex items-center justify-center shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-text">{selectedAddress.title}</p>
                                    <p className="text-xs text-text2 leading-relaxed">{selectedAddress.address[0]?.streetNumber} {selectedAddress.address[0]?.buildingNumber}, {selectedAddress.address[0]?.city}</p>
                                </div>
                            </div>
                        ) : <span className="opacity-50 text-xs italic">No address selected</span>}
                    >
                        {!isAddingNewAddress ? (
                            <div className="space-y-4">
                                {addresses.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {addresses.map((del: any, idx: number) => (
                                            <div
                                                key={idx}
                                                onClick={() => setSelectedAddressIndex(idx)}
                                                className={`p-5 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all duration-300 relative overflow-hidden
                                                    ${selectedAddressIndex === idx ? 'border-a bg-a/5 shadow-[0_4px_20px_rgba(0,128,255,0.15)] ring-1 ring-a' : 'border-gb bg-card hover:border-a/30'}`}
                                            >
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <p className={`font-black uppercase tracking-widest text-xs ${selectedAddressIndex === idx ? 'text-a' : 'text-text'}`}>{del.title}</p>
                                                        {selectedAddressIndex === idx && <span className="w-5 h-5 rounded-full bg-a text-white flex items-center justify-center text-[10px]">✓</span>}
                                                    </div>
                                                    <p className="text-sm font-semibold mt-2">{del.address[0]?.streetNumber} {del.address[0]?.buildingNumber}</p>
                                                    <p className="text-xs text-text2 mt-1">{del.address[0]?.city}, {del.address[0]?.country}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <div
                                            onClick={() => setIsAddingNewAddress(true)}
                                            className="p-5 rounded-2xl border border-dashed border-gb flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-glass transition-all min-h-[140px]"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gb flex items-center justify-center">
                                                <Plus size={18} className="text-text2" />
                                            </div>
                                            <span className="text-sm font-bold text-text2">Add New Address</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 border border-dashed border-gb rounded-3xl bg-card">
                                        <MapPin className="mx-auto mb-4 opacity-20" size={40} />
                                        <p className="text-text2 mb-4 font-mono text-xs uppercase tracking-widest">No existing locations.</p>
                                        <button onClick={() => setIsAddingNewAddress(true)} className="bg-glass border border-gb px-8 py-3 rounded-full text-sm font-bold hover:bg-gb transition-colors shadow-sm text-text">Add New Address</button>
                                    </div>
                                )}

                                <button
                                    disabled={selectedAddressIndex === null}
                                    onClick={() => setStep(2)}
                                    className={`mt-6 w-full py-4 rounded-xl font-bold transition-all uppercase tracking-widest text-[11px] sm:text-xs ${selectedAddressIndex !== null ? 'bg-a text-white hover:scale-[1.01] shadow-lg shadow-(--a)/20' : 'bg-gb text-muted cursor-not-allowed'}`}
                                >
                                    Deliver to Selected
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <InputField label="Location Label" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                    <InputField label="Mobile Number" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                    <InputField label="Street Number" value={formData.streetNumber} onChange={e => setFormData({ ...formData, streetNumber: e.target.value })} />
                                    <InputField label="Building" value={formData.buildingNumber} onChange={e => setFormData({ ...formData, buildingNumber: e.target.value })} />
                                    <InputField label="Floor" value={formData.floorNumber} onChange={e => setFormData({ ...formData, floorNumber: e.target.value })} />
                                    <InputField label="Apartment" value={formData.apartmentNumber} onChange={e => setFormData({ ...formData, apartmentNumber: e.target.value })} />
                                    <InputField label="City" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                                    <InputField label="ZIP Code" value={formData.postalCode} onChange={e => setFormData({ ...formData, postalCode: e.target.value })} />
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button onClick={() => setIsAddingNewAddress(false)} className="flex-1 border border-gb py-4 rounded-xl font-bold hover:bg-glass transition-colors text-xs uppercase tracking-widest">Cancel</button>
                                    <button onClick={handleSaveAddressAndContinue} disabled={isAddingAddress} className="flex-1 bg-a text-white py-4 rounded-xl font-bold shadow-lg shadow-(--a)/30 hover:scale-[1.01] transition-all text-xs uppercase tracking-widest">
                                        {isAddingAddress ? "Saving..." : "Save Address"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </Section>

                    {/* VERTICAL STEP CONNECTOR */}
                    <div className="ml-[45px] w-0.5 h-10 bg-linear-to-b from-a to-transparent opacity-60" />

                    {/* STEP 2: PAYMENT */}
                    <Section
                        number="2" title="Payment Details"
                        isActive={step === 2}
                        isCompleted={step > 2}
                        onEdit={() => setStep(2)}
                        summary={step > 2 ? (
                            <div className="flex items-center gap-4 bg-card p-4 rounded-2xl border border-gb capitalize">
                                <div className="w-10 h-10 rounded-full bg-a/10 text-a flex items-center justify-center shrink-0">
                                    <CreditCard size={20} />
                                </div>
                                <div>
                                    <span className="font-bold text-text block">{paymentMethod.replace('-', ' ')}</span>
                                    <span className="text-xs text-text2">Secure Checkout</span>
                                </div>
                            </div>
                        ) : null}
                    >
                        <div className="space-y-3">
                            {[
                                { id: "card", label: "Credit / Debit Card", desc: "Pay securely with Visa or Mastercard", active: true },
                                { id: "paypal", label: "PayPal", desc: "Fast and safe online payment", active: true },
                                { id: "cod", label: "Cash on Delivery", desc: "Pay at your door (Cairo only)", active: isCairo }
                            ].map(option => (
                                <div
                                    key={option.id}
                                    onClick={() => option.active && setPaymentMethod(option.id)}
                                    className={`flex items-center justify-between p-5 border rounded-2xl transition-all duration-300
                                        ${paymentMethod === option.id ? "border-a bg-a/5 ring-1 ring-a" : option.active ? "border-gb bg-card cursor-pointer hover:border-a/30" : "border-gb/50 opacity-40 cursor-not-allowed"}`}
                                >
                                    <div>
                                        <p className={`font-bold ${paymentMethod === option.id ? 'text-a' : 'text-text'}`}>{option.label}</p>
                                        <p className="text-xs text-text2 mt-1">{option.desc}</p>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === option.id ? 'border-a bg-a' : 'border-gb'}`}>
                                        {paymentMethod === option.id && <div className="w-2 h-1.5 rounded-full bg-white" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                            <button onClick={() => setStep(1)} className="py-4 px-8 border border-gb rounded-xl font-bold bg-card hover:bg-gb transition-colors text-xs uppercase tracking-widest text-text">Back</button>
                            <button onClick={() => setStep(3)} className="flex-1 bg-a text-white py-4 rounded-xl font-bold shadow-lg shadow-(--a)/30 hover:scale-[1.01] transition-all text-xs uppercase tracking-widest">Review Order</button>
                        </div>
                    </Section>

                    {/* VERTICAL STEP CONNECTOR */}
                    <div className="ml-[45px] w-0.5 h-10 bg-linear-to-b from-a to-transparent opacity-60" />

                    {/* STEP 3: REVIEW */}
                    <Section
                        number="3" title="Review Your Order"
                        isActive={step === 3}
                        isCompleted={step > 3}
                        onEdit={() => setStep(3)}
                        summary={step > 3 ? (
                            <div className="flex items-center gap-3 text-xs font-bold text-text2 opacity-70">
                                <ShoppingBag size={14} />
                                <span>{cart.cartItems.length} Items Reviewed</span>
                            </div>
                        ) : null}
                    >
                        <div className="space-y-6">
                            <div className="bg-card shadow-inner border border-gb rounded-2xl overflow-hidden divide-y divide-gb max-h-[300px] overflow-y-auto custom-scrollbar">
                                {cart.cartItems.map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-4 p-4 items-center bg-glass hover:bg-ag transition-colors">
                                        <div className="w-12 h-12 bg-white rounded-xl border border-gb p-1 flex shrink-0 items-center justify-center">
                                            <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                                        </div>
                                        <div className="flex-1 min-w-0 pr-2">
                                            <p className="font-bold text-text text-sm truncate">{item.name}</p>
                                            <p className="text-[9px] text-text2 uppercase font-mono tracking-widest mt-0.5 opacity-70">Qty: {item.qty}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-black text-a text-sm">${item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button onClick={() => setStep(2)} className="py-4 px-8 border border-gb rounded-xl font-bold bg-card hover:bg-gb transition-colors text-xs uppercase tracking-widest text-text">Back</button>
                                <button onClick={() => setStep(4)} className="flex-1 bg-text text-bg py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg hover:scale-[1.01]">Continue to Payment</button>
                            </div>
                        </div>
                    </Section>

                    {/* VERTICAL STEP CONNECTOR */}
                    <div className="ml-[45px] w-0.5 h-10 bg-linear-to-b from-a to-transparent opacity-60" />

                    {/* STEP 4: PAY */}
                    <Section
                        number="4" title="Finalize Payment"
                        isActive={step === 4}
                        isCompleted={false}
                    >
                        <div className="absolute right-6 top-6 text-a opacity-10 pointer-events-none">
                            <CreditCard className="w-24 h-24" />
                        </div>

                        <div className="space-y-6 relative z-10">
                            <PaymentRenderer
                                method={paymentMethod}
                                total={cart.totalPrice}
                                cart={cart}
                                address={selectedAddress}
                                onOrderSuccess={handleOrderSuccess}
                            />

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button onClick={() => setStep(3)} className="py-5 px-8 border border-gb rounded-2xl font-bold bg-card hover:bg-gb transition-colors text-xs uppercase tracking-widest text-text">Back</button>
                                {paymentMethod === 'cod' && (
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={isCreatingOrder}
                                        className="flex-1 flex items-center justify-center gap-3 bg-a text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-[0_4px_24px_rgba(0,128,255,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(0,128,255,0.4)] disabled:opacity-50"
                                    >
                                        <ShoppingBag size={18} />
                                        {isCreatingOrder ? "Placing Order..." : "Place Order"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </Section>

                </div>

                {/* RIGHT */}
                <div className="sticky top-6 h-fit">
                    <OrderSummary cart={cart} />
                </div>

            </div>
        </div>
        </Elements>
        </PayPalScriptProvider>
    )
}