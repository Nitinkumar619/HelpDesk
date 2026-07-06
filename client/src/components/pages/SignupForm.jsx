const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useNotify from "../../hooks/useNotify";
import FloatingIcons from "../ui/FloatingIcons";
import apiClient from "../../utils/apiClient";


const SignupForm = () => {
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotify();

  const handleSignup = async (e) => {
  e.preventDefault();
  // Optional: Add a loading state to disable the button during submission
  // setLoading(true);

  try {
    // Use the apiClient to make the POST request.
    // It automatically handles the base URL, headers, and JSON conversion.
    const { data } = await apiClient.post("/api/users/signup", { name, email, password });

    if (data.success) {
      // On successful signup, store the token and navigate the user.
      localStorage.setItem("token", data.token);
      notifySuccess("Signup successful! Redirecting to login...");
      
      // Navigate to the login page after a short delay to allow the user to see the success message.
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } else {
      // This case handles scenarios where the server responds with 200 OK but indicates failure in the body.
      // This might not be reached if the server always sends error statuses for failures.
      notifyError(data.message || "Signup failed. Please try again.");
    }
  } catch (err) {
    // This block catches network errors and non-2xx server responses (like 400, 500).
    console.error("Signup error:", err);
    // Use the specific error message from the server if available.
    notifyError(err.response?.data?.message || "Server error. Please try again later.");
  } finally {
    // Optional: Stop the loading state
    // setLoading(false);
  }
};

  return (
    <main className="flex-grow mx-auto px-4 sm:px-6 lg:px-8 py-8"> 
      <div className="min-h-screen w-full max-w-2xl bg-gray-800 p-12 rounded-3xl shadow-2xl border border-gray-700">
        <FloatingIcons />
        <FloatingIcons />
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-indigo-400">IIITA Help Desk</h1>
          <h2 className="text-2xl font-medium text-gray-300 mt-4">Create an Account</h2>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-base font-medium text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-5 py-3 bg-gray-900 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="you@iiita.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3 bg-gray-900 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3 bg-gray-900 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 cursor-pointer text-white font-semibold py-3 text-lg rounded-xl hover:bg-indigo-700 transition duration-200"
          >
            Sign Up
          </button>
        </form>

        <div className="text-sm text-center text-gray-400 mt-8">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-400 hover:underline font-medium">
            Login
          </a>
        </div>

        <p className="text-xs text-center text-gray-500 mt-3">
          Use your IIITA email address to register.
        </p>
      </div>
    </main>
  );
};

export default SignupForm;
