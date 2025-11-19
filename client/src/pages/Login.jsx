import { useAuth } from "../context/auth.context.jsx";
import { useForm } from "../hooks/useForm";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

const Login = () => {
    const { login } = useAuth();
    const [formData, handleChange] = useForm({
        email: '',
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData);
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to your Laptomania account</p>
                </div>

                <Card className="shadow-xl border-2">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Login</CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                            </div>

                            <Button type="submit" className="w-full" size="lg">
                                Sign In
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-gray-600">Don't have an account? </span>
                            <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
                                Sign up
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
                </div>
            </div>
        </div>
    )
}

export default Login;
