const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../utils/apiClient";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }
  // Optional: Add a loading state here if desired
  // setLoading(true);

  try {
    // Use the apiClient to make the POST request.
    // It automatically handles the base URL and JSON conversion.
    await apiClient.post(`/api/users/reset-password/${token}`, { password });

    // If the request is successful (i.e., doesn't throw an error), we can proceed.
    setSuccess("Password reset successful! Redirecting to login...");
    setTimeout(() => {
      navigate("/login");
    }, 2000);

  } catch (err) {
    // This block catches network errors and non-2xx server responses (like 400, 500).
    console.error("Error resetting password:", err);
    // Use the specific error message from the server if available.
    setError(err.response?.data?.message || "Something went wrong. Please try again later.");
  } finally {
    // Optional: Stop the loading state
    // setLoading(false);
  }
};

  return (
    <main className="flex-grow mx-auto px-4 sm:px-6 lg:px-8 py-8"> 
      <div className="w-full max-w-xl bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-700">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-400">Reset Password</h1>
          <h2 className="text-2xl font-medium text-gray-300 mt-4">
            Enter and confirm your new password
          </h2>
        </div>

        {error && <div className="text-red-400 text-sm mb-4 text-center">{error}</div>}
        {success && <div className="text-green-400 text-sm mb-4 text-center">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-base font-medium text-gray-300 mb-1">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              className="w-full px-5 py-3 bg-gray-900 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-300 mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
              className="w-full px-5 py-3 bg-gray-900 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 cursor-pointer text-white font-semibold py-3 text-lg rounded-xl hover:bg-indigo-700 transition duration-200"
          >
            Reset Password
          </button>
        </form>

        <div className="text-sm text-center text-gray-400 mt-8">
          Remembered your password?{" "}
          <a href="/login" className="text-indigo-400 hover:underline font-medium">
            Log In
          </a>
        </div>

        <p className="text-xs text-center text-gray-500 mt-3">
          Only authorized IIITA users allowed
        </p>
      </div>
    </main>
  );
};

export default ResetPassword;
