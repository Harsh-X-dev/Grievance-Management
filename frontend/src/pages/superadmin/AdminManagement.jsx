import React, { useState, useEffect } from "react";
import adminService from "../../services/admin.service.js";
import { useToast } from "../../context/ToastContext.jsx";
import { getInitials } from "../../utils/formatters.js";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import AddAdminModal from "../../components/superadmin/AddAdminModal.jsx";
import EditAdminModal from "../../components/superadmin/EditAdminModal.jsx";
import ConfirmModal from "../../components/common/ConfirmModal.jsx";

export const AdminManagement = () => {
  const { showToast } = useToast();
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [deletingAdmin, setDeletingAdmin] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAdmins = async () => {
    try {
      const result = await adminService.getAdmins();
      if (result.success && result.admins) {
        setAdmins(result.admins);
      }
    } catch (err) {
      console.error("[AdminManagement] Error fetching admins:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (adminData) => {
    setActionLoading(true);
    try {
      const result = await adminService.createAdmin(adminData);
      if (result.success) {
        showToast(
          "Admin Created",
          `Coordinator "${adminData.name}" added to ${adminData.department}.`,
          "success"
        );
        setShowAddModal(false);
        await fetchAdmins();
      } else {
        showToast("Error", result.message || "Failed to create admin.", "error");
      }
    } catch {
      showToast("Error", "Could not connect to server.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateAdmin = async (adminId, data) => {
    setActionLoading(true);
    try {
      const result = await adminService.updateAdmin(adminId, data);
      if (result.success) {
        showToast("Admin Updated", "Coordinator profile updated successfully.", "success");
        setEditingAdmin(null);
        await fetchAdmins();
      } else {
        showToast("Error", result.message || "Failed to update admin.", "error");
      }
    } catch {
      showToast("Error", "Could not connect to server.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAdmin = async () => {
    if (!deletingAdmin) return;
    setActionLoading(true);
    try {
      const result = await adminService.deleteAdmin(deletingAdmin._id);
      if (result.success) {
        showToast("Admin Removed", `Coordinator "${deletingAdmin.name}" has been removed.`, "success");
        setDeletingAdmin(null);
        await fetchAdmins();
      } else {
        showToast("Error", result.message || "Failed to delete admin.", "error");
      }
    } catch {
      showToast("Error", "Could not connect to server.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading department administrators..." />;
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900">
            Admin Management
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage departmental grievance coordinators and access privileges
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-gray-800 transition shadow-md self-start sm:self-auto"
        >
          + Add New Admin
        </button>
      </div>

      {/* Admins Grid */}
      {admins.length === 0 ? (
        <div className="glass-panel p-8 rounded-3xl border border-white">
          <EmptyState
            message="No department admins configured yet. Add your first coordinator!"
            action={
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-black text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-gray-800 transition"
              >
                Add Admin
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {admins.map((admin) => {
            const initials = getInitials(admin.name);

            return (
              <div
                key={admin._id}
                className="glass-panel bg-white/80 rounded-[2rem] p-6 flex flex-col items-center text-center relative hover:shadow-xl transition border border-white group"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-inner text-gray-800">
                  {initials}
                </div>
                <h3 className="font-bold text-lg text-gray-900">{admin.name}</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                  {admin.department || "General"}
                </p>
                <p className="text-xs text-gray-500 mb-6 truncate max-w-[220px]">
                  {admin.email}
                </p>

                <div className="w-full flex gap-2 border-t border-gray-100 pt-4 mt-auto">
                  <button
                    onClick={() => setEditingAdmin(admin)}
                    className="flex-1 py-2 text-xs font-bold text-black border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setDeletingAdmin(admin)}
                    className="flex-1 py-2 text-xs font-bold text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Admin Modal */}
      <AddAdminModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onConfirm={handleCreateAdmin}
        isLoading={actionLoading}
      />

      {/* Edit Admin Modal */}
      <EditAdminModal
        isOpen={Boolean(editingAdmin)}
        onClose={() => setEditingAdmin(null)}
        admin={editingAdmin}
        onConfirm={handleUpdateAdmin}
        isLoading={actionLoading}
      />

      {/* Delete Admin Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingAdmin)}
        onClose={() => setDeletingAdmin(null)}
        onConfirm={handleDeleteAdmin}
        title="Delete Admin Account?"
        message={`Are you sure you want to remove coordinator "${deletingAdmin?.name}"? This action cannot be undone.`}
        confirmText="Confirm Delete"
        isDestructive={true}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default AdminManagement;
