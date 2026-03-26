import { useState } from "react"
import { useGetCartQuery } from "@/slices/cartApiSlice"
import { useGetProfileQuery, useAddAddressMutation } from "@/slices/usersApiSlice"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

import CheckoutSection from "@/pages/checkout/components/CheckoutSection"
import InputField from "@/Components/InputField"
import OrderSummary from "@/pages/checkout/components/OrderSummary"
import StepIndicator from "@/pages/checkout/components/StepIndicator"
import { MapPin, Plus, CreditCard, AlertCircle, ShoppingBag } from "lucide-react"
import PaymentRenderer from "@/pages/checkout/components/PaymentRenderer"

export default function Checkout() {
    const { data: cart, isLoading } = useGetCartQuery()
    const { data: user } = useGetProfileQuery()
    const [addAddress, { isLoading: isAddingAddress }] = useAddAddressMutation()
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

    const handlePlaceOrder = () => {
        if (!selectedAddress) return toast.error("Please select a shipping address")
        console.log("PLACE ORDER PAYLOAD", { selectedAddress, paymentMethod, cart })
        toast.success("Order Placed Successfully! (Simulation)")
        navigate('/') // Simulation redirect
    }

    return (
        <div className="container mx-auto py-8 md:py-12 px-4 max-w-7xl font-body">

            {/* STEP INDICATOR */}
            <StepIndicator step={step} />

            <div className="grid lg:grid-cols-[1fr_400px] gap-8">

                {/* LEFT */}
                <div className="space-y-6">

                    {/* STEP 1: SHIPPING */}
                    <CheckoutSection 
                       number="1" title="Shipping Address" 
                       isActive={step === 1} 
                       isCompleted={step > 1}
                       onEdit={() => setStep(1)}
                       summary={selectedAddress ? (
                           <div className="flex items-center gap-4 bg-[var(--card)] p-4 rounded-2xl border border-[var(--gb)]">
                               <div className="w-10 h-10 rounded-full bg-[var(--a)]/10 text-[var(--a)] flex items-center justify-center shrink-0">
                                   <MapPin size={20} />
                               </div>
                               <div>
                                   <p className="font-bold text-[var(--text)]">{selectedAddress.title}</p>
                                   <p className="text-xs text-[var(--text2)] leading-relaxed">{selectedAddress.address[0]?.streetNumber} {selectedAddress.address[0]?.buildingNumber}, {selectedAddress.address[0]?.city}</p>
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
                                                    ${selectedAddressIndex === idx ? 'border-[var(--a)] bg-[var(--a)]/5 shadow-[0_4px_20px_rgba(0,128,255,0.15)] ring-1 ring-[var(--a)]' : 'border-[var(--gb)] bg-[var(--card)] hover:border-[var(--a)]/30'}`}
                                            >
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <p className={`font-black uppercase tracking-widest text-xs ${selectedAddressIndex === idx ? 'text-[var(--a)]' : 'text-[var(--text)]'}`}>{del.title}</p>
                                                        {selectedAddressIndex === idx && <span className="w-5 h-5 rounded-full bg-[var(--a)] text-white flex items-center justify-center text-[10px]">✓</span>}
                                                    </div>
                                                    <p className="text-sm font-semibold mt-2">{del.address[0]?.streetNumber} {del.address[0]?.buildingNumber}</p>
                                                    <p className="text-xs text-[var(--text2)] mt-1">{del.address[0]?.city}, {del.address[0]?.country}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <div 
                                            onClick={() => setIsAddingNewAddress(true)}
                                            className="p-5 rounded-2xl border border-dashed border-[var(--gb)] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[var(--glass)] transition-all min-h-[140px]"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-[var(--gb)] flex items-center justify-center">
                                                <Plus size={18} className="text-[var(--text2)]" />
                                            </div>
                                            <span className="text-sm font-bold text-[var(--text2)]">Add New Address</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 border border-dashed border-[var(--gb)] rounded-3xl bg-[var(--card)]">
                                        <MapPin className="mx-auto mb-4 opacity-20" size={40} />
                                        <p className="text-[var(--text2)] mb-4 font-mono text-xs uppercase tracking-widest">No existing locations.</p>
                                        <button onClick={() => setIsAddingNewAddress(true)} className="bg-[var(--glass)] border border-[var(--gb)] px-8 py-3 rounded-full text-sm font-bold hover:bg-[var(--gb)] transition-colors shadow-sm text-[var(--text)]">Add New Address</button>
                                    </div>
                                )}
                                
                                <button
                                    disabled={selectedAddressIndex === null}
                                    onClick={() => setStep(2)}
                                    className={`mt-6 w-full py-4 rounded-xl font-bold transition-all uppercase tracking-widest text-[11px] sm:text-xs ${selectedAddressIndex !== null ? 'bg-[var(--a)] text-white hover:scale-[1.01] shadow-lg shadow-[var(--a)]/20' : 'bg-[var(--gb)] text-[var(--muted)] cursor-not-allowed'}`}
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
                                    <button onClick={() => setIsAddingNewAddress(false)} className="flex-1 border border-[var(--gb)] py-4 rounded-xl font-bold hover:bg-[var(--glass)] transition-colors text-xs uppercase tracking-widest">Cancel</button>
                                    <button onClick={handleSaveAddressAndContinue} disabled={isAddingAddress} className="flex-1 bg-[var(--a)] text-white py-4 rounded-xl font-bold shadow-lg shadow-[var(--a)]/30 hover:scale-[1.01] transition-all text-xs uppercase tracking-widest">
                                        {isAddingAddress ? "Saving..." : "Save Address"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </CheckoutSection>

                    {/* VERTICAL STEP CONNECTOR */}
                    <div className="ml-[45px] w-0.5 h-10 bg-linear-to-b from-a to-transparent opacity-60" />

                    {/* STEP 2: PAYMENT */}
                    <CheckoutSection 
                       number="2" title="Payment Details" 
                       isActive={step === 2} 
                       isCompleted={step > 2}
                       onEdit={() => setStep(2)}
                       summary={step > 2 ? (
                           <div className="flex items-center gap-4 bg-[var(--card)] p-4 rounded-2xl border border-[var(--gb)] capitalize">
                               <div className="w-10 h-10 rounded-full bg-[var(--a)]/10 text-[var(--a)] flex items-center justify-center shrink-0">
                                   <CreditCard size={20} />
                               </div>
                               <div>
                                   <span className="font-bold text-[var(--text)] block">{paymentMethod.replace('-', ' ')}</span>
                                   <span className="text-xs text-[var(--text2)]">Secure Checkout</span>
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
                                        ${paymentMethod === option.id ? "border-[var(--a)] bg-[var(--a)]/5 ring-1 ring-[var(--a)]" : option.active ? "border-[var(--gb)] bg-[var(--card)] cursor-pointer hover:border-[var(--a)]/30" : "border-[var(--gb)]/50 opacity-40 cursor-not-allowed"}`}
                                >
                                    <div>
                                        <p className={`font-bold ${paymentMethod === option.id ? 'text-[var(--a)]' : 'text-[var(--text)]'}`}>{option.label}</p>
                                        <p className="text-xs text-[var(--text2)] mt-1">{option.desc}</p>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === option.id ? 'border-[var(--a)] bg-[var(--a)]' : 'border-[var(--gb)]'}`}>
                                        {paymentMethod === option.id && <div className="w-2 h-1.5 rounded-full bg-white" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                            <button onClick={() => setStep(1)} className="py-4 px-8 border border-[var(--gb)] rounded-xl font-bold bg-[var(--card)] hover:bg-[var(--gb)] transition-colors text-xs uppercase tracking-widest text-[var(--text)]">Back</button>
                            <button onClick={() => setStep(3)} className="flex-1 bg-[var(--a)] text-white py-4 rounded-xl font-bold shadow-lg shadow-[var(--a)]/30 hover:scale-[1.01] transition-all text-xs uppercase tracking-widest">Review Order</button>
                        </div>
                    </CheckoutSection>

                    {/* VERTICAL STEP CONNECTOR */}
                    <div className="ml-[45px] w-0.5 h-10 bg-linear-to-b from-a to-transparent opacity-60" />

                    {/* STEP 3: REVIEW & SUBMIT */}
                    <CheckoutSection 
                       number="3" title="Review Your Order" 
                       isActive={step === 3} 
                       isCompleted={false}
                    >
                        <div className="absolute right-6 top-6 text-[var(--a)] opacity-10 pointer-events-none">
                            <AlertCircle className="w-24 h-24" />
                        </div>
                        
                        <div className="space-y-6 relative z-10">
                            <div className="bg-[var(--card)] shadow-inner border border-[var(--gb)] rounded-2xl overflow-hidden divide-y divide-[var(--gb)] max-h-[400px] overflow-y-auto custom-scrollbar">
                                {cart.cartItems.map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-4 p-4 items-center bg-[var(--glass)] hover:bg-[var(--ag)] transition-colors">
                                        <div className="w-16 h-16 bg-white rounded-xl border border-[var(--gb)] p-2 flex shrink-0 items-center justify-center">
                                            <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                                        </div>
                                        <div className="flex-1 min-w-0 pr-2">
                                            <p className="font-bold text-[var(--text)] truncate">{item.name}</p>
                                            <p className="text-[10px] text-[var(--text2)] uppercase font-mono tracking-widest mt-1 opacity-70">Quantity: {item.qty}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-black text-[var(--a)]">{item.price}</p>
                                            <p className="text-[10px] text-[var(--text2)] uppercase font-mono tracking-widest mt-1 opacity-70">EGP</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <PaymentRenderer
                                method={paymentMethod}
                                total={cart.totalPrice}
                            />

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button onClick={() => setStep(2)} className="py-5 px-8 border border-[var(--gb)] rounded-2xl font-bold bg-[var(--card)] hover:bg-[var(--gb)] transition-colors text-xs uppercase tracking-widest text-[var(--text)]">Back</button>
                                <button
                                    onClick={handlePlaceOrder}
                                    className="flex-1 flex items-center justify-center gap-3 bg-[var(--text)] text-[var(--bg)] py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
                                >
                                    <ShoppingBag size={18} />
                                    Place Order
                                </button>
                            </div>
                        </div>
                    </CheckoutSection>

                </div>

                {/* RIGHT */}
                <div className="sticky top-6 h-fit">
                    <OrderSummary cart={cart} />
                </div>

            </div>
        </div>
    )
}