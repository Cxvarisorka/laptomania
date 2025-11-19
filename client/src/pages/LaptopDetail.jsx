import { useParams, useNavigate, Link } from "react-router";
import { useState, useEffect } from "react";
import { useLaptop } from "../context/laptops.context";
import { useAuth } from "../context/auth.context";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";

const LaptopDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { laptops, addToCart } = useLaptop();
    const { user } = useAuth();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const laptop = laptops?.find(l => l._id === id);

    useEffect(() => {
        if (!laptop && laptops?.length > 0) {
            // Laptop not found, redirect to catalog
            navigate('/laptops');
        }
    }, [laptop, laptops, navigate]);

    if (!laptop) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">💻</div>
                    <p className="text-xl text-gray-600">Loading laptop details...</p>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(laptop);
        }
    };

    const specifications = [
        { label: "Brand", value: laptop.brand, icon: "🏢" },
        { label: "Model", value: laptop.model, icon: "📱" },
        { label: "Processor", value: laptop.processor, icon: "⚡" },
        { label: "RAM", value: laptop.ram, icon: "💾" },
        { label: "Storage", value: laptop.storage, icon: "🗄️" },
        { label: "Graphics", value: laptop.graphics, icon: "🎮" },
        { label: "Display", value: laptop.display, icon: "🖥️" },
        { label: "Operating System", value: laptop.os, icon: "⚙️" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center space-x-2 text-sm">
                        <Link to="/" className="text-gray-500 hover:text-indigo-600">Home</Link>
                        <span className="text-gray-400">/</span>
                        <Link to="/laptops" className="text-gray-500 hover:text-indigo-600">Laptops</Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-900 font-medium">{laptop.brand} {laptop.model}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative bg-white rounded-lg border-2 border-gray-200 overflow-hidden aspect-square">
                            <img
                                src={laptop.images[selectedImage]?.url}
                                alt={`${laptop.brand} ${laptop.model}`}
                                className="w-full h-full object-contain p-8"
                            />
                            {laptop.stock < 5 && laptop.stock > 0 && (
                                <Badge variant="destructive" className="absolute top-4 right-4 text-sm px-3 py-1">
                                    Only {laptop.stock} left!
                                </Badge>
                            )}
                            {laptop.stock === 0 && (
                                <Badge variant="secondary" className="absolute top-4 right-4 text-sm px-3 py-1">
                                    Out of Stock
                                </Badge>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        {laptop.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {laptop.images.map((image, index) => (
                                    <button
                                        key={image._id}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative bg-white rounded-lg border-2 overflow-hidden aspect-square hover:border-indigo-500 transition-colors ${
                                            selectedImage === index ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-gray-200'
                                        }`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={`${laptop.brand} ${laptop.model} - ${index + 1}`}
                                            className="w-full h-full object-contain p-2"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        {/* Title and Price */}
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                {laptop.brand} {laptop.model}
                            </h1>
                            <p className="text-gray-600 mb-4">{laptop.processor}</p>
                            
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-4xl font-bold text-indigo-600">
                                    ${laptop.price}
                                </span>
                                <Badge variant={laptop.stock > 5 ? "success" : laptop.stock > 0 ? "destructive" : "secondary"}>
                                    {laptop.stock > 5 ? "In Stock" : laptop.stock > 0 ? `Only ${laptop.stock} left` : "Out of Stock"}
                                </Badge>
                            </div>
                        </div>

                        {/* Description */}
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="font-semibold text-lg mb-2">Description</h3>
                                <p className="text-gray-700 leading-relaxed">{laptop.description}</p>
                            </CardContent>
                        </Card>

                        {/* Quantity and Add to Cart */}
                        {user && user.role !== "admin" && (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Quantity
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    className="w-10 h-10 rounded-md border-2 border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-colors flex items-center justify-center font-semibold"
                                                    disabled={laptop.stock === 0}
                                                >
                                                    −
                                                </button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={laptop.stock}
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(Math.max(1, Math.min(laptop.stock, parseInt(e.target.value) || 1)))}
                                                    className="w-20 h-10 text-center border-2 border-gray-300 rounded-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                                    disabled={laptop.stock === 0}
                                                />
                                                <button
                                                    onClick={() => setQuantity(Math.min(laptop.stock, quantity + 1))}
                                                    className="w-10 h-10 rounded-md border-2 border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-colors flex items-center justify-center font-semibold"
                                                    disabled={laptop.stock === 0}
                                                >
                                                    +
                                                </button>
                                                <span className="text-sm text-gray-600 ml-2">
                                                    {laptop.stock} available
                                                </span>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleAddToCart}
                                            disabled={laptop.stock === 0}
                                            size="lg"
                                            className="w-full text-lg"
                                        >
                                            {laptop.stock === 0 ? 'Out of Stock' : `Add ${quantity} to Cart - $${(laptop.price * quantity).toFixed(2)}`}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {!user && (
                            <Card className="bg-indigo-50 border-indigo-200">
                                <CardContent className="pt-6">
                                    <p className="text-center text-gray-700 mb-4">
                                        Please sign in to purchase this laptop
                                    </p>
                                    <div className="flex gap-3">
                                        <Link to="/login" className="flex-1">
                                            <Button variant="outline" className="w-full">Login</Button>
                                        </Link>
                                        <Link to="/signup" className="flex-1">
                                            <Button className="w-full">Sign Up</Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Specifications */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Specifications</h2>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {specifications.map((spec, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="text-3xl">{spec.icon}</span>
                                        <div className="flex-1">
                                            <div className="text-sm text-gray-600 font-medium">{spec.label}</div>
                                            <div className="text-gray-900 font-semibold">{spec.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Features */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardContent className="pt-6 text-center">
                                <div className="text-4xl mb-3">🚀</div>
                                <h3 className="font-semibold mb-2">High Performance</h3>
                                <p className="text-sm text-gray-600">
                                    Powered by {laptop.processor} for seamless multitasking
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardContent className="pt-6 text-center">
                                <div className="text-4xl mb-3">💾</div>
                                <h3 className="font-semibold mb-2">Ample Storage</h3>
                                <p className="text-sm text-gray-600">
                                    {laptop.storage} storage with {laptop.ram} RAM
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardContent className="pt-6 text-center">
                                <div className="text-4xl mb-3">🛡️</div>
                                <h3 className="font-semibold mb-2">Warranty Included</h3>
                                <p className="text-sm text-gray-600">
                                    Manufacturer warranty and customer support
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Back to Catalog */}
                <div className="mt-12 text-center">
                    <Link to="/laptops">
                        <Button variant="outline" size="lg">
                            ← Back to All Laptops
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LaptopDetail;
