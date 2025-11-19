import { useAuth } from "../context/auth.context.jsx";
import { useForm } from "../hooks/useForm";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

const Signup = () => {
    const { signup } = useAuth();
    const [formData, handleChange] = useForm({
        fullname: '',
        email: '',
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        signup(formData);
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Join Laptomania</h1>
                    <p className="text-gray-600">Create your account and start shopping</p>
                </div>

                <Card className="shadow-xl border-2">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
                        <CardDescription className="text-center">
                            Fill in your details to create a new account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullname">Full Name</Label>
                                <Input 
                                    id="fullname"
                                    type="text" 
                                    value={formData.fullname} 
                                    onChange={handleChange} 
                                    name="fullname" 
                                    placeholder="John Doe" 
                                    required 
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                    id="email"
                                    type="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    name="email" 
                                    placeholder="your.email@example.com" 
                                    required 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input 
                                    id="password"
                                    type="password" 
                                    value={formData.password} 
                                    onChange={handleChange} 
                                    name="password" 
                                    placeholder="••••••••" 
                                    required 
                                />
                                <p className="text-xs text-gray-500">
                                    Password must be at least 8 characters long
                                </p>
                            </div>

                            <Button type="submit" className="w-full" size="lg">
                                Create Account
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-gray-600">Already have an account? </span>
                            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                                Sign in
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
                </div>
            </div>
        </div>
    )
}

export default Signup;
