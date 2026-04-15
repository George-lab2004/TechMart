import { useState } from "react"
import toast from "react-hot-toast"

import AdminHeader from "../components/AdminHeader"
import AdminStatCard from "../components/AdminStatCard"
import AdminTable from "../components/AdminTable"
import PaginationBar from "../components/PaginationBar"
import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation } from "@/slices/usersApiSlice"
import type { user } from "@/slices/usersApiSlice"
import UserInsightsModal from "./components/UserInsightsModal"
import { BarChart3, Lock } from "lucide-react"
import { useSelector } from "react-redux"

function Users() {
    const [page, setPage] = useState(1)
    const { userInfo } = useSelector((state: any) => state.auth)
    const { data, isLoading, error } = useGetUsersQuery(page)
    const [deleteUser] = useDeleteUserMutation()
    const [updateUser] = useUpdateUserMutation()

    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("")

    const [isInsightsOpen, setIsInsightsOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<user | null>(null)

    if (isLoading)
        return (
            <div className="p-8 text-center font-bebas text-2xl opacity-20 animate-pulse">
                LOADING USERS...
            </div>
        )

    if (error)
        return (
            <div className="p-8 text-center text-red-500">
                Error loading users.
            </div>
        )

    const users: user[] = data?.users ?? []
    const pagination = data?.pagination

    // ── Stats ────────────────────────────
    const total = pagination?.total ?? 0
    const admins = users.filter(u => u.isAdmin).length
    const customers = total - admins
    const verified = users.filter(u => u.confirmedEmail).length

    // ── Filter ───────────────────────────
    const filteredUsers = users.filter(u => {
        const matchesSearch =
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesRole =
            roleFilter === ""
                ? true
                : roleFilter === "admin"
                    ? u.isAdmin
                    : !u.isAdmin

        return matchesSearch && matchesRole
    })

    // ── Handlers ─────────────────────────
    const handleDelete = async (id: string) => {
        if (userInfo?.isDemo) {
            toast.error("Action restricted in Demo Mode! Database users cannot be deleted.")
            return
        }
        if (window.confirm("Delete this user? ⚠️")) {
            try {
                await deleteUser(id).unwrap()
                toast.success("User deleted successfully")
            } catch (err: any) {
                toast.error(err?.data?.message || "Delete failed")
                console.error(err)
            }
        }
    }

    const toggleAdmin = async (userItem: user) => {
        if (userInfo?.isDemo) {
            toast.error("Action restricted in Demo Mode! User roles cannot be modified.")
            return
        }
        try {
            const updated = await updateUser({
                _id: userItem._id,
                isAdmin: !userItem.isAdmin
            }).unwrap()
            toast.success(`User updated to ${updated.isAdmin ? "Admin" : "Customer"}`)
        } catch (err: any) {
            toast.error(err?.data?.message || "Role toggle failed")
            console.error("Failed to update role:", err)
        }
    }

    return (
        <>
            <AdminHeader
                title="Users"
                description="Manage platform users"
            />

            {/* Stats */}
            <div className="flex flex-wrap gap-5 justify-center mb-8">
                <AdminStatCard label="Total Users" value={total} />
                <AdminStatCard label="Admins" value={admins} textClass="text-a3" />
                <AdminStatCard label="Customers" value={customers} textClass="text-orange-600" />
                <AdminStatCard label="Verified" value={verified} textClass="text-green-600" />
            </div>

            {/* Table */}
            <AdminTable
                headers={[
                    "#",
                    "User",
                    "Email",
                    "Role",
                    "Verified",
                    "Joined",
                    "Actions"
                ]}
                data={filteredUsers}
                isLoading={isLoading}
                searchTerm={searchTerm}
                onSearchChange={(v) => { setSearchTerm(v); setPage(1) }}
                filters={[
                    {
                        label: "Role",
                        value: roleFilter,
                        onChange: setRoleFilter,
                        options: [
                            { label: "Admin", value: "admin" },
                            { label: "Customer", value: "customer" }
                        ]
                    }
                ]}
                renderRow={(userItem, index) => (
                    <tr key={userItem._id} className="hover:bg-a/5 border-t border-gb">
                        {/* Index */}
                        <td className="px-6 py-4 text-[10px] font-mono">
                            {index + 1}
                        </td>

                        {/* Name */}
                        <td className="px-6 py-4">
                            <div className="flex flex-col">
                                <span className="font-bold text-text">
                                    {userItem.name}
                                </span>
                                <span className="text-[10px] opacity-40 font-mono">
                                    {userItem._id.slice(-6)}
                                </span>
                            </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4 text-[10px] font-mono">
                            {userItem.email}
                        </td>

                        {/* Role Toggle */}
                        <td className="px-6 py-4 text-center">
                            <button
                                onClick={() => toggleAdmin(userItem)}
                                className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all ${userItem.isAdmin
                                    ? "bg-a text-white hover:bg-a/80"
                                    : "bg-muted/10 text-text2 hover:bg-muted/20 border border-gb"
                                    }`}
                            >
                                {userItem.isAdmin ? "Admin" : "User"}
                            </button>
                        </td>

                        {/* Verified */}
                        <td className="px-6 py-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
                                userItem.confirmedEmail
                                ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                                : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                            }`}>
                                {userItem.confirmedEmail ? "Yes" : "No"}
                            </span>
                        </td>

                        {/* Created */}
                        <td className="px-6 py-4 text-center font-mono text-[10px]">
                            {new Date(userItem.createdAt).toLocaleDateString()}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => {
                                        setSelectedUser(userItem)
                                        setIsInsightsOpen(true)
                                    }}
                                    className="flex items-center gap-1 text-blue-500 font-bold text-[10px] hover:text-blue-600 transition-colors"
                                    title="View AI Analytics"
                                >
                                    <BarChart3 size={11} />
                                    Insights
                                </button>

                                {userInfo?.isDemo ? (
                                    <>
                                        <button
                                            title="Editing disabled in Demo Mode"
                                            className="text-muted/40 cursor-not-allowed font-bold uppercase text-[10px] tracking-widest flex items-center gap-1"
                                        >
                                            <Lock size={10} /> Toggle
                                        </button>
                                        <button
                                            title="Deletion disabled in Demo Mode"
                                            className="text-muted/20 cursor-not-allowed font-bold uppercase text-[10px] tracking-widest"
                                        >
                                            Delete
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => toggleAdmin(userItem)}
                                            className="text-a font-bold text-[10px]"
                                        >
                                            Toggle Role
                                        </button>

                                        <button
                                            onClick={() => handleDelete(userItem._id)}
                                            className="text-red-500 font-bold text-[10px]"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </td>
                    </tr>
                )}
            />

            {pagination && pagination.pages > 1 && (
                <PaginationBar
                    page={pagination.page}
                    pages={pagination.pages}
                    total={pagination.total}
                    limit={pagination.limit}
                    onChange={(p) => { setPage(p); setSearchTerm("") }}
                />
            )}

            <UserInsightsModal
                isOpen={isInsightsOpen}
                onClose={() => setIsInsightsOpen(false)}
                user={selectedUser}
            />
        </>
    )
}

export default Users