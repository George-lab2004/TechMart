import { useEffect, useState } from "react"
import { X } from "lucide-react"

interface Props {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: any) => void
    initialData?: any
}

export default function CategoryModal({ isOpen, onClose, onSubmit, initialData }: Props) {
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        color: "#000000",
        glowColor: "#000000",
        images: [{ url: "", alt: "" }]
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                images: initialData.images?.length ? initialData.images : [{ url: "", alt: "" }]
            })
        } else {
            setFormData({
                name: "",
                slug: "",
                description: "",
                color: "#000000",
                glowColor: "#000000",
                images: [{ url: "", alt: "" }]
            })
        }
    }, [initialData, isOpen])

    const handleChange = (e: any) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            images: [{ ...prev.images[0], [field]: value }]
        }))
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        onSubmit(formData)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-3xl w-full max-w-xl p-8 border border-gb shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bebas tracking-widest">
                        {initialData ? "Edit Category" : "Create Category"}
                    </h2>
                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Category Name"
                        className="border p-3 rounded-xl"
                        required
                    />

                    <input
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        placeholder="slug-name"
                        className="border p-3 rounded-xl"
                        required
                    />

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Description"
                        className="border p-3 rounded-xl"
                    />

                    {/* Image */}
                    <input
                        placeholder="Image URL"
                        value={formData.images[0].url}
                        onChange={(e) => handleImageChange("url", e.target.value)}
                        className="border p-3 rounded-xl"
                    />

                    <input
                        placeholder="Alt Text"
                        value={formData.images[0].alt}
                        onChange={(e) => handleImageChange("alt", e.target.value)}
                        className="border p-3 rounded-xl"
                    />

                    {/* Colors */}
                    <div className="flex gap-4">
                        <input type="color" name="color" value={formData.color} onChange={handleChange} />
                        <input type="color" name="glowColor" value={formData.glowColor} onChange={handleChange} />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-xl">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 bg-a text-white rounded-xl">
                            {initialData ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}