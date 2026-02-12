import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Track from "./pages/Track";
import About from "./pages/About";
import Services from "./pages/Services";
import AdminReports from "./pages/AdminReports";
import Inbox from "./pages/Inbox";
import ChatBot from "./components/ChatBot";
import Footer from "./components/Footer";
import "./index.css";

console.log("🚀 NaviLogix Client App Starting...");

function App() {
  console.log("✓ App component rendered");
  return (
    <Router>
      <div className="App flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/track/:id" element={<Track />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/reports" element={<AdminReports />} />
          </Routes>
        </main>
        <ChatBot />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
