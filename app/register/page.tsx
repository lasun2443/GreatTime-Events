"use client";

export default function RegisterPage() {
    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{ backgroundColor: "#1F2A2E" }}
        >
            <div
                className="w-full max-w-md p-6 md:p-8 rounded-2xl shadow-lg"
                style={{ backgroundColor: "#E5E1D8", color: "#1F2A2E" }}
            >
                <h1 className="text-2xl md:text-3xl font-bold text-center text-[#C9A96A] mb-1">
                    GreatTime Event Center
                </h1>
                <p className="text-center text-sm mb-6">
                    Admin Registration (Dev Only)
                </p>

                <form className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email address"
                        className="w-full p-3 rounded outline-none border"
                        style={{ backgroundColor: "#F5F5F5", color: "#1F2A2E" }}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 rounded outline-none border"
                        style={{ backgroundColor: "#F5F5F5", color: "#1F2A2E" }}
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full p-3 rounded outline-none border"
                        style={{ backgroundColor: "#F5F5F5", color: "#1F2A2E" }}
                    />

                    <button
                        className="w-full py-3 rounded font-semibold transition"
                        style={{
                            backgroundColor: "#C9A96A",
                            color: "#1F2A2E",
                        }}
                    >
                        Register Admin
                    </button>
                </form>

                <p className="text-center text-sm mt-6">
                    Already have an account?{" "}
                    <a
                        href="/login"
                        className="font-semibold underline text-[#C9A96A]"
                    >
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}
