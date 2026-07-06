import React from "react";

const Button = ({ onClick, icon: Icon, children, variant = "primary" }) => {
  const baseStyles =
    "inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition";

  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-indigo-500/30",
    secondary:
      "bg-gray-800/70 hover:bg-gray-700/70 backdrop-blur text-white border border-gray-700",
    white:
      "bg-white text-indigo-900 hover:bg-indigo-100 shadow-lg",
    outline:
      "bg-transparent hover:bg-white/10 border border-white/30 text-white",
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} cursor-pointer`}>
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
};

export default Button;
