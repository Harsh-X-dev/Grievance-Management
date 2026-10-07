import React from "react";

export const StatCard = ({ label, value, borderColor = "border-black", subtext, icon }) => {
  return (
    <div className={`glass-panel p-5 rounded-2xl border-l-4 ${borderColor} relative overflow-hidden transition hover:shadow-md`}>
      <div className="flex justify-between items-start">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <h3 className="text-3xl font-serif mt-1 font-bold text-gray-900">
        {value ?? "—"}
      </h3>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
};

export default StatCard;
