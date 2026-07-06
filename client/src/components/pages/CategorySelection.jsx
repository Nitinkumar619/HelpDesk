import React from "react";
import { useNavigate } from "react-router-dom";
import FloatingIcons from "../ui/FloatingIcons";
import {ChevronRight, Flash, Plumbing, Computer, Setting, Cleaning, Wifi} from "../../assets/Icons";

const categories = [
  {
    name: "Network",
    icon: (
      <Wifi />
    ),
    description: "WiFi issues, internet connectivity, network access problems"
  },
  {
    name: "Cleaning",
    icon: (
      <Cleaning />
    ),
    description: "Janitorial services, waste disposal, floor cleaning"
  },
  {
    name: "Carpentry",
    icon: (
      <Setting />
    ),
    description: "Furniture repair, door and window issues, woodwork"
  },
  {
    name: "PC Maintenance",
    icon: (
      <Computer />
    ),
    description: "Computer hardware issues, software problems, peripheral troubles"
  },
  {
    name: "Plumbing",
    icon: (
      <Plumbing />
    ),
    description: "Water leakage, tap issues, drainage problems, water supply"
  },
  {
    name: "Electricity",
    icon: (
      <Flash />
    ),
    description: "Power outage, electrical equipment failure, wiring problems"
  },
];

const CategorySelection = () => {
  const navigate = useNavigate();
  const handleSelect = (category) => {
    navigate("/complaint", { state: { category } });
  };

  return (
    <main className="flex-grow mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen"> 
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center pt-8 pb-16">
          <FloatingIcons />
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-3">
              IIITA Help Desk
            </h1>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">
              What can we help you with?
            </h2>
            <p className="mt-3 text-gray-400 max-w-md mx-auto">
              Select the category that best describes your issue to submit a support ticket
            </p>
            <div className="w-24 h-1 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.name}
                onClick={() => handleSelect(category.name)}
                className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 cursor-pointer border border-gray-700 transition-all duration-300 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 group"
              >
                <div className="absolute top-0 right-0 h-24 w-24 -mt-8 -mr-8 bg-indigo-500/10 rounded-full transition-transform duration-300 group-hover:scale-150"></div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-indigo-600/20 text-indigo-400 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white">
                    {category.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {category.description}
                    </p>
                  </div>
                  
                  <div className="text-gray-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-indigo-400">
                    <ChevronRight />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-gray-400 text-sm">
              Need help determining the right category? Contact our support team at <a href="mailto:helpdesk@iiita.ac.in" className="text-indigo-400 hover:text-indigo-300">helpdesk@iiita.ac.in</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CategorySelection;