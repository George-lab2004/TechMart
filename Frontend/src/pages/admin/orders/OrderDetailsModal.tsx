import { X, User, MapPin, CreditCard, Calendar, ShoppingBag, Info } from 'lucide-react'
import { type IOrder } from '@/slices/ordersApiSlice'

interface OrderDetailsModalProps {
  order: IOrder
  onClose: () => void
}

const OrderDetailsModal = ({ order, onClose }: OrderDetailsModalProps) => {
  if (!order) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200'
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-blue-100 text-blue-700 border-blue-200'
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gb animate-in zoom-in-95 fade-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gb bg-surf2/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight text-text">ORDER #{order.orderNumber}</h2>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted font-mono">
              <Calendar size={12} />
              <span>{new Date(order.createdAt).toLocaleString()}</span>
              <span className="opacity-20">|</span>
              <span className="opacity-60 uppercase">{order._id}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-black/5 rounded-full transition-colors text-muted hover:text-text"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[75vh] p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Left Column: Logistics */}
            <div className="flex flex-col gap-8">
              
              {/* Customer Info */}
              <section>
                <div className="flex items-center gap-2 mb-4 text-a">
                  <User size={18} />
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Customer Profile</h3>
                </div>
                <div className="bg-surf/30 p-5 rounded-2xl border border-gb/50 space-y-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-muted font-bold">Full Name</span>
                    <span className="text-sm font-semibold">{order.user.name}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-muted font-bold">Email Address</span>
                    <span className="text-sm font-mono">{order.user.email}</span>
                  </div>
                </div>
              </section>

              {/* Shipping Details */}
              <section>
                <div className="flex items-center gap-2 mb-4 text-a">
                  <MapPin size={18} />
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Shipping Logistics</h3>
                </div>
                <div className="bg-surf/30 p-5 rounded-2xl border border-gb/50 space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-muted font-bold">Street / Bldg</span>
                      <span>{order.shippingAddress.buildingNumber} {order.shippingAddress.streetNumber}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-muted font-bold">Floor / Apt</span>
                      <span>Floor {order.shippingAddress.floorNumber}, Apt {order.shippingAddress.apartmentNumber}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-muted font-bold">Location</span>
                      <span>{order.shippingAddress.city}, {order.shippingAddress.country}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-muted font-bold">Postal Code</span>
                      <span className="font-mono">{order.shippingAddress.postalCode}</span>
                    </div>
                  </div>
                  {order.shippingAddress.landmark && (
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-muted font-bold">Landmark</span>
                      <span>{order.shippingAddress.landmark}</span>
                    </div>
                  )}
                  {order.shippingAddress.notes && (
                    <div className="flex flex-col pt-2 border-t border-gb/50">
                      <span className="text-[10px] uppercase tracking-widest text-muted font-bold italic opacity-60">Delivery Instructions</span>
                      <p className="text-xs italic opacity-80 mt-1">{order.shippingAddress.notes}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Payment Info */}
              <section>
                <div className="flex items-center gap-2 mb-4 text-a">
                  <CreditCard size={18} />
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Payment Manifest</h3>
                </div>
                <div className="bg-surf/30 p-5 rounded-2xl border border-gb/50 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-muted font-bold">Method</span>
                    <span className="text-sm font-bold uppercase tracking-widest text-a">{order.paymentMethod}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest text-muted font-bold text-right">Status</span>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${order.isPaid ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                      {order.isPaid ? 'Payment Confirmed' : 'Awaiting Payment'}
                    </span>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Order Items */}
            <div className="flex flex-col gap-8">
              <section>
                <div className="flex items-center gap-2 mb-4 text-a">
                  <ShoppingBag size={18} />
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Items Manifest</h3>
                </div>
                <div className="border border-gb rounded-2xl overflow-hidden bg-surf/10">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surf2 text-[10px] uppercase tracking-widest font-bold text-muted border-b border-gb">
                      <tr>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3 text-center">Qty</th>
                        <th className="px-4 py-3 text-right">Unit</th>
                        <th className="px-4 py-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gb">
                      {order.orderItems.map((item, idx) => (
                        <tr key={idx} className="group hover:bg-black/[0.02] transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-10 h-10 rounded-lg object-cover bg-white border border-gb group-hover:scale-105 transition-transform shadow-sm"
                              />
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-text line-clamp-1">{item.name}</span>
                                <span className="text-[9px] opacity-40 font-mono uppercase truncate w-24">{item.productID}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center font-mono text-xs">×{item.qty}</td>
                          <td className="px-4 py-3 text-right font-mono text-xs">${item.price.toFixed(0)}</td>
                          <td className="px-4 py-3 text-right font-bold text-xs">${(item.price * item.qty).toFixed(0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Financial Breakdown */}
                <div className="mt-6 space-y-3 px-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted tracking-wide">SUBTOTAL</span>
                    <span className="font-mono font-bold">${order.itemsPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted tracking-wide">ESTIMATED TAX (15%)</span>
                    <span className="font-mono font-bold">${order.taxPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted tracking-wide">SHIPPING & HANDLING</span>
                    <span className="font-mono font-bold">
                      {order.shippingPrice === 0 ? <span className="text-green-600 tracking-tighter uppercase font-bold text-xs">FREE SHIPPING</span> : `$${order.shippingPrice.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gb/60 flex justify-between items-center text-lg">
                    <span className="font-black tracking-widest text-text">TOTAL</span>
                    <span className="font-bebas text-2xl tracking-[0.1em] text-a">${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </section>

              {/* Internal Metadata */}
              <section className="mt-auto">
                <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100 flex items-start gap-3">
                  <Info size={16} className="text-orange-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-orange-900 leading-relaxed font-medium">
                    Transaction snapshots are immutable. Changes to the user profile or product listing 
                    after this timestamp will not affect this historical record.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gb bg-bg flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-8 py-2.5 rounded-xl border border-gb text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 transition-all outline-none"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsModal
