import React, { useState } from "react";
import { motion } from "framer-motion";
import RadialShareMenu from "../components/RadialShareMenu";
import { useForm, ValidationError } from "@formspree/react";

const Contact = () => {
  const [state, handleSubmitFormspree] = useForm(
    import.meta.env.VITE_FORMSPREE_FORM_ID,
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSubmitFormspree(e);

    if (state.succeeded) {
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }, 3000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-12 pb-20">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl opacity-50"></div>

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] left-[10%] w-[150px] h-[150px] border-2 border-primary/5 rounded-[30%] blur-sm"
      ></motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[20%] right-[10%] w-[200px] h-[200px] border-2 border-secondary/5 rounded-[40%] blur-sm"
      ></motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-10"
        >
          <motion.div variants={itemVariants} className="inline-block">
            <span className="bg-[#EBF5FF] text-primary px-6 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border border-blue-100 shadow-sm">
              Connect Directly
            </span>
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="mt-3 text-5xl md:text-7xl font-black text-[#001F3F] tracking-tight leading-tight"
          >
            Let's Start a <span className="text-[#FF4136]">Conversation</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-2 text-gray-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed"
          >
            Ready to optimize your global logistics? Our experts are standing by
            to help you navigate the future of delivery.
          </motion.p>
        </motion.div>

        {/* 2-Column Grid: Form Left, Info Right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-x-12 gap-y-16 items-start">
          {/* Action Center (Form) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full flex justify-center lg:justify-start"
          >
            <div className="bg-[#F8F9FA] p-10 md:p-12 rounded-[50px] shadow-2xl border border-white w-full max-w-[600px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>

              {state.succeeded ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 shadow-inner">
                    ✓
                  </div>
                  <h2 className="text-3xl font-black text-[#001F3F] mb-4">
                    Message Dispatched!
                  </h2>
                  <p className="text-gray-600">We'll get back to you soon!</p>
                </motion.div>
              ) : (
                <>
                  <h2 className="mt-3 mb-3 text-xl md:text-3xl font-black text-[#001F3F] tracking-tight leading-tight">
                    {" "}
                    Contact Form
                  </h2>
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-8 relative z-10"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-xs font-black text-[#001F3F]/60 ml-1 uppercase tracking-widest">
                          Full Identity
                        </label>
                        <input
                          required
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full bg-white border-2 border-transparent p-5 rounded-2xl shadow-sm outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-[15px] font-semibold"
                        />
                        <ValidationError
                          prefix="Name"
                          field="name"
                          errors={state.errors}
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black text-[#001F3F]/60 ml-1 uppercase tracking-widest">
                          Digital Mail
                        </label>
                        <input
                          required
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="w-full bg-white border-2 border-transparent p-5 rounded-2xl shadow-sm outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-[15px] font-semibold"
                        />
                        <ValidationError
                          prefix="Email"
                          field="email"
                          errors={state.errors}
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-[#001F3F]/60 ml-1 uppercase tracking-widest">
                        Inquiry Subject
                      </label>
                      <input
                        required
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What can we help you solve?"
                        className="w-full bg-white border-2 border-transparent p-5 rounded-2xl shadow-sm outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-[15px) font-semibold"
                      />
                      <ValidationError
                        prefix="Subject"
                        field="subject"
                        errors={state.errors}
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-[#001F3F]/60 ml-1 uppercase tracking-widest">
                        Your Message
                      </label>
                      <textarea
                        required
                        rows="5"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your global logistics requirements..."
                        className="w-full bg-white border-2 border-transparent p-5 rounded-2xl shadow-sm outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-[15px] font-semibold resize-none"
                      ></textarea>
                      <ValidationError
                        prefix="Message"
                        field="message"
                        errors={state.errors}
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={state.submitting}
                      className="w-full bg-[#001F3F] text-white py-5 rounded-2xl font-black text-2xl shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {state.submitting ? (
                        <>
                          Sending
                          <span className="text-2xl animate-spin">⏳</span>
                        </>
                      ) : (
                        <>
                          Send
                          <span className="text-2xl animate-pulse">
                            Message
                          </span>
                        </>
                      )}
                    </motion.button>

                    {state.errors && state.errors.length > 0 && (
                      <p className="text-red-500 text-sm text-center mt-4">
                        Oops! There was an error submitting your form. Please
                        try again.
                      </p>
                    )}
                  </form>
                </>
              )}
            </div>
          </motion.div>

          {/* Information Hub (Right Column) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 pt-2"
          >
            {[
              {
                icon: "📍",
                title: "Headquarters",
                info: (
                  <>
                    123 Logistics Way,
                    <br />
                    Suite 500,
                    <br />
                    Colombo 07,
                    <br />
                    Sri Lanka
                  </>
                ),
              },
              {
                icon: "📞",
                title: "Phone Lines",
                info: (
                  <>
                    +94 11 234 5678
                    <br />
                    +94 77 123 4567
                  </>
                ),
              },
              {
                icon: "✉️",
                title: "Email Support",
                info: "support@navilogix.com",
              },
              {
                icon: "⏰",
                title: "Business Hours",
                info: (
                  <>
                    Mon - Fri: 9AM - 6PM
                    <br />
                    Sat: 10AM - 2PM
                    <br />
                    Sun: Closed
                  </>
                ),
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 5 }}
                className="bg-white/80 backdrop-blur-sm p-8 rounded-[32px] shadow-lg border border-gray-100 flex items-center gap-6 group"
              >
                <div className="w-14 h-14 bg-[#F8F9FA] rounded-[20px] flex items-center justify-center text-2xl shadow-inner group-hover:bg-primary/5 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-[14px] font-black text-[#001F3F] uppercase tracking-widest mb-1 opacity-70">
                    {item.title}
                  </h3>
                  <p className="text-[16px] text-primary font-extrabold leading-snug">
                    {item.info}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* FULL WIDTH Premium Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="mt-20 bg-[#001F3F] rounded-[60px] p-10 md:p-16 lg:pr-32 text-white relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5 w-full"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF4136]/10 rounded-full blur-[150px] opacity-30 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="text-center lg:text-left space-y-8 max-w-3xl">
              <div className="inline-block bg-white text-[#FF4136] px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-lg">
                Priority Assistance
              </div>
              <h3 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight text-balance">
                Need Fast Help? <br />
                <span className="text-blue-100/40 text-3xl">
                  Our Experts are Ready.
                </span>
              </h3>
              <p className="text-blue-100/60 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
                Experience the next generation of logistics support. Whether
                it's an urgent tracking request or a complex supply chain
                inquiry, we're here to help instantly.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.dispatchEvent(new Event("openChatBot"))}
                  className="bg-[#FF4136] text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_40px_-5px_rgba(255,65,54,0.3)] hover:brightness-110 transition-all border-none font-sans"
                >
                  Consult with AI
                </motion.button>
              </div>
            </div>

            <div className="flex flex-col items-center gap-12 lg:pl-20">
              <div className="text-center">
                <h4 className="text-[10px] font-black text-blue-100/30 uppercase tracking-[0.5em] mb-4">
                  Social Ecosystem
                </h4>
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#FF4136]/50 to-transparent mx-auto"></div>
              </div>
              <div className="scale-[1.3] md:scale-[1.5] drop-shadow-[0_0_50px_rgba(255,65,54,0.5)] transition-all hover:scale-[1.6] duration-700">
                <RadialShareMenu />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
