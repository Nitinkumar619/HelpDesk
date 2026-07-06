
import { jwtDecode } from "jwt-decode"; // Assuming you still need this for the email
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {QuestionMark, Tag, AdjustmentVertical, ChevronDown, Location, Message, 
        Support, Upload, Close, Tick, Spinner, Minus} from "../../assets/Icons";
import useNotify from "../../hooks/useNotify";
import apiClient from "../../utils/apiClient";

const TicketForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState("");
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    priority: "Low",
    location: "",
    type: "",
    message: "",
  });
  const location = useLocation();
  const categoryFromState = location.state?.category || "";
  const { notifySuccess, notifyError } = useNotify();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles([file]);
      setFileName(file.name);
    }
  };
  
  const handleRemoveFile = () => {
    setFiles([]);
    setFileName("");
  };
  

useEffect(() => {
  const fetchUserDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const email = decoded.email;

      // Use the apiClient. The auth token is added automatically by the interceptor.
      const { data } = await apiClient.get(`/api/users/${email}`);

      if (data.success && data.user) {
        setFormData(prev => ({
          ...prev,
          name: data.user.name,
          email: data.user.email,
          type: categoryFromState || "",
        }));
      }
    } catch (err) {
      console.error("Error fetching user info", err);
      // Use the detailed error message from Axios if available
      notifyError(err.response?.data?.message || "Could not fetch user details.");
    }
  };

  fetchUserDetails();
}, [categoryFromState]); // Dependency array is correct

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  const { name, email, priority, location, type, message } = formData;
  if (!name || !email || !priority || !location || !type || !message) {
    notifyError("Please fill all required fields");
    setIsSubmitting(false);
    return;
  }

  // Create a FormData object to handle file uploads
  const form = new FormData();
  // Append all form fields to the FormData object
  Object.entries(formData).forEach(([key, val]) => form.append(key, val));
  if (files.length > 0) {
    files.forEach(file => form.append("attachments", file));
  }

  try {
    // Use apiClient.post. Axios correctly handles sending FormData.
    // The interceptor will add the Authorization header.
    const { data } = await apiClient.post("/api/complaints", form);

    if (data.success) {
      notifySuccess("Ticket submitted! Check your email for your 4-digit code.");
      // Reset the form state after successful submission
      setFormData({
        name: "",
        email: "",
        type: "",
        priority: "Low",
        location: "",
        message: "",
      });
      setFiles([]);
      setFileName("");
    } else {
      // This part might not be reached if the server sends a non-2xx status,
      // as Axios would throw an error, which is caught below.
      notifyError(data.message || "Failed to submit ticket");
    }
  } catch (err) {
    console.error("Error submitting ticket:", err);
    notifyError(err.response?.data?.message || "An error occurred while submitting the ticket.");
  } finally {
    setIsSubmitting(false);
  }
};


  const priorityIcons = {
    Low: (
      <Minus color={'blue'} />
    ),
    Medium: (
      <Minus color={'yellow'} />
    ),
    High: (
      <Minus color={'red'} />
    ),
  };

  const locationGroups = {
    "Academic": [
      "Admin Building", "LT", "CC-1", "CC-2", "CC-3", "Library", "RSA", "Main Auditorium"
    ],
    "Residential": [
      "Director's Residence", 
      "Residential (A-Block)", "Residential (B-Block)", "Residential (C-Block)",
      "Residential (D-Block)", "Residential (E-Block)", "Residential (F-Block)",
      "Residential (G-Block)", "Residential (H-Block)", "Residential (I-Block)",
      "Residential (J-Block)"
    ],
    "Hostels": [
      "BH-1", "BH-2", "BH-3", "BH-4", "BH-5", "GH-1", "GH-2", "GH-3",
      "V. Hostel 1", "V. Hostel 2", "V. Hostel 3"
    ],
    "Campus Facilities": [
      "Health Center", "SAC", "Shopping Complex", "Cafateria",
      "Gate 1", "Gate 2", "Gate 3", "Gate 4", "Mini Gate",
      "Pumping Station", "Electric Sub-Station"
    ]
  };

  return (
    <main className="flex-grow mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen"> 
      <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-700">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <QuestionMark />
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">IIITA Help Desk</h1>
          <p className="text-xl font-medium text-gray-300 mt-2">Submit a Support Ticket</p>
          <div className="w-24 h-1 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type field */}
            <div className="col-span-2">
              <label className="block text-base font-medium text-gray-300 mb-1">
                <span className="flex items-center gap-2">
                  <Tag />
                  Issue Type
                </span>
              </label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                readOnly
                className="w-full px-5 py-3 bg-gray-800 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg transition-all duration-200 focus:border-indigo-500"
              />
            </div>

            {/* Priority field */}
            <div>
              <label className="block text-base font-medium text-gray-300 mb-1">
                <span className="flex items-center gap-2">
                  <AdjustmentVertical />
                  Priority
                </span>
              </label>
              <div className="relative">
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="appearance-none w-full pl-12 pr-10 py-3 bg-gray-800 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg transition-all duration-200 focus:border-indigo-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  {priorityIcons[formData.priority]}
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown />
                </div>
              </div>
            </div>

            {/* Location field */}
            <div>
              <label className="block text-base font-medium text-gray-300 mb-1">
                <span className="flex items-center gap-2">
                  <Location />
                  Location
                </span>
              </label>
              <div className="relative">
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="appearance-none w-full pl-12 pr-10 py-3 bg-gray-800 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg transition-all duration-200 focus:border-indigo-500"
                >
                  <option value="">-- Select Location --</option>
                  {Object.entries(locationGroups).map(([group, locations]) => (
                    <optgroup key={group} label={group}>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Location />
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown />
                </div>
              </div>
            </div>
          </div>

          {/* Message field */}
          <div>
            <label className="block text-base font-medium text-gray-300 mb-1">
              <span className="flex items-center gap-2">
                <Message />
                Description
              </span>
            </label>
            <textarea
              name="message"
              rows="5"
              placeholder="Please describe your issue in detail..."
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 bg-gray-800 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg transition-all duration-200 focus:border-indigo-500"
            />
            <p className="text-xs text-gray-400 mt-1">Be specific about what's not working and steps to reproduce the issue if applicable.</p>
          </div>

          {/* Attachments field */}
          <div>
            <label className="block text-base font-medium text-gray-300 mb-1">
              <span className="flex items-center gap-2">
                <Support />
                Attachment
              </span>
            </label>
            <div className="flex items-center space-x-2">
              <label
                htmlFor="attachment"
                className="cursor-pointer px-5 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <Upload />
                Upload File
              </label>
              <input
                id="attachment"
                name="attachment"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              {fileName ? (
                <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-lg border border-gray-700">
                  <span className="text-white truncate max-w-xs">{fileName}</span>
                  <button 
                    type="button" 
                    onClick={handleRemoveFile}
                    className="text-gray-400 hover:text-white"
                  >
                    <Close />
                  </button>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">No file selected</span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">Upload screenshots, error messages, or other relevant files (max 10MB)</p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full ${isSubmitting ? 'bg-indigo-800' : 'bg-indigo-600 hover:bg-indigo-700'} cursor-pointer text-white font-semibold py-4 px-6 text-lg rounded-xl transition duration-200 flex items-center justify-center gap-2`}
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  Processing...
                </>
              ) : (
                <>
                  <Tick />
                  Submit Ticket
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Need help? Contact our support team at <a href="mailto:helpdesk@iiita.ac.in" className="text-indigo-400 hover:text-indigo-300">helpdesk@iiita.ac.in</a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default TicketForm;