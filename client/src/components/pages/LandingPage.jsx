const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Ticket, ShieldCheck, Clock, MessagesSquare, ChevronRight } from "lucide-react";
import iiitaImage from "../../assets/img/iiita.jpeg";
import { jwtDecode } from "jwt-decode";
import FloatingIcons from "../ui/FloatingIcons";
import FeatureCard from "../ui/FeatureCard";
import Button from "../ui/Button";
import Particles from "../ui/Particles";

const LandingPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserName(decoded.name || "User");
      setIsLoggedIn(true);
    }
  }, []);

  const handleNavigate = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      localStorage.setItem("redirectAfterLogin", path);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-gray-900 to-black text-white">
      {/* <FloatingIcons /> */}
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
      <Particles />
        <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
          <div className="pt-20 pb-16 md:pt-32 md:pb-24 flex flex-col md:flex-row items-center justify-between">
            <div className="z-10 text-left md:w-1/2 mb-10 md:mb-0">
            
              <div className="inline-block px-4 py-1 rounded-full bg-indigo-800/60 text-indigo-200 text-sm font-medium mb-4">
                {isLoggedIn ? "Welcome Back!" : "IIITA Help Desk"}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-indigo-400 mb-6">
                {isLoggedIn ? `Hello, ${userName}` : "Streamlined Support System"}
              </h1>
              <p className="text-lg text-gray-300 max-w-xl mb-8">
                {isLoggedIn 
                  ? "Manage and track your complaints with our intuitive help desk platform."
                  : "A unified platform for students and staff to raise, manage, and track complaints across hostels, departments, and facilities at IIITA."}
              </p>
              <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => handleNavigate("/select-category")}
                icon={Send}
                variant="primary"
              >
                Submit a Ticket
              </Button>
              <Button
                onClick={() => handleNavigate("/track")}
                icon={Ticket}
                variant="secondary"
              >
                View Existing Tickets
              </Button>
              {isLoggedIn && (
                <Button
                onClick={() => navigate("/profile")}
                icon={ChevronRight}
                variant="primary"
              >
                Go to Your Dashboard
              </Button>)}
              </div>
            </div>
            <div className="z-10 md:w-5/12">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur-lg opacity-50"></div>
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={iiitaImage}
                    alt="IIITA Campus"
                    className="w-full h-auto object-cover rounded-lg shadow-xl transform transition hover:scale-105 duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-900/70 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-indigo-400 mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our platform simplifies the complaint management process, ensuring quick resolution and clear communication.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            <FeatureCard
              icon={<ShieldCheck className="w-8 h-8 text-indigo-400" />}
              title="Secure Complaint Filing"
              description="Submit complaints using our structured and secure ticket system categorized by facility or department."
            />
            <FeatureCard
              icon={<Clock className="w-8 h-8 text-indigo-400" />}
              title="Real-Time Tracking"
              description="Track the progress of your complaints in real-time with status updates and estimated resolution timelines."
            />
            <FeatureCard
              icon={<MessagesSquare className="w-8 h-8 text-indigo-400" />}
              title="Transparent Communication"
              description="Communicate directly with assigned personnel via the ticket thread for updates or clarification."
            />
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12 lg:px-16 flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-8 md:mb-0">
              <h3 className="text-2xl font-bold text-white mb-2">Ready to get started?</h3>
              <p className="text-indigo-200 max-w-md">
                Submit your first ticket or check the status of an existing complaint.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => handleNavigate("/select-category")}
              icon={Send}
              variant="white"
            >
              Submit Now
            </Button>
            <Button
              onClick={() => handleNavigate("/track")}
              icon={Ticket}
              variant="outline"
            >
              Track Tickets
            </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default LandingPage;