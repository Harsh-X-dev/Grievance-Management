import React, { useState, useEffect } from "react";
import Modal from "../common/Modal.jsx";
import { DEPARTMENTS } from "../../constants/index.js";

export const EditAdminModal = ({
  isOpen,
  onClose,
  admin,
  onConfirm,
  isLoading = false,
}) => {
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);

  useEffect(() => {
    if (admin && isOpen) {
      setEmail(admin.email || "");
      setDepartment(admin.department || DEPARTMENTS[0]);
    }
  }, [admin, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !admin?._id) return;
    onConfirm(admin._id, {
      email: email.trim(),
      department,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Admin Profile"
      subtitle={`Update details for ${admin?.name || "Admin"}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-3">
            University Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-3">
            Assigned Department
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full bg-gray-100 border border-transparent rounded-full px-5 py-3.5 text-sm outline-none focus:bg-white focus:border-gray-200 transition font-medium"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 justify-end pt-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="px-6 py-2.5 rounded-full text-xs font-bold bg-black text-white hover:bg-gray-800 transition disabled:opacity-40"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditAdminModal;
