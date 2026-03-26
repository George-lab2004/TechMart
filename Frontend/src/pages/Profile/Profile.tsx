import { useState } from "react";
import Cube from "@/Components/Cube";
import Loader from "@/Components/Loader";
import { useGetProfileQuery, useUpdateProfileMutation, useAddAddressMutation, useUpdateAddressMutation, useDeleteAddressMutation } from "@/slices/usersApiSlice";
import { useGetMyOrdersQuery } from "@/slices/ordersApiSlice";
import { ArrowRight, MapPin, Package, Shield, User as UserIcon, Plus, Save, Key, Edit2, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import toast from "react-hot-toast";

export default function Profile() {
    const { data: user, isLoading, isError } = useGetProfileQuery();
    const { data: orders, isLoading: ordersLoading } = useGetMyOrdersQuery();

    if (isLoading) return <Loader />;
    if (isError) return (
        <div className="container mx-auto py-20 px-4 text-center">
            <p className="text-lg mb-4 text-destructive">Error loading profile. Please try logging in again.</p>
            <Link to="/login" className="text-a hover:underline font-mono uppercase tracking-widest text-sm">Login</Link>
        </div>
    );

    return (
        <div className="container mx-auto py-12 md:py-20 px-4 max-w-5xl space-y-10 font-body">
            {/* Breadcrumb */}
            <div className="font-mono flex text-[0.75rem] text-muted mb-4 uppercase tracking-widest">
                <Link to="/" className="text-text2 hover:text-a transition-colors">Home</Link>
                &nbsp;/&nbsp;<span className="text-text">My Profile</span>
            </div>

            {/* Header Section with 3D Cube */}
            <div className="bg-glass border border-gb p-8 md:p-12 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                    <div className="text-center lg:text-left space-y-4">
                        <div className="space-y-1">
                            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-text">
                                {user?.name}
                            </h1>
                            <p className="text-text2 font-mono text-sm tracking-wide opacity-80">{user?.email}</p>
                        </div>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 py-4">
                            <StatCard value={orders?.length || 0} label="Orders" icon={<Package size={16} />} />
                            <StatCard value={user?.delivery?.length || 0} label="Addresses" icon={<MapPin size={16} />} />
                            <Link to="/products" className="group flex items-center gap-2 rounded-2xl border border-blue-500/20 bg-blue-500/10 hover:bg-blue-500 hover:text-white py-3 px-6 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/10">
                                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">Shop Now</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="relative">
                        <Cube
                            name={user?.name}
                            email={user?.email}
                            addressTitle={user?.delivery?.[0]?.title || "Add Address"}
                        />
                    </div>
                </div>
            </div>

            {/* Content Tabs Section */}
            <div className="bg-glass border border-gb p-6 md:p-10 rounded-[2.5rem] backdrop-blur-3xl shadow-xl min-h-[600px] transition-all duration-500">
                <Tabs defaultValue="personal" className="w-full h-fit">
                    <TabsList className="flex flex-wrap md:grid md:grid-cols-4 gap-3 bg-black/10 dark:bg-white/5 p-2 rounded-[1.5rem] border border-gb mb-10 shadow-inner">
                        <TabsTrigger value="personal" className="flex-1 data-[state=active]:bg-a data-[state=active]:text-white rounded-xl py-4 transition-all text-xs uppercase font-black tracking-[0.2em] flex items-center justify-center gap-2 shadow-sm">
                            <UserIcon size={16} /> Personal
                        </TabsTrigger>
                        <TabsTrigger value="security" className="flex-1 data-[state=active]:bg-a2 data-[state=active]:text-white rounded-xl py-4 transition-all text-xs uppercase font-black tracking-[0.2em] flex items-center justify-center gap-2 shadow-sm">
                            <Shield size={16} /> Security
                        </TabsTrigger>
                        <TabsTrigger value="addresses" className="flex-1 data-[state=active]:bg-a3 data-[state=active]:text-white rounded-xl py-4 transition-all text-xs uppercase font-black tracking-[0.2em] flex items-center justify-center gap-2 shadow-sm">
                            <MapPin size={16} /> Addresses
                        </TabsTrigger>
                        <TabsTrigger value="orders" className="flex-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-xl py-4 transition-all text-xs uppercase font-black tracking-[0.2em] flex items-center justify-center gap-2 shadow-sm">
                            <Package size={16} /> History
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal" className="animate-in fade-in slide-in-from-bottom-2">
                        <PersonalInfo user={user} />
                    </TabsContent>

                    <TabsContent value="security" className="animate-in fade-in slide-in-from-bottom-2">
                        <Security />
                    </TabsContent>

                    <TabsContent value="addresses" className="animate-in fade-in slide-in-from-bottom-2">
                        <Addresses user={user} />
                    </TabsContent>

                    <TabsContent value="orders" className="animate-in fade-in slide-in-from-bottom-2">
                        <Orders orders={orders} isLoading={ordersLoading} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

// ================= STAT CARD =================
const StatCard = ({ value, label, icon }: { value: number | string, label: string, icon: React.ReactNode }) => (
    <div className="bg-card/40 border border-gb rounded-2xl py-3 px-6 flex flex-col items-center justify-center min-w-[100px] shadow-sm group/stat hover:border-a/50 transition-colors">
        <div className="flex items-center gap-2 text-text group-hover/stat:text-a transition-colors">
            <span className="text-xl font-black">{value}</span>
            {icon}
        </div>
        <span className="text-[10px] uppercase tracking-widest text-text2 font-bold opacity-60">{label}</span>
    </div>
);

// ================= PERSONAL INFO =================
const PersonalInfo = ({ user }: { user: any }) => {
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProfile({ name, email }).unwrap();
            toast.success("Profile updated perfectly!");
        } catch (err: any) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-text2 opacity-60 ml-1">Full Name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-white/5 border-gb rounded-xl py-6 px-4 focus:ring-a" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-text2 opacity-60 ml-1">Email Address</label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white/5 border-gb rounded-xl py-6 px-4" />
                </div>
            </div>
            <Button disabled={isLoading} className="w-full md:w-auto bg-a text-white font-bold py-6 px-10 rounded-xl hover:scale-105 transition-all flex items-center gap-3">
                {isLoading ? "Saving..." : <><Save size={18} /> Save Profile Changes</>}
            </Button>
        </form>
    );
};

// ================= SECURITY =================
const Security = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) return toast.error("Passwords don't match!");
        try {
            await updateProfile({ password }).unwrap();
            toast.success("Password secured!");
            setPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-widest text-text2 opacity-60 ml-1">New Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-white/5 border-gb rounded-xl py-6 px-4" />
            </div>
            <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-widest text-text2 opacity-60 ml-1">Repeat Password</label>
                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-white/5 border-gb rounded-xl py-6 px-4" />
            </div>
            <Button disabled={isLoading} className="w-full md:w-auto bg-a2 text-white font-bold py-6 px-10 rounded-xl hover:scale-105 transition-all flex items-center gap-3">
                {isLoading ? "Updating..." : <><Key size={18} /> Update Security Key</>}
            </Button>
        </form>
    );
};

// ================= ADDRESSES =================
const Addresses = ({ user }: { user: any }) => {
    const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
    const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
    const [deleteAddress] = useDeleteAddressMutation();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        phone: "",
        streetNumber: "",
        buildingNumber: "",
        floorNumber: "",
        apartmentNumber: "",
        city: "",
        country: "Egypt",
        landmark: "",
        notes: "",
        postalCode: ""
    });

    const resetForm = () => {
        setFormData({
            title: "", phone: "", streetNumber: "", buildingNumber: "",
            floorNumber: "", apartmentNumber: "", city: "", country: "Egypt",
            landmark: "", notes: "", postalCode: ""
        });
        setEditingId(null);
    };

    const handleEdit = (del: any) => {
        setEditingId(del._id);
        const addr = del.address[0] || {};
        setFormData({
            title: del.title || "",
            phone: del.phone || "",
            streetNumber: addr.streetNumber || "",
            buildingNumber: addr.buildingNumber || "",
            floorNumber: addr.floorNumber || "",
            apartmentNumber: addr.apartmentNumber || "",
            city: addr.city || "",
            country: addr.country || "Egypt",
            landmark: addr.landmark || "",
            notes: addr.notes || "",
            postalCode: addr.postalCode?.toString() || ""
        });
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this address?")) return;
        try {
            await deleteAddress(id).unwrap();
            toast.success("Address removed.");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to delete");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) return toast.error("Title is required");

        const data = {
            ...formData,
            postalCode: Number(formData.postalCode) || undefined
        };

        try {
            if (editingId) {
                await updateAddress({ ...data, addressId: editingId }).unwrap();
                toast.success("Location updated!");
            } else {
                // Formatting for addAddress according to existing logic if needed, 
                // but the controller now handles flat bodies too if implemented that way.
                // Let's stick to the flat body as the new controller expects it.
                await addAddress(data).unwrap();
                toast.success("New location added!");
            }
            resetForm();
        } catch (err: any) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
            {/* List Existing Addresses */}
            <div className="xl:col-span-2 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-text border-b border-gb pb-4 mb-6 flex items-center gap-2">
                    <MapPin size={16} className="text-a3" /> My Locations
                </h3>
                {user?.delivery && user.delivery.length > 0 ? (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {user.delivery.map((del: any, i: number) => (
                            <div key={i} className={`bg-white/5 border ${editingId === del._id ? 'border-a3 shadow-lg shadow-a3/10' : 'border-gb'} p-6 rounded-2xl group transition-all duration-300 relative`}>
                                <div className="flex justify-between items-start mb-3">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-a3">{del.title}</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(del)} className="p-2 rounded-lg bg-white/5 hover:bg-a3/20 text-text2 hover:text-a3 transition-all">
                                            <Edit2 size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(del._id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-text2 hover:text-red-500 transition-all">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1 opacity-80">
                                    <p className="text-sm font-bold text-text">
                                        {del.address[0]?.streetNumber} {del.address[0]?.buildingNumber}
                                    </p>
                                    <p className="text-xs text-text2 leading-relaxed">
                                        {del.address[0]?.floorNumber && `Floor ${del.address[0].floorNumber}, `}
                                        {del.address[0]?.apartmentNumber && `Apt ${del.address[0].apartmentNumber}`}
                                    </p>
                                    <p className="text-xs text-text2">
                                        {del.address[0]?.city}, {del.address[0]?.country}
                                    </p>
                                    {del.phone && <p className="text-[10px] font-mono mt-2 text-a3/80">{del.phone}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-gb rounded-[2.5rem] bg-black/5">
                        <MapPin size={40} className="mx-auto mb-4 opacity-10" />
                        <p className="text-text2 font-mono text-xs uppercase tracking-widest">No addresses saved yet.</p>
                    </div>
                )}
            </div>

            {/* Expanded Address Form */}
            <form onSubmit={handleSubmit} className="xl:col-span-3 bg-black/10 dark:bg-white/5 p-8 rounded-[2.5rem] border border-gb space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-a3 opacity-50" />

                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text opacity-70 font-mono flex items-center gap-2">
                        {editingId ? <><Edit2 size={14} /> Modify Location</> : <><Plus size={14} /> Register New Hub</>}
                    </h3>
                    {editingId && (
                        <button type="button" onClick={resetForm} className="text-[10px] font-bold uppercase tracking-widest text-text2 hover:text-red-500 flex items-center gap-1 transition-colors">
                            <X size={12} /> Cancel Edit
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-text2 opacity-50">Label</label>
                        <Input placeholder="Home, Work, GYM..." value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="bg-transparent border-gb/50 py-6" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-text2 opacity-50">Contact Phone</label>
                        <Input placeholder="+20 XXX XXX XXXX" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="bg-transparent border-gb/50 py-6" />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-text2 opacity-50">Street</label>
                        <Input value={formData.streetNumber} onChange={(e) => setFormData({ ...formData, streetNumber: e.target.value })} className="bg-transparent border-gb/50 py-6" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-text2 opacity-50">Building</label>
                        <Input value={formData.buildingNumber} onChange={(e) => setFormData({ ...formData, buildingNumber: e.target.value })} className="bg-transparent border-gb/50 py-6" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-text2 opacity-50">Floor</label>
                        <Input value={formData.floorNumber} onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })} className="bg-transparent border-gb/50 py-6" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-text2 opacity-50">Apt</label>
                        <Input value={formData.apartmentNumber} onChange={(e) => setFormData({ ...formData, apartmentNumber: e.target.value })} className="bg-transparent border-gb/50 py-6" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-text2 opacity-50">City</label>
                        <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="bg-transparent border-gb/50 py-6" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-text2 opacity-50">Country</label>
                        <Input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="bg-transparent border-gb/50 py-6" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-text2 opacity-50">ZIP Code</label>
                        <Input value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} className="bg-transparent border-gb/50 py-6" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-text2 opacity-50">Landmark & Notes</label>
                    <Input placeholder="Next to Metro station, Blue gate..." value={formData.landmark} onChange={(e) => setFormData({ ...formData, landmark: e.target.value })} className="bg-transparent border-gb/50 py-6" />
                </div>

                <Button disabled={isAdding || isUpdating} className="w-full bg-a3 text-white font-black py-7 rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-a3/20 mt-4 uppercase tracking-[0.2em] text-xs">
                    {(isAdding || isUpdating) ? "Processing..." : editingId ? "Update Location" : "Establish New Hub"}
                </Button>
            </form>
        </div>
    );
};

// ================= ORDERS =================
const Orders = ({ orders, isLoading }: { orders: any, isLoading: boolean }) => {
    if (isLoading) return <p className="text-center py-10 opacity-60 animate-pulse font-mono text-sm">FETCHING ORDERS...</p>;

    return (
        <div className="space-y-4">
            {orders && orders.length > 0 ? (
                <div className="grid gap-4">
                    {orders.map((order: any) => (
                        <div key={order._id} className="bg-white/5 border border-gb p-6 rounded-2xl flex items-center justify-between group hover:border-blue-500/50 transition-all">
                            <div className="space-y-1">
                                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-text2 opacity-60">Order #{order._id.slice(-8)}</p>
                                <p className="text-sm font-bold text-text">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right space-y-2">
                                <p className="text-lg font-black text-blue-500">${order.totalPrice}</p>
                                <span className={`text-[9px] uppercase font-black px-3 py-1 rounded-full ${order.isPaid ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {order.isPaid ? 'PAID' : 'PENDING'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border-2 border-dashed border-gb rounded-[2.5rem]">
                    <Package size={48} className="mx-auto mb-4 opacity-10" />
                    <p className="text-text2 font-mono text-sm">You haven't placed any orders yet.</p>
                    <Link to="/products" className="text-a text-xs uppercase font-bold tracking-widest mt-4 inline-block hover:underline">Start Shopping</Link>
                </div>
            )}
        </div>
    );
};