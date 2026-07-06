const StarRating = ({ rating, showCount = true, size = "small" }) => {
  const sizeClass = size === "large" ? "w-8 h-8" : "w-5 h-5";
  
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass} ${
            i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
          }`}
        />
      ))}
      {showCount && <span className="ml-2 text-yellow-500 font-medium">{rating}/5</span>}
    </div>
  );
};
export default StarRating;