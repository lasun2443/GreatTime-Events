"use client";

import { useState, useEffect } from "react";
import { api } from "../lib/api";

interface Stat {
    title: string;
    value: string | number;
}

interface Booking {
    customer: string;
    hall: string; // Assuming hall.name is mapped to hall directly in API response
    date: string;
    status: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stat[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [statsData, recentBookingsData] = await Promise.all([
                    api.dashboard.getStats(),
                    api.dashboard.getRecentBookings(),
                ]);

                setStats([
                    { title: "Total Halls", value: statsData.totalHalls },
                    { title: "Total Bookings", value: statsData.totalBookings },
                    { title: "Pending", value: statsData.pendingBookings },
                    {
                        title: "Revenue",
                        value: new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                        }).format(statsData.totalRevenue),
                    },
                ]);
                setBookings(recentBookingsData.recentBookings);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="w-full min-h-screen p-4 md:p-8 flex items-center justify-center" style={{ backgroundColor: "#E5E1D8" }}>
                <p style={{ color: "#5F6F52" }}>Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-h-screen p-4 md:p-8 flex items-center justify-center" style={{ backgroundColor: "#E5E1D8" }}>
                <p style={{ color: "#C62828" }}>Error: {error}</p>
            </div>
    );
  }

    return (
        <div
            className="w-full min-h-screen p-4 md:p-8"
            style={{ backgroundColor: "#E5E1D8" }}
        >
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "#2E2E2E" }}>
                    Admin Dashboard
                </h1>
                <p className="text-sm mt-1" style={{ color: "#5F6F52" }}>
                    Welcome back! Here's what's happening today.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className="p-4 md:p-6 rounded-xl shadow"
                        style={{
                            backgroundColor: "#9FAF97",
                            color: "#2E2E2E",
                        }}
                    >
                        <p className="text-sm opacity-70">{stat.title}</p>
                        <h2 className="text-xl md:text-2xl font-bold mt-2">{stat.value}</h2>
                    </div>
                ))}
            </div>

            {/* Recent Bookings */}
            <div
                className="rounded-xl shadow p-4 md:p-6"
                style={{ backgroundColor: "#FFFFFF", color: "#2E2E2E" }}
            >
                <h3 className="text-lg md:text-xl font-semibold mb-4" style={{ color: "#2E2E2E" }}>
                    Recent Bookings
                </h3>

                {/* Table (Tablet & Desktop) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead style={{ backgroundColor: "#9FAF97", color: "#2E2E2E" }}>
                            <tr>
                                <th className="py-3 px-4 text-left rounded-tl-lg">Customer</th>
                                <th className="py-3 px-4 text-center">Hall</th>
                                <th className="py-3 px-4 text-center">Date</th>
                                <th className="py-3 px-4 text-center rounded-tr-lg">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking, i) => (
                                <tr
                                    key={i}
                                    className="border-b"
                                    style={{ borderColor: "#E5E1D8" }}
                                >
                                    <td className="py-3 px-4">{booking.customer}</td>
                                    <td className="text-center py-3 px-4">{booking.hall}</td>
                                    <td className="text-center py-3 px-4">{booking.date}</td>
                                    <td className="text-center py-3 px-4">
                                        <span
                                            className="px-3 py-1 rounded-full text-xs font-semibold"
                                            style={{
                                                backgroundColor:
                                                    booking.status === "PENDING"
                                                        ? "#FFF4E6"
                                                        : booking.status === "APPROVED"
                                                            ? "#E8F5E9"
                                                            : "#FFEBEE",
                                                color:
                                                    booking.status === "PENDING"
                                                        ? "#F57C00"
                                                        : booking.status === "APPROVED"
                                                            ? "#2E7D32"
                                                            : "#C62828",
                                            }}
                                        >
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Cards (Mobile) */}
                <div className="md:hidden flex flex-col gap-4">
                    {bookings.map((booking, i) => (
                        <div
                            key={i}
                            className="p-4 rounded-lg shadow"
                            style={{
                                backgroundColor: "#9FAF97",
                                color: "#2E2E2E",
                            }}
                        >
                            <div className="flex justify-between mb-2">
                                <span className="text-sm opacity-70">Customer</span>
                                <span className="font-semibold">{booking.customer}</span>
                            </div>

                            <div className="flex justify-between mb-2">
                                <span className="text-sm opacity-70">Hall</span>
                                <span>{booking.hall}</span>
                            </div>

                            <div className="flex justify-between mb-2">
                                <span className="text-sm opacity-70">Date</span>
                                <span>{booking.date}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm opacity-70">Status</span>
                                <span
                                    className="px-3 py-1 rounded-full text-xs font-semibold"
                                    style={{
                                        backgroundColor:
                                            booking.status === "PENDING"
                                                ? "#FFF4E6"
                                                : booking.status === "APPROVED"
                                                    ? "#E8F5E9"
                                                    : "#FFEBEE",
                                        color:
                                            booking.status === "PENDING"
                                                ? "#F57C00"
                                                : booking.status === "APPROVED"
                                                    ? "#2E7D32"
                                                    : "#C62828",
                                    }}
                                >
                                    {booking.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}