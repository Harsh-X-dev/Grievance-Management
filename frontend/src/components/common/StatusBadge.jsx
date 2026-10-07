import React from "react";
import { STATUS_STYLES } from "../../constants/index.js";

export const StatusBadge = ({ status, solid = false, uppercase = false, className = "" }) => {
  const current = STATUS_STYLES[status] || {
    badge: "bg-gray-100 text-gray-600 border border-gray-200",
    badgeSolid: "bg-gray-100 text-gray-600",
  };

  const styleClass = solid ? current.badgeSolid : current.badge;

  return (
    <span
      className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${
        uppercase ? "uppercase tracking-wide" : ""
      } ${styleClass} ${className}`}
    >
      {status || "Unknown"}
    </span>
  );
};

export default StatusBadge;
