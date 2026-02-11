
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
    const [trackingId, setTrackingId] = useState('');
    const navigate = useNavigate();

    const handleTrack = (e) => {
        e.preventDefault();
        if (trackingId.trim()) {
            navigate(`/track/${trackingId}`);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-blue-300/10 rounded-full blur-2xl"></div>

            {/* Hero Section */}
            <div className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-7xl mx-auto text-center"
                >
                    <motion.div variants={itemVariants} className="mb-8 flex justify-center">
                        <span className="bg-blue-100 text-primary px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase border border-blue-200">
                            🚀 Next-Gen Logistics
                        </span>
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold text-primary mb-8 tracking-tight leading-tight">
                        Shipping Made <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-500">Simple & Intelligent</span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Experience the future of delivery with AI-powered routing, real-time tracking, and lightning-fast dispatch. We move your world.
                    </motion.p>

                    {/* Tracking Box */}
                    <motion.div variants={itemVariants} className="relative max-w-2xl mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-[30px] blur opacity-20 transform translate-y-4 scale-95"></div>
                        <div className="relative bg-white rounded-[30px] shadow-2xl p-2 md:p-3 border border-gray-100 flex flex-col md:flex-row items-center gap-2">
                            <div className="flex-grow w-full md:w-auto flex items-center px-4 py-2">
                                <span className="text-2xl mr-3">📦</span>
                                <input
                                    type="text"
                                    className="w-full bg-transparent border-none outline-none text-gray-700 text-lg placeholder-gray-400"
                                    placeholder="Enter Tracking ID (e.g. NV-8839)"
                                    value={trackingId}
                                    onChange={(e) => setTrackingId(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleTrack}
                                className="w-full md:w-auto bg-primary text-white px-8 py-4 rounded-[24px] font-bold text-lg shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                            >
                                Track
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div variants={itemVariants} className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 text-gray-500">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-2xl text-primary">5M+</span>
                            <span className="text-sm">Parcels<br />Delivered</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-2xl text-primary">120+</span>
                            <span className="text-sm">Countries<br />Served</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-2xl text-primary">99%</span>
                            <span className="text-sm">Customer<br />Satisfaction</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: "🚀", title: "Super Fast Delivery", desc: "Our AI optimizes routes in real-time to ensure the fastest delivery times possible." },
                        { icon: "📍", title: "Live Tracking", desc: "End-to-end visibility. Know exactly where your package is at every second." },
                        { icon: "🛡️", title: "Secure Handling", desc: "From pickup to drop-off, your items are handled with maximum security and care." }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -10 }}
                            className="bg-white p-8 rounded-[30px] shadow-lg border border-gray-50 flex flex-col items-center text-center group hover:border-secondary/20 transition-colors duration-300"
                        >
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-secondary/10 group-hover:scale-110 transition-all duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-5xl mx-auto px-4 pb-24">
                <div className="bg-primary rounded-[40px] p-10 md:p-16 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">Ready to Ship Smarter?</h2>
                    <p className="text-blue-100 max-w-2xl mx-auto mb-10 text-lg relative z-10">
                        Join thousands of businesses and individuals who trust NaviLogix for their daily logistics needs.
                    </p>
                    <button onClick={() => navigate('/register')} className="bg-white text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-secondary hover:text-white transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 relative z-10">
                        Get Started Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
