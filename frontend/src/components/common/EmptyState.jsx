import React from "react";

export const EmptyState = ({ message = "No data found.", icon, action }) => {
  return (
    <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
      {icon ? (
        <div className="mb-3 text-gray-400">{icon}</div>
      ) : (
        <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-3 text-lg">
          📂
        </div>
      )}
      <p className="text-sm text-gray-500 font-medium">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
