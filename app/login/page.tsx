"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError("");
        setLoading(true);
        try {
            const data = await api.auth.login({ email, password });
            localStorage.setItem("token", data.token);
            localStorage.setItem("admin", JSON.stringify(data.admin));
            router.push("/admin");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{ backgroundColor: "#E5E1D8" }}
        >
            <div
                className="w-full max-w-md p-6 md:p-8 rounded-2xl shadow-lg"
                style={{ backgroundColor: "#FFFFFF" }}
            >
                <h1 className="text-2xl md:text-3xl font-bold text-center mb-1" style={{ color: "#2E2E2E" }}>
                    GreatTime Event Center
                </h1>
                <p className="text-center text-sm mb-6" style={{ color: "#5F6F52" }}>
                    Admin Login Portal
                </p>

                {error && (
                    <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 rounded outline-none border"
                        style={{ backgroundColor: "#F5F5F5", color: "#2E2E2E", borderColor: "#9FAF97" }}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 rounded outline-none border"
                        style={{ backgroundColor: "#F5F5F5", color: "#2E2E2E", borderColor: "#9FAF97" }}
                    />

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full py-3 rounded font-semibold transition disabled:opacity-50"
                        style={{
                            backgroundColor: "#5F6F52",
                            color: "#E5E1D8",
                        }}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </div>

                <p className="text-center text-sm mt-6" style={{ color: "#2E2E2E" }}>
                    Don't have access?{" "}
                    <a
                        href="/register"
                        className="font-semibold underline"
                        style={{ color: "#5F6F52" }}
                    >
                        Register Admin
                    </a>
                </p>
            </div>
        </div>
    );
}
