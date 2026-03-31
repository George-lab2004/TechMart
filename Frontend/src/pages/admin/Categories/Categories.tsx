import { useState } from "react"
import type { category } from "@/slices/categoryApiSlice"

import {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation
} from "@/slices/categoryApiSlice"

import AdminHeader from "../components/AdminHeader"
import AdminStatCard from "../components/AdminStatCard"
import AdminTable from "../components/AdminTable"
import CategoryModal from "./components/CategoryModel"

function Categories() {
    const { data, isLoading, error } = useGetCategoriesQuery()
    const [createCategory] = useCreateCategoryMutation()
    const [updateCategory] = useUpdateCategoryMutation()
    const [deleteCategory] = useDeleteCategoryMutation()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<category | null>(null)

    const [searchTerm, setSearchTerm] = useState("")

    if (isLoading)
        return <div className="p-8 text-center font-bebas text-2xl opacity-20 animate-pulse">Loading Categories...</div>

    if (error)
        return <div className="p-8 text-center text-red-500">Error loading categories.</div>

    const categories: category[] = data?.result ?? []

    // ── Stats ────────────────────────────
    const total = categories.length
    const withImages = categories.filter(c => c.images?.length > 0).length
    const withoutImages = total - withImages

    // ── Filter ───────────────────────────
    const filtered = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // ── Handlers ─────────────────────────
    const handleOpenModal = (cat: category | null = null) => {
        setSelectedCategory(cat)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setSelectedCategory(null)
        setIsModalOpen(false)
    }

    const handleSubmit = async (formData: any) => {
        try {
            if (selectedCategory) {
                await updateCategory({ ...formData, _id: selectedCategory._id }).unwrap()
            } else {
                await createCategory(formData).unwrap()
            }
            handleCloseModal()
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async (id: string) => {
        if (window.confirm("Delete this category? ⚠️")) {
            try {
                await deleteCategory(id).unwrap()
            } catch (err) {
                console.error(err)
            }
        }
    }

    return (
        <>
            <AdminHeader
                title="Categories"
                description="Manage product categories"
                buttonText="+ Add Category"
                onButtonClick={() => handleOpenModal()}
            />

            {/* Stats */}
            <div className="flex flex-wrap gap-5 justify-center mb-8">
                <AdminStatCard label="Total" value={total} />
                <AdminStatCard label="With Images" value={withImages} textClass="text-a3" />
                <AdminStatCard label="No Images" value={withoutImages} textClass="text-orange-600" />
            </div>

            {/* Table */}
            <AdminTable
                headers={[
                    "#",
                    "Category",
                    "Slug",
                    "Image",
                    "Color",
                    "Actions"
                ]}
                data={filtered}
                isLoading={isLoading}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                renderRow={(cat, index) => (
                    <tr key={cat._id} className="hover:bg-a/5 border-t border-gb">
                        {/* Index */}
                        <td className="px-6 py-4 text-[10px] font-mono">
                            {index + 1}
                        </td>

                        {/* Name */}
                        <td className="px-6 py-4 font-bold text-text">
                            {cat.name}
                        </td>

                        {/* Slug */}
                        <td className="px-6 py-4 text-[10px] font-mono opacity-60">
                            {cat.slug}
                        </td>

                        {/* Image */}
                        <td className="px-6 py-4">
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-gb bg-bg flex items-center justify-center">
                                {cat.images?.[0] ? (
                                    <img
                                        src={cat.images[0].url}
                                        alt={cat.images[0].alt}
                                        className="w-full h-full object-cover"
                                    />
                                ) : "📁"}
                            </div>
                        </td>

                        {/* Color */}
                        <td className="px-6 py-4">
                            {cat.color && (
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-4 rounded-full border"
                                        style={{ background: cat.color }}
                                    />
                                    <span className="text-[10px] font-mono">
                                        {cat.color}
                                    </span>
                                </div>
                            )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => handleOpenModal(cat)}
                                    className="text-a font-bold text-[10px]"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(cat._id)}
                                    className="text-red-500 font-bold text-[10px]"
                                >
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                )}
            />

            <CategoryModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                initialData={selectedCategory}
            />
        </>
    )
}

export default Categories