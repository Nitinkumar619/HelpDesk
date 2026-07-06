const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import StarRating from "../../components/StarRating";
import useNotify from "../../hooks/useNotify";
import { Check, Star, Loader2, AlertCircle, File, MapPin, Clock, User, Calendar, ExternalLink } from "lucide-react";
import {Close, Search} from "../../assets/Icons";
import ChatUser from "../ChatUser";
import apiClient from "../../utils/apiClient";

const UserDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({});
  const [activeFeedbackForm, setActiveFeedbackForm] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { notifySuccess, notifyError } = useNotify();
  

 const handleFeedbackSubmit = async (complaint) => {
  if (!feedback[complaint.id]?.rating) {
    notifyError("Please select a rating before submitting");
    return;
  }

  const body = {
    complaint_id: complaint.id,
    user_id: complaint.user_id,
    assigned_personnel_id: complaint.assigned_personnel_id,
    rating: feedback[complaint.id]?.rating,
    comment: feedback[complaint.id]?.comment || "",
  };

  try {
    const { data } = await apiClient.post("/api/users/feedback", body);

    if (data.success) {
      notifySuccess("Feedback submitted successfully!");

      setComplaints((prevComplaints) =>
        prevComplaints.map((c) =>
          c.id === complaint.id ? { ...c, feedback_given: true } : c
        )
      );

      setFeedback((prev) => ({ ...prev, [complaint.id]: {} }));
      setActiveFeedbackForm(null);
    } else {
      notifyError(data.message || "Failed to submit feedback.");
    }
  } catch (error) {
    console.error("Feedback error:", error);
    notifyError(error.response?.data?.message || "Error submitting feedback.");
  }
};

useEffect(() => {
  const fetchComplaints = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const { data } = await apiClient.get(`/api/complaints/user/${decoded.email}`);
      
      if (data.success && Array.isArray(data.complaints)) {
        setComplaints(data.complaints);
      }
    } catch (error) {
      console.error("Failed to fetch complaints", error);
      notifyError(error.response?.data?.message || "Could not fetch your complaints.");
    } finally {
      setLoading(false);
    }
  };

  fetchComplaints();
}, []);

  // Filter complaints based on status and search term
  const filteredComplaints = complaints.filter(complaint => {
    const matchesStatus = filterStatus === 'all' || complaint.status.toLowerCase() === filterStatus.toLowerCase();
    const searchMatch = searchTerm === '' || 
      complaint.type?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      complaint.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.assigned_personnel_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && searchMatch;
  });

  const totalResolved = complaints.filter(c => c.status === "Resolved").length;
  const totalPending = complaints.filter(c => c.status !== "Resolved").length;
  const totalComplaints = complaints.length;

  const getPriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high': return 'text-red-500 bg-red-100';
      case 'medium': return 'text-orange-500 bg-orange-100';
      case 'low': return 'text-green-500 bg-green-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 rounded-2xl mb-8 p-8 shadow-xl">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Your Complaint Dashboard
        </h2>
        <p className="text-indigo-200 text-lg">
          Track and manage all your submitted complaints in one place
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800/80 rounded-xl p-6 shadow-lg border border-gray-700/50 backdrop-blur">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-200">Total Complaints</h3>
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <AlertCircle className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-4">{totalComplaints}</p>
        </div>
        
        <div className="bg-gray-800/80 rounded-xl p-6 shadow-lg border border-gray-700/50 backdrop-blur">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-200">Resolved</h3>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Check className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-4">{totalResolved}</p>
        </div>
        
        <div className="bg-gray-800/80 rounded-xl p-6 shadow-lg border border-gray-700/50 backdrop-blur">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-200">Pending</h3>
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-4">{totalPending}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex gap-2">
          <button 
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              filterStatus === "all" 
                ? "bg-indigo-600 text-white" 
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setFilterStatus("resolved")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              filterStatus === "resolved" 
                ? "bg-green-600 text-white" 
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Resolved
          </button>
          <button 
            onClick={() => setFilterStatus("pending")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              filterStatus === "pending" 
                ? "bg-orange-600 text-white" 
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Pending
          </button>
        </div>
        
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search complaints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <Search />
        </div>
      </div>

      {/* Complaints List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          <span className="ml-3 text-xl text-gray-300">Loading your complaints...</span>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="bg-gray-800/70 rounded-xl p-10 text-center border border-gray-700">
          <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-xl text-gray-400 mb-2">No complaints found</p>
          <p className="text-gray-500">
            {searchTerm 
              ? "Try adjusting your search filters" 
              : "You haven't submitted any complaints yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="bg-gray-800/80 backdrop-blur rounded-xl shadow-lg overflow-hidden border border-gray-700/50 hover:border-indigo-500/50 transition duration-300 flex flex-col"
            >
              {/* Status indicator */}
              <div className={`h-2 w-full ${
                complaint.status === "Resolved" ? "bg-green-500" : "bg-orange-500"
              }`}></div>
              
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{complaint.type}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    complaint.status === "Resolved" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-orange-100 text-orange-800"
                  }`}>
                    {complaint.status}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5 shrink-0" />
                    <p className="text-gray-300">{complaint.location}</p>
                  </div>
                  
                  <div className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-gray-400 mr-2 mt-0.5 shrink-0" />
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium tracking-wide ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority} Priority
                    </span>
                  </div>

                  <div className="flex items-start">
                    <User className="w-4 h-4 text-gray-400 mr-2 mt-0.5 shrink-0" />
                    <p className="text-gray-300">
                      {complaint.assigned_personnel_name || "Not assigned yet"}
                    </p>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2 mt-0.5 shrink-0" />
                    <p className="text-gray-300">
                      {new Date(complaint.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}
                    </p>
                  </div>

                  {complaint.attachments && (
                    <div className="flex items-start">
                      <File className="w-4 h-4 text-gray-400 mr-2 mt-0.5 shrink-0" />
                      <a
                        href={`${apiUrl}/uploads/${complaint.attachments}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 flex items-center"
                      >
                        View Attachment
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Feedback section */}
              <div className="bg-gray-900/50 p-4 border-t border-gray-700/50">
                {complaint.status === "Resolved" && (
                  complaint.feedback_given ? (
                    <div className="flex flex-col items-center py-2">
                      <p className="text-gray-400 text-sm mb-2">Your Feedback</p>
                      {complaint.feedback && (
                        <StarRating rating={complaint.feedback} size="large" />
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveFeedbackForm(complaint.id)}
                      className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center"
                    >
                      <Star className="w-4 h-4 mr-2" /> Rate this complaint
                    </button>
                  )
                )}

                {/* Status message for pending complaints */}
                {complaint.status !== "Resolved" && (
                  <div className="flex items-center justify-center py-2">
                    <Clock className="w-5 h-5 text-orange-400 mr-2" />
                    <p className="text-gray-300 text-sm">Awaiting resolution</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feedback Modal */}
      {activeFeedbackForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md shadow-2xl animate-fade-in-up">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                onClick={() => setActiveFeedbackForm(null)}
                className="text-gray-400 hover:text-white rounded-full p-1 hover:bg-gray-700 transition"
              >
                <Close />
              </button>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-1">Rate Your Experience</h3>
                <p className="text-gray-400">Your feedback helps us improve our services</p>
              </div>

              <div className="space-y-6">
                {/* Rating Section with Stars */}
                <div>
                  <label className="block text-gray-300 mb-3 text-center">
                    How would you rate the resolution of your complaint?
                  </label>
                  <div className="flex items-center justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        onClick={() =>
                          setFeedback({
                            ...feedback,
                            [activeFeedbackForm]: {
                              ...feedback[activeFeedbackForm],
                              rating: star,
                            },
                          })
                        }
                        className={`w-10 h-10 cursor-pointer transition ${
                          feedback[activeFeedbackForm]?.rating >= star 
                            ? "text-yellow-400 fill-yellow-400 scale-110" 
                            : "text-gray-400 hover:text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  {feedback[activeFeedbackForm]?.rating && (
                    <p className="text-center mt-2 text-yellow-500">
                      {feedback[activeFeedbackForm]?.rating === 5 ? "Excellent!" :
                       feedback[activeFeedbackForm]?.rating === 4 ? "Very Good" :
                       feedback[activeFeedbackForm]?.rating === 3 ? "Good" :
                       feedback[activeFeedbackForm]?.rating === 2 ? "Fair" : "Poor"}
                    </p>
                  )}
                </div>

                {/* Comment Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Additional Comments (Optional)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Share your thoughts about how we handled your complaint..."
                    value={feedback[activeFeedbackForm]?.comment || ""}
                    onChange={(e) =>
                      setFeedback({
                        ...feedback,
                        [activeFeedbackForm]: {
                          ...feedback[activeFeedbackForm],
                          comment: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setActiveFeedbackForm(null)}
                    className="flex-1 py-3 px-4 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const complaint = complaints.find(c => c.id === activeFeedbackForm);
                      if (complaint) handleFeedbackSubmit(complaint);
                    }}
                    disabled={!feedback[activeFeedbackForm]?.rating}
                    className="flex-1 py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ChatUser />
    </div>
  );
};

export default UserDashboard;