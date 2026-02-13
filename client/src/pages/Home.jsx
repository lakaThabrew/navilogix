
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
            <div className="relative pt-24 pb-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-center lg:text-left z-10"
                    >
                        <motion.div variants={itemVariants} className="mb-6 flex justify-center lg:justify-start">
                            <span className="bg-blue-100/80 backdrop-blur-sm text-primary px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase border border-blue-200">
                                🚀 Next-Gen Logistics
                            </span>
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold text-primary mb-6 tracking-tight leading-[1.1]">
                            Shipping Made <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-500">Simple & Intelligent</span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Experience the future of delivery with AI-powered routing, real-time tracking, and lightning-fast dispatch. We move your world.
                        </motion.p>

                        {/* Tracking Box */}
                        <motion.div variants={itemVariants} className="relative max-w-xl mx-auto lg:mx-0 mb-12">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-[24px] blur opacity-20 transform translate-y-4 scale-95"></div>
                            <div className="relative bg-white rounded-[24px] shadow-xl p-2 border border-gray-100 flex flex-col sm:flex-row items-center gap-2">
                                <div className="flex-grow w-full sm:w-auto flex items-center px-4 py-3">
                                    <span className="text-2xl mr-3">📦</span>
                                    <input
                                        type="text"
                                        className="w-full bg-transparent border-none outline-none text-gray-700 text-lg placeholder-gray-400"
                                        placeholder="Enter Tracking ID"
                                        value={trackingId}
                                        onChange={(e) => setTrackingId(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={handleTrack}
                                    className="w-full sm:w-auto bg-primary text-white px-8 py-3 rounded-[20px] font-bold text-lg shadow-lg hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 group"
                                >
                                    Track
                                </button>
                            </div>
                        </motion.div>

                        {/* Stats - Compact Version */}
                        <motion.div variants={itemVariants} className="flex flex-wrap justify-center lg:justify-start gap-8 md:gap-12 text-gray-500">
                            <div className="flex items-center gap-3">
                                <div className="text-3xl font-bold text-primary">5M+</div>
                                <div className="text-sm leading-tight">Parcels<br />Delivered</div>
                            </div>
                            <div className="w-px h-10 bg-gray-200 hidden sm:block"></div>
                            <div className="flex items-center gap-3">
                                <div className="text-3xl font-bold text-primary">120+</div>
                                <div className="text-sm leading-tight">Countries<br />Served</div>
                            </div>
                            <div className="w-px h-10 bg-gray-200 hidden sm:block"></div>
                            <div className="flex items-center gap-3">
                                <div className="text-3xl font-bold text-primary">99%</div>
                                <div className="text-sm leading-tight">Customer<br />Satisfaction</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Hero Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative hidden lg:block h-[600px] w-full"
                    >
                        {/* Abstract blobs behind image */}
                        <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl"></div>

                        <div className="relative h-full w-full rounded-[40px] overflow-hidden shadow-2xl border-4 border-white/50 backdrop-blur-xl">
                            <img
                                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop"
                                alt="Modern Logistics Warehouse"
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>

                            {/* Floating Badge */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white flex items-center gap-4 max-w-xs"
                            >
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xl">
                                    ✓
                                </div>
                                <div>
                                    <div className="text-primary font-bold text-sm">Real-time Verified</div>
                                    <div className="text-xs text-gray-500">System operational</div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
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
