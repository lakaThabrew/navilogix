import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AdminReports = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("userInfo"));
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get("http://localhost:5000/api/parcels/reports", config);
            setStats(data.stats);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching stats:", error);
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center p-8">Loading Analytics...</div>;
    if (!stats) return <div className="text-center p-8">No data available.</div>;

    // Chart Data Preparation
    const branchLabels = Object.keys(stats.branchBreakdown || {});
    const branchData = Object.values(stats.branchBreakdown || {});

    const riderLabels = Object.keys(stats.riderPerformance || {});
    const riderDataDelivered = riderLabels.map(r => stats.riderPerformance[r].delivered);
    const riderDataAssigned = riderLabels.map(r => stats.riderPerformance[r].assigned);

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

    return (
        <div className="p-8 max-w-7xl mx-auto pt-32">
            <h1 className="text-4xl font-bold text-primary mb-8">📊 System Analytics</h1>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="floating-card p-6 bg-blue-600 text-white">
                    <h3 className="text-lg opacity-80">Total Parcels</h3>
                    <p className="text-4xl font-bold">{stats.totalParcels}</p>
                </div>
                <div className="floating-card p-6 bg-green-500 text-white">
                    <h3 className="text-lg opacity-80">Total Revenue (COD)</h3>
                    <p className="text-4xl font-bold">Rs. {stats.totalRevenue}</p>
                </div>
                <div className="floating-card p-6 bg-yellow-500 text-white">
                    <h3 className="text-lg opacity-80">Pending Delivery</h3>
                    <p className="text-4xl font-bold">{stats.totalPending}</p>
                </div>
                <div className="floating-card p-6 bg-red-500 text-white">
                    <h3 className="text-lg opacity-80">Returns</h3>
                    <p className="text-4xl font-bold">{stats.totalReturned}</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="floating-card p-6 bg-white min-h-[400px]">
                    <h3 className="text-xl font-bold text-gray-700 mb-4">🏢 Branch Performance</h3>
                    {branchLabels.length > 0 ? (
                        <Bar options={{ responsive: true, plugins: { legend: { position: 'top' } } }} data={branchChartData} />
                    ) : <p>No branch data yet.</p>}
                </div>
                <div className="floating-card p-6 bg-white min-h-[400px]">
                    <h3 className="text-xl font-bold text-gray-700 mb-4">🚴 Rider Efficiency</h3>
                    {riderLabels.length > 0 ? (
                        <Bar options={{ responsive: true, plugins: { legend: { position: 'top' } } }} data={riderChartData} />
                    ) : <p>No rider data yet.</p>}
                </div>
            </div>

            {/* Detailed Table Placeholder (Optional) */}
            {/* Could list top branches or recent critical issues */}
        </div>
    );
};

export default AdminReports;
