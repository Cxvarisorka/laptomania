import { useAuth } from "../context/auth.context";
import { useLaptop } from "../context/laptops.context";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

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
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Add New Laptop</CardTitle>
                <CardDescription>Fill in the details to add a new laptop to the catalog</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="brand">Brand *</Label>
                            <Input id="brand" name="brand" placeholder="e.g., Dell, HP, Lenovo" required />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="model">Model *</Label>
                            <Input id="model" name="model" placeholder="e.g., XPS 15, ThinkPad X1" required />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="processor">Processor *</Label>
                            <Input id="processor" name="processor" placeholder="e.g., Intel Core i7-12700H" required />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="ram">RAM *</Label>
                            <Input id="ram" name="ram" placeholder="e.g., 16GB DDR4" required />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="storage">Storage *</Label>
                            <Input id="storage" name="storage" placeholder="e.g., 512GB SSD" required />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="graphics">Graphics *</Label>
                            <Input id="graphics" name="graphics" placeholder="e.g., NVIDIA RTX 3060" required />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="display">Display *</Label>
                            <Input id="display" name='display" placeholder="e.g., 15.6\" FHD IPS' required />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="os">Operating System *</Label>
                            <Input id="os" name="os" placeholder="e.g., Windows 11 Pro" required />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="price">Price ($) *</Label>
                            <Input id="price" name="price" type="number" step="0.01" placeholder="999.99" required />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock Quantity *</Label>
                            <Input id="stock" name="stock" type="number" placeholder="10" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Detailed description of the laptop..."
                            rows="4"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="images">Product Images *</Label>
                        <Input
                            id="images"
                            type="file"
                            name="images"
                            multiple
                            accept="image/*"
                            required
                        />
                        <p className="text-xs text-gray-500">Upload multiple images (recommended: 2-4 images)</p>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Adding Laptop...' : 'Add Laptop to Catalog'}
                    </Button>
                </form>
            </CardContent>
        </Card>
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
                <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                            <div className={`text-3xl p-3 rounded-full ${stat.color}`}>
                                {stat.icon}
                            </div>
                        </div>
                    </CardContent>
                </Card>
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
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl">Profile Information</CardTitle>
                                <CardDescription>Your account details and role</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
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
                                                <Badge variant={isAdmin ? "default" : isModerator ? "secondary" : "outline"}>
                                                    {user.role}
                                                </Badge>
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
                            </CardContent>
                        </Card>
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
