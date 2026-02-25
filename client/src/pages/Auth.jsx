import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Form states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("regular");

    // Sync mode with URL
    useEffect(() => {
        if (location.pathname === "/register") {
            setIsLogin(false);
        } else {
            setIsLogin(true);
        }
    }, [location]);

    const toggleMode = (mode) => {
        if (mode === "login") {
            setIsLogin(true);
            navigate("/login");
        } else {
            setIsLogin(false);
            navigate("/register");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await axios.post(
                "http://localhost:5000/api/auth/login",
                { email, password }
            );
            localStorage.setItem("userInfo", JSON.stringify(data));
            navigate("/dashboard");
        } catch (error) {
            alert(error.response?.data?.message || "Login Failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (role === "regular") {
                const pay = window.confirm(
                    "Regular accounts come with premium features. Proceed to setup payment?"
                );
                if (!pay) {
                    setIsLoading(false);
                    return;
                }
            }

            const { data } = await axios.post(
                "http://localhost:5000/api/auth/register",
                { name, email, password, role }
            );
            localStorage.setItem("userInfo", JSON.stringify(data));
            navigate("/dashboard");
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-4 pt-32 pb-20 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [0, -90, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]"
                />
            </div>

            <div className="flex w-full max-w-5xl bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100">
                {/* Visual Panel */}
                <div className="hidden md:flex flex-col justify-center items-center w-5/12 p-12 text-white relative transition-all duration-700 bg-[#001F3F]">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? 'login-text' : 'register-text'}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="relative z-10 text-center flex flex-col items-center"
                        >
                            <h1 className="text-4xl font-black mb-6 tracking-tight">
                                {isLogin ? "Welcome Back!" : "Join the Fleet"}
                            </h1>
                            <p className="text-white/70 text-lg mb-12 font-medium leading-relaxed">
                                {isLogin
                                    ? "Access your dashboard and manage your global logistics with NaviLogix AI."
                                    : "Start shipping smarter today. Create your account and unlock priority tracking."}
                            </p>

                            <div className="w-48 h-48 bg-white/10 rounded-[40px] flex items-center justify-center backdrop-blur-md shadow-inner">
                                <span className="text-7xl">{isLogin ? "🔐" : "🚀"}</span>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Content Panel */}
                <div className="w-full md:w-7/12 p-8 md:p-14 flex flex-col justify-center bg-white">
                    {/* LOGO */}
                    <div className="flex justify-center mb-2 transition-transform hover:scale-105 duration-500">
                        <img src="/logo_bg_removed.png" alt="Logo" className="h-48 w-auto object-contain" />
                    </div>

                    {/* MODE TOGGLE (PILL) */}
                    <div className="flex justify-center mb-12">
                        <div className="relative w-full max-w-[320px] h-[60px] bg-gray-100 rounded-full p-1.5 flex items-center shadow-inner">
                            {/* Sliding Background */}
                            <motion.div
                                layoutId="auth-bg"
                                className="absolute h-[48px] rounded-full bg-white shadow-md z-0"
                                initial={false}
                                animate={{
                                    width: 'calc(50% - 6px)',
                                    x: isLogin ? 0 : '100%',
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />

                            <button
                                onClick={() => toggleMode('login')}
                                className={`flex-1 relative z-10 text-sm font-black transition-colors duration-300 ${isLogin ? 'text-[#001F3F]' : 'text-gray-400'}`}
                            >
                                LOGIN
                            </button>
                            <button
                                onClick={() => toggleMode('register')}
                                className={`flex-1 relative z-10 text-sm font-black transition-colors duration-300 ${!isLogin ? 'text-[#001F3F]' : 'text-gray-400'}`}
                            >
                                REGISTER
                            </button>
                        </div>
                    </div>

                    {/* FORMS */}
                    <div className="relative mt-2">
                        <AnimatePresence mode="wait">
                            {isLogin ? (
                                <motion.div
                                    key="login-form"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <form onSubmit={handleLogin} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-[#001F3F]/40 uppercase tracking-widest ml-1">Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl outline-none focus:border-primary/10 transition-all font-semibold"
                                                placeholder="your@email.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-[#001F3F]/40 uppercase tracking-widest ml-1">Password</label>
                                            <input
                                                type="password"
                                                required
                                                className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl outline-none focus:border-primary/10 transition-all font-semibold"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="text-right">
                                            <button type="button" className="text-xs font-bold text-secondary hover:underline">Forgot Password?</button>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-[#001F3F] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-black transition-all flex justify-center items-center gap-3"
                                        >
                                            {isLoading ? "Signing in..." : "Sign In"}
                                            {!isLoading && <span>➡️</span>}
                                        </button>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="register-form"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <form onSubmit={handleRegister} className="space-y-5">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-[#001F3F]/40 uppercase tracking-widest ml-1">Full Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl outline-none focus:border-primary/10 transition-all font-semibold"
                                                    placeholder="John Doe"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-[#001F3F]/40 uppercase tracking-widest ml-1">Account</label>
                                                <select
                                                    className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl outline-none focus:border-primary/10 transition-all font-semibold"
                                                    value={role}
                                                    onChange={(e) => setRole(e.target.value)}
                                                >
                                                    <option value="regular">Regular</option>
                                                    <option value="delivery_person">Delivery</option>
                                                    <option value="branch_head">Branch</option>
                                                    <option value="main_admin">Admin</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-[#001F3F]/40 uppercase tracking-widest ml-1">Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl outline-none focus:border-primary/10 transition-all font-semibold"
                                                placeholder="your@email.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-[#001F3F]/40 uppercase tracking-widest ml-1">Password</label>
                                            <input
                                                type="password"
                                                required
                                                className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl outline-none focus:border-primary/10 transition-all font-semibold"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-[#001F3F] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-black transition-all flex justify-center items-center gap-3"
                                        >
                                            {isLoading ? "Creating..." : "Create Account"}
                                            {!isLoading && <span>🚀</span>}
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
