
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
    ];

    if (user) {
        navLinks.push({ name: 'Dashboard', path: '/dashboard' });
        if (user.role === 'main_admin') {
            navLinks.push({ name: 'Inbox', path: '/inbox' });
        }
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="text-3xl font-bold flex items-center gap-2 tracking-tighter group">
                        <span className="text-secondary group-hover:scale-110 transition-transform duration-300 inline-block">NAVI</span>
                        <span className="text-primary group-hover:text-primary/80 transition-colors">LOGIX</span>
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
                            className="text-primary text-3xl focus:outline-none"
                        >
                            {isOpen ? '✕' : '☰'}
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
                        <div className="flex flex-col items-center gap-6 py-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-xl font-medium text-gray-700 hover:text-secondary transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {user ? (
                                <button
                                    onClick={() => { logout(); setIsOpen(false) }}
                                    className="text-red-500 font-bold text-xl mt-2"
                                >
                                    Logout
                                </button>
                            ) : (
                                <div className="flex flex-col gap-4 mt-2 w-full px-8">
                                    <Link
                                        to="/login"
                                        className="w-full text-center py-3 border border-primary text-primary rounded-xl font-bold"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="w-full text-center py-3 bg-primary text-white rounded-xl font-bold shadow-lg"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Register
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
