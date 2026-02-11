import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔐 [CLIENT LOGIN] Attempting login for:", email);
    setIsLoading(true);
    try {
      console.log("📤 [CLIENT LOGIN] Sending login request...");
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
      );
      console.log(
        "✅ [CLIENT LOGIN] Login successful! User:",
        data.name,
        "Role:",
        data.role,
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      console.log("💾 [CLIENT LOGIN] User info saved to localStorage");
      console.log("➡️ [CLIENT LOGIN] Navigating to dashboard...");
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "❌ [CLIENT LOGIN] Login failed:",
        error.response?.data?.message || error.message,
      );
      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="flex w-full max-w-5xl bg-white/50 backdrop-blur-lg rounded-[30px] shadow-2xl overflow-hidden border border-white/20">
        {/* Left Side - Visuals */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 p-12 bg-gradient-to-br from-primary to-[#003366] text-white relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center flex flex-col items-center"
          >
            <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-blue-200 text-lg mb-8">
              Access your dashboard and manage your logistics with lightning
              speed.
            </p>
            <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner animate-bounce-slow mt-8">
              <span className="text-8xl justify-center">🔐</span>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-center md:text-left mb-10">
              <h2 className="text-3xl font-bold text-primary mb-2">
                Login to NaviLogix
              </h2>
              <p className="text-gray-500">
                Please enter your credentials to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="input-field bg-white focus:bg-blue-50 transition-colors"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  className="input-field bg-white focus:bg-blue-50 transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="text-right mt-2">
                  <span className="text-sm text-secondary hover:underline cursor-pointer">
                    Forgot Password?
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-4 text-lg font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex justify-center items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-gray-600">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-secondary cursor-pointer font-bold hover:underline"
              >
                Create an account
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
