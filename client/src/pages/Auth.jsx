import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

import logger from "../utils/logger";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Modes: 'login' | 'register' | 'forgot' | 'reset'
  const [mode, setMode] = useState("login");
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("regular");
  const [resetToken, setResetToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState({
    score: 0,
    label: "Empty",
    color: "bg-gray-200",
  });

  // Sync mode with URL
  useEffect(() => {
    if (location.pathname === "/register") {
      setMode("register");
    } else if (location.pathname === "/forgot-password") {
      setMode("forgot");
    } else {
      setMode("login");
    }
    setShowPassword(false);
  }, [location]);

  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length > 5) score++;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    const result = { score, label: "Weak", color: "bg-red-500" };
    if (score > 2) {
      result.label = "Fair";
      result.color = "bg-orange-400";
    }
    if (score > 3) {
      result.label = "Good";
      result.color = "bg-blue-400";
    }
    if (score > 4) {
      result.label = "Strong";
      result.color = "bg-green-500";
    }
    if (pass.length === 0) {
      result.label = "Empty";
      result.score = 0;
      result.color = "bg-gray-200";
    }

    setStrength(result);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/dashboard");
    } catch (error) {
      logger.error("Login error:", error);
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
          "Regular accounts come with premium features. Proceed to setup payment?",
        );
        if (!pay) {
          setIsLoading(false);
          return;
        }
      }

      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password, role },
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email },
      );
      alert("Reset token generated! Check your email for the token.");
      setMode("reset");
    } catch (error) {
      logger.error("Forgot password error:", error);
      alert(error.response?.data?.message || "Failed to initiate reset");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        token: resetToken,
        password,
      });
      alert("Password reset successful! Please login.");
      setMode("login");
    } catch (error) {
      alert(error.response?.data?.message || "Reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-4 pt-32 pb-20 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
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
              key={mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 text-center flex flex-col items-center"
            >
              <h1 className="text-4xl font-black mb-6 tracking-tight">
                {mode === "login" ? (
                  <>
                    Welcome{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-500">
                      Back!
                    </span>
                  </>
                ) : mode === "register" ? (
                  <>
                    Join the{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-500">
                      Fleet
                    </span>
                  </>
                ) : mode === "forgot" ? (
                  <>
                    Recover{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-500">
                      Access
                    </span>
                  </>
                ) : (
                  <>
                    Secure{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-500">
                      Account
                    </span>
                  </>
                )}
              </h1>
              <p className="text-white/70 text-lg mb-12 font-medium leading-relaxed">
                {mode === "login"
                  ? "Access your dashboard and manage your global logistics with NaviLogix AI."
                  : mode === "register"
                    ? "Start shipping smarter today. Create your account and unlock priority tracking."
                    : mode === "forgot"
                      ? "Enter your email to receive a recovery token for your account."
                      : "Choose a strong new password to regain access to your dashboard."}
              </p>

              <div className="w-48 h-48 bg-white/10 rounded-[40px] flex items-center justify-center backdrop-blur-md shadow-inner">
                <span className="text-7xl">
                  {mode === "login"
                    ? "🔐"
                    : mode === "register"
                      ? "🚀"
                      : mode === "forgot"
                        ? "📧"
                        : "🛡️"}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Content Panel */}
        <div className="w-full md:w-7/12 p-8 md:p-14 flex flex-col justify-center bg-white">
          {/* LOGO */}
          <div className="flex justify-center mb-2 transition-transform hover:scale-105 duration-500">
            <img
              src="/logo_bg_removed.png"
              alt="Logo"
              className="h-48 w-auto object-contain"
            />
          </div>

          {/* MODE TOGGLE (Only for Login/Register) */}
          {(mode === "login" || mode === "register") && (
            <div className="flex justify-center mb-12">
              <div className="relative w-full max-w-[320px] h-[60px] bg-gray-100 rounded-full p-1.5 flex items-center shadow-inner">
                <motion.div
                  layoutId="auth-bg"
                  className="absolute h-[48px] rounded-full bg-white shadow-md z-0"
                  initial={false}
                  animate={{
                    width: "calc(50% - 6px)",
                    x: mode === "login" ? 0 : "100%",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />

                <button
                  onClick={() => navigate("/login")}
                  className={`flex-1 relative z-10 text-sm font-black transition-colors duration-300 ${mode === "login" ? "text-[#001F3F]" : "text-gray-400"}`}
                >
                  LOGIN
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className={`flex-1 relative z-10 text-sm font-black transition-colors duration-300 ${mode === "register" ? "text-[#001F3F]" : "text-gray-400"}`}
                >
                  REGISTER
                </button>
              </div>
            </div>
          )}

          {/* FORMS */}
          <div className="relative mt-2">
            <AnimatePresence mode="wait">
              {mode === "login" && (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-[#001F3F]/40 uppercase tracking-widest ml-1">
                        Email Address
                      </label>
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
                      <label className="text-xs font-black text-[#001F3F]/40 uppercase tracking-widest ml-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          className="w-full bg-gray-50 border-2 border-transparent p-4 pr-12 rounded-2xl outline-none focus:border-primary/10 transition-all font-semibold"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-xs font-bold text-secondary hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#001F3F] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-black transition-all flex justify-center items-center gap-3"
                    >
                      {isLoading ? "Signing in..." : "SIGN IN"}
                    </button>
                  </form>
                </motion.div>
              )}

              {mode === "register" && (
                <motion.div
                  key="register-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <form onSubmit={handleRegister} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-[#001F3F]/40 uppercase tracking-widest ml-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl outline-none focus:border-primary/10 transition-all font-semibold"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-[#001F3F]/40 uppercase tracking-widest ml-1">
                          Email Address
                        </label>
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
                        <label className="text-xs font-black text-[#001F3F]/40 uppercase tracking-widest ml-1">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            className="w-full bg-gray-50 border-2 border-transparent p-4 pr-12 rounded-2xl outline-none focus:border-primary/10 transition-all font-semibold"
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
                            {showPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                        </div>
                        {/* Strength Meter */}
                        {password.length > 0 && (
                          <div className="px-1 pt-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                                Security Strength
                              </span>
                              <span
                                className={`text-[10px] font-black uppercase tracking-wider ${strength.label === "Strong" ? "text-green-500" : "text-orange-400"}`}
                              >
                                {strength.label}
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${(strength.score / 5) * 100}%`,
                                }}
                                className={`h-full ${strength.color} transition-all duration-500`}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#001F3F] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-black transition-all flex justify-center items-center gap-3"
                    >
                      {isLoading ? "Creating..." : "Create Account"}
                    </button>
                  </form>
                </motion.div>
              )}

              {mode === "forgot" && (
                <motion.div
                  key="forgot-form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  <form onSubmit={handleForgot} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-[#001F3F]/40 uppercase tracking-widest ml-1">
                        Recovery Email
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl outline-none focus:border-primary/10 transition-all font-semibold"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#001F3F] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-black transition-all flex justify-center items-center gap-3"
                    >
                      {isLoading ? "Sending..." : "Send Token"}
                      {!isLoading && <span>📩</span>}
                    </button>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="text-xs font-black text-secondary uppercase tracking-widest hover:underline"
                      >
                        Back to Login
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {mode === "reset" && (
                <motion.div
                  key="reset-form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  <form onSubmit={handleReset} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-[#001F3F]/40 uppercase tracking-widest ml-1">
                        Reset Token
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl outline-none focus:border-primary/10 transition-all font-semibold"
                        placeholder="Paste token here"
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-[#001F3F]/40 uppercase tracking-widest ml-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          className="w-full bg-gray-50 border-2 border-transparent p-4 pr-12 rounded-2xl outline-none focus:border-primary/10 transition-all font-semibold"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-[#001F3F]/40 uppercase tracking-widest ml-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          className="w-full bg-gray-50 border-2 border-transparent p-4 pr-12 rounded-2xl outline-none focus:border-primary/10 transition-all font-semibold"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-secondary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:brightness-110 transition-all flex justify-center items-center gap-3"
                    >
                      {isLoading ? "Resetting..." : "Update Password"}
                      {!isLoading && <span>🛡️</span>}
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
