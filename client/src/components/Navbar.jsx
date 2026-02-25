
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut } from "lucide-react";

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const [isOpen, setIsOpen] = useState(false);

    const logout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Services', path: '/services' },
        { name: 'Contact', path: '/contact' },
    ];

    if (user) {
        navLinks.push({ name: 'Dashboard', path: '/dashboard' });
        if (user.role === 'main_admin') {
            navLinks.push({ name: 'Inbox', path: '/inbox' });
            navLinks.push({ name: 'Reports', path: '/reports' });
        }
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <motion.img
                            src="/logo_bg_removed.png"
                            alt="NaviLogix Logo"
                            className="h-14 w-auto object-contain"
                            whileHover={{ scale: 1.05, rotate: -2 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8 font-medium">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-gray-600 hover:text-primary relative group py-2"
                            >
                                {link.name}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}

                        {user ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={logout}
                                className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                            >
                                Logout
                            </motion.button>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-primary font-semibold hover:text-secondary transition-colors">Login</Link>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/register')}
                                    className="bg-primary text-white px-6 py-2.5 rounded-full shadow-lg hover:bg-gray-800 transition-all font-semibold"
                                >
                                    Register
                                </motion.button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-primary hover:bg-gray-100 p-2 rounded-xl transition-colors"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 shadow-xl overflow-hidden"
                    >
                        <div className="flex flex-col items-center gap-4 py-8 px-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="w-full text-center py-4 text-xl font-bold text-primary bg-gray-50 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {user ? (
                                <button
                                    onClick={() => { logout(); setIsOpen(false) }}
                                    className="w-full flex items-center justify-center gap-2 text-red-500 font-black text-xl py-4 mt-2 border-2 border-red-50"
                                >
                                    <LogOut size={20} /> Logout
                                </button>
                            ) : (
                                <div className="flex flex-col gap-4 mt-4 w-full">
                                    <Link
                                        to="/login"
                                        className="w-full text-center py-4 bg-gray-100 text-primary rounded-2xl font-black shadow-inner"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        LOGIN
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="w-full text-center py-4 bg-primary text-white rounded-2xl font-black shadow-xl"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        REGISTER
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
