import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [parcels, setParcels] = useState([]);
  const [form, setForm] = useState({
    senderName: "",
    senderAddress: "",
    senderContact: "",
    receiverName: "",
    receiverAddress: "",
    receiverContact: "",
    weight: "",
    type: "Standard",
    codAmount: 0,
  });
  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    returned: 0,
    cod: 0,
  });

  useEffect(() => {
    console.log("📋 [CLIENT DASHBOARD] Component mounted");
    const u = JSON.parse(localStorage.getItem("userInfo"));
    if (!u) {
      console.log(
        "❌ [CLIENT DASHBOARD] No user info found, redirecting to login",
      );
      navigate("/login");
    } else {
      console.log(
        "✅ [CLIENT DASHBOARD] User loaded:",
        u.name,
        "Role:",
        u.role,
      );
      setUser(u);
      fetchParcels();
    }
  }, [navigate]);

  const fetchParcels = async () => {
    console.log("📦 [CLIENT DASHBOARD] Fetching parcels...");
    try {
      const { data } = await axios.get("http://localhost:5000/api/parcels");
      console.log(`✅ [CLIENT DASHBOARD] Received ${data.length} parcels`);
      setParcels(data);
    } catch (error) {
      console.error(
        "❌ [CLIENT DASHBOARD] Error fetching parcels:",
        error.message,
      );
      console.error(error);
    }
  };

  const handleAddParcel = async (e) => {
    e.preventDefault();
    console.log("➕ [CLIENT DASHBOARD] Adding new parcel:", form.receiverName);
    try {
      const parcelData = {
        senderInfo: {
          name: form.senderName,
          address: form.senderAddress,
          contact: form.senderContact,
        },
        receiverInfo: {
          name: form.receiverName,
          address: form.receiverAddress,
          contact: form.receiverContact,
        },
        weight: form.weight,
        type: form.type,
        codAmount: form.codAmount,
      };
      console.log("📤 [CLIENT DASHBOARD] Sending parcel data:", parcelData);
      await axios.post("http://localhost:5000/api/parcels", parcelData);
      console.log("✅ [CLIENT DASHBOARD] Parcel added successfully!");
      alert("Parcel Added & Branch Auto-Assigned!");
      fetchParcels();
      setForm({
        senderName: "",
        senderAddress: "",
        senderContact: "",
        receiverName: "",
        receiverAddress: "",
        receiverContact: "",
        weight: "",
        type: "Standard",
        codAmount: 0,
      });
    } catch (error) {
      console.error(
        "❌ [CLIENT DASHBOARD] Error adding parcel:",
        error.message,
      );
      alert("Failed to add parcel");
    }
  };

  const updateStatus = async (id, status) => {
    console.log(
      `🔄 [CLIENT DASHBOARD] Updating parcel ${id} status to: ${status}`,
    );
    const u = JSON.parse(localStorage.getItem("userInfo"));
    try {
      console.log("📤 [CLIENT DASHBOARD] Sending status update...");
      await axios.put(`http://localhost:5000/api/parcels/${id}/status`, {
        status,
        location: "Updated by " + u.name,
      });
      console.log("✅ [CLIENT DASHBOARD] Status updated successfully");
      fetchParcels();
    } catch (error) {
      console.error(
        "❌ [CLIENT DASHBOARD] Error updating status:",
        error.message,
      );
      console.error(error);
    }
  };

  if (!user) return null;

  // Filter logic
  let displayedParcels = parcels;
  if (user.role === "regular") {
    displayedParcels = parcels.filter(
      (p) =>
        (p.senderInfo &&
          (p.senderInfo.contact === user.email ||
            p.senderInfo.name === user.name)) ||
        (p.receiverInfo &&
          (p.receiverInfo.contact === user.email ||
            p.receiverInfo.name === user.name)),
    );
  } else if (user.role === "delivery_person") {
    displayedParcels = parcels.filter(
      (p) =>
        p.riderId && (p.riderId._id === user._id || p.riderId === user._id),
    );
  } else if (user.role === "branch_head") {
    displayedParcels = parcels.filter(
      (p) =>
        p.branchId &&
        (p.branchId._id === user.branchId || p.branchId === user.branchId),
    );
  }

  const currentStats = {
    total: displayedParcels.length,
    delivered: displayedParcels.filter((p) => p.status === "Delivered").length,
    returned: displayedParcels.filter((p) => p.status === "Returned").length,
    cod: displayedParcels.reduce(
      (acc, p) => acc + (Number(p.codAmount) || 0),
      0,
    ),
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-primary mb-8">
        Hello, <span className="text-secondary">{user.name}</span>{" "}
        <span className="text-lg font-normal text-gray-500">({user.role})</span>
      </h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="floating-card text-center p-6">
          <div className="text-4xl font-bold text-primary mb-2">
            {currentStats.total}
          </div>
          <div className="text-gray-500">Total Parcels</div>
        </div>
        <div className="floating-card text-center p-6 bg-green-50 border border-green-100">
          <div className="text-4xl font-bold text-green-600 mb-2">
            {currentStats.delivered}
          </div>
          <div className="text-gray-500">Delivered</div>
        </div>
        <div className="floating-card text-center p-6 bg-red-50 border border-red-100">
          <div className="text-4xl font-bold text-red-600 mb-2">
            {currentStats.returned}
          </div>
          <div className="text-gray-500">Returned</div>
        </div>
        <div className="floating-card text-center p-6 bg-blue-50 border border-blue-100">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            Rs. {currentStats.cod}
          </div>
          <div className="text-gray-500">COD Volume</div>
        </div>
      </div>

      {/* Admin View: Add Parcel */}
      {user.role === "main_admin" && (
        <div className="floating-card mb-12">
          <h3 className="text-2xl font-bold text-primary mb-6 border-b pb-2">
            Add New Parcel (Main Office)
          </h3>
          <form
            onSubmit={handleAddParcel}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-4">
              <h4 className="font-bold text-gray-600">Sender Info</h4>
              <input
                className="input-field"
                placeholder="Name"
                value={form.senderName}
                onChange={(e) =>
                  setForm({ ...form, senderName: e.target.value })
                }
                required
              />
              <input
                className="input-field"
                placeholder="Address"
                value={form.senderAddress}
                onChange={(e) =>
                  setForm({ ...form, senderAddress: e.target.value })
                }
                required
              />
              <input
                className="input-field"
                placeholder="Contact"
                value={form.senderContact}
                onChange={(e) =>
                  setForm({ ...form, senderContact: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-gray-600">Receiver Info</h4>
              <input
                className="input-field"
                placeholder="Name"
                value={form.receiverName}
                onChange={(e) =>
                  setForm({ ...form, receiverName: e.target.value })
                }
                required
              />
              <input
                className="input-field"
                placeholder="Address (e.g. Kandy)"
                value={form.receiverAddress}
                onChange={(e) =>
                  setForm({ ...form, receiverAddress: e.target.value })
                }
                required
              />
              <input
                className="input-field"
                placeholder="Contact"
                value={form.receiverContact}
                onChange={(e) =>
                  setForm({ ...form, receiverContact: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-4 md:col-span-2 grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-600 mb-2">Parcel Details</h4>
                <input
                  className="input-field mb-2"
                  placeholder="Weight (kg)"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                />
              </div>
              <div>
                <h4 className="font-bold text-gray-600 mb-2">Payment</h4>
                <input
                  className="input-field"
                  placeholder="COD Amount"
                  value={form.codAmount}
                  onChange={(e) =>
                    setForm({ ...form, codAmount: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary md:col-span-2 text-lg font-bold"
            >
              Add Parcel to System
            </button>
          </form>
        </div>
      )}

      {/* General Dashboard Table */}
      <div className="floating-card overflow-hidden">
        <h3 className="text-2xl font-bold text-primary mb-6">
          Parcels Overview
        </h3>
        {displayedParcels.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No parcels found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 font-bold text-gray-600 rounded-tl-xl">
                    Tracking ID
                  </th>
                  <th className="p-4 font-bold text-gray-600">Receiver</th>
                  <th className="p-4 font-bold text-gray-600">Branch</th>
                  <th className="p-4 font-bold text-gray-600">Status</th>
                  {user.role !== "regular" && (
                    <th className="p-4 font-bold text-gray-600 rounded-tr-xl">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayedParcels.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-primary">
                      {p.trackingId}
                    </td>
                    <td className="p-4 text-gray-600">
                      {p.receiverInfo.address}
                    </td>
                    <td className="p-4 text-gray-600">
                      {p.branchId?.branchName || "Unassigned"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm
                                                ${
                                                  p.status === "Delivered"
                                                    ? "bg-green-100 text-green-800"
                                                    : p.status === "Returned"
                                                      ? "bg-red-100 text-red-800"
                                                      : "bg-blue-100 text-blue-800"
                                                }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    {user.role !== "regular" && (
                      <td className="p-4 flex gap-2">
                        {user.role === "delivery_person" && (
                          <>
                            <button
                              onClick={() => updateStatus(p._id, "Delivered")}
                              className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 shadow-md"
                            >
                              Deliver
                            </button>
                            <button
                              onClick={() => updateStatus(p._id, "Returned")}
                              className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 shadow-md"
                            >
                              Return
                            </button>
                          </>
                        )}
                        {user.role === "branch_head" &&
                          p.status === "Transmitting" && (
                            <button
                              onClick={() =>
                                updateStatus(p._id, "In Sub Branch")
                              }
                              className="btn-primary py-1 px-3 text-sm"
                            >
                              Receive at Branch
                            </button>
                          )}
                        {user.role === "main_admin" &&
                          !p.riderId &&
                          p.branchId && (
                            <button
                              onClick={() =>
                                updateStatus(p._id, "Transmitting")
                              }
                              className="btn-secondary py-1 px-3 text-sm"
                            >
                              Transmit to Branch
                            </button>
                          )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mock Map for Delivery Person */}
      {user.role === "delivery_person" && (
        <div className="floating-card mt-12 bg-gray-50 p-6">
          <h3 className="text-2xl font-bold text-primary mb-4">
            Your Optimized Route (Map)
          </h3>
          <div className="h-96 bg-gray-200 rounded-3xl flex items-center justify-center border-4 border-white shadow-inner">
            <div className="text-center">
              <p className="text-2xl mb-2">🗺️</p>
              <p className="font-bold text-gray-500">
                OpenStreetMap Area (Free & Open Source)
              </p>
              <p className="text-sm text-gray-400">
                Waypoints loaded for: {user.name}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard;
