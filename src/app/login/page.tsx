"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/lib/apiClient";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            
            const data = await apiClient("/inspectors/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            console.log("Login successful:", data);
            
            if (data.success && data.data) {
                login(data.data);
                router.push("/");
            } else {
                 throw new Error(data.message || "Login failed");
            }
            
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Side - Image Section */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#0f4c6e]">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <Image
                        src="/login.png"
                        alt="Ship at sea"
                        fill
                        className="object-cover object-top opacity-100 "
                        priority
                    />

                </div>

            </div>

            {/* Right Side - Form Section */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 md:px-16 lg:px-24 xl:px-32 py-12 relative">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in to your Account</h1>
                    <p className="text-gray-500 mb-8 text-sm">
                        Don't have an account? <Link href="/signup" className="text-gray-900 font-semibold underline">Sign Up</Link>
                    </p>

                    {error && (
                        <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm text-gray-500 mb-2" htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your Email ID"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1F9EBD]/50 focus:border-[#1F9EBD] transition-all placeholder-gray-300 text-gray-800"
                                required
                            />
                        </div>

                        <div className="relative">
                            <div className="flex justify-between mb-2">
                                <label className="block text-sm text-gray-500" htmlFor="password">Password</label>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter Password"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1F9EBD]/50 focus:border-[#1F9EBD] transition-all placeholder-gray-300 text-gray-800 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember-me"
                                    className="w-4 h-4 rounded border-gray-300 text-[#1B6486] focus:ring-[#1B6486]"
                                />
                                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-500 font-medium">Remember me</label>
                            </div>
                            <Link href="/forgot-password" className="text-sm font-semibold text-[#1B6486] hover:underline">
                                Forgot Password ?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-[#C4C4C4] hover:bg-[#b0b0b0] text-white font-semibold rounded-lg shadow-sm transition-colors text-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                "Log In"
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-400">Or login with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            {/* Google Icon */}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.7663 12.2764C23.7663 11.4607 23.7001 10.6406 23.5882 9.83807H12.2402V14.4591H18.722C18.453 15.9494 17.5887 17.2678 16.3232 18.1056V21.1039H20.1903C22.461 19.0139 23.7663 15.9274 23.7663 12.2764Z" fill="#4285F4" />
                                <path d="M12.24 24.0008C15.4764 24.0008 18.2057 22.9382 20.1942 21.1039L16.3271 18.1055C15.2514 18.8375 13.8624 19.252 12.2443 19.252C9.11361 19.252 6.4592 17.1399 5.50678 14.3003H1.51633V17.3912C3.55344 21.4434 7.70263 24.0008 12.24 24.0008Z" fill="#34A853" />
                                <path d="M5.50277 14.3003C5.00209 12.8099 5.00209 11.1961 5.50277 9.70575V6.61481H1.51654C-0.185244 10.0056 -0.185244 14.0004 1.51654 17.3912L5.50277 14.3003Z" fill="#FBBC05" />
                                <path d="M12.24 4.74966C13.9507 4.7232 15.6042 5.36697 16.8437 6.54867L20.2693 3.12262C18.0998 1.0855 15.2205 -0.0344664 12.24 0.000808666C7.70263 0.000808666 3.55344 2.55822 1.51633 6.61481L5.50256 9.70575C6.45037 6.86173 9.10933 4.74966 12.24 4.74966Z" fill="#EA4335" />
                            </svg>
                            <span className="font-semibold text-gray-600 text-sm">Google</span>
                        </button>
                        <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            {/* Facebook Icon */}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 12.0605C22 6.50455 17.5229 2 12 2C6.47715 2 2 6.50455 2 12.0605C2 17.0828 5.65684 21.2452 10.4375 21.9795V14.9636H7.89844V12.0605H10.4375V9.84504C10.4375 7.32296 11.9305 5.93012 14.2146 5.93012C15.3088 5.93012 16.4531 6.12663 16.4531 6.12663V8.60253H15.1922C13.95 8.60253 13.5625 9.37877 13.5625 10.1741V12.0605H16.3359L15.8926 14.9636H13.5625V21.9795C18.3432 21.2452 22 17.0828 22 12.0605Z" fill="#1877F2" />
                            </svg>
                            <span className="font-semibold text-gray-600 text-sm">Facebook</span>
                        </button>
                    </div>

                    <div className="mt-12 text-xs text-gray-400 text-center leading-relaxed">
                        By signing up, you agree to the <a href="#" className="font-medium text-gray-600">Terms of Service</a> and <a href="#" className="font-medium text-gray-600">Data Processing Agreement</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
