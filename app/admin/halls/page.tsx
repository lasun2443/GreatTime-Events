"use client";

import { useState, useEffect } from "react";
import { api } from "../../lib/api";

export default function HallsPage() {
    const [halls, setHalls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [newHall, setNewHall] = useState({ name: "", capacity: "", price: "" });
    const [creating, setCreating] = useState(false);

    const fetchHalls = async () => {
        try {
            const data = await api.halls.getAll();
            setHalls(data.halls);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHalls();
    }, []);

    const handleCreate = async () => {
        if (!newHall.name || !newHall.capacity || !newHall.price) {
            setError("All fields are required");
            return;
        }

        setCreating(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Not authenticated");

            await api.halls.create(newHall, token);
            setNewHall({ name: "", capacity: "", price: "" });
            fetchHalls();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this hall?")) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Not authenticated");

            await api.halls.delete(id, token);
            fetchHalls();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div
            className="w-full min-h-screen p-4 md:p-8 space-y-6"
            style={{ backgroundColor: "#E5E1D8" }}
        >
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "#2E2E2E" }}>
                    Halls Management
                </h1>
                <p className="text-sm mt-1" style={{ color: "#5F6F52" }}>
                    Add, edit, and manage event halls
                </p>
            </div>

            {error && (
                <div className="p-3 rounded bg-red-100 text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Add Hall */}
            <div
                className="p-4 md:p-6 rounded-xl shadow"
                style={{ backgroundColor: "#FFFFFF" }}
            >
                <h2 className="text-lg md:text-xl font-bold mb-4" style={{ color: "#2E2E2E" }}>
                    Add New Hall
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        placeholder="Hall Name"
                        value={newHall.name}
                        onChange={(e) => setNewHall({ ...newHall, name: e.target.value })}
                        className="p-2 rounded outline-none border"
                        style={{ backgroundColor: "#F5F5F5", color: "#2E2E2E", borderColor: "#9FAF97" }}
                    />
                    <input
                        placeholder="Capacity"
                        type="number"
                        value={newHall.capacity}
                        onChange={(e) => setNewHall({ ...newHall, capacity: e.target.value })}
                        className="p-2 rounded outline-none border"
                        style={{ backgroundColor: "#F5F5F5", color: "#2E2E2E", borderColor: "#9FAF97" }}
                    />
                    <input
                        placeholder="Price (₦)"
                        type="number"
                        value={newHall.price}
                        onChange={(e) => setNewHall({ ...newHall, price: e.target.value })}
                        className="p-2 rounded outline-none border"
                        style={{ backgroundColor: "#F5F5F5", color: "#2E2E2E", borderColor: "#9FAF97" }}
                    />

                    <button
                        onClick={handleCreate}
                        disabled={creating}
                        className="md:col-span-3 py-2 rounded font-semibold transition disabled:opacity-50"
                        style={{
                            backgroundColor: "#5F6F52",
                            color: "#E5E1D8",
                        }}
                    >
                        {creating ? "Adding..." : "Add Hall"}
                    </button>
                </div>
            </div>

            {/* Halls List */}
            <div
                className="p-4 md:p-6 rounded-xl shadow"
                style={{ backgroundColor: "#FFFFFF" }}
            >
                <h2 className="text-lg md:text-xl font-bold mb-4" style={{ color: "#2E2E2E" }}>
                    All Halls
                </h2>

                {loading ? (
                    <p className="text-center py-4">Loading halls...</p>
                ) : (
                    <>
                        {/* Table for Desktop */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead style={{ backgroundColor: "#9FAF97", color: "#2E2E2E" }}>
                                    <tr>
                                        <th className="py-3 px-4 text-left rounded-tl-lg">Name</th>
                                        <th className="py-3 px-4 text-center">Capacity</th>
                                        <th className="py-3 px-4 text-center">Price</th>
                                        <th className="py-3 px-4 text-center rounded-tr-lg">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {halls.map((hall) => (
                                        <tr key={hall.id} className="border-b" style={{ borderColor: "#E5E1D8" }}>
                                            <td className="py-3 px-4" style={{ color: "#2E2E2E" }}>{hall.name}</td>
                                            <td className="py-3 px-4 text-center" style={{ color: "#2E2E2E" }}>{hall.capacity}</td>
                                            <td className="py-3 px-4 text-center" style={{ color: "#2E2E2E" }}>₦{hall.price.toLocaleString()}</td>
                                            <td className="py-3 px-4 text-center">
                                                <button
                                                    onClick={() => handleDelete(hall.id)}
                                                    className="px-3 py-1 rounded text-sm font-semibold"
                                                    style={{ backgroundColor: "#C62828", color: "#FFFFFF" }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Cards for Mobile */}
                        <div className="md:hidden space-y-4">
                            {halls.map((hall) => (
                                <div
                                    key={hall.id}
                                    className="p-4 rounded-lg shadow"
                                    style={{
                                        backgroundColor: "#9FAF97",
                                        color: "#2E2E2E",
                                    }}
                                >
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm opacity-70">Name</span>
                                        <span className="font-semibold">{hall.name}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm opacity-70">Capacity</span>
                                        <span>{hall.capacity}</span>
                                    </div>
                                    <div className="flex justify-between mb-3">
                                        <span className="text-sm opacity-70">Price</span>
                                        <span>₦{hall.price.toLocaleString()}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(hall.id)}
                                        className="w-full py-2 rounded text-sm font-semibold"
                                        style={{ backgroundColor: "#C62828", color: "#FFFFFF" }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
