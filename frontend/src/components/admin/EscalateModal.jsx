import React, { useState, useEffect } from "react";
import Modal from "../common/Modal.jsx";

export const EscalateModal = ({
  isOpen,
  onClose,
  caseId,
  onConfirm,
  isLoading = false,
}) => {
  const [escalateTo, setEscalateTo] = useState("Super Admin");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) {
      setEscalateTo("Super Admin");
      setReason("");
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirm(escalateTo, reason.trim());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Escalate Grievance"
      subtitle={`Forward case #${caseId} to higher administration`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Escalate To
          </label>
          <input
            type="text"
            value={escalateTo}
            onChange={(e) => setEscalateTo(e.target.value)}
            disabled
            className="w-full bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-700 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Escalation Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why this grievance cannot be resolved at the department level..."
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
            disabled={isLoading || !reason.trim()}
            className="px-6 py-2.5 rounded-full text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-40"
          >
            {isLoading ? "Escalating..." : "Confirm Escalation"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EscalateModal;
