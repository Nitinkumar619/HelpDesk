const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6 transition-all duration-300 hover:bg-gray-800 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10">
      <div className="bg-indigo-900/30 p-3 rounded-lg inline-block mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};
export default FeatureCard;