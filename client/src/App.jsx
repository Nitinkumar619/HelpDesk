const apiUrl = import.meta.env.VITE_BACKEND_URL;
import React, { useState, useEffect } from "react";
import {BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer } from "react-toastify";
import { LandingPage, LoginForm, SignupForm, ComplaintForm, AdminDashboard, Header, Footer, 
  Track, UserDashboard, CategorySelection, ForgotPassword, ResetPassword } from "./components/pages/export";
import ChatUser from "./components/ChatUser";
import ChatAdmin from "./components/ChatAdmin";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // seconds
        if (decoded.exp && decoded.exp > currentTime) {
          setIsLoggedIn(true);
          setIsAdmin(decoded.isAdmin === true);
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
      }
    }
  }, []);
  
  const handleLogin = async (email, password) => {
    try {
      const response = await fetch(`${apiUrl}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.success && data.token) {
        localStorage.setItem("token", data.token);

        const decoded = jwtDecode(data.token);
        setIsLoggedIn(true);
        setIsAdmin(decoded.isAdmin);

      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Server error: " + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <>
    <ToastContainer />
    <Router>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <Header isLoggedIn={isLoggedIn} isAdmin={isAdmin} onLogout={handleLogout} />
          <Routes>
            <Route 
              path="/"
              element={<LandingPage />} 
            />
            <Route 
              path="/login" 
              element={isLoggedIn ? (<Navigate to={isAdmin ? "/admin" : "/dashboard"} />) : (<LoginForm onLogin={handleLogin}/>)
              }
            />
            <Route 
              path="/signup"
              element={ isLoggedIn ? <Navigate to={isAdmin ? "/admin" : "/login"} /> : <SignupForm /> }
            />
            <Route
              path="/complaint"
              element={isLoggedIn && !isAdmin ? <ComplaintForm /> : <Navigate to="/" />}
            />
            <Route
              path="/admin"
              element={isAdmin && <AdminDashboard />}
            />
            <Route 
               path="/select-category" 
               element={isLoggedIn && !isAdmin ?<CategorySelection /> : <Navigate to="/" />} 
             />
            <Route
              path="/profile"
              element={isLoggedIn && !isAdmin && <UserDashboard />}
            />
            <Route
              path="/track"
              element={isLoggedIn && !isAdmin ? <Track /> : <Navigate to="/" />}
            />
            <Route
              path="/forgot-password"
              element={<ForgotPassword />}
            />
            <Route 
              path="/reset-password/:token" 
              element={<ResetPassword />} 
            />

            <Route 
              path="/chatadmin"
              element={isLoggedIn && isAdmin && <ChatAdmin />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        <Footer />
      </div>
    </Router>
    </>
  );
};

export default App;
