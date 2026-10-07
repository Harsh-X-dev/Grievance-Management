import React from "react";

export const LoadingSpinner = ({ text = "Loading...", size = "w-8 h-8" }) => {
  return (
    <div className="py-12 flex flex-col items-center justify-center gap-3">
      <div className={`${size} border-3 border-gray-200 border-t-black rounded-full animate-spin`}></div>
      {text && <p className="text-xs text-gray-500 font-medium">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
