import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Track from "./pages/Track";
import About from "./pages/About";
import Services from "./pages/Services";
import AdminReports from "./pages/AdminReports";
import BranchReports from "./pages/BranchReports";
import Inbox from "./pages/Inbox";
import ChatBot from "./components/ChatBot";
import Footer from "./components/Footer";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import "./index.css";
import logger from "./utils/logger";

function App() {
  useEffect(() => {
    logger.info("🚀 NaviLogix Client App Started");

    // Helper: Global Logout
    const logout = () => {
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    };

    // 1. Axios Interceptor: Catch 401 (Unauthorized/Expired)
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          logger.warn("⚠️ [AUTH] Session expired or unauthorized. Logging out...");
          logout();
        }
        return Promise.reject(error);
      }
    );

    // 2. Client-side Expiry Check (Auto-logout while idle)
    let logoutTimer = null;
    const info = localStorage.getItem("userInfo");
    if (info) {
      try {
        const userInfo = JSON.parse(info);
        if (userInfo && userInfo.token) {
          const payloadBase64 = userInfo.token.split(".")[1];
          const decodedPayload = JSON.parse(atob(payloadBase64));
          const expiryTime = decodedPayload.exp * 1000;
          const currentTime = Date.now();

          if (currentTime >= expiryTime) {
            logout();
          } else {
            const timeout = expiryTime - currentTime;
            logoutTimer = setTimeout(() => {
              logger.info("⏱️ [AUTH] Token timer reached. Auto-logging out...");
              logout();
            }, timeout);
          }
        }
      } catch (e) {
        logger.error("Error checking token expiry: " + e.message);
      }
    }

    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <Router>
      <div className="App flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route path="/forgot-password" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/track/:id" element={<Track />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/reports" element={<AdminReports />} />
            <Route path="/branch-reports" element={<BranchReports />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
        <ChatBot />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
