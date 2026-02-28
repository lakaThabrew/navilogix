import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import logger from "../utils/logger";
import { User, Mail, Lock, CheckCircle, Shield } from "lucide-react";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem("userInfo"));
        if (u) {
            setUser(u);
            setName(u.name);
            setEmail(u.email);
        }
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage({ text: "", type: "" });

        if (password && password !== confirmPassword) {
            setMessage({ text: "Passwords do not match!", type: "error" });
            return;
        }

        setIsUpdating(true);
        logger.info(`🔄 [PROFILE] Updating profile for ${email}`);

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put("http://localhost:5000/api/auth/profile", {
                name,
                email,
                password
            }, config);

            // Update local storage with new info (including new token)
            localStorage.setItem("userInfo", JSON.stringify(data));
            setUser(data);
            setMessage({ text: "Profile updated successfully! ✨", type: "success" });
            setPassword("");
            setConfirmPassword("");
            logger.info("✅ [PROFILE] Update successful");
        } catch (error) {
            logger.error(`❌ [PROFILE] Update failed: ${error.message}`);
            setMessage({ text: error.response?.data?.message || "Failed to update profile.", type: "error" });
        } finally {
            setIsUpdating(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen pt-32 pb-16 px-4 bg-background relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>

            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {/* Left Panel: User Summary Card */}
                    <div className="md:col-span-1">
                        <div className="floating-card bg-white p-8 text-center flex flex-col items-center">
                            <div className="w-32 h-32 bg-gradient-to-br from-primary to-blue-400 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg mb-6 border-4 border-white outline outline-4 outline-primary/10">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                            <p className="text-gray-500 mb-4">{user.email}</p>
                            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                                <Shield size={16} />
                                {user.role.replace('_', ' ').toUpperCase()}
                            </span>

                            {user.role === 'regular' && (
                                <div className={`mt-6 w-full py-2 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${user.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    <CheckCircle size={18} />
                                    {user.paymentStatus === 'paid' ? 'Premium Active' : 'Free Tier'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Update Form */}
                    <div className="md:col-span-2">
                        <div className="floating-card bg-white p-8">
                            <h3 className="text-2xl font-bold text-primary mb-6 border-b border-gray-100 pb-4">Personal Information</h3>

                            {message.text && (
                                <div className={`p-4 mb-6 rounded-xl font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full pl-12 pr-4 py-3 border-none rounded-2xl bg-gray-50 shadow-inset outline-none focus:ring-2 focus:ring-primary/20 transition-all text-gray-700"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            className="w-full pl-12 pr-4 py-3 border-none rounded-2xl bg-gray-50 shadow-inset outline-none focus:ring-2 focus:ring-primary/20 transition-all text-gray-700"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Section */}
                                <div className="pt-6 border-t border-gray-100">
                                    <h4 className="text-lg font-bold text-gray-800 mb-4">Change Password</h4>
                                    <p className="text-sm text-gray-500 mb-6">Leave blank if you do not want to change your password.</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">New Password</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Lock size={18} className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="password"
                                                    className="w-full pl-12 pr-4 py-3 border-none rounded-2xl bg-gray-50 shadow-inset outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder-gray-400"
                                                    placeholder="••••••••"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Confirm Password</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Lock size={18} className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="password"
                                                    className="w-full pl-12 pr-4 py-3 border-none rounded-2xl bg-gray-50 shadow-inset outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder-gray-400"
                                                    placeholder="••••••••"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        className="btn-primary py-3 px-8 font-bold flex items-center gap-2"
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                Updating...
                                            </>
                                        ) : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
