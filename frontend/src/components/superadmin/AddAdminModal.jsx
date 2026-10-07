import React, { useState, useEffect } from "react";
import Modal from "../common/Modal.jsx";
import { DEPARTMENTS } from "../../constants/index.js";

export const AddAdminModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName("");
      setEmail("");
      setDepartment(DEPARTMENTS[0]);
      setPassword("Welcome@123");
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onConfirm({
      name: name.trim(),
      email: email.trim(),
      department,
      password: password.trim() || "Welcome@123",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Department Admin"
      subtitle="Create a new coordinator account for a university department"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-3">
            Admin Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dr. S. K. Sharma"
            className="auth-input"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-3">
            University Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin.dept@university.edu"
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

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-3">
            Initial Password
          </label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Welcome@123"
            className="auth-input font-mono text-xs"
          />
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
            disabled={isLoading || !name.trim() || !email.trim()}
            className="px-6 py-2.5 rounded-full text-xs font-bold bg-black text-white hover:bg-gray-800 transition disabled:opacity-40"
          >
            {isLoading ? "Creating..." : "Create Admin Account"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddAdminModal;
