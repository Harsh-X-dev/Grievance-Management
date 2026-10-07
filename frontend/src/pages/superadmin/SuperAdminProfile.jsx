import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getInitials } from "../../utils/formatters.js";
import PasswordModal from "../../components/common/PasswordModal.jsx";

export const SuperAdminProfile = () => {
  const { user } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const initials = getInitials(user?.name || "Super Admin");

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-serif font-bold text-gray-900">
          Super Admin Profile & Security
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Root governance credentials and administrative access
        </p>
      </div>

      {/* Profile Card */}
      <div className="glass-panel p-8 rounded-3xl border border-white shadow-sm bg-white/80 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
          <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
            {initials}
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-serif font-bold text-gray-900">
              {user?.name || "Super Administrator"}
            </h3>
            <p className="text-xs font-bold text-red-600 uppercase tracking-wider mt-0.5">
              Root Authority • Super Admin
            </p>
            <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
          </div>
        </div>

        {/* Detailed Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Administrator Name
            </p>
            <p className="text-sm font-semibold text-gray-900 mt-1">
              {user?.name || "—"}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Official Email
            </p>
            <p className="text-sm font-semibold text-gray-900 mt-1">
              {user?.email || "—"}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Authority Level
            </p>
            <p className="text-sm font-semibold text-gray-900 mt-1 font-mono text-xs">
              System Wide (All Departments)
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Account Role
            </p>
            <p className="text-sm font-semibold text-gray-900 mt-1 font-mono text-xs">
              SUPERADMIN
            </p>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="glass-panel p-8 rounded-3xl border border-white shadow-sm bg-white/80 space-y-4">
        <div>
          <h3 className="text-xl font-serif font-bold text-gray-900">
            Security & Password
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Update your master administrative password
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-gray-800 transition shadow-sm"
          >
            Change Password
          </button>
        </div>
      </div>

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

export default SuperAdminProfile;
