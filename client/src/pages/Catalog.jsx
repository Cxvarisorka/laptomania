/* eslint-disable react/prop-types */
import { useAuth } from "../context/auth.context";
import { useLaptop } from "../context/laptops.context";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

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
        <Card className="hover:shadow-xl transition-all duration-300 flex flex-col h-full">
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
                    <Badge variant="destructive" className="absolute top-2 right-2">
                        Only {laptop.stock} left!
                    </Badge>
                )}
                {laptop.stock === 0 && (
                    <Badge variant="secondary" className="absolute top-2 right-2">
                        Out of Stock
                    </Badge>
                )}
            </div>

            {editing ? (
                <form onSubmit={handleUpdate} className="flex flex-col gap-3 p-4 flex-1">
                    {editableFields.map((key) => (
                        <div key={key} className="space-y-1">
                            <Label className="text-xs capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                            {key === "images" ? (
                                <Input
                                    type="file"
                                    name="images"
                                    multiple
                                />
                            ) : (
                                <Input
                                    type="text"
                                    name={key}
                                    defaultValue={laptop[key]}
                                />
                            )}
                        </div>
                    ))}

                    <div className="flex gap-2 mt-auto">
                        <Button type="submit" variant="default" className="flex-1">
                            Save
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setEditing(false)}
                            variant="outline"
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            ) : (
                <>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <CardTitle className="text-xl mb-1">
                                    {laptop.brand} {laptop.model}
                                </CardTitle>
                                <CardDescription className="text-sm">
                                    {laptop.processor}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-3">
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
                    </CardContent>

                    <CardFooter className="flex flex-col gap-2">
                        <Link to={`/laptops/${laptop._id}`} className="w-full">
                            <Button variant="outline" className="w-full">
                                View Details
                            </Button>
                        </Link>
                        {user?.role === "admin" ? (
                            <div className="flex gap-2 w-full">
                                <Button
                                    onClick={() => deleteLaptop(laptop._id)}
                                    variant="destructive"
                                    className="flex-1"
                                >
                                    Delete
                                </Button>
                                <Button
                                    onClick={() => setEditing(true)}
                                    variant="default"
                                    className="flex-1"
                                >
                                    Update
                                </Button>
                            </div>
                        ) : (
                            <Button 
                                onClick={() => addToCart(laptop)} 
                                className="w-full"
                                disabled={laptop.stock === 0}
                            >
                                {laptop.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </Button>
                        )}
                    </CardFooter>
                </>
            )}
        </Card>
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
                            <Badge variant="secondary" className="mt-4 md:mt-0 text-base px-4 py-2">
                                Signed in as {user.role}
                            </Badge>
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
