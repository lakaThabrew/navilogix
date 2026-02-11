import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("regular");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(
      "📝 [CLIENT REGISTER] Attempting registration for:",
      email,
      "Role:",
      role,
    );
    setIsLoading(true);

    try {
      if (role === "regular") {
        console.log(
          "💳 [CLIENT REGISTER] Regular user - prompting for payment...",
        );
        const pay = window.confirm(
          "Regular accounts come with premium features. Proceed to setup payment?",
        );
        if (!pay) {
          console.log("❌ [CLIENT REGISTER] User cancelled payment");
          setIsLoading(false);
          return;
        }
        console.log("✓ [CLIENT REGISTER] User accepted payment");
      }

      console.log("📤 [CLIENT REGISTER] Sending registration request...");
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password, role },
      );
      console.log(
        "✅ [CLIENT REGISTER] Registration successful! User:",
        data.name,
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      console.log("💾 [CLIENT REGISTER] User info saved to localStorage");
      // Simulate a brief loading state for better UX
      setTimeout(() => {
        console.log("➡️ [CLIENT REGISTER] Navigating to dashboard...");
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error(
        "❌ [CLIENT REGISTER] Registration failed:",
        error.response?.data?.message || error.message,
      );
      alert(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="flex w-full max-w-6xl bg-white/50 backdrop-blur-lg rounded-[30px] shadow-2xl overflow-hidden border border-white/20">
        {/* Left Side - Visuals */}
        <div className="hidden lg:flex flex-col justify-center items-center w-1/2 p-12 bg-gradient-to-br from-orange-400 to-red-500 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center flex flex-col items-center"
          >
            <h1 className="text-5xl font-bold mb-6">Join NaviLogix</h1>
            <p className="text-orange-100 text-xl mb-12 max-w-md mx-auto">
              Start shipping smarter today. Create your account and unlock the
              power of AI-driven logistics.
            </p>

            <div className="relative w-80 h-80">
              <div className="absolute inset-0 border-4 border-cyan-300/50 rounded-full animate-spin-slow"></div>
              <div
                className="absolute inset-4 border-4 border-cyan-300/30 rounded-full animate-spin-slow animation-delay-2000"
                style={{ animationDirection: "reverse" }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-9xl animate-bounce-slow">🚀</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-center md:text-left mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                Create Account
              </h2>
              <p className="text-gray-500">Sign up in less than 2 minutes.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="input-field bg-white focus:ring-secondary/20 transition-all"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                    Account Type
                  </label>
                  <div className="relative">
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="input-field bg-white appearance-none cursor-pointer focus:ring-secondary/20 pr-10"
                    >
                      <option value="regular">Regular User</option>
                      <option value="delivery_person">Delivery Person</option>
                      <option value="branch_head">Branch Head</option>
                      <option value="main_admin">Main Admin</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="input-field bg-white focus:ring-secondary/20 transition-all"
                  placeholder="name@company.com"
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
                  className="input-field bg-white focus:ring-secondary/20 transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-400 mt-1 ml-1">
                  Must be at least 8 characters long.
                </p>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 text-secondary rounded focus:ring-secondary/20"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <span className="text-secondary font-bold cursor-pointer hover:underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-secondary font-bold cursor-pointer hover:underline">
                    Privacy Policy
                  </span>
                  .
                </label>
              </div>

              <button
                type="submit"
                className="btn-secondary w-full py-4 text-lg font-bold shadow-lg mt-4 hover:bg-orange-600 hover:shadow-xl transform hover:-translate-y-1 transition-all flex justify-center items-center"
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
                  "Create My Account"
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-secondary cursor-pointer font-bold hover:underline"
              >
                Log in instead
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
