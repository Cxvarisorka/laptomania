/* eslint-disable react/prop-types */
import { useAuth } from "../context/auth.context";
import { useLaptop } from "../context/laptops.context";
import { useState } from "react";
import { Link } from "react-router";

const Laptop = ({ laptop }) => {
    const { deleteLaptop, updateLaptop, addToCart } = useLaptop();
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);

    // Editable fields (excluding DB-related and availability fields)
    const editableFields = Object.keys(laptop).filter(
        (key) => !["_id", "__v", "createdAt", "updatedAt", "isAvailable", "images"].includes(key)
    );

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        await updateLaptop(laptop._id, formData);
        setEditing(false);
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            {/* Images */}
            <div className="relative overflow-hidden rounded-t-lg">
                <div className="grid grid-cols-2 gap-1 bg-gray-100">
                    {laptop.images.map((image, idx) => (
                        <img
                            key={image._id}
                            src={image.url}
                            alt={`${laptop.brand} ${laptop.model} - ${idx + 1}`}
                            className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
                        />
                    ))}
                </div>
                {laptop.stock < 5 && laptop.stock > 0 && (
                    <span className="absolute top-2 right-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-600 text-white">
                        Only {laptop.stock} left!
                    </span>
                )}
                {laptop.stock === 0 && (
                    <span className="absolute top-2 right-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-200 text-gray-900">
                        Out of Stock
                    </span>
                )}
            </div>

            {editing ? (
                <form onSubmit={handleUpdate} className="flex flex-col gap-3 p-4 flex-1">
                    {editableFields.map((key) => (
                        <div key={key} className="space-y-1">
                            <label className="text-xs capitalize block text-sm font-medium text-gray-700">{key.replace(/([A-Z])/g, ' $1')}</label>
                            {key === "images" ? (
                                <input
                                    type="file"
                                    name="images"
                                    multiple
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                />
                            ) : (
                                <input
                                    type="text"
                                    name={key}
                                    defaultValue={laptop[key]}
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                />
                            )}
                        </div>
                    ))}

                    <div className="flex gap-2 mt-auto">
                        <button type="submit" className="flex-1 h-10 px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 shadow-md">
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditing(false)}
                            className="flex-1 h-10 px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 border border-gray-300 bg-white hover:bg-gray-100 text-gray-900"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <div className="flex flex-col space-y-1.5 p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold leading-none tracking-tight mb-1">
                                    {laptop.brand} {laptop.model}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {laptop.processor}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 pt-0 flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">💾 RAM:</span>
                                <span className="text-gray-600">{laptop.ram}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">🗄️ Storage:</span>
                                <span className="text-gray-600">{laptop.storage}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">🎮 GPU:</span>
                                <span className="text-gray-600">{laptop.graphics}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">🖥️ Display:</span>
                                <span className="text-gray-600">{laptop.display}</span>
                            </div>
                            <div className="flex items-center gap-2 col-span-2">
                                <span className="font-medium">⚙️ OS:</span>
                                <span className="text-gray-600">{laptop.os}</span>
                            </div>
                        </div>

                        <p className="text-sm text-gray-700 line-clamp-2">
                            {laptop.description}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t">
                            <div>
                                <div className="text-2xl font-bold text-indigo-600">
                                    ${laptop.price}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Stock: {laptop.stock} units
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 p-6 pt-0">
                        <Link to={`/laptops/${laptop._id}`} className="w-full">
                            <button className="w-full h-10 px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 border border-gray-300 bg-white hover:bg-gray-100 text-gray-900">
                                View Details
                            </button>
                        </Link>
                        {user?.role === "admin" ? (
                            <div className="flex gap-2 w-full">
                                <button
                                    onClick={() => deleteLaptop(laptop._id)}
                                    className="flex-1 h-10 px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-red-600 text-white hover:bg-red-700 shadow-md"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setEditing(true)}
                                    className="flex-1 h-10 px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                                >
                                    Update
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => addToCart(laptop)}
                                className="w-full h-10 px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                                disabled={laptop.stock === 0}
                            >
                                {laptop.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

const LaptopList = () => {
    const { laptops } = useLaptop();

    if (!laptops || laptops.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="text-6xl mb-4">💻</div>
                <p className="text-xl text-gray-500 mb-2">No laptops found</p>
                <p className="text-gray-400">Check back later for new arrivals!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {laptops.map((laptop) => (
                <Laptop key={laptop._id} laptop={laptop} />
            ))}
        </div>
    );
};

const Catalog = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Browse Laptops</h1>
                            <p className="text-indigo-100">
                                {user ? `Welcome back, ${user.fullname || user.email}!` : 'Discover your perfect laptop'}
                            </p>
                        </div>
                        {user && (
                            <span className="mt-4 md:mt-0 text-base px-4 py-2 inline-flex items-center rounded-full font-semibold bg-gray-200 text-gray-900">
                                Signed in as {user.role}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Catalog Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <LaptopList />
            </div>
        </div>
    );
};

export default Catalog;
