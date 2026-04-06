import React, { useEffect, useState } from "react";
import axios from "axios";
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
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);

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

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateRole = async (userId, newRole, branchId = null) => {
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
      alert("Failed to update user role");
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
    const stdLabel = label.charAt(0) != label.charAt(0).toUpperCase() ? label.charAt(0).toUpperCase() + label.slice(1) : label;
    standardizedMap[stdLabel] = (standardizedMap[stdLabel] || 0) + typeData[index];
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
        <div className="floating-card p-6 bg-white mb-8 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
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
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <button
            onClick={() => fetchStats()}
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95"
          >
            Apply Filter
          </button>
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
              fetchStats("", "");
            }}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all text-xs"
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
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">
              {stats.totalParcels}
            </p>
          </div>
          <div className="floating-card p-6 !bg-white border-l-4 border-green-500">
            <h3 className="text-lg text-gray-500 font-semibold mb-2">
              Total Revenue (COD)
            </h3>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 break-words">
              Rs. {Number(stats.totalRevenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="floating-card p-6 !bg-white border-l-4 border-yellow-500">
            <h3 className="text-lg text-gray-500 font-semibold mb-2">
              Pending Delivery
            </h3>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-500">
              {stats.totalPending}
            </p>
          </div>
          <div className="floating-card p-6 !bg-white border-l-4 border-red-500">
            <h3 className="text-lg text-gray-500 font-semibold mb-2">
              Returns
            </h3>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-500">
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
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-primary">
              👥 User{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-500">
                Management
              </span>
            </h2>
            <a
              href="/register"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white text-sm px-4 py-2 rounded-lg font-bold shadow hover:bg-red-600 transition-colors"
            >
              + Add New User
            </a>
          </div>

          <div className="floating-card bg-white p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                  <tr>
                    <th className="p-4 font-bold">Name</th>
                    <th className="p-4 font-bold">Email</th>
                    <th className="p-4 font-bold">Current Role</th>
                    <th className="p-4 font-bold">Branch (If applicable)</th>
                    <th className="p-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr
                      key={u._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 font-medium text-gray-800">
                        {u.name}
                      </td>
                      <td className="p-4 text-gray-500">{u.email}</td>
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
                          className="bg-transparent border border-gray-200 rounded p-1 text-sm outline-none w-32"
                        >
                          <option value="regular">Regular</option>
                          <option value="delivery_person">
                            Delivery Person
                          </option>
                          <option value="branch_head">Branch Head</option>
                          <option value="main_admin">Main Admin</option>
                        </select>
                      </td>
                      <td className="p-4">
                        {u.role === "branch_head" ||
                        u.role === "delivery_person" ? (
                          <select
                            value={u.branchId?._id || ""}
                            onChange={(e) =>
                              handleUpdateRole(u._id, u.role, e.target.value)
                            }
                            className="bg-transparent border border-gray-200 rounded p-1 text-sm outline-none"
                          >
                            <option value="">Select Branch...</option>
                            {branches.map((b) => (
                              <option key={b._id} value={b._id}>
                                {b.branchName}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-gray-400 italic">No Data</span>
                        )}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="text-red-500 hover:text-red-700 font-bold px-3 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors text-xs"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
