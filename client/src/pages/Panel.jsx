import { useAuth } from "../context/auth.context";
import { useLaptop } from "../context/laptops.context";
import { useState } from "react";

const AddLaptop = () => {
    const { addLaptop } = useLaptop();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const formData = new FormData(e.target);
        await addLaptop(formData);
        
        setIsSubmitting(false);
        e.target.reset();
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">Add New Laptop</h3>
                <p className="text-sm text-gray-500">Fill in the details to add a new laptop to the catalog</p>
            </div>
            <div className="p-6 pt-0">
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand *</label>
                            <input id="brand" name="brand" placeholder="e.g., Dell, HP, Lenovo" required className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model *</label>
                            <input id="model" name="model" placeholder="e.g., XPS 15, ThinkPad X1" required className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="processor" className="block text-sm font-medium text-gray-700">Processor *</label>
                            <input id="processor" name="processor" placeholder="e.g., Intel Core i7-12700H" required className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="ram" className="block text-sm font-medium text-gray-700">RAM *</label>
                            <input id="ram" name="ram" placeholder="e.g., 16GB DDR4" required className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="storage" className="block text-sm font-medium text-gray-700">Storage *</label>
                            <input id="storage" name="storage" placeholder="e.g., 512GB SSD" required className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="graphics" className="block text-sm font-medium text-gray-700">Graphics *</label>
                            <input id="graphics" name="graphics" placeholder="e.g., NVIDIA RTX 3060" required className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="display" className="block text-sm font-medium text-gray-700">Display *</label>
                            <input id="display" name='display" placeholder="e.g., 15.6\" FHD IPS' required className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="os" className="block text-sm font-medium text-gray-700">Operating System *</label>
                            <input id="os" name="os" placeholder="e.g., Windows 11 Pro" required className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($) *</label>
                            <input id="price" name="price" type="number" step="0.01" placeholder="999.99" required className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Quantity *</label>
                            <input id="stock" name="stock" type="number" placeholder="10" required className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Detailed description of the laptop..."
                            rows="4"
                            required
                            className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="images" className="block text-sm font-medium text-gray-700">Product Images *</label>
                        <input
                            id="images"
                            type="file"
                            name="images"
                            multiple
                            accept="image/*"
                            required
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                        />
                        <p className="text-xs text-gray-500">Upload multiple images (recommended: 2-4 images)</p>
                    </div>

                    <button
                        type="submit"
                        className="w-full h-11 px-8 text-lg inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Adding Laptop...' : 'Add Laptop to Catalog'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const UserStats = ({ user, laptops }) => {
    const totalLaptops = laptops?.length || 0;
    const totalValue = laptops?.reduce((sum, laptop) => sum + (laptop.price * laptop.stock), 0) || 0;
    const lowStock = laptops?.filter(laptop => laptop.stock < 5).length || 0;
    const outOfStock = laptops?.filter(laptop => laptop.stock === 0).length || 0;

    const stats = [
        { label: "Total Laptops", value: totalLaptops, icon: "💻", color: "bg-blue-100 text-blue-700" },
        { label: "Inventory Value", value: `$${totalValue.toLocaleString()}`, icon: "💰", color: "bg-green-100 text-green-700" },
        { label: "Low Stock", value: lowStock, icon: "⚠️", color: "bg-yellow-100 text-yellow-700" },
        { label: "Out of Stock", value: outOfStock, icon: "❌", color: "bg-red-100 text-red-700" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
                <div key={index} className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                            <div className={`text-3xl p-3 rounded-full ${stat.color}`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const Panel = () => {
    const { user } = useAuth();
    const { laptops } = useLaptop();
    const [activeTab, setActiveTab] = useState("profile");

    const isAdmin = user?.role === "admin";
    const isModerator = user?.role === "moderator";
    const canManageLaptops = isAdmin || isModerator;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
                    <p className="text-indigo-100">Manage your account and inventory</p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Section (Admin/Moderator only) */}
                {canManageLaptops && <UserStats user={user} laptops={laptops} />}

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6 border-b">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`px-4 py-2 font-medium transition-colors ${
                            activeTab === "profile"
                                ? "text-indigo-600 border-b-2 border-indigo-600"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Profile
                    </button>
                    {canManageLaptops && (
                        <button
                            onClick={() => setActiveTab("add-laptop")}
                            className={`px-4 py-2 font-medium transition-colors ${
                                activeTab === "add-laptop"
                                    ? "text-indigo-600 border-b-2 border-indigo-600"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Add Laptop
                        </button>
                    )}
                </div>

                {/* Content */}
                {activeTab === "profile" && (
                    <div className="max-w-2xl">
                        <div className="rounded-lg border border-gray-200 bg-white shadow-lg">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h3 className="text-2xl font-semibold leading-none tracking-tight">Profile Information</h3>
                                <p className="text-sm text-gray-500">Your account details and role</p>
                            </div>
                            <div className="p-6 pt-0 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Full Name</p>
                                            <p className="text-lg font-medium">{user.fullname}</p>
                                        </div>
                                        <div className="text-3xl">👤</div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Email Address</p>
                                            <p className="text-lg font-medium">{user.email}</p>
                                        </div>
                                        <div className="text-3xl">📧</div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Account Role</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-lg font-medium capitalize">{user.role}</p>
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                    isAdmin ? "bg-indigo-600 text-white" :
                                                    isModerator ? "bg-gray-200 text-gray-900" :
                                                    "border border-gray-300 text-gray-900"
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-3xl">
                                            {isAdmin ? "👑" : isModerator ? "⭐" : "👥"}
                                        </div>
                                    </div>
                                </div>

                                {canManageLaptops && (
                                    <div className="pt-4 border-t">
                                        <h4 className="font-semibold mb-2">Permissions</h4>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li className="flex items-center gap-2">
                                                <span className="text-green-600">✓</span>
                                                Add new laptops to catalog
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="text-green-600">✓</span>
                                                Update laptop information
                                            </li>
                                            {isAdmin && (
                                                <li className="flex items-center gap-2">
                                                    <span className="text-green-600">✓</span>
                                                    Delete laptops from catalog
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "add-laptop" && canManageLaptops && (
                    <div className="max-w-4xl">
                        <AddLaptop />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Panel;
