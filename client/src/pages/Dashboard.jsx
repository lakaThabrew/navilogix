import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeliveryMap from "../components/DeliveryMap";
import logger from "../utils/logger";

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

  const [messages, setMessages] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchForm, setBranchForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "branch_head",
    branchId: ""
  });

  // Add Branch States
  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchContact, setNewBranchContact] = useState("");
  const [newBranchLat, setNewBranchLat] = useState("");
  const [newBranchLng, setNewBranchLng] = useState("");
  const [newBranchAreas, setNewBranchAreas] = useState("");
  const [addingBranch, setAddingBranch] = useState(false);

  async function fetchBranches() {
    try {
      const { data } = await axios.get("http://localhost:5000/api/auth/branches");
      setBranches(data);
    } catch (error) {
      logger.error("Error fetching branches: " + error.message, { error });
    }
  };

  async function fetchParcels(userInfo = user) {
    logger.info("📦 [CLIENT DASHBOARD] Fetching parcels...");
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.get("http://localhost:5000/api/parcels", config);
      logger.info(`✅ [CLIENT DASHBOARD] Received ${data.length} parcels`);
      setParcels(data);
    } catch (error) {
      logger.error(
        "❌ [CLIENT DASHBOARD] Error fetching parcels: " + error.message,
      );
    }
  };

  async function fetchMessages(userInfo = user) {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.get("http://localhost:5000/api/messages", config);
      setMessages(data);
    } catch (error) {
      logger.error("Error fetching messages: " + error.message, { error });
    }
  };

  useEffect(() => {
    logger.info("📋 [CLIENT DASHBOARD] Component mounted");
    const u = JSON.parse(localStorage.getItem("userInfo"));
    if (!u) {
      logger.info(
        "❌ [CLIENT DASHBOARD] No user info found, redirecting to login",
      );
      navigate("/login");
    } else {
      logger.info(
        "✅ [CLIENT DASHBOARD] User loaded: " + u.name + " Role: " + u.role,
      );
      setUser(u);
      fetchParcels(u);
      if (u.role === 'main_admin') {
        fetchMessages(u);
        fetchBranches();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const markAsRead = async (id) => {
    try {
      const u = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: { Authorization: `Bearer ${u.token}` },
      };
      await axios.put(`http://localhost:5000/api/messages/${id}/read`, {}, config);
      fetchMessages();
    } catch (error) {
      logger.error("Error marking message as read: " + error.message, { error });
    }
  };

  const handleCreateBranchAdmin = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      await axios.post("http://localhost:5000/api/auth/register", {
        ...branchForm
      }, config);
      alert("User Created Successfully!");
      setBranchForm({ name: "", email: "", password: "", role: "branch_head", branchId: "" });
    } catch (error) {
      alert("Failed: " + (error.response?.data?.message || error.message));
    }
  };

  const handleAddBranch = async (e) => {
    e.preventDefault();
    if (!newBranchName || !newBranchLat || !newBranchLng) {
      alert("Branch Name, Latitude, and Longitude are required.");
      return;
    }

    try {
      setAddingBranch(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const payload = {
        branchName: newBranchName,
        contactNumber: newBranchContact,
        lat: newBranchLat,
        lng: newBranchLng,
        assignedAreas: newBranchAreas
      };

      await axios.post("http://localhost:5000/api/auth/branches", payload, config);
      alert("Branch added successfully!");

      // Clear form
      setNewBranchName("");
      setNewBranchContact("");
      setNewBranchLat("");
      setNewBranchLng("");
      setNewBranchAreas("");

      fetchBranches(); // Refresh branches drop down
    } catch (error) {
      logger.error("Error adding branch: " + error.message);
      alert(error.response?.data?.message || "Failed to add branch");
    } finally {
      setAddingBranch(false);
    }
  };

  const handleAddParcel = async (e) => {
    e.preventDefault();
    logger.info("➕ [CLIENT DASHBOARD] Adding new parcel: " + form.receiverName);
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
      logger.info("📤 [CLIENT DASHBOARD] Sending parcel data:", parcelData);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      if (user.role === 'branch_head') {
        // Send Message Request instead of creating parcel
        await axios.post("http://localhost:5000/api/messages", {
          content: `New Parcel Request from Branch Head ${user.name}. Please review and add to system.`,
          receiverRole: 'main_admin',
          parcelData: parcelData
        }, config);
        alert("Request Sent to Main Admin!");
      } else {
        // Regular Admin Flow: Create Parcel directly
        await axios.post("http://localhost:5000/api/parcels", parcelData, config);
        alert("Parcel Added & Branch Auto-Assigned!");
      }

      logger.info("✅ [CLIENT DASHBOARD] Action completed successfully!");
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
      logger.error(
        "❌ [CLIENT DASHBOARD] Error adding parcel: " + error.message,
      );
      alert("Failed to add parcel");
    }
  };

  const updateStatus = async (id, status) => {
    logger.info(
      `🔄 [CLIENT DASHBOARD] Updating parcel ${id} status to: ${status}`,
    );
    const u = JSON.parse(localStorage.getItem("userInfo"));
    try {
      logger.info("📤 [CLIENT DASHBOARD] Sending status update...");
      const config = {
        headers: { Authorization: `Bearer ${u.token}` },
      };
      await axios.put(`http://localhost:5000/api/parcels/${id}/status`, {
        status,
        location: "Updated by " + u.name,
      }, config);
      logger.info("✅ [CLIENT DASHBOARD] Status updated successfully");
      fetchParcels();
    } catch (error) {
      logger.error(
        "❌ [CLIENT DASHBOARD] Error updating status: " + error.message,
      );
    }
  };

  // Reports Logic for Regular Users
  const [reportData, setReportData] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);



  async function fetchReportData() {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get("http://localhost:5000/api/parcels/reports", config);
      setReportData(data.stats);
    } catch (error) {
      logger.error("Error fetching reports: " + error.message, { error });
    }
  };

  useEffect(() => {
    if (user && user.role === 'regular') {
      if (user.paymentStatus !== 'paid') {
        setShowPaymentModal(true);
      } else {
        fetchReportData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handlePayment = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put("http://localhost:5000/api/auth/pay", {}, config);
      alert("Payment Successful! Features Unlocked.");
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      setShowPaymentModal(false);
      fetchReportData(); // Fetch reports after unlocking
    } catch (error) {
      logger.error("Payment failed: " + error.message, { error });
      alert("Payment Failed");
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
        (p.branchId._id === user.branchId || p.branchId === user.branchId) ||
        (p.createdBy === user._id),
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
        {user.role === 'regular' && (
          <span className={`ml-4 text-sm px-3 py-1 rounded-full ${user.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {user.paymentStatus === 'paid' ? 'Premium Unlocked' : 'Free Tier'}
          </span>
        )}
      </h1>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">🔓 Unlock Premium Features</h2>
            <p className="text-gray-600 mb-6">
              Upgrade to a Regular User account to access your personalized Dashboard, Detailed Reports, and Parcel History.
            </p>
            <div className="bg-blue-50 p-4 rounded-xl mb-6">
              <p className="text-3xl font-bold text-blue-600">$9.99<span className="text-sm text-gray-400 font-normal">/month</span></p>
            </div>
            <button
              onClick={handlePayment}
              className="w-full bg-gradient-to-r from-secondary to-red-600 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              Pay Now & Unlock
            </button>
            <button
              onClick={() => navigate('/')}
              className="mt-4 text-gray-400 hover:text-gray-600 text-sm"
            >
              Go Back Home
            </button>
          </div>
        </div>
      )}

      {user.role === 'main_admin' && messages.length > 0 && (
        <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
          <h3 className="text-xl font-bold text-yellow-800 mb-4">🔔 Notifications</h3>
          <div className="space-y-3">
            {messages.map(msg => (
              <div
                key={msg._id}
                onClick={() => markAsRead(msg._id)}
                className={`p-4 rounded-lg bg-white shadow-sm border-l-4 cursor-pointer hover:bg-gray-50 transition-colors ${msg.isRead ?
                  'border-gray-300' : 'border-blue-500'}`}
              >
                <p className="font-medium text-gray-800">{msg.content}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Overview */}
      {/* If regular user is unpaid, blur stats or hide them? Existing stats are fine, but reports are extra. */}
      {/* Actually, user requested "regular users... payment ekk krnn one... it psse dashboard eke pennan one" */}
      {/* So dashboard is largely blocked until paid. */}

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 ${user.role === 'regular' && user.paymentStatus !== 'paid' ?
          'opacity-20 pointer-events-none select-none filter blur-sm' : ''}`}>
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

      {reportData && user.role === 'regular' && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-primary mb-6">📊 Your Performance Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="floating-card bg-white p-6">
              <h4 className="font-bold text-gray-700 mb-4 border-b pb-2">📦 Parcel Volume</h4>
              <div className="flex justify-between items-center mb-2">
                <span>Sent:</span>
                <span className="font-bold text-primary">{reportData.totalSent}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Received:</span>
                <span className="font-bold text-primary">{reportData.totalReceived}</span>
              </div>
            </div>
            <div className="floating-card bg-white p-6">
              <h4 className="font-bold text-gray-700 mb-4 border-b pb-2">💰 COD Financials</h4>
              <div className="flex justify-between items-center mb-2">
                <span>Total Paid:</span>
                <span className="font-bold text-red-500">Rs. {reportData.codPaid}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total to Receive:</span>
                <span className="font-bold text-green-500">Rs. {reportData.codToReceive}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Management Section (Main Admin Only) */}
      {user.role === "main_admin" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="floating-card mb-12">
              <h3 className="text-2xl font-bold text-primary mb-6 border-b pb-2">
                👤 User Management: Add Staff User
              </h3>
              <form onSubmit={handleCreateBranchAdmin} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g., John Doe"
                      value={branchForm.name}
                      onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="e.g., johndoe@navilogix.com"
                      value={branchForm.email}
                      onChange={(e) => setBranchForm({ ...branchForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                    <input
                      type="password"
                      className="input-field"
                      placeholder="e.g., password123"
                      value={branchForm.password}
                      onChange={(e) => setBranchForm({ ...branchForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                    <select
                      className="input-field"
                      value={branchForm.role}
                      onChange={(e) => setBranchForm({ ...branchForm, role: e.target.value, branchId: "" })}
                      required
                    >
                      <option value="branch_head">Branch Head</option>
                      <option value="delivery_person">Delivery Person (Driver)</option>
                    </select>
                  </div>
                  {(branchForm.role === 'branch_head' || branchForm.role === 'delivery_person') && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
                      <select
                        className="input-field"
                        value={branchForm.branchId}
                        onChange={(e) => setBranchForm({ ...branchForm, branchId: e.target.value })}
                        required
                      >
                        <option value="">Select a Branch</option>
                        {branches.map(b => (
                          <option key={b._id} value={b._id}>{b.branchName}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="btn-primary font-bold px-8">
                    Register User
                  </button>
                </div>
              </form>
            </div>

            {/* Branch Management Section */}
            <div className="floating-card mb-12">
              <h3 className="text-2xl font-bold text-primary mb-6 border-b pb-2">
                🏢 Branch Management: Add New Branch
              </h3>
              <form onSubmit={handleAddBranch} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name *</label>
                    <input
                      type="text"
                      required
                      value={newBranchName}
                      onChange={(e) => setNewBranchName(e.target.value)}
                      className="input-field"
                      placeholder="e.g., Kandy Branch"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                    <input
                      type="text"
                      value={newBranchContact}
                      onChange={(e) => setNewBranchContact(e.target.value)}
                      className="input-field"
                      placeholder="e.g., 081-2234567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={newBranchLat}
                      onChange={(e) => setNewBranchLat(e.target.value)}
                      className="input-field"
                      placeholder="e.g., 7.2906"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={newBranchLng}
                      onChange={(e) => setNewBranchLng(e.target.value)}
                      className="input-field"
                      placeholder="e.g., 80.6337"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Areas (comma-separated)</label>
                  <input
                    type="text"
                    value={newBranchAreas}
                    onChange={(e) => setNewBranchAreas(e.target.value)}
                    className="input-field"
                    placeholder="e.g., Kandy, Peradeniya, Katugastota"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={addingBranch}
                    className="btn-primary font-bold px-8 disabled:opacity-50"
                  >
                    {addingBranch ? "Adding..." : "+ Add Branch"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>

      )}

      {/* Admin & Branch Head View: Add Parcel */}
      {(user.role === "main_admin" || user.role === "branch_head") && (
        <div className="floating-card mb-12">
          <h3 className="text-2xl font-bold text-primary mb-6 border-b pb-2">
            {user.role === 'branch_head' ? '📦 Dispatch New Parcel (From Branch)' : '📦 Add New Parcel (Main Office)'}
          </h3>
          <form
            onSubmit={handleAddParcel}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-4">
              <h4 className="font-bold text-gray-600">Sender Info</h4>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                className="input-field"
                placeholder="Joe Doe"
                value={form.senderName}
                onChange={(e) =>
                  setForm({ ...form, senderName: e.target.value })
                }
                required
              />
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <input
                className="input-field"
                placeholder="123 Main St"
                value={form.senderAddress}
                onChange={(e) =>
                  setForm({ ...form, senderAddress: e.target.value })
                }
                required
              />
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact No. *</label>
              <input
                className="input-field"
                placeholder="077-1234567"
                value={form.senderContact}
                onChange={(e) =>
                  setForm({ ...form, senderContact: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-gray-600">Receiver Info</h4>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                className="input-field"
                placeholder="Jane Doe"
                value={form.receiverName}
                onChange={(e) =>
                  setForm({ ...form, receiverName: e.target.value })
                }
                required
              />
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <input
                className="input-field"
                placeholder="123 Main St"
                value={form.receiverAddress}
                onChange={(e) =>
                  setForm({ ...form, receiverAddress: e.target.value })
                }
                required
              />
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact No.*</label>
              <input
                className="input-field"
                placeholder="077-1234567"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg) *</label>
                    <input
                      className="input-field mb-2"
                      placeholder="1"
                      value={form.weight}
                      onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <select
                      className="input-field mb-2"
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                    >
                      <option value="document">Document</option>
                      <option value="parcel">Parcel</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-600 mb-2">Payment</h4>
                <label className="block text-sm font-medium text-gray-700 mb-1">COD Amount *</label>
                <input
                  className="input-field mb-2"
                  placeholder="COD Amount"
                  value={form.codAmount}
                  onChange={(e) =>
                    setForm({ ...form, codAmount: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end pt-0 md:col-span-2 w-full">
              <button
                type="submit"
                className="btn-primary px-8 text-lg font-bold"
              >
                {user.role === 'branch_head' ? 'Send Request to Main Admin' : 'Add Parcel to System'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* General Dashboard Table */}
      <div className={`floating-card overflow-hidden ${user.role === 'regular' && user.paymentStatus !== 'paid' ? 'opacity-20 pointer-events-none filter blur-sm' : ''}`}>
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
                      {user.role === 'main_admin' || user.role === 'branch_head' ? (
                        <select
                          value={p.status}
                          onChange={(e) => updateStatus(p._id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm outline-none cursor-pointer border-none
                            ${p.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : p.status === "Returned"
                                ? "bg-red-100 text-red-800"
                                : p.status === "Out for Delivery"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Main Branch">In Main Branch</option>
                          <option value="Transmitting">Transmitting</option>
                          <option value="In Sub Branch">In Sub Branch</option>

                          {/* Restricting Options Based on Role */}
                          {user.role !== 'main_admin' && <option value="Out for Delivery">Out for Delivery</option>}

                          {/* Delivered is theoretically restricted from both admin and branch head, but if it was already delivered by a rider, it should display it */}
                          <option value="Delivered" disabled>Delivered</option>

                          <option value="Returned">Returned</option>
                        </select>
                      ) : (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm
                                                  ${p.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : p.status === "Returned"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                        >
                          {p.status}
                        </span>
                      )}
                    </td>
                    {user.role !== "regular" && (
                      <td className="p-4 flex gap-2">
                        {user.role === "delivery_person" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateStatus(p._id, "Delivered")}
                              className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 shadow-md"
                              disabled={p.status === "Delivered"}
                            >
                              {p.status === "Delivered" ? "Delivered ✔" : "Mark Delivered"}
                            </button>
                            <button
                              onClick={() => updateStatus(p._id, "Returned")}
                              className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 shadow-md"
                            >
                              Mark Returned
                            </button>
                          </div>
                        )}
                        {/* Status updates for admin/branch head is now in the dropdown, but we can keep standard quick action buttons for Transmitting etc if needed */}
                        {user.role === "branch_head" && p.status === "Transmitting" && (
                          <button
                            onClick={() => updateStatus(p._id, "In Sub Branch")}
                            className="bg-blue-100 text-blue-700 border border-blue-200 py-1 px-3 text-sm rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            Receive at Branch
                          </button>
                        )}
                        {user.role === "main_admin" && !p.riderId && p.branchId && p.status === "In Main Branch" && (
                          <button
                            onClick={() => updateStatus(p._id, "Transmitting")}
                            className="bg-indigo-100 text-indigo-700 border border-indigo-200 py-1 px-3 text-sm rounded-lg hover:bg-indigo-200 transition-colors"
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
          <DeliveryMap parcels={displayedParcels} />
        </div>
      )}
    </div>
  );
};
export default Dashboard;
