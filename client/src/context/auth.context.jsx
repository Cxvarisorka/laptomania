/* eslint-disable react/prop-types */
import { useContext, useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = import.meta.env.VITE_API_URL + '/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const autoLogin = async () => {
            const res = await fetch(`${API_URL}/auth/auto-login`, {
                method: 'POST',
                credentials: 'include'
            });

            const result = await res.json();

            if(res.ok) {
                setUser(result);
                navigate('/panel');
            }
        };

        autoLogin();
    }, []);

    const signup = async (formData) => {
        const toastId = toast.loading("Creating your account...");

        try {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message);
            }

            // Success toast
            toast.update(toastId, {
                render: result.message || "Signup successful 🎉",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });

            navigate("/login");
        } catch (err) {
            // Error toast
            toast.update(toastId, {
                render: `Error: ${err.message}`,
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    };

    const login = async (formData) => {
        const toastId = toast.loading("Logging in...");

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message);
            }

            setUser(result);

            // Success toast
            toast.update(toastId, {
                render: "Login successful ✅",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });

            navigate("/panel");
        } catch (err) {
            toast.update(toastId, {
                render: `Error: ${err.message}`,
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    };

    const logout = async () => {
        const toastId = toast.loading("Logging out...");

        try {
            const res = await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("User not logged in!");
            }

            // Success toast
            toast.update(toastId, {
                render: "Logged out successfully 👋",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });

            setUser(null);
            navigate("/login");
        } catch (err) {
            toast.update(toastId, {
                render: `Error: ${err.message}`,
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    };

    const googleAuth = () => {
        window.location.href = `${API_URL}/oauth/google`;
    }

    const githubAuth = () => {
        window.location.href = `${API_URL}/oauth/github`;
    }


    return (
        <AuthContext.Provider value={{user, signup, login, logout, googleAuth, githubAuth}}>
            { children }
        </AuthContext.Provider>
    )
}