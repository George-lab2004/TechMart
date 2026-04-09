import { useState } from "react"
import toast from "react-hot-toast"
import type { Product } from "@/pages/Products/components/ProductCard"
import {
    useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} from "@/slices/productApiSlice"
import ProductModal from "./components/ProductModal"
import AdminStatCard from "../components/AdminStatCard"
import AdminTable from "../components/AdminTable"
import AdminHeader from "../components/AdminHeader"
import { useGetCategoriesQuery } from "@/slices/categoryApiSlice"

function Products() {
    const { data, isLoading, error } = useGetProductsQuery()
    const { data: categoriesData } = useGetCategoriesQuery()
    const [createProduct] = useCreateProductMutation()
    const [updateProduct] = useUpdateProductMutation()
    const [deleteProduct] = useDeleteProductMutation()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    // Filter & Sort State
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    const [selectedBrand, setSelectedBrand] = useState("")
    const [sortBy, setSortBy] = useState("newest")

    if (isLoading) return <div className="p-8 text-center font-bebas text-2xl tracking-widest opacity-20 animate-pulse">Synchronizing Data...</div>
    if (error) return <div className="p-8 text-center text-a2 font-mono text-xs text-red-500">Error loading products catalog.</div>

    const products: Product[] = data?.result ?? [];

    // Stats calculation
    const productsCount = products.length
    const inStockCount = products.filter((product) => product.countInStock > 0).length
    const outOfStockCount = products.filter((product) => product.countInStock === 0).length
    const LowStock = products.filter((product) => product.countInStock < 5).length

    // Filter Logic
    const brands = Array.from(new Set(products.map(p => p.brand))).sort()
    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (product.slug && product.slug.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesCategory = selectedCategory
            ? (product.category?._id === selectedCategory || product?.category?.name === selectedCategory)
            : true

        const matchesBrand = selectedBrand ? product.brand === selectedBrand : true

        return matchesSearch && matchesCategory && matchesBrand
    }).sort((a: any, b: any) => {
        if (sortBy === "priceLowHigh") return a.price - b.price
        if (sortBy === "priceHighLow") return b.price - a.price
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    })

    const handleOpenModal = (product: Product | null = null) => {
        setSelectedProduct(product)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setSelectedProduct(null)
        setIsModalOpen(false)
    }

    const handleModalSubmit = async (formData: any) => {
        try {
            if (selectedProduct) {
                await updateProduct({ id: selectedProduct._id, data: formData }).unwrap()
                toast.success("Product updated successfully!")
            } else {
                await createProduct(formData).unwrap()
                toast.success("Product added to catalog!")
            }
            handleCloseModal()
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to save product")
            console.error("Failed to save product:", err)
        }
    }

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this product? This action is irreversible. 🚨")) {
            try {
                await deleteProduct(id).unwrap()
                toast.success("Product removed from catalog")
            } catch (err: any) {
                toast.error(err?.data?.message || "Delete failed")
                console.error("Failed to delete product:", err)
            }
        }
    }

    return (
        <>
            <AdminHeader 
                title="Products" 
                description="Manage your products" 
                buttonText="+ Add Product"
                onButtonClick={() => handleOpenModal()}
            />

            <div className="flex flex-wrap gap-5 justify-center mb-8">
                <AdminStatCard label="Total Products" value={productsCount} />
                <AdminStatCard label="In Stock" value={inStockCount} textClass="text-a3" />
                <AdminStatCard label="Low Stock" value={LowStock} textClass="text-orange-600" />
                <AdminStatCard label="Out of Stock" value={outOfStockCount} textClass="text-red-700" />
            </div>

            <AdminTable
                headers={[
                    "#", "Product", "SKU / Slug", "Category", "Brand", "Price",
                    "Stock", "Rating", "Reviews", "Badge", "Warranty", "Return",
                    "Colors", "Tags", "Sales", "Actions"
                ]}
                data={filteredProducts}
                isLoading={isLoading}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filters={[
                    {
                        label: "Category",
                        value: selectedCategory,
                        onChange: setSelectedCategory,
                        options: categoriesData?.result?.map((c: any) => ({ label: c.name, value: c._id })) || []
                    },
                    {
                        label: "Brand",
                        value: selectedBrand,
                        onChange: setSelectedBrand,
                        options: brands.map(b => ({ label: b, value: b }))
                    }
                ]}
                sortConfig={{
                    value: sortBy,
                    onChange: setSortBy,
                    options: [
                        { label: "Newest First", value: "newest" },
                        { label: "Price: Low to High", value: "priceLowHigh" },
                        { label: "Price: High to Low", value: "priceHighLow" }
                    ]
                }}
                renderRow={(product, index) => (
                    <tr key={product._id} className="hover:bg-blend-color-dodge hover:bg-a/10 border-t border-t-gb">
                        <td className="px-6 py-4 font-mono text-[10px]">{index + 1}</td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-bg border border-gb flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {product.images?.[0] ? (
                                        <img src={product.images[0].url} alt={product.images[0].alt} className="w-full h-full object-cover" />
                                    ) : "📦"}
                                </div>
                                <span className="font-bold text-text whitespace-nowrap">{product.name}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex flex-col font-mono text-[10px]">
                                <span className="text-text2">{product.sku}</span>
                                <span className="opacity-40">{product.slug}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-md bg-ag text-a font-mono text-[9px] uppercase tracking-widest border border-a/10">
                                {product.category?.name || "Generic"}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{product.brand}</td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex flex-col">
                                <span className="font-bold text-text">${product.price}</span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <span className="text-[10px] text-muted line-through opacity-50 font-mono">${product.originalPrice}</span>
                                )}
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex flex-col items-center gap-1.5 font-mono">
                                <div className="w-16 h-1 bg-gb rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${product.countInStock < 5 ? (product.countInStock === 0 ? "bg-red-500" : "bg-orange-500") : "bg-green-500"
                                            }`}
                                        style={{ width: `${Math.min(product.countInStock * 2, 100)}%` }}
                                    />
                                </div>
                                <span className={`text-[10px] font-bold ${product.countInStock < 5 ? (product.countInStock === 0 ? "text-red-600" : "text-orange-600") : "text-green-600"
                                    }`}>
                                    {product.countInStock}
                                </span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-[10px]">{product.rating} ★</td>
                        <td className="px-6 py-4 text-center font-mono text-[10px]">{product.numReviews}</td>
                        <td className="px-6 py-4">
                            {product.badge && (
                                <span className="px-2 py-0.5 rounded bg-bg border border-gb font-mono text-[8px] uppercase tracking-widest text-muted">
                                    {product.badge}
                                </span>
                            )}
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-[10px]">{product.warrantyYears}y</td>
                        <td className="px-6 py-4 text-center font-mono text-[10px]">{product.returnDays}d</td>
                        <td className="px-6 py-4 text-[10px] max-w-[150px] truncate">
                            {product.colors?.map(c => c.name).join(", ")}
                        </td>
                        <td className="px-6 py-4 text-[10px] max-w-[150px] truncate">
                            {Array.isArray(product.tags) ? product.tags.join(", ") : product.tags}
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-[10px] text-a3">{product.soldCount || 0}</td>
                        <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-3">
                                <button onClick={() => handleOpenModal(product)} className="text-a hover:text-a/80 font-bold uppercase text-[10px] tracking-widest">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(product._id)} className="text-a2 hover:text-a2/80 font-bold uppercase text-[10px] tracking-widest">
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                )}
            />

            <ProductModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleModalSubmit}
                initialData={selectedProduct}
            />
        </>
    )
}

export default Products