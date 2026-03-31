import { useState, useEffect } from "react"
import { X, Plus, Trash2, Layout, Image as ImageIcon, Cpu, Palette, Box, Tag, Shield, Truck } from "lucide-react"
import { useGetCategoriesQuery } from "@/slices/categoryApiSlice"

interface ProductModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (formData: any) => void
    initialData?: any
}

const TABS = [
    { id: 'basic', label: 'Identity', icon: Layout },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'pricing', label: 'Pricing & Stock', icon: Tag },
    { id: 'specs', label: 'Technical Specs', icon: Cpu },
    { id: 'variants', label: 'Variants & Colors', icon: Palette },
    { id: 'shipping', label: 'Shipping & Box', icon: Truck },
]

export default function ProductModal({ isOpen, onClose, onSubmit, initialData }: ProductModalProps) {
    const { data: categoriesData } = useGetCategoriesQuery()
    const [activeTab, setActiveTab] = useState('basic')
    const [formData, setFormData] = useState<any>({
        name: "",
        slug: "",
        sku: "",
        brand: "",
        category: "",
        badge: "",
        tags: "",
        description: "",
        price: 0,
        originalPrice: 0,
        currency: "USD",
        countInStock: 0,
        images: [],
        colors: [],
        quickSpecs: [],
        specs: [],
        boxItems: [],
        variantGroups: [],
        warrantyYears: 1,
        returnDays: 30
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                category: initialData.category?._id || initialData.category || "",
                tags: Array.isArray(initialData.tags) ? initialData.tags.join(", ") : initialData.tags || ""
            })
        } else {
            setFormData({
                name: "",
                slug: "",
                sku: "",
                brand: "",
                category: "",
                badge: "",
                tags: "",
                description: "",
                price: 0,
                originalPrice: 0,
                currency: "USD",
                countInStock: 0,
                images: [],
                colors: [],
                quickSpecs: [],
                specs: [],
                boxItems: [],
                variantGroups: [],
                warrantyYears: 1,
                returnDays: 30
            })
        }
    }, [initialData, isOpen])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev: any) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        // Remove internal fields that shouldn't be sent to the backend
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { user, _id, __v, createdAt, updatedAt, ...cleanData } = formData

        const submissionData = {
            ...cleanData,
            tags: typeof formData.tags === 'string' 
                ? formData.tags.split(",").map((t: string) => t.trim()).filter(Boolean) 
                : formData.tags
        }
        onSubmit(submissionData)
    }

    if (!isOpen) return null

    const addRow = (field: string, defaultValue: any) => {
        setFormData((prev: { [x: string]: any }) => ({ ...prev, [field]: [...prev[field], defaultValue] }))
    }

    const updateRow = (field: string, index: number, value: any) => {
        const newArr = [...formData[field]]
        newArr[index] = { ...newArr[index], ...value }
        setFormData((prev: any) => ({ ...prev, [field]: newArr }))
    }

    const removeRow = (field: string, index: number) => {
        setFormData((prev: any) => ({ ...prev, [field]: prev[field].filter((_: any, i: number) => i !== index) }))
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0a0a1a]/80 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-gb flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gb bg-surf2">
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-bebas tracking-widest text-text">
                            {initialData ? 'Update Terminal' : 'Initialize Product'}
                        </h2>
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted opacity-60">
                            {initialData ? `Editing CID-${initialData._id.slice(-6)}` : 'Catalog Protocol Alpha'}
                        </span>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full border border-gb flex items-center justify-center hover:bg-a2 hover:text-white hover:border-a2 transition-all group">
                        <X size={18} className="group-hover:rotate-90 transition-transform" />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-64 bg-surf2 border-r border-gb flex flex-col py-6">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-4 px-8 py-4 transition-all relative ${activeTab === tab.id ? 'text-a bg-white ring-1 ring-inset ring-gb' : 'text-muted hover:text-text hover:bg-white/50'
                                    }`}
                            >
                                <tab.icon size={18} />
                                <span className="text-[11px] font-bold uppercase tracking-widest">{tab.label}</span>
                                {activeTab === tab.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-a" />}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col bg-white overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-10 font-sans">
                            {activeTab === 'basic' && (
                                <div className="grid grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex flex-col gap-2 col-span-2">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Product Name</label>
                                        <input required name="name" value={formData.name} onChange={handleChange} className="bg-surf2 border border-gb rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-a/20 focus:border-a transition-all font-medium text-text" placeholder="e.g. Nexus Pro M4" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Slug (URL)</label>
                                        <input required name="slug" value={formData.slug} onChange={handleChange} className="bg-surf2 border border-gb rounded-xl px-5 py-3 font-mono text-xs focus:ring-a/20" placeholder="nexus-pro-m4" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted">SKU (External ID)</label>
                                        <input name="sku" value={formData.sku} onChange={handleChange} className="bg-surf2 border border-gb rounded-xl px-5 py-3 font-mono text-xs focus:ring-a/20" placeholder="NX-PM4-2025" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Brand</label>
                                        <input required name="brand" value={formData.brand} onChange={handleChange} className="bg-surf2 border border-gb rounded-xl px-5 py-3 font-medium transition-all" placeholder="e.g. Apple" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Category</label>
                                        <select required name="category" value={formData.category} onChange={handleChange} className="bg-surf2 border border-gb rounded-xl px-5 py-3 font-medium focus:ring-a/20 outline-none">
                                            <option value="">Select Category</option>
                                            {categoriesData?.result?.map((cat: any) => (
                                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Status Badge</label>
                                        <input name="badge" value={formData.badge} onChange={handleChange} className="bg-surf2 border border-gb rounded-xl px-5 py-3 font-medium" placeholder="New / Hot / −15%" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Tags (Comma Separated)</label>
                                        <input name="tags" value={formData.tags} onChange={handleChange} className="bg-surf2 border border-gb rounded-xl px-5 py-3 font-medium" placeholder="laptop, m4, apple" />
                                    </div>
                                    <div className="flex flex-col gap-2 col-span-2">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Short Description</label>
                                        <textarea required name="description" value={formData.description} onChange={handleChange} rows={3} className="bg-surf2 border border-gb rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-a/20 transition-all font-medium text-sm" placeholder="Summarize for SEO and grid layout..." />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'media' && (
                                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bebas tracking-widest text-text">Visual Asset Pipeline</h3>
                                        <button type="button" onClick={() => addRow('images', { url: '', alt: '', isPrimary: false })} className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-a bg-ag px-4 py-2 rounded-lg border border-a/20 hover:bg-a hover:text-white transition-all">
                                            <Plus size={14} /> Attach Asset
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {formData.images.map((img: any, idx: number) => (
                                            <div key={idx} className="p-5 border border-gb rounded-2xl bg-surf2 flex flex-col gap-4 relative group">
                                                <button type="button" onClick={() => removeRow('images', idx)} className="absolute top-4 right-4 text-a2 bg-white rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 size={12} />
                                                </button>
                                                <input value={img.url} onChange={e => updateRow('images', idx, { url: e.target.value })} className="bg-white border border-gb rounded-lg px-3 py-2 text-xs font-mono" placeholder="Image URL" />
                                                <input value={img.alt} onChange={e => updateRow('images', idx, { alt: e.target.value })} className="bg-white border border-gb rounded-lg px-3 py-2 text-xs" placeholder="Alt Text" />
                                                <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest cursor-pointer">
                                                    <input type="radio" checked={img.isPrimary} onChange={() => {
                                                        const newImgs = formData.images.map((img: any, i: number) => ({ ...img, isPrimary: i === idx }))
                                                        setFormData((prev: any) => ({ ...prev, images: newImgs }))
                                                    }} className="text-a" /> Master View
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'pricing' && (
                                <div className="grid grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Current Price</label>
                                        <div className="relative">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 font-mono text-muted">$</span>
                                            <input required type="number" name="price" value={formData.price} onChange={handleChange} className="bg-surf2 border border-gb rounded-xl pl-10 pr-5 py-3 font-bebas text-2xl w-full text-a" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Original Price (Strike-through)</label>
                                        <div className="relative">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 font-mono text-muted">$</span>
                                            <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="bg-surf2 border border-gb rounded-xl pl-10 pr-5 py-3 font-bebas text-lg w-full text-muted" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Currency</label>
                                        <input name="currency" value={formData.currency} onChange={handleChange} className="bg-surf2 border border-gb rounded-xl px-5 py-3 font-mono text-sm" placeholder="USD" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Inventory Count</label>
                                        <input required type="number" name="countInStock" value={formData.countInStock} onChange={handleChange} className="bg-surf2 border border-gb rounded-xl px-5 py-3 font-bebas text-2xl text-text2" />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'specs' && (
                                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-[12px] font-bebas tracking-widest text-text">Quick Specs (Hero Display)</h3>
                                            {formData.quickSpecs.length < 4 && (
                                                <button type="button" onClick={() => addRow('quickSpecs', { icon: '⚡', label: '', value: '' })} className="text-[9px] font-mono uppercase tracking-widest text-a">+ Add Hero Spec</button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {formData.quickSpecs.map((spec: any, idx: number) => (
                                                <div key={idx} className="flex gap-2 items-center bg-surf2 p-3 rounded-xl border border-gb">
                                                    <input value={spec.icon} onChange={e => updateRow('quickSpecs', idx, { icon: e.target.value })} className="w-10 bg-white rounded border border-gb p-2 text-center" />
                                                    <input value={spec.label} onChange={e => updateRow('quickSpecs', idx, { label: e.target.value })} className="flex-1 bg-white rounded border border-gb p-2 text-[10px] uppercase font-mono" placeholder="Label" />
                                                    <input value={spec.value} onChange={e => updateRow('quickSpecs', idx, { value: e.target.value })} className="flex-1 bg-white rounded border border-gb p-2 text-[10px] font-bold" placeholder="Value" />
                                                    <button type="button" onClick={() => removeRow('quickSpecs', idx)} className="text-a2 p-1"><Trash2 size={12} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-[12px] font-bebas tracking-widest text-text">Full Specifications Grid</h3>
                                            <button type="button" onClick={() => addRow('specs', { icon: '🧠', label: '', value: '', description: '' })} className="text-[9px] font-mono uppercase tracking-widest text-a">+ Add Spec Card</button>
                                        </div>
                                        {formData.specs.map((spec: any, idx: number) => (
                                            <div key={idx} className="grid grid-cols-4 gap-2 items-start bg-surf2 p-4 rounded-xl border border-gb relative group">
                                                <button type="button" onClick={() => removeRow('specs', idx)} className="absolute -top-2 -right-2 bg-white text-a2 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity border border-gb"><Trash2 size={10} /></button>
                                                <input value={spec.icon} onChange={e => updateRow('specs', idx, { icon: e.target.value })} className="w-full bg-white rounded border border-gb p-2 text-center" />
                                                <div className="col-span-3 grid grid-cols-2 gap-2">
                                                    <input value={spec.label} onChange={e => updateRow('specs', idx, { label: e.target.value })} className="bg-white rounded border border-gb p-2 text-[10px] uppercase font-mono" placeholder="LABEL" />
                                                    <input value={spec.value} onChange={e => updateRow('specs', idx, { value: e.target.value })} className="bg-white rounded border border-gb p-2 text-[10px] font-bold" placeholder="DISPLAY VALUE" />
                                                    <textarea value={spec.description} onChange={e => updateRow('specs', idx, { description: e.target.value })} className="col-span-2 bg-white rounded border border-gb p-2 text-[10px] leading-relaxed" placeholder="Detailed description..." rows={2} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'variants' && (
                                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-[12px] font-bebas tracking-widest text-text">Color Configuration</h3>
                                            <button type="button" onClick={() => addRow('colors', { name: '', hex: '#000000' })} className="text-[9px] font-mono uppercase tracking-widest text-a">+ Material/Color</button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            {formData.colors.map((color: any, idx: number) => (
                                                <div key={idx} className="flex gap-2 items-center bg-surf2 p-3 rounded-xl border border-gb">
                                                    <input type="color" value={color.hex} onChange={e => updateRow('colors', idx, { hex: e.target.value })} className="w-8 h-8 rounded-full border-0 bg-transparent cursor-pointer" />
                                                    <input value={color.name} onChange={e => updateRow('colors', idx, { name: e.target.value })} className="flex-1 bg-white rounded border border-gb px-2 py-1 text-[10px] font-bold" placeholder="Color Name" />
                                                    <button type="button" onClick={() => removeRow('colors', idx)} className="text-a2"><Trash2 size={12} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-[12px] font-bebas tracking-widest text-text">Variant Groups (Storage, Memory, etc.)</h3>
                                            <button type="button" onClick={() => addRow('variantGroups', { name: '', options: [] })} className="text-[9px] font-mono uppercase tracking-widest text-a">+ Add Group</button>
                                        </div>
                                        {formData.variantGroups.map((group: any, idx: number) => (
                                            <div key={idx} className="p-5 bg-surf2 rounded-2xl border border-gb flex flex-col gap-4 relative">
                                                <button type="button" onClick={() => removeRow('variantGroups', idx)} className="absolute top-4 right-4 text-a2"><Trash2 size={14} /></button>
                                                <div className="flex flex-col gap-1 w-2/3">
                                                    <label className="text-[9px] font-mono uppercase text-muted tracking-widest">Group Label</label>
                                                    <input value={group.name} onChange={e => updateRow('variantGroups', idx, { name: e.target.value })} className="bg-white border border-gb rounded-lg px-3 py-2 text-xs font-bold" placeholder="e.g. Storage Capacity" />
                                                </div>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {group.options.map((opt: any, oIdx: number) => (
                                                        <div key={oIdx} className="grid grid-cols-4 gap-2 items-center bg-white p-2 rounded-lg border border-gb">
                                                            <input value={opt.label} onChange={e => {
                                                                const opts = [...group.options]; opts[oIdx].label = e.target.value; updateRow('variantGroups', idx, { options: opts })
                                                            }} className="bg-surf2 rounded px-2 py-1 text-[10px]" placeholder="Label (512GB)" />
                                                            <input value={opt.value} onChange={e => {
                                                                const opts = [...group.options]; opts[oIdx].value = e.target.value; updateRow('variantGroups', idx, { options: opts })
                                                            }} className="bg-surf2 rounded px-2 py-1 text-[10px] font-mono" placeholder="Value (512gb)" />
                                                            <input type="number" value={opt.priceModifier} onChange={e => {
                                                                const opts = [...group.options]; opts[oIdx].priceModifier = Number(e.target.value); updateRow('variantGroups', idx, { options: opts })
                                                            }} className="bg-surf2 rounded px-2 py-1 text-[10px]" placeholder="+ Price" />
                                                            <div className="flex items-center justify-end gap-2">
                                                                <input type="checkbox" checked={opt.inStock} onChange={e => {
                                                                    const opts = [...group.options]; opts[oIdx].inStock = e.target.checked; updateRow('variantGroups', idx, { options: opts })
                                                                }} />
                                                                <button type="button" onClick={() => {
                                                                    const opts = group.options.filter((_: any, i: number) => i !== oIdx); updateRow('variantGroups', idx, { options: opts })
                                                                }} className="text-a2"><Trash2 size={10} /></button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <button type="button" onClick={() => {
                                                        const opts = [...group.options, { label: '', value: '', priceModifier: 0, inStock: true }]; updateRow('variantGroups', idx, { options: opts })
                                                    }} className="text-[9px] font-mono uppercase tracking-widest text-text2 opacity-60 hover:opacity-100">+ Add Option</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'shipping' && (
                                <div className="grid grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Returns Policy (Days)</label>
                                        <input type="number" name="returnDays" value={formData.returnDays} onChange={handleChange} className="bg-surf2 border border-gb rounded-xl px-5 py-3 font-bebas text-2xl" placeholder="30" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Warranty Period (Years)</label>
                                        <input type="number" name="warrantyYears" value={formData.warrantyYears} onChange={handleChange} className="bg-surf2 border border-gb rounded-xl px-5 py-3 font-bebas text-2xl" placeholder="1" />
                                    </div>

                                    <div className="col-span-2 flex flex-col gap-4 mt-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bebas tracking-widest text-text">In The Box Items</h3>
                                            <button type="button" onClick={() => addRow('boxItems', { icon: '🎁', name: '', quantity: '×1' })} className="text-[9px] font-mono uppercase tracking-widest text-a">+ Component</button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {formData.boxItems.map((item: any, idx: number) => (
                                                <div key={idx} className="flex gap-2 items-center bg-surf2 p-3 rounded-xl border border-gb relative group">
                                                    <input value={item.icon} onChange={e => updateRow('boxItems', idx, { icon: e.target.value })} className="w-10 bg-white rounded border border-gb p-2 text-center" />
                                                    <input value={item.name} onChange={e => updateRow('boxItems', idx, { name: e.target.value })} className="flex-1 bg-white rounded border border-gb px-3 py-2 text-[10px] font-bold" placeholder="Item Name" />
                                                    <input value={item.quantity} onChange={e => updateRow('boxItems', idx, { quantity: e.target.value })} className="w-14 bg-white rounded border border-gb px-2 py-2 text-[10px] font-mono text-center" placeholder="×1" />
                                                    <button type="button" onClick={() => removeRow('boxItems', idx)} className="text-a2 p-1"><Trash2 size={12} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-10 py-6 border-t border-gb bg-surf2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full animate-pulse ${initialData ? 'bg-a' : 'bg-a3'}`} />
                                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted">
                                    System Ready: Proceed with {initialData ? 'Modification' : 'Creation'}
                                </span>
                            </div>
                            <div className="flex gap-4">
                                <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl border border-gb text-[11px] font-bold uppercase tracking-widest hover:bg-white transition-all">Cancel</button>
                                <button type="submit" className="px-10 py-3 rounded-xl bg-a text-white text-[11px] font-bold uppercase tracking-widest hover:shadow-lg hover:shadow-a/30 hover:-translate-y-0.5 transition-all">
                                    {initialData ? 'Commit Changes' : 'Execute Initializer'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
