import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import logger from "../utils/logger";
import { User, Mail, Lock, CheckCircle, Shield, AlertCircle, CreditCard, Eye, EyeOff } from "lucide-react";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState({
        score: 0,
        label: "Empty",
        color: "bg-gray-200",
    });

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem("userInfo"));
        if (u) {
            setUser(u);
            setName(u.name);
            setEmail(u.email);
        }
    }, []);

    const calculateStrength = (pass) => {
        let score = 0;
        if (pass.length > 5) score++;
        if (pass.length > 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[!@#$%^&*]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;

        const result = { score, label: "Weak", color: "bg-red-500" };
        if (score > 2) { result.label = "Fair"; result.color = "bg-orange-400"; }
        if (score > 3) { result.label = "Good"; result.color = "bg-blue-400"; }
        if (score > 4) { result.label = "Strong"; result.color = "bg-[#41dc8e]"; }
        if (score > 5) { result.label = "Excellent"; result.color = "bg-green-500"; }
        if (pass.length === 0) { result.label = "Empty"; result.score = 0; result.color = "bg-gray-200"; }

        setStrength(result);
    };

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
            logger.info(`🔄 [PROFILE] Sending update request for ${email}${password ? " (with password change)" : ""}`);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put("http://localhost:5000/api/auth/profile", {
                name,
                email,
                password
            }, config);

            logger.info(`✅ [PROFILE] Update successful for ${email}`);

            // Check if email or password was changed to force re-login
            if (email !== user.email || password) {
                logger.info(`🔄 [PROFILE] Sensitive info changed, forcing re-login for ${email}`);
                localStorage.removeItem("userInfo");
                setMessage({ text: "Profile updated! Please log in again with your new credentials. 🔐", type: "success" });
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
                return;
            }

            // Update local storage with new info (including new token)
            localStorage.setItem("userInfo", JSON.stringify(data));
            setUser(data);
            setMessage({ text: "Profile updated successfully! ✨", type: "success" });
            setPassword("");
            setConfirmPassword("");
            logger.info(`✅ [PROFILE] Updated successful for ${email}`);
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

                            {/* Branch Info (if staff) */}
                            {(user.role === 'branch_head' || user.role === 'delivery_person') && (
                                <div className="mt-4 flex flex-col items-center gap-1 group">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm font-semibold">
                                        <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                                        <span>Assigned Branch</span>
                                    </div>
                                    <span className="text-gray-800 font-black uppercase tracking-tight text-lg group-hover:text-primary transition-colors">
                                        {user.branchName || 'No Branch'}
                                    </span>
                                </div>
                            )}

                            {user.role === 'regular' && (
                                <div className={`mt-6 w-full py-2 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${user.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : user.isPlanReserved ? 'bg-amber-100 text-amber-700' : 'bg-orange-100 text-orange-700'}`}>
                                    <CheckCircle size={18} />
                                    {user.paymentStatus === 'paid' ? 'Premium Active' : user.isPlanReserved ? `${user.selectedPlan.toUpperCase()} Reserved` : 'Free Tier'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Update Form */}
                    <div className="md:col-span-2">
                        <div className="floating-card bg-white p-8">
                            <h3 className="text-2xl font-bold text-primary mb-6 border-b border-gray-100 pb-4">Personal Information</h3>
                            
                            {user.isPlanReserved && user.paymentStatus !== 'paid' && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="mb-8 p-6 rounded-[24px] bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-2 opacity-10">
                                        <CreditCard size={80} />
                                    </div>
                                    <div className="flex items-start gap-4 relative z-10">
                                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                                            <AlertCircle size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-amber-900 mb-1">
                                                Subscription Pending: {user.selectedPlan?.toUpperCase()}
                                            </h4>
                                            <p className="text-amber-800/80 text-sm mb-4">
                                                You have reserved the <span className="font-bold">{user.selectedPlan}</span> package, but the payment has not been completed yet.
                                            </p>
                                            <div className="flex flex-wrap gap-3">
                                                <div className="px-3 py-1 bg-white/60 border border-amber-200 rounded-lg text-xs font-bold text-amber-700 flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                                    Payment Gateway: Maintenance
                                                </div>
                                                <button 
                                                    onClick={() => window.location.href="/checkout?plan=" + user.selectedPlan}
                                                    className="px-4 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-all shadow-sm"
                                                >
                                                    Retry Payment
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

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
                                                    type={showPassword ? "text" : "password"}
                                                    className="w-full pl-12 pr-12 py-3 border-none rounded-2xl bg-gray-50 shadow-inset outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder-gray-400"
                                                    placeholder="••••••••"
                                                    value={password}
                                                    onChange={(e) => {
                                                        setPassword(e.target.value);
                                                        calculateStrength(e.target.value);
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            
                                            {/* Strength Meter */}
                                            {password.length > 0 && (
                                                <div className="mt-2 px-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                                                            Strength: <span className={strength.color.replace('bg-', 'text-')}>{strength.label}</span>
                                                        </span>
                                                    </div>
                                                    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(strength.score / 6) * 100}%` }}
                                                            className={`h-full ${strength.color} transition-all duration-500`}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Confirm Password</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Lock size={18} className="text-gray-400" />
                                                </div>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    className="w-full pl-12 pr-12 py-3 border-none rounded-2xl bg-gray-50 shadow-inset outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder-gray-400"
                                                    placeholder="••••••••"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
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
