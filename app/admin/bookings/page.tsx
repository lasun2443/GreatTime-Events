"use client";

import { useState, useEffect } from "react";
import { api } from "../../lib/api";

export default function BookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({ status: "", customer: "" });

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Not authenticated");

            const data = await api.bookings.getAll(token, filters);
            setBookings(data.bookings);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Not authenticated");

            await api.bookings.update({ id, status }, token);
            fetchBookings();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleFilter = () => {
        fetchBookings();
    };

    return (
        <div
            className="w-full min-h-screen p-4 md:p-8 space-y-6"
            style={{ backgroundColor: "#E5E1D8" }}
        >
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "#2E2E2E" }}>
                    Bookings Management
                </h1>
                <p className="text-sm mt-1" style={{ color: "#5F6F52" }}>
                    Approve, reject and track all hall bookings
                </p>
            </div>

            {error && (
                <div className="p-3 rounded bg-red-100 text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Filters */}
            <div
                className="p-4 rounded-xl shadow flex flex-wrap gap-3 md:gap-4"
                style={{ backgroundColor: "#FFFFFF" }}
            >
                <input
                    placeholder="Search by customer..."
                    value={filters.customer}
                    onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
                    className="p-2 rounded outline-none border w-full md:w-1/3"
                    style={{ backgroundColor: "#F5F5F5", color: "#2E2E2E", borderColor: "#9FAF97" }}
                />

                <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="p-2 rounded outline-none border w-full md:w-1/4"
                    style={{ backgroundColor: "#F5F5F5", color: "#2E2E2E", borderColor: "#9FAF97" }}
                >
                    <option value="">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="COMPLETED">Completed</option>
                </select>

                <button
                    onClick={handleFilter}
                    className="px-4 py-2 rounded font-semibold transition w-full md:w-auto"
                    style={{ backgroundColor: "#5F6F52", color: "#E5E1D8" }}
                >
                    Filter
                </button>
            </div>

            {/* Table (Desktop) */}
            <div
                className="hidden md:block p-4 md:p-6 rounded-xl shadow"
                style={{ backgroundColor: "#FFFFFF" }}
            >
                {loading ? (
                    <p className="text-center py-4">Loading bookings...</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead style={{ backgroundColor: "#9FAF97", color: "#2E2E2E" }}>
                            <tr>
                                <th className="py-3 px-4 text-left rounded-tl-lg">Customer</th>
                                <th className="py-3 px-4 text-center">Phone</th>
                                <th className="py-3 px-4 text-center">Hall</th>
                                <th className="py-3 px-4 text-center">Date</th>
                                <th className="py-3 px-4 text-center">Status</th>
                                <th className="py-3 px-4 text-center rounded-tr-lg">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((b) => (
                                <tr key={b.id} className="border-b" style={{ borderColor: "#E5E1D8" }}>
                                    <td className="py-3 px-4" style={{ color: "#2E2E2E" }}>{b.customer}</td>
                                    <td className="py-3 px-4 text-center" style={{ color: "#2E2E2E" }}>{b.phone}</td>
                                    <td className="py-3 px-4 text-center" style={{ color: "#2E2E2E" }}>{b.hall.name}</td>
                                    <td className="py-3 px-4 text-center" style={{ color: "#2E2E2E" }}>{new Date(b.date).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span
                                            className="px-3 py-1 rounded-full text-xs font-semibold"
                                            style={{
                                                backgroundColor:
                                                    b.status === "PENDING"
                                                        ? "#FFF4E6"
                                                        : b.status === "APPROVED"
                                                            ? "#E8F5E9"
                                                            : "#FFEBEE",
                                                color:
                                                    b.status === "PENDING"
                                                        ? "#F57C00"
                                                        : b.status === "APPROVED"
                                                            ? "#2E7D32"
                                                            : "#C62828",
                                            }}
                                        >
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center space-x-2">
                                        {b.status === "PENDING" && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(b.id, "APPROVED")}
                                                    className="px-3 py-1 rounded text-sm font-semibold"
                                                    style={{ backgroundColor: "#5F6F52", color: "#E5E1D8" }}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(b.id, "CANCELLED")}
                                                    className="px-3 py-1 rounded text-sm font-semibold"
                                                    style={{ backgroundColor: "#C62828", color: "#FFFFFF" }}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {b.status === "APPROVED" && (
                                            <button
                                                onClick={() => handleStatusUpdate(b.id, "CANCELLED")}
                                                className="px-3 py-1 rounded text-sm font-semibold"
                                                style={{ backgroundColor: "#C62828", color: "#FFFFFF" }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Cards (Mobile) */}
            <div className="md:hidden space-y-4">
                {bookings.map((b) => (
                    <div
                        key={b.id}
                        className="p-4 rounded-lg shadow"
                        style={{
                            backgroundColor: "#9FAF97",
                            color: "#2E2E2E",
                        }}
                    >
                        <div className="flex justify-between mb-2">
                            <span className="text-sm opacity-70">Customer</span>
                            <span className="font-semibold">{b.customer}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm opacity-70">Phone</span>
                            <span>{b.phone}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm opacity-70">Hall</span>
                            <span>{b.hall.name}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm opacity-70">Date</span>
                            <span>{new Date(b.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between mb-3">
                            <span className="text-sm opacity-70">Status</span>
                            <span
                                className="px-3 py-1 rounded-full text-xs font-semibold"
                                style={{
                                    backgroundColor:
                                        b.status === "PENDING"
                                            ? "#FFF4E6"
                                            : b.status === "APPROVED"
                                                ? "#E8F5E9"
                                                : "#FFEBEE",
                                    color:
                                        b.status === "PENDING"
                                            ? "#F57C00"
                                            : b.status === "APPROVED"
                                                ? "#2E7D32"
                                                : "#C62828",
                                }}
                            >
                                {b.status}
                            </span>
                        </div>

                        <div className="flex gap-2">
                            {b.status === "PENDING" && (
                                <>
                                    <button
                                        onClick={() => handleStatusUpdate(b.id, "APPROVED")}
                                        className="flex-1 py-2 rounded text-sm font-semibold"
                                        style={{ backgroundColor: "#5F6F52", color: "#E5E1D8" }}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(b.id, "CANCELLED")}
                                        className="flex-1 py-2 rounded text-sm font-semibold"
                                        style={{ backgroundColor: "#C62828", color: "#FFFFFF" }}
                                    >
                                        Reject
                                    </button>
                                </>
                            )}
                            {b.status === "APPROVED" && (
                                <button
                                    onClick={() => handleStatusUpdate(b.id, "CANCELLED")}
                                    className="flex-1 py-2 rounded text-sm font-semibold"
                                    style={{ backgroundColor: "#C62828", color: "#FFFFFF" }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
