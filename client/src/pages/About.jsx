import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import logger from "../utils/logger";

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const About = () => {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/branches");
        setBranches(response.data);
      } catch (error) {
        logger.error("Error fetching branches:", { error: error.message });
      }
    };
    fetchBranches();
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div
        className="absolute top-[-20%] right-[-30%] w-[1000px] h-[1000px] 
                   bg-secondary/5 rounded-full blur-3xl -z-10 animate-pulse-slow"
      ></div>
      <div className="absolute bottom-[-10%] left-[-20%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <span
            className="bg-blue-100 text-primary px-4 py-1.5 rounded-full text-sm 
          font-semibold tracking-wide uppercase border border-blue-200 mb-6 inline-block"
          >
            Our Story
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-primary mb-8 tracking-tight">
            Revolutionizing <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-500">
              Global Logistics
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            We are not just moving boxes; we are engineering the future of
            commerce. Fast, intelligent, and borderless.
          </p>
        </motion.div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 relative z-10">
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white/80 backdrop-blur-md p-10 rounded-[40px] shadow-xl border border-white/50 group hover:border-blue-200 transition-all duration-500"
          >
            <div className="w-20 h-20 bg-blue-100/50 rounded-2xl flex items-center justify-center mb-8 text-4xl group-hover:scale-110 transition-transform duration-300">
              🚀
            </div>
            <h2 className="text-3xl font-bold mb-4 text-primary">
              Our Mission
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              To empower businesses and individuals with seamless, intelligent,
              and sustainable logistics solutions that bridge distances in the
              blink of an eye.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white/80 backdrop-blur-md p-10 rounded-[40px] shadow-xl border border-white/50 group hover:border-red-200 transition-all duration-500"
          >
            <div className="w-20 h-20 bg-red-100/50 rounded-2xl flex items-center justify-center mb-8 text-4xl group-hover:scale-110 transition-transform duration-300">
              🌍
            </div>
            <h2 className="text-3xl font-bold mb-4 text-primary">Our Vision</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              A world where physical boundaries are no longer barriers to
              commerce, connection, and growth. We aim to be the leading force
              in global trade.
            </p>
          </motion.div>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32 mt-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 leading-tight">
              From Idea to <br />
              <span className="text-secondary">Global Impact</span>
            </h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Founded in 2024, NaviLogix emerged from a simple question: "Why
                is shipping so complex?" Traditional logistics were bogged down
                by paperwork, opacity, and inefficiency.
              </p>
              <p>
                We built NaviLogix on a foundation of AI-driven route
                optimization and a customer-centric philosophy. We wanted to
                create a system that feels effortless to the user — where you
                simply click 'Send', and the rest is taken care of by our
                digital ecosystem.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 relative h-[500px]"
          >
            <div className="absolute inset-0 bg-secondary/10 rounded-[50px] transform rotate-3 scale-105 blur-lg"></div>
            <div className="relative h-full w-full bg-white rounded-[50px] shadow-2xl overflow-hidden border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                alt="Global Network"
                className="w-full h-full object-cover"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>

              <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="font-bold text-primary">
                    Live Connection
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Branches Section */}
        <div className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Our <span className="text-secondary">Branches</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Strategically located across the island to ensure your parcels are
              delivered with speed and precision.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-sm p-4 md:p-8 rounded-[40px] shadow-2xl border border-white/50"
          >
            {/* Branch Contact Details */}
            {branches.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {branches.map((branch) => (
                  <div
                    key={`contact-${branch._id}`}
                    className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-blue-200"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 text-primary rounded-xl flex items-center justify-center text-xl">
                        🏢
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">
                          {branch.branchName}
                        </h3>
                        {branch.contactNumber && (
                          <p className="text-primary font-medium flex items-center gap-1 text-sm mt-1">
                            📞 {branch.contactNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="h-[500px] w-full rounded-3xl overflow-hidden border border-gray-200 relative z-0">
              {branches.length > 0 ? (
                <MapContainer
                  center={[7.8731, 80.7718]}
                  zoom={7}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {branches.map((branch) => (
                    <Marker
                      key={branch._id}
                      position={[
                        branch.coordinates.lat,
                        branch.coordinates.lng,
                      ]}
                    >
                      <Popup className="rounded-xl">
                        <div className="text-center p-1">
                          <strong className="text-primary text-lg block mb-1">
                            {branch.branchName}
                          </strong>
                          {branch.contactNumber && (
                            <span className="text-sm font-medium text-gray-600 block mb-2">
                              📞 {branch.contactNumber}
                            </span>
                          )}
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                            Serving Areas
                          </span>
                          <span className="text-sm text-gray-700 bg-blue-50 px-2 py-1 rounded-md inline-block">
                            {branch.assignedAreas.join(", ")}
                          </span>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-primary rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500 font-medium tracking-wide animate-pulse">
                    🔃 Loading branch network...
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="relative mb-32 rounded-[50px] overflow-hidden bg-primary text-white shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary opacity-20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>

          <div className="relative z-10 p-16 md:p-24 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { val: "5M+", label: "Parcels Delivered" },
              { val: "120+", label: "Countries Served" },
              { val: "99.9%", label: "On-Time Rate" },
              { val: "24/7", label: "AI Support" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-5xl md:text-6xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-blue-200">
                  {stat.val}
                </div>
                <div className="text-blue-200 text-lg font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
