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

const BranchReports = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading)
        return <div className="text-center p-8">🔃 Loading Analytics...</div>;
    if (!stats)
        return <div className="text-center p-8">❌ No data available.</div>;

    // Chart Data Preparation
    const riderLabels = Object.keys(stats.riderPerformance || {});
    const riderDataDelivered = riderLabels.map(
        (r) => stats.riderPerformance[r].delivered,
    );
    const riderDataAssigned = riderLabels.map(
        (r) => stats.riderPerformance[r].assigned,
    );

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
    const typeLabels = typeLabelsRaw.map(
        (label, index) => `${label} (${typeData[index]})`,
    );
    const typeChartData = {
        labels: typeLabels,
        datasets: [
            {
                data: typeData,
                backgroundColor: [
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="p-8 max-w-7xl mx-auto pt-32 space-y-12">
            <div>
                <h1 className="text-4xl font-bold text-primary mb-8">
                    📊 Branch{" "}
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
                        className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 text-xs"
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="floating-card p-6 bg-white flex flex-col items-center">
                        <h3 className="text-xl font-bold text-gray-700 mb-4 w-full text-left">
                            🏷️ Parcel Types
                        </h3>
                        <div className="w-full max-w-[300px]">
                            {typeLabels.length > 0 ? (
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
        </div>
    );
};

export default BranchReports;
