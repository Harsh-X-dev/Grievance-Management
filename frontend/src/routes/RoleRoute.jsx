import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export const RoleRoute = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 font-medium">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  const role = user.role?.toLowerCase();
  const isAllowed = allowedRoles.map((r) => r.toLowerCase()).includes(role);

  if (!isAllowed) {
    // Redirect user to their own proper portal
    if (role === "student") {
      return <Navigate to="/student" replace />;
    }
    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    if (role === "superadmin") {
      return <Navigate to="/superadmin" replace />;
    }
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default RoleRoute;
