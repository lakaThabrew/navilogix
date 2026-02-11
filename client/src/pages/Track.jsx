import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

const Track = () => {
  const { id } = useParams();
  const [parcel, setParcel] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("🔍 [CLIENT TRACK] Tracking parcel:", id);
    const fetchParcel = async () => {
      try {
        console.log("📤 [CLIENT TRACK] Fetching parcel data...");
        const { data } = await axios.get(
          `http://localhost:5000/api/parcels/track/${id}`,
        );
        console.log(
          "✅ [CLIENT TRACK] Parcel found:",
          data.trackingId,
          "Status:",
          data.status,
        );
        setParcel(data);
      } catch (err) {
        console.error(
          "❌ [CLIENT TRACK] Error:",
          err.response?.data?.message || err.message,
        );
        setError("Parcel not found");
      }
    };
    fetchParcel();
  }, [id]);

  if (error)
    return (
      <div className="flex justify-center items-center min-h-[50vh] bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[30px] shadow-xl text-center border-2 border-red-100"
        >
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-red-500 mb-2">Oops!</h3>
          <p className="text-gray-500">{error}</p>
        </motion.div>
      </div>
    );

  if (!parcel)
    return (
      <div className="flex justify-center items-center min-h-[50vh] bg-background">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-primary">
            NL
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-background py-16 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100"
      >
        {/* Header Section */}
        <div className="bg-primary text-white p-10 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary opacity-20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
            <div>
              <div className="text-blue-200 text-sm font-bold uppercase tracking-widest mb-2">
                Tracking ID
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                {parcel.trackingId}
              </h2>
            </div>
            <div className="mt-6 md:mt-0">
              <div
                className={`px-6 py-2 rounded-full text-lg font-bold shadow-lg flex items-center gap-2
                                ${
                                  parcel.status === "Delivered"
                                    ? "bg-green-500 text-white"
                                    : parcel.status === "Returned"
                                      ? "bg-red-500 text-white"
                                      : "bg-secondary text-white"
                                }`}
              >
                <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
                {parcel.status}
              </div>
            </div>
          </div>
        </div>

        {/* Route Info */}
        <div className="p-10 md:p-12 grid md:grid-cols-2 gap-12 bg-gray-50 border-b border-gray-100">
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm text-primary">
              📍
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">
                From (Sender)
              </h3>
              <p className="text-xl font-bold text-gray-800">
                {parcel.senderInfo?.name}
              </p>
              <p className="text-gray-600">{parcel.senderInfo?.address}</p>
              <p className="text-sm text-blue-500 mt-2 font-medium">
                {parcel.branchId?.branchName || "Main Hub"} Branch
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm text-green-600">
              🏠
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">
                To (Receiver)
              </h3>
              <p className="text-xl font-bold text-gray-800">
                {parcel.receiverInfo?.name}
              </p>
              <p className="text-gray-600">{parcel.receiverInfo?.address}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="p-10 md:p-12 bg-white">
          <h3 className="text-2xl font-bold text-primary mb-10">
            Shipment Progress
          </h3>
          <div className="relative border-l-4 border-blue-50 ml-4 space-y-12">
            {parcel.history.map((event, index) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                key={index}
                className="relative pl-10"
              >
                {/* Timeline Dot */}
                <div
                  className={`absolute -left-[13px] top-1 w-6 h-6 rounded-full border-4 border-white shadow-md
                                    ${index === 0 ? "bg-secondary scale-125" : "bg-green-400"}`}
                ></div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                    <p className="font-bold text-primary text-xl">
                      {event.status}
                    </p>
                    <span className="text-sm text-gray-400 font-medium bg-gray-50 px-3 py-1 rounded-full">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">{event.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default Track;
