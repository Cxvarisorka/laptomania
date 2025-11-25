import { Link } from 'react-router';
import { useAuth } from '../context/auth.context';
import { useState } from 'react';
import { useLaptop } from '../context/laptops.context';

const Nav = () => {
    const { user, logout } = useAuth();
    const { cart, addToCart, reduceOne, removeProduct, clearCart } = useLaptop();
    const [isOpen, setIsOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const totalItems = cart.reduce((prev, cur) => prev + cur.quantity, 0);
    const totalPrice = cart.reduce((prev, cur) => prev + (cur.price * cur.quantity), 0);

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <span className="text-3xl">💻</span>
                            <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Laptomania
                            </span>
                        </Link>
                        
                        <ul className="hidden md:flex ml-8 space-x-1">
                            <li>
                                <Link to="/" className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/laptops" className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                    Laptops
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="hidden md:flex items-center gap-2">
                        {user ? (
                            <>
                                <button onClick={() => setIsOpen(true)} className="relative text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors">
                                    🛒 Cart
                                    {totalItems > 0 && (
                                        <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-indigo-600 text-white rounded-full font-semibold">
                                            {totalItems}
                                        </span>
                                    )}
                                </button>
                                <Link to="/panel"><button className="h-9 px-3 text-sm inline-flex items-center justify-center rounded-md font-medium transition-colors hover:bg-gray-100 text-gray-900">Panel</button></Link>
                                <button onClick={logout} className="h-9 px-3 text-sm inline-flex items-center justify-center rounded-md font-medium transition-colors text-red-600 hover:text-red-700 hover:bg-red-50">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login"><button className="h-9 px-3 text-sm inline-flex items-center justify-center rounded-md font-medium transition-colors hover:bg-gray-100 text-gray-900">Login</button></Link>
                                <Link to="/signup"><button className="h-9 px-3 text-sm inline-flex items-center justify-center rounded-md font-medium transition-colors bg-indigo-600 text-white hover:bg-indigo-700 shadow-md">Sign Up</button></Link>
                            </>
                        )}
                    </div>

                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <ul className="space-y-2">
                            <li><Link to="/" className="block text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-md text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
                            <li><Link to="/laptops" className="block text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-md text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Laptops</Link></li>
                            {user ? (
                                <>
                                    <li><button onClick={() => { setIsOpen(true); setMobileMenuOpen(false); }} className="w-full text-left text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-md text-sm font-medium">🛒 Cart {totalItems > 0 && `(${totalItems})`}</button></li>
                                    <li><Link to="/panel" className="block text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-md text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Panel</Link></li>
                                    <li><button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full text-left text-red-600 hover:bg-red-50 px-4 py-2 rounded-md text-sm font-medium">Logout</button></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/login" className="block text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-md text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Login</Link></li>
                                    <li><Link to="/signup" className="block bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium text-center" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link></li>
                                </>
                            )}
                        </ul>
                    </div>
                )}
            </nav>

            <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <h2 className="text-xl font-semibold">Shopping Cart</h2>
                    <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 rounded-full p-2 transition">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col h-[calc(100%-64px)]">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {cart.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4">🛒</div>
                                <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
                                <p className="text-gray-400 text-sm">Add some laptops to get started!</p>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div key={item._id} className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                                    <div className="flex gap-3">
                                        <img src={item.images?.[0]?.url} alt={item.model} className="w-20 h-20 object-cover rounded-lg" />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-sm truncate">{item.brand} {item.model}</h3>
                                            <p className="text-indigo-600 font-bold text-lg">${item.price}</p>

                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                                    <button onClick={() => reduceOne(item)} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition">−</button>
                                                    <span className="px-3 text-gray-800 select-none min-w-[2rem] text-center">{item.quantity}</span>
                                                    <button onClick={() => addToCart(item)} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition">+</button>
                                                </div>
                                                <button onClick={() => removeProduct(item)} className="text-red-600 hover:text-red-700 text-sm font-medium">Remove</button>
                                            </div>

                                            <p className="text-gray-600 text-sm mt-1">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {cart.length > 0 && (
                        <div className="border-t bg-gray-50 p-4 space-y-3">
                            <div className="flex justify-between items-center text-lg font-semibold">
                                <span>Total:</span>
                                <span className="text-indigo-600">${totalPrice.toFixed(2)}</span>
                            </div>
                            <button className="w-full h-11 px-8 text-lg inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 shadow-md">Proceed to Checkout</button>
                            <button onClick={clearCart} className="w-full h-11 px-8 text-lg inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 border border-gray-300 bg-white hover:bg-gray-100 text-gray-900">Clear Cart</button>
                        </div>
                    )}
                </div>
            </div>

            {isOpen && (
                <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity" />
            )}
        </header>
    );
};

export default Nav;
