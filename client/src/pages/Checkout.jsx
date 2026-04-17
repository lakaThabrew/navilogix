import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import logger from "../utils/logger";

const Checkout = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialPlan = searchParams.get("plan") || "";
    const [selectedPlan, setSelectedPlan] = useState(initialPlan);
    const [checkoutComplete, setCheckoutComplete] = useState(false);

    const plans = {
        plus: {
            name: "Plus Plan",
            price: "$9.99",
            period: "/mo",
            description: "For regular users and small businesses.",
            features: [
                "Express Delivery Options",
                "Real-Time Live Tracking",
                "Automated Dashboard & Reports",
                "Priority Customer Support"
            ],
            color: "from-blue-600 to-indigo-700",
            icon: "🚀"
        },
        pro: {
            name: "Pro Plan",
            price: "$29.99",
            period: "/mo",
            description: "Enterprise-level features and high volume.",
            features: [
                "Custom Logistics API",
                "AI Route Optimization",
                "Dedicated Account Manager",
                "Automated Reverse Logistics",
                "Discount on Services"
            ],
            color: "from-purple-600 to-pink-700",
            icon: "💎"
        }
    };

    const handlePlanSelect = (plan) => {
        logger.info(`🛒 [CHECKOUT] User selected plan: ${plan}`);
        setSelectedPlan(plan);
    };

    const handleConfirmPayment = async () => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (!user) {
            navigate("/login");
            return;
        }

        try {
            logger.info(`💳 [CHECKOUT] Attempting to reserve plan: ${selectedPlan} for user: ${user.email}`);
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.post(
                "http://localhost:5000/api/auth/reserve",
                { plan: selectedPlan },
                config
            );
            
            logger.info(`✅ [CHECKOUT] Plan ${selectedPlan} successfully reserved for user: ${user.email}`);
            // Update local storage with new user info
            localStorage.setItem("userInfo", JSON.stringify({ ...user, ...data }));
            setCheckoutComplete(true);
        } catch (error) {
            console.error("Reservation failed:", error);
            alert("Failed to reserve plan. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Complete Your Subscription</h1>
                    <p className="text-slate-600">Choose your package and upgrade your logistics experience.</p>
                </motion.div>

                {!selectedPlan ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {Object.entries(plans).map(([key, plan]) => (
                            <motion.div
                                key={key}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handlePlanSelect(key)}
                                className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 cursor-pointer group hover:border-blue-500 transition-all"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-3xl mb-6 shadow-lg`}>
                                    {plan.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                                <div className="text-3xl font-extrabold text-blue-600 mb-4">
                                    {plan.price}<span className="text-lg font-normal text-slate-500">{plan.period}</span>
                                </div>
                                <p className="text-slate-600 mb-6">{plan.description}</p>
                                <button className="w-full py-3 rounded-xl bg-slate-100 text-slate-800 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    Select {plan.name}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                ) : !checkoutComplete ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
                    >
                        <div className="flex flex-col md:flex-row">
                            {/* Summary Side */}
                            <div className="md:w-1/2 p-8 md:p-12 bg-slate-50">
                                <button 
                                    onClick={() => setSelectedPlan("")}
                                    className="text-slate-400 hover:text-slate-600 mb-8 flex items-center gap-2 group transition-all"
                                >
                                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to plans
                                </button>
                                <h2 className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm opacity-60">Order Summary</h2>
                                
                                <div className="flex items-center gap-4 mb-8">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plans[selectedPlan].color} flex items-center justify-center text-3xl shadow-lg`}>
                                        {plans[selectedPlan].icon}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900">{plans[selectedPlan].name}</h3>
                                        <p className="text-slate-500">Monthly Subscription</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8 border-t border-slate-200 pt-6">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Subtotal</span>
                                        <span>{plans[selectedPlan].price}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Tax</span>
                                        <span>$0.00</span>
                                    </div>
                                    <div className="flex justify-between text-2xl font-bold text-slate-900 pt-4 border-t border-slate-200">
                                        <span>Total</span>
                                        <span>{plans[selectedPlan].price}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Side */}
                            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                                <div className="text-center mb-8">
                                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                                        💳
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Payment Details</h3>
                                    <p className="text-slate-500">Confirm your subscription to continue.</p>
                                </div>

                                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
                                    <h4 className="text-amber-800 font-bold mb-2 flex items-center gap-2">
                                        <span>⚠️</span> System Notice
                                    </h4>
                                    <p className="text-amber-700 text-sm leading-relaxed">
                                        Our payment processing gateway is currently undergoing maintenance. Would you like to proceed with the reservation of this package?
                                    </p>
                                </div>

                                <button
                                    onClick={handleConfirmPayment}
                                    className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all transform hover:-translate-y-1 active:scale-95"
                                >
                                    Confirm & Proceed
                                </button>
                                <p className="text-center text-slate-400 text-xs mt-6">
                                    Secure encryption provided by NaviLogix Pay Service.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-12 text-center shadow-2xl border border-green-100 max-w-lg mx-auto"
                    >
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 animate-bounce-slow">
                            ✓
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Plan Reserved!</h2>
                        <p className="text-slate-600 mb-8 leading-relaxed">
                            Thank you for choosing the <span className="font-bold text-blue-600">{plans[selectedPlan].name}</span>. 
                            As mentioned, payment cannot proceed right now due to maintenance. We have noted your interest and will automatically contact you once the system is live!
                        </p>
                        <div className="flex gap-4">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="flex-1 py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg"
                        >
                            Back to Dashboard
                        </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
