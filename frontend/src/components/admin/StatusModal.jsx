import React, { useState, useEffect } from "react";
import Modal from "../common/Modal.jsx";
import { ALLOWED_STATUS_TRANSITIONS } from "../../constants/index.js";

export const StatusModal = ({
  isOpen,
  onClose,
  currentStatus = "Pending",
  onConfirm,
  isLoading = false,
}) => {
  const allowed = ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
  const [newStatus, setNewStatus] = useState(allowed[0] || "");
  const [remark, setRemark] = useState("");

  useEffect(() => {
    const list = ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
    setNewStatus(list[0] || "");
    setRemark("");
  }, [currentStatus, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newStatus || !remark.trim()) return;
    onConfirm(newStatus, remark.trim());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Case Status"
      subtitle={`Current status: ${currentStatus}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            New Status
          </label>
          {allowed.length === 0 ? (
            <p className="text-xs text-gray-500 italic p-3 bg-gray-50 rounded-xl">
              No further status transitions available for "{currentStatus}".
            </p>
          ) : (
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-black transition font-semibold"
            >
              {allowed.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Action Remark / Notes <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Reason or notes regarding this status change..."
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm outline-none focus:bg-white focus:border-black transition resize-none"
            required
          ></textarea>
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
            disabled={isLoading || allowed.length === 0 || !remark.trim()}
            className="px-6 py-2.5 rounded-full text-xs font-bold bg-black text-white hover:bg-gray-800 transition disabled:opacity-40"
          >
            {isLoading ? "Saving..." : "Confirm Update"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default StatusModal;
