"use client";

import { useState, useEffect } from "react";
import { api } from "./lib/api";

export default function LandingPage() {
  const [halls, setHalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHall, setSelectedHall] = useState<any>(null);
  const [bookingData, setBookingData] = useState({
    customer: "",
    phone: "",
    email: "",
    date: "",
  });
  const [bookingStatus, setBookingStatus] = useState("");

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const data = await api.halls.getAll();
        setHalls(data.halls);
      } catch (error) {
        console.error("Failed to fetch halls", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHalls();
  }, []);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHall) return;

    setBookingStatus("processing");
    try {
      await api.bookings.create({
        ...bookingData,
        hallId: selectedHall.id,
        amount: selectedHall.price,
      });
      setBookingStatus("success");
      setBookingData({ customer: "", phone: "", email: "", date: "" });
      setTimeout(() => {
        setSelectedHall(null);
        setBookingStatus("");
      }, 2000);
    } catch (error: any) {
      setBookingStatus("error: " + error.message);
    }
  };

  const scrollToHalls = () => {
    document.getElementById("halls-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#E5E1D8" }}
    >
      {/* Header */}
      <header
        className="flex justify-between items-center px-4 md:px-12 py-4 shadow sticky top-0 z-10"
        style={{ backgroundColor: "#9FAF97", color: "#2E2E2E" }}
      >
        <h1 className="text-lg md:text-xl font-bold">
          GreatTime Event Center
        </h1>

        <a
          href="/login"
          className="text-sm font-semibold underline"
          style={{ color: "#2E2E2E" }}
        >
          Admin Login
        </a>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="flex flex-col md:flex-row items-center justify-center px-6 md:px-16 gap-10 py-20">
          {/* Text */}
          <div className="text-center md:text-left max-w-xl">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "#2E2E2E" }}
            >
              Make Your Events Truly Memorable
            </h2>
            <p
              className="text-sm md:text-base mb-6"
              style={{ color: "#5F6F52" }}
            >
              Book beautiful halls for weddings, parties, conferences and
              special occasions at GreatTime Event Center.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={scrollToHalls}
                className="px-6 py-3 rounded font-semibold"
                style={{ backgroundColor: "#5F6F52", color: "#E5E1D8" }}
              >
                Book a Hall
              </button>

              <button
                onClick={scrollToHalls}
                className="px-6 py-3 rounded font-semibold border"
                style={{
                  borderColor: "#5F6F52",
                  color: "#5F6F52",
                  backgroundColor: "transparent",
                }}
              >
                View Halls
              </button>
            </div>
          </div>

          {/* Image / Placeholder Card */}
          <div
            className="w-full md:w-[400px] h-[250px] md:h-[300px] rounded-xl shadow flex items-center justify-center"
            style={{ backgroundColor: "#9FAF97", color: "#2E2E2E" }}
          >
            <p className="text-sm opacity-70">
              Hall Preview Image Here
            </p>
          </div>
        </div>

        {/* Halls Section */}
        <div id="halls-section" className="px-6 md:px-16 py-16 bg-white">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: "#2E2E2E" }}>
            Our Available Halls
          </h2>

          {loading ? (
            <p className="text-center">Loading halls...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {halls.map((hall) => (
                <div
                  key={hall.id}
                  className="rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
                  style={{ backgroundColor: "#F5F5F5" }}
                >
                  <div className="h-48 bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500">Hall Image</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2" style={{ color: "#2E2E2E" }}>{hall.name}</h3>
                    <div className="flex justify-between mb-4 text-sm" style={{ color: "#5F6F52" }}>
                      <span>Capacity: {hall.capacity} guests</span>
                      <span className="font-bold">₦{hall.price.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => setSelectedHall(hall)}
                      className="w-full py-2 rounded font-semibold transition"
                      style={{ backgroundColor: "#5F6F52", color: "#E5E1D8" }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Booking Modal */}
      {selectedHall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 md:p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4" style={{ color: "#2E2E2E" }}>
              Book {selectedHall.name}
            </h3>
            
            {bookingStatus === "success" ? (
              <div className="text-center py-8">
                <div className="text-green-600 text-xl font-bold mb-2">Booking Successful!</div>
                <p className="text-gray-600">We will contact you shortly to confirm.</p>
              </div>
            ) : (
              <form onSubmit={handleBook} className="space-y-4">
                {bookingStatus.startsWith("error") && (
                  <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
                    {bookingStatus.replace("error: ", "")}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#5F6F52" }}>Full Name</label>
                  <input
                    required
                    value={bookingData.customer}
                    onChange={(e) => setBookingData({ ...bookingData, customer: e.target.value })}
                    className="w-full p-2 rounded border outline-none focus:ring-2"
                    style={{ borderColor: "#9FAF97" }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#5F6F52" }}>Phone Number</label>
                  <input
                    required
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                    className="w-full p-2 rounded border outline-none focus:ring-2"
                    style={{ borderColor: "#9FAF97" }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#5F6F52" }}>Email (Optional)</label>
                  <input
                    type="email"
                    value={bookingData.email}
                    onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                    className="w-full p-2 rounded border outline-none focus:ring-2"
                    style={{ borderColor: "#9FAF97" }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#5F6F52" }}>Event Date</label>
                  <input
                    required
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    className="w-full p-2 rounded border outline-none focus:ring-2"
                    style={{ borderColor: "#9FAF97" }}
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setSelectedHall(null)}
                    className="flex-1 py-2 rounded font-semibold border"
                    style={{ borderColor: "#5F6F52", color: "#5F6F52" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingStatus === "processing"}
                    className="flex-1 py-2 rounded font-semibold disabled:opacity-50"
                    style={{ backgroundColor: "#5F6F52", color: "#E5E1D8" }}
                  >
                    {bookingStatus === "processing" ? "Booking..." : "Confirm Booking"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        className="text-center py-4 text-sm"
        style={{ backgroundColor: "#9FAF97", color: "#2E2E2E" }}
      >
        © {new Date().getFullYear()} GreatTime Event Center. All rights reserved.
      </footer>
    </div>
  );
}
