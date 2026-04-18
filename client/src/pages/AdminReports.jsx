import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import logger from "../utils/logger";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'staff', 'customers'
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchBranches = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/auth/branches",
      );
      setBranches(data);
    } catch (error) {
      logger.error("Error fetching branches: " + error.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      if (user?.role !== "main_admin") return;
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(
        "http://localhost:5000/api/auth/users",
        config,
      );
      setUsers(data);
    } catch (error) {
      logger.error("Error fetching users: " + error.message, { error });
    }
  };

  const fetchStats = async (sDate = startDate, eDate = endDate) => {
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      let url = "http://localhost:5000/api/parcels/reports";

      const params = new URLSearchParams();
      if (sDate) params.append("startDate", sDate);
      if (eDate) params.append("endDate", eDate);
      if (params.toString()) url += `?${params.toString()}`;

      const { data } = await axios.get(url, config);
      setStats(data.stats);
      setLoading(false);
    } catch (error) {
      logger.error("Error fetching stats: " + error.message, { error });
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!user) {
      navigate("/login");
    } else if (user.role !== "main_admin") {
      navigate("/dashboard");
    } else {
      fetchStats();
      fetchUsers();
      fetchBranches();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleUpdateRole = async (userId, newRole, branchId = null) => {
    setIsUpdating(true);
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(
        `http://localhost:5000/api/auth/users/${userId}/role`,
        { role: newRole, branchId },
        config,
      );
      fetchUsers(); // Refresh users list
      logger.info(`✅ [ADMIN] Updated role for user ${userId} to ${newRole}`);
      alert("User role updated successfully!");
    } catch (error) {
      logger.error("Error updating user role: " + error.message);
      alert(
        "Failed to update user role: " +
          (error.response?.data?.message || error.message),
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(
        `http://localhost:5000/api/auth/users/${userId}`,
        config,
      );
      fetchUsers(); // Refresh users list
      logger.info(`✅ [ADMIN] Deleted user ${userId}`);
    } catch (error) {
      logger.error("Error deleting user: " + error.message);
      alert("Failed to delete user");
    }
  };

  if (loading)
    return <div className="text-center p-8">🔃 Loading Analytics...</div>;
  if (!stats)
    return <div className="text-center p-8">❌ No data available.</div>;

  // Chart Data Preparation
  const branchLabels = Object.keys(stats.branchBreakdown || {});
  const branchData = Object.values(stats.branchBreakdown || {});

  const riderLabels = Object.keys(stats.riderPerformance || {});
  const riderDataDelivered = riderLabels.map(
    (r) => stats.riderPerformance[r].delivered,
  );
  const riderDataAssigned = riderLabels.map(
    (r) => stats.riderPerformance[r].assigned,
  );

  const branchChartData = {
    labels: branchLabels,
    datasets: [
      {
        label: "Parcels Handled",
        data: branchData,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const riderChartData = {
    labels: riderLabels,
    datasets: [
      {
        label: "Assigned",
        data: riderDataAssigned,
        backgroundColor: "rgba(255, 206, 86, 0.5)",
      },
      {
        label: "Delivered",
        data: riderDataDelivered,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const statusLabelsRaw = Object.keys(stats.statusBreakdown || {});
  const statusData = Object.values(stats.statusBreakdown || {});
  const statusLabels = statusLabelsRaw.map(
    (label, index) => `${label} (${statusData[index]})`,
  );
  const statusChartData = {
    labels: statusLabels,
    datasets: [
      {
        data: statusData,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const typeLabelsRaw = Object.keys(stats.typeBreakdown || {});
  const typeData = Object.values(stats.typeBreakdown || {});

  // Standardize labels to Title Case if they are 'parcel' vs 'Parcel'
  const standardizedMap = {};
  typeLabelsRaw.forEach((label, index) => {
    const stdLabel =
      label.charAt(0) != label.charAt(0).toUpperCase()
        ? label.charAt(0).toUpperCase() + label.slice(1)
        : label;
    standardizedMap[stdLabel] =
      (standardizedMap[stdLabel] || 0) + typeData[index];
  });

  const finalTypeLabels = Object.keys(standardizedMap);
  const finalTypeData = Object.values(standardizedMap);

  const typeLabelsWithCount = finalTypeLabels.map(
    (label, index) => `${label} (${finalTypeData[index]})`,
  );

  const typeChartData = {
    labels: typeLabelsWithCount,
    datasets: [
      {
        data: finalTypeData,
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)", // Blue
          "rgba(255, 99, 132, 0.6)", // Red-ish
          "rgba(255, 206, 86, 0.6)", // Yellow
          "rgba(75, 192, 192, 0.6)", // Teal
          "rgba(153, 102, 255, 0.6)", // Purple
          "rgba(255, 159, 64, 0.6)", // Orange
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-8 max-w-7xl mx-auto pt-32 space-y-12">
      <div>
        <h1 className="text-4xl font-bold text-primary mb-8">
          📊 System{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-500">
            Analytics
          </span>
        </h1>

        {/* Filters */}
        <div className="floating-card p-6 bg-white mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm"
            />
          </div>
          <button
            onClick={() => fetchStats()}
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 w-full md:w-auto"
          >
            Apply Filter
          </button>
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
              fetchStats("", "");
            }}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all text-xs w-full md:w-auto"
          >
            Clear
          </button>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="floating-card p-6 !bg-white border-l-4 border-blue-500">
            <h3 className="text-lg text-gray-500 font-semibold mb-2">
              Total Parcels
            </h3>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 truncate">
              {stats.totalParcels}
            </p>
          </div>
          <div className="floating-card p-6 !bg-white border-l-4 border-green-500">
            <h3 className="text-lg text-gray-500 font-semibold mb-2">
              Total Revenue (COD)
            </h3>
            <p
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 whitespace-nowrap truncate"
              title={`Rs. ${Number(stats.totalRevenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            >
              Rs.{" "}
              {Number(stats.totalRevenue).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="floating-card p-6 !bg-white border-l-4 border-yellow-500">
            <h3 className="text-lg text-gray-500 font-semibold mb-2">
              Pending Delivery
            </h3>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-500 truncate">
              {stats.totalPending}
            </p>
          </div>
          <div className="floating-card p-6 !bg-white border-l-4 border-red-500">
            <h3 className="text-lg text-gray-500 font-semibold mb-2">
              Returns
            </h3>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-500 truncate">
              {stats.totalReturned}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="floating-card p-6 bg-white min-h-[400px]">
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              🏢 Branch Performance
            </h3>
            {branchLabels.length > 0 ? (
              <Bar
                options={{
                  responsive: true,
                  plugins: { legend: { position: "top" } },
                }}
                data={branchChartData}
              />
            ) : (
              <p>No branch data yet.</p>
            )}
          </div>
          <div className="floating-card p-6 bg-white min-h-[400px]">
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              🚴 Rider Efficiency
            </h3>
            {riderLabels.length > 0 ? (
              <Bar
                options={{
                  responsive: true,
                  plugins: { legend: { position: "top" } },
                }}
                data={riderChartData}
              />
            ) : (
              <p>No rider data yet.</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="floating-card p-6 bg-white flex flex-col items-center">
            <h3 className="text-xl font-bold text-gray-700 mb-4 w-full text-left">
              📦 Parcel Status Breakdown
            </h3>
            <div className="w-full max-w-[300px]">
              {statusLabels.length > 0 ? (
                <Doughnut
                  options={{
                    responsive: true,
                    plugins: { legend: { position: "bottom" } },
                  }}
                  data={statusChartData}
                />
              ) : (
                <p className="text-gray-500">No status data yet.</p>
              )}
            </div>
          </div>

          <div className="floating-card p-6 bg-white flex flex-col items-center">
            <h3 className="text-xl font-bold text-gray-700 mb-4 w-full text-left">
              🏷️ Parcel Types
            </h3>
            <div className="w-full max-w-[300px]">
              {typeLabelsWithCount.length > 0 ? (
                <Pie
                  options={{
                    responsive: true,
                    plugins: { legend: { position: "bottom" } },
                  }}
                  data={typeChartData}
                />
              ) : (
                <p className="text-gray-500">No parcel type data yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Management Section */}
      {JSON.parse(localStorage.getItem("userInfo"))?.role === "main_admin" && (
        <div className="space-y-6">
          {/* Tab Switcher */}
          <div className="flex flex-col sm:flex-row p-1 bg-slate-100 rounded-2xl w-full sm:w-fit mb-8 shadow-inner border border-slate-200/50 gap-1 sm:gap-0">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto ${
                activeTab === "all"
                  ? "bg-white text-slate-800 shadow-md"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50 opacity-70"
              }`}
            >
              🌐 All{" "}
              <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-md">
                {users.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("staff")}
              className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto ${
                activeTab === "staff"
                  ? "bg-white text-primary shadow-md"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50 opacity-70"
              }`}
            >
              💼 Staff{" "}
              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">
                {users.filter((u) => u.role !== "regular").length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("customers")}
              className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto ${
                activeTab === "customers"
                  ? "bg-white text-secondary shadow-md"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50 opacity-70"
              }`}
            >
              👥 Customers{" "}
              <span className="text-[10px] bg-secondary/10 text-secondary px-1.5 py-0.5 rounded-md">
                {users.filter((u) => u.role === "regular").length}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 grid-rows-1 overflow-hidden">
            {/* All Users Panel */}
            <div
              className={`transition-all duration-500 col-start-1 row-start-1 ${
                activeTab === "all"
                  ? "opacity-100 translate-x-0 pointer-events-auto z-10"
                  : "opacity-0 -translate-x-full pointer-events-none z-0"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  Master <span className="text-slate-400">Registry</span>
                </h2>
              </div>

              <div className="floating-card bg-transparent md:bg-white p-0 overflow-hidden border-none md:border md:border-slate-100 shadow-none md:shadow-xl md:shadow-slate-200/40">
                {/* Mobile Grid View */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {users.map((u) => (
                    <div
                      key={u._id}
                      className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border ${u.role === "regular" ? "bg-orange-50 text-orange-400 border-orange-100" : "bg-blue-50 text-blue-400 border-blue-100"}`}
                          >
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{u.name}</p>
                            <p className="text-[11px] text-slate-400">
                              {u.email}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          aria-label={`Delete ${u.name}`}
                          className="p-2 text-rose-500 bg-rose-50 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                        >
                          🗑️
                        </button>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                          Access Level
                        </span>
                        <span
                          className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${u.role === "regular" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}
                        >
                          {u.role.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/80 text-slate-400 border-b border-slate-100">
                      <tr>
                        <th className="p-4 font-bold uppercase text-[10px] tracking-wider">
                          User
                        </th>
                        <th className="p-4 font-bold uppercase text-[10px] tracking-wider">
                          Contact
                        </th>
                        <th className="p-4 font-bold uppercase text-[10px] tracking-wider">
                          Role
                        </th>
                        <th className="p-4 font-bold uppercase text-[10px] tracking-wider text-right">
                          Delete
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {users.map((u) => (
                        <tr
                          key={u._id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${u.role === "regular" ? "bg-orange-50 text-orange-400 border-orange-100" : "bg-blue-50 text-blue-400 border-blue-100"}`}
                              >
                                {u.name.charAt(0)}
                              </div>
                              <span className="font-bold text-slate-700">
                                {u.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-slate-500">{u.email}</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${u.role === "regular" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}
                            >
                              {u.role.replace("_", " ")}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              aria-label={`Delete ${u.name}`}
                              className="text-slate-300 hover:text-rose-500 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div
              className={`transition-all duration-500 col-start-1 row-start-1 ${
                activeTab === "staff"
                  ? "opacity-100 translate-x-0 pointer-events-auto z-10"
                  : activeTab === "all"
                    ? "opacity-0 translate-x-full pointer-events-none z-0"
                    : "opacity-0 -translate-x-full pointer-events-none z-0"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  Staff{" "}
                  <span className="text-primary opacity-60">Directory</span>
                </h2>
                <a
                  href="/dashboard"
                  className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-xl transition-all active:scale-95 text-xs flex items-center gap-2"
                >
                  <span>+</span> New Staff Member
                </a>
              </div>

              <div className="floating-card bg-transparent md:bg-white p-0 overflow-hidden border-none md:border md:border-slate-100 shadow-none md:shadow-xl md:shadow-slate-200/40">
                {/* Mobile Card Grid */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {users
                    .filter((u) => u.role !== "regular")
                    .map((u) => (
                      <div
                        key={u._id}
                        className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-100">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">
                                {u.name}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {u.email}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            aria-label={`Delete ${u.name}`}
                            className="text-rose-500 p-2 bg-rose-50 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                          >
                            🗑️
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-slate-400 ml-1">
                              Role
                            </label>
                            <select
                              value={u.role}
                              onChange={(e) =>
                                handleUpdateRole(
                                  u._id,
                                  e.target.value,
                                  u.branchId?._id,
                                )
                              }
                              className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-[10px] font-bold w-full outline-none"
                            >
                              <option value="delivery_person">
                                Delivery Person
                              </option>
                              <option value="branch_head">Branch Head</option>
                              <option value="main_admin">Main Admin</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-slate-400 ml-1">
                              Branch
                            </label>
                            <select
                              value={u.branchId?._id || ""}
                              onChange={(e) =>
                                handleUpdateRole(u._id, u.role, e.target.value)
                              }
                              className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-[10px] font-bold w-full outline-none"
                            >
                              <option value="">None</option>
                              {branches.map((b) => (
                                <option key={b._id} value={b._id}>
                                  {b.branchName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/80 text-slate-400 border-b border-slate-100">
                      <tr>
                        <th className="p-4 font-bold uppercase text-[10px] tracking-wider">
                          Identity
                        </th>
                        <th className="p-4 font-bold uppercase text-[10px] tracking-wider">
                          Authentication
                        </th>
                        <th className="p-4 font-bold uppercase text-[10px] tracking-wider">
                          Access Level
                        </th>
                        <th className="p-4 font-bold uppercase text-[10px] tracking-wider">
                          Assigned Branch
                        </th>
                        <th className="p-4 font-bold uppercase text-[10px] tracking-wider text-right">
                          Control
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {users
                        .filter((u) => u.role !== "regular")
                        .map((u) => (
                          <tr
                            key={u._id}
                            className="hover:bg-slate-50/50 transition-colors group"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-200">
                                  {u.name.charAt(0)}
                                </div>
                                <span className="font-bold text-slate-700">
                                  {u.name}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 text-slate-500 font-medium">
                              {u.email}
                            </td>
                            <td className="p-4">
                              <select
                                value={u.role}
                                onChange={(e) =>
                                  handleUpdateRole(
                                    u._id,
                                    e.target.value,
                                    u.branchId?._id,
                                  )
                                }
                                className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-[11px] font-bold outline-none w-36 focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer hover:bg-white"
                              >
                                <option value="delivery_person">
                                  Delivery Person
                                </option>
                                <option value="branch_head">Branch Head</option>
                                <option value="main_admin">Main Admin</option>
                              </select>
                            </td>
                            <td className="p-4">
                              <select
                                value={u.branchId?._id || ""}
                                onChange={(e) =>
                                  handleUpdateRole(
                                    u._id,
                                    u.role,
                                    e.target.value,
                                  )
                                }
                                className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-[11px] font-bold outline-none shadow-sm focus:ring-2 focus:ring-primary/20 transition-all hover:bg-white cursor-pointer"
                              >
                                <option value="">No Branch Assigned</option>
                                {branches.map((b) => (
                                  <option key={b._id} value={b._id}>
                                    {b.branchName}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => handleDeleteUser(u._id)}
                                aria-label={`Delete ${u.name}`}
                                className="text-slate-300 hover:text-rose-500 font-bold p-2 rounded-lg transition-all text-[14px] hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                                title="Remove Staff"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div
              className={`transition-all duration-500 col-start-1 row-start-1 ${
                activeTab === "customers"
                  ? "opacity-100 translate-x-0 pointer-events-auto z-10"
                  : "opacity-0 translate-x-full pointer-events-none z-0"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  Customer{" "}
                  <span className="text-secondary opacity-60">Directory</span>
                </h2>
              </div>

              <div className="floating-card bg-transparent md:bg-white p-0 overflow-hidden border-none md:border md:border-slate-100 shadow-none md:shadow-xl md:shadow-slate-200/40">
                {/* Mobile Card Grid */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {users
                    .filter((u) => u.role === "regular")
                    .map((u) => (
                      <div
                        key={u._id}
                        className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-100">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">
                                {u.name}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {u.email}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            aria-label={`Delete ${u.name}`}
                            className="text-rose-500 p-2 bg-rose-50 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                          >
                            🗑️
                          </button>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-slate-400 ml-1">
                            Account Role
                          </label>
                          <select
                            value={u.role}
                            onChange={(e) =>
                              handleUpdateRole(
                                u._id,
                                e.target.value,
                                u.branchId?._id,
                              )
                            }
                            className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-[11px] font-bold outline-none w-full shadow-sm"
                          >
                            <option value="regular">Regular Account</option>
                            <option value="delivery_person">
                              Upgrade to Staff
                            </option>
                          </select>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/80 text-slate-400 border-b border-slate-100">
                      <tr>
                        <th className="p-4 font-bold uppercase text-[10px] tracking-wider">
                          Customer Name
                        </th>
                        <th className="p-4 font-bold uppercase text-[10px] tracking-wider">
                          Contact Email
                        </th>
                        <th className="p-4 font-bold uppercase text-[10px] tracking-wider">
                          Account Role
                        </th>
                        <th className="p-4 font-bold uppercase text-[10px] tracking-wider text-right">
                          Control
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {users
                        .filter((u) => u.role === "regular")
                        .map((u) => (
                          <tr
                            key={u._id}
                            className="hover:bg-slate-50/50 transition-colors group"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-200">
                                  {u.name.charAt(0)}
                                </div>
                                <span className="font-bold text-slate-700">
                                  {u.name}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 text-slate-500 font-medium">
                              {u.email}
                            </td>
                            <td className="p-4">
                              <select
                                value={u.role}
                                onChange={(e) =>
                                  handleUpdateRole(
                                    u._id,
                                    e.target.value,
                                    u.branchId?._id,
                                  )
                                }
                                className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-[11px] font-bold outline-none w-36 shadow-sm focus:ring-2 focus:ring-primary/20 transition-all hover:bg-white cursor-pointer"
                              >
                                <option value="regular">Regular Account</option>
                                <option value="delivery_person">
                                  Upgrade to Staff
                                </option>
                              </select>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => handleDeleteUser(u._id)}
                                aria-label={`Delete ${u.name}`}
                                className="text-slate-300 hover:text-rose-500 font-bold p-2 rounded-lg transition-all text-[14px] hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                                title="Deactivate Account"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
