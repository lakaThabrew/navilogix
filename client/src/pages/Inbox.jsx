import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Inbox = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem("userInfo"));
        if (!u) {
            navigate("/login");
        } else {
            setUser(u);
            fetchMessages(u);
        }
    }, [navigate]);

    const fetchMessages = async (userInfo) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            };
            const { data } = await axios.get("http://localhost:5000/api/messages", config);
            setMessages(data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const markAsRead = async (id) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.put(`http://localhost:5000/api/messages/${id}/read`, {}, config);
            fetchMessages(user);
        } catch (error) {
            console.error("Error marking message as read:", error);
        }
    };

    const handleApprove = async (e, msg) => {
        e.stopPropagation(); // Prevent marking as read when clicking button
        const confirm = window.confirm("Create this parcel in the system?");
        if (!confirm) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            // Create the parcel
            await axios.post("http://localhost:5000/api/parcels", msg.parcelData, config);
            alert("Parcel Created Successfully!");

            // Mark message as read
            await markAsRead(msg._id);
        } catch (error) {
            console.error("Error creating parcel:", error);
            alert("Failed to create parcel: " + (error.response?.data?.message || error.message));
        }
    };

    if (!user) return null;

    return (
        <div className="p-8 max-w-4xl mx-auto pt-32">
            <h1 className="text-4xl font-bold text-primary mb-8">
                Inbox <span className="text-gray-500 text-lg">({user.role})</span>
            </h1>

            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-700">Recent Messages</h2>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {messages.filter(m => !m.isRead).length} Unread
                    </span>
                </div>

                {messages.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <p className="text-6xl mb-4">📭</p>
                        <p>No messages found.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {messages.map((msg) => (
                            <div
                                key={msg._id}
                                className={`p-6 transition-colors hover:bg-gray-50 cursor-pointer flex gap-4 ${msg.isRead ? 'opacity-60 bg-white' : 'bg-blue-50/30'}`}
                                onClick={() => markAsRead(msg._id)}
                            >
                                <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${msg.isRead ? 'bg-gray-300' : 'bg-blue-500 shadow-glow'}`}></div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-gray-800 text-lg">
                                            {msg.senderId?.name || 'Unknown Sender'}
                                            <span className="text-sm font-normal text-gray-500 ml-2">&lt;{msg.senderId?.email}&gt;</span>
                                        </h4>
                                        <span className="text-xs text-gray-400 font-mono whitespace-nowrap">
                                            {new Date(msg.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    {msg.senderId?.branchId && (
                                        <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                                            🏢 <span>Branch: {msg.senderId.branchId}</span>
                                        </div>
                                    )}
                                    <p className="text-gray-600 leading-relaxed">{msg.content}</p>

                                    {msg.parcelData && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200" onClick={(e) => e.stopPropagation()}>
                                            <h5 className="font-bold text-gray-700 text-sm mb-2">📦 Parcel Request Details:</h5>
                                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                                                <div><span className="font-semibold">Sender:</span> {msg.parcelData.senderInfo?.name}</div>
                                                <div><span className="font-semibold">Receiver:</span> {msg.parcelData.receiverInfo?.name}</div>
                                                <div><span className="font-semibold">To:</span> {msg.parcelData.receiverInfo?.address}</div>
                                                <div><span className="font-semibold">Type:</span> {msg.parcelData.type}</div>
                                            </div>
                                            <button
                                                onClick={(e) => handleApprove(e, msg)}
                                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-green-700 transition-colors flex items-center gap-2"
                                            >
                                                ✅ Approve & Create Parcel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;
