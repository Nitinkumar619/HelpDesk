const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
import React, { useState } from "react";
import apiClient from "../../utils/apiClient";

function Track() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");
  const [personnel, setPersonnel] = useState(null);

  const handleTrack = async () => {
  setError("");
  setStatus(null);
 

  if (!email || !code) {
    setError("Please enter both email and ticket code.");
    return;
  }

  try {
    const { data } = await apiClient.post("/api/complaints/track", { email, code });

    if (data.success) {
      setStatus(data.status);
      // Conditionally set personnel info if it exists in the response.
      if (data.personnel) {
        setPersonnel(data.personnel);
      } else {
        setPersonnel(null);
      }
    } else {
      // This case handles scenarios where the server responds with 200 OK
      // but indicates failure in the body.
      setError(data.message || "Ticket not found.");
    }
  } catch (err) {
    // This block catches network errors and non-2xx server responses (like 404, 500).
    console.error("Error tracking ticket:", err);
    // Use the specific error message from the server if available.
    setError(err.response?.data?.message || "An error occurred while fetching status.");
  } finally {
    
  }
};


  return (
    <main className="flex-grow mx-auto px-4 sm:px-6 lg:px-8 py-24"> 
    <div className="max-w-xl mx-auto p-8 bg-gray-800 rounded-2xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold text-center text-white mb-6">Track Your Ticket</h2>
      <div className="space-y-4">
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white"
        />
        <input
          type="text"
          placeholder="Ticket ID"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white"
        />
        <button
          onClick={handleTrack}
          className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold"
        >
          Track Ticket
        </button>

        {status && (
          <div className="mt-4 text-lg text-white text-center">
            <strong>Status:</strong> <span className="text-indigo-400">{status}</span>
          </div>
        )}
        {personnel && (
          <div className="mt-2 text-white text-center">
            <p><strong>Assigned To:</strong> {personnel.name}</p>
            <p><strong>Contact:</strong> {personnel.contact}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-500 text-center font-medium">{error}</div>
        )}
      </div>
    </div>
    </main>
  );
}

export default Track;
