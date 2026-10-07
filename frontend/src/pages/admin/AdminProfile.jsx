import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import PasswordModal from "../../components/common/PasswordModal.jsx";

export const AdminProfile = () => {
  const { user } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const avatarName = encodeURIComponent(user?.name || "Admin");

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-serif font-bold text-gray-900">
          Admin Profile & Security
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Coordinator credentials and department assignment
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="glass-panel p-8 rounded-3xl border border-white shadow-sm bg-white/80 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
          <div className="w-20 h-20 rounded-full border-2 border-white shadow-lg overflow-hidden flex-shrink-0">
            <img
              src={`https://ui-avatars.com/api/?name=${avatarName}&background=1d1d1f&color=fff`}
              alt="Admin"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-serif font-bold text-gray-900">
              {user?.name || "Administrator"}
            </h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5">
              {user?.department ? `${user.department} Department` : "Department Admin"}
            </p>
            <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
          </div>
        </div>

        {/* Detailed Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Coordinator Name
            </p>
            <p className="text-sm font-semibold text-gray-900 mt-1">
              {user?.name || "—"}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Assigned Department
            </p>
            <p className="text-sm font-semibold text-gray-900 mt-1">
              {user?.department || "General"}
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
              Role
            </p>
            <p className="text-sm font-semibold text-gray-900 mt-1 uppercase font-mono text-xs">
              {user?.role || "Admin"}
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
            Update your administrative account password
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

export default AdminProfile;
