import { useState } from "react"

import AdminHeader from "../components/AdminHeader"
import AdminStatCard from "../components/AdminStatCard"
import AdminTable from "../components/AdminTable"
import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation } from "@/slices/usersApiSlice"
import type { user } from "@/slices/usersApiSlice"

function Users() {
    const { data, isLoading, error } = useGetUsersQuery()
    const [deleteUser] = useDeleteUserMutation()
    const [updateUser] = useUpdateUserMutation()

    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("")

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

    const users: user[] = data ?? []

    // ── Stats ────────────────────────────
    const total = users.length
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
        if (window.confirm("Delete this user? ⚠️")) {
            try {
                await deleteUser(id).unwrap()
            } catch (err) {
                console.error(err)
            }
        }
    }

    const toggleAdmin = async (userItem: user) => {
        try {
            await updateUser({
                _id: userItem._id,
                isAdmin: !userItem.isAdmin
            }).unwrap()
        } catch (err) {
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
                onSearchChange={setSearchTerm}
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
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                            >
                                {userItem.isAdmin ? "Admin" : "User"}
                            </button>
                        </td>

                        {/* Verified */}
                        <td className="px-6 py-4 text-center">
                            <span
                                className={`px-2 py-1 rounded-md text-[9px] font-bold ${userItem.confirmedEmail
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
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
                            </div>
                        </td>
                    </tr>
                )}
            />
        </>
    )
}

export default Users