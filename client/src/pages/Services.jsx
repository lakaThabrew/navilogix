import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ image, title, description, benefits, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: delay, duration: 0.5 }}
    whileHover={{
      y: -10,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    }}
    className="bg-white rounded-[30px] shadow-lg border border-gray-100 flex flex-col group hover:border-secondary/20 transition-all duration-300 relative overflow-hidden h-full"
  >
    {/* Image Header */}
    <div className="h-48 overflow-hidden relative">
      <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
      />
    </div>

    <div className="p-8 flex flex-col flex-grow relative z-20">
      {/* Hover Highlight Line */}
      <div className="absolute top-0 left-8 w-12 h-1 bg-secondary rounded-b-lg"></div>

      <h3 className="text-2xl font-bold mb-4 text-primary mt-4">{title}</h3>
      <p className="text-gray-600 mb-8 leading-relaxed text-sm flex-grow">
        {description}
      </p>

      <ul className="space-y-3 w-full mb-8">
        {benefits.map((benefit, index) => (
          <li
            key={index}
            className="flex items-center text-sm font-medium text-gray-700"
          >
            <span className="w-1.5 h-1.5 bg-secondary rounded-full mr-3"></span>
            {benefit}
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
);

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      image:
        "https://images.unsplash.com/photo-1762313271305-d2de86c2f63f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZXhwcmVzcyUyMHBhcmNlbHxlbnwwfHwwfHx8Mg%3D%3D&auto=format&fit=crop",
      title: "Express Parcel",
      description:
        "Need it there yesterday? Our flagship express service ensures your packages move faster than you can track them.",
      benefits: [
        "Same-Day Options",
        "Real-Time GPS",
        "Priority Handling",
        "Full Insurance",
      ],
    },
    {
      image:
        "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2xvYmFsfGVufDB8fDB8fHwy&auto=format&fit=crop",
      title: "Global Freight",
      description:
        "Our global network spans 120+ countries. We handle customs so you don't have to.",
      benefits: [
        "Customs Clearance",
        "Air & Sea Freight",
        "Door-to-Door",
        "Container Tracking",
      ],
    },
    {
      image:
        "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2070&auto=format&fit=crop",
      title: "Smart Warehousing",
      description:
        "Smart storage located strategically near major transit hubs. Scale your inventory without the overhead.",
      benefits: [
        "Climate-Controlled",
        "Inventory System",
        "Pick & Pack",
        "24/7 Security",
      ],
    },
    {
      image:
        "https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070&auto=format&fit=crop",
      title: "Reverse Logistics",
      description:
        "Returns happen. Make them painless for your customers and profitable for your business.",
      benefits: [
        "Automated Portals",
        "Quality Inspection",
        "Refurbishment",
        "Efficient Restocking",
      ],
    },
    {
      image:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
      title: "AI Optimization",
      description:
        "Our proprietary AI engine calculates the most efficient path for every single package, saving time and fuel.",
      benefits: [
        "Carbon Tracking",
        "Lower Costs",
        "Dynamic Rerouting",
        "Predictive Analytics",
      ],
    },
    {
      image:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032&auto=format&fit=crop",
      title: "Enterprise Solutions",
      description:
        "Tailored solutions for enterprises. We integrate directly with your supply chain.",
      benefits: [
        "API Integration",
        "Dedicated Manager",
        "Volume Discounts",
        "Custom Reporting",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-32">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100 rounded-full blur-[100px] opacity-40 mix-blend-multiply"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-100 rounded-full blur-[100px] opacity-40 mix-blend-multiply"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-extrabold text-primary mb-6 mt-8"
          >
            Our{" "}
            <span className="text-secondary relative inline-block">
              Services
              <svg
                className="absolute w-full h-3 -bottom-1 left-0 text-secondary opacity-30"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </motion.h1>
          <p className="text-xl text-gray-600 max-w-5xl mx-auto leading-relaxed font-light">
            Comprehensive logistics solutions designed to exceed expectations.
            Whether it's a small parcel or a shipping container, we handle it
            with care.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} delay={index * 0.1} />
          ))}
        </div>

        {/* Packages / Pricing Section */}
        <div className="text-center mb-16 mt-32" id="packages">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-primary mb-6"
          >
            Our <span className="text-secondary">Packages</span>
          </motion.h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your delivery needs. Upgrade anytime as
            your requirements grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 max-w-6xl mx-auto px-4">
          {/* Free Package */}
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col relative"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Free</h3>
            <div className="text-4xl font-extrabold text-primary mb-6">
              $0<span className="text-lg font-normal text-gray-500">/mo</span>
            </div>
            <p className="text-gray-600 mb-8">
              Perfect for occasional senders.
            </p>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center text-gray-700 font-medium">
                <span className="text-green-500 mr-3 text-xl">✔</span> Standard
                Delivery
              </li>
              <li className="flex items-center text-gray-700 font-medium">
                <span className="text-green-500 mr-3 text-xl">✔</span> Basic
                Tracking
              </li>
              <li className="flex items-center text-gray-400 font-medium">
                <span className="mr-3 text-xl">✖</span> No Priority Support
              </li>
              <li className="flex items-center text-gray-400 font-medium">
                <span className="mr-3 text-xl">✖</span> No Custom Dashboard
              </li>
            </ul>
            <button
              onClick={() => navigate("/register")}
              className="mt-auto w-full py-3 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all"
            >
              Get Started
            </button>
          </motion.div>

          {/* Plus Package */}
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-gradient-to-b from-primary to-[#0f172a] rounded-3xl p-8 shadow-2xl border border-primary flex flex-col relative transform md:-translate-y-4"
          >
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-secondary text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg tracking-wider">
              POPULAR
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 mt-2">Plus</h3>
            <div className="text-4xl font-extrabold text-white mb-6">
              $9.99
              <span className="text-lg font-normal text-gray-400">/mo</span>
            </div>
            <p className="text-gray-300 mb-8">
              For regular users and small businesses.
            </p>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center text-white font-medium">
                <span className="text-secondary mr-3 text-xl">✔</span> Express
                Delivery Options
              </li>
              <li className="flex items-center text-white font-medium">
                <span className="text-secondary mr-3 text-xl">✔</span> Real-Time
                Live Tracking
              </li>
              <li className="flex items-center text-white font-medium">
                <span className="text-secondary mr-3 text-xl">✔</span> Automated
                Dashboard & Reports
              </li>
              <li className="flex items-center text-white font-medium">
                <span className="text-secondary mr-3 text-xl">✔</span> Priority
                Customer Support
              </li>
            </ul>
            <button
              onClick={() => navigate("/checkout?plan=plus")}
              className="mt-auto w-full py-3 rounded-xl bg-secondary text-white font-bold hover:bg-orange-600 transition-all shadow-lg hover:shadow-secondary/30"
            >
              Buy Plus
            </button>
          </motion.div>

          {/* Pro Package */}
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col relative"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Pro</h3>
            <div className="text-4xl font-extrabold text-primary mb-6">
              $29.99
              <span className="text-lg font-normal text-gray-500">/mo</span>
            </div>
            <p className="text-gray-600 mb-8">
              Enterprise-level features and high volume.
            </p>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center text-gray-700 font-medium">
                <span className="text-green-500 mr-3 text-xl">✔</span> Custom
                Logistics API
              </li>
              <li className="flex items-center text-gray-700 font-medium">
                <span className="text-green-500 mr-3 text-xl">✔</span> AI Route
                Optimization
              </li>
              <li className="flex items-center text-gray-700 font-medium">
                <span className="text-green-500 mr-3 text-xl">✔</span> Dedicated
                Account Manager
              </li>
              <li className="flex items-center text-gray-700 font-medium">
                <span className="text-green-500 mr-3 text-xl">✔</span> Automated
                Reverse Logistics
              </li>
              <li className="flex items-center text-gray-700 font-medium">
                <span className="text-green-500 mr-3 text-xl">✔</span> Discount
                on Sending & Receiving
              </li>
            </ul>
            <button
              onClick={() => navigate("/checkout?plan=pro")}
              className="mt-auto w-full py-3 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all"
            >
              Buy Pro
            </button>
          </motion.div>
        </div>

        {/* Interactive CTA */}
        <div className="relative rounded-[50px] overflow-hidden bg-primary shadow-2xl text-center p-12 md:p-20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          {/* Floating Shapes */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-secondary rounded-full blur-xl opacity-60 animate-bounce-slow"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-400 rounded-full blur-xl opacity-40 animate-pulse"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Ready to Streamline Your Logistics?
            </h2>
            <p className="text-blue-100 mb-10 max-w-2xl mx-auto text-lg">
              Join thousands of businesses that trust NaviLogix for their
              critical shipping needs. Get a quote today and see the difference.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="bg-secondary text-white px-10 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl hover:bg-orange-600 transition-all"
              >
                Get Started Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/contact")}
                className="bg-transparent border-2 border-white/30 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-primary transition-all backdrop-blur-sm"
              >
                Contact Sales
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
