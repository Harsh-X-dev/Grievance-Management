import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import caseService from "../../services/case.service.js";
import { useToast } from "../../context/ToastContext.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import ChatThread from "../../components/common/ChatThread.jsx";
import ChatInput from "../../components/common/ChatInput.jsx";
import AttachmentList from "../../components/common/AttachmentList.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import StatusModal from "../../components/admin/StatusModal.jsx";
import EscalateModal from "../../components/admin/EscalateModal.jsx";
import ConfirmModal from "../../components/common/ConfirmModal.jsx";
import { formatDate, getInitials } from "../../utils/formatters.js";

export const AdminCaseDetail = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [caseData, setCaseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [showResolveConfirm, setShowResolveConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCase = useCallback(async () => {
    try {
      const result = await caseService.getCaseById(caseId);
      if (result.success && result.case) {
        setCaseData(result.case);
      } else {
        showToast("Error", result.message || "Failed to load case.", "error");
      }
    } catch {
      showToast("Error", "Could not connect to server.", "error");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [caseId, showToast]);

  useEffect(() => {
    fetchCase();
  }, [fetchCase]);

  const handleSendMessage = async (text) => {
    if (!caseData || caseData.status === "Resolved" || caseData.status === "Escalated") return;
    setIsSending(true);
    try {
      const result = await caseService.sendMessage(caseId, text);
      if (result.success) {
        const updated = await caseService.getCaseById(caseId);
        if (updated.success && updated.case) {
          setCaseData(updated.case);
        }
        showToast("Message Sent", "Your response has been added to the case thread.", "success");
      } else {
        showToast("Failed to Send", result.message || "Message failed.", "error");
      }
    } catch {
      showToast("Error", "Could not connect to server.", "error");
    } finally {
      setIsSending(false);
    }
  };

  const handleStatusChange = async (newStatus, remark) => {
    setActionLoading(true);
    try {
      const result = await caseService.changeStatus(caseId, newStatus, remark);
      if (result.success) {
        showToast("Status Updated", `Grievance status changed to "${newStatus}".`, "success");
        setShowStatusModal(false);
        await fetchCase();
      } else {
        showToast("Update Failed", result.message || "Could not change status.", "error");
      }
    } catch {
      showToast("Error", "Could not connect to server.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEscalate = async (escalateTo, reason) => {
    setActionLoading(true);
    try {
      const result = await caseService.escalateCase(caseId, escalateTo, reason);
      if (result.success) {
        showToast("Case Escalated", "Case escalated to Super Admin.", "warning");
        setShowEscalateModal(false);
        navigate("/admin/cases");
      } else {
        showToast("Escalation Failed", result.message || "Could not escalate.", "error");
      }
    } catch {
      showToast("Error", "Could not connect to server.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async () => {
    setActionLoading(true);
    try {
      const result = await caseService.resolveCase(caseId);
      if (result.success) {
        showToast("Case Resolved", `Grievance #${caseId} marked as resolved.`, "success");
        setShowResolveConfirm(false);
        navigate("/admin/cases");
      } else {
        showToast("Error", result.message || "Could not resolve case.", "error");
      }
    } catch {
      showToast("Error", "Could not connect to server.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading case details..." />;
  }

  if (!caseData) {
    return (
      <div className="glass-panel p-8 rounded-3xl text-center space-y-4 max-w-lg mx-auto">
        <h3 className="font-serif font-bold text-xl">Case Not Found</h3>
        <p className="text-sm text-gray-500">
          The requested grievance #{caseId} could not be found.
        </p>
        <button
          onClick={() => navigate("/admin/cases")}
          className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-gray-800 transition"
        >
          Back to Case List
        </button>
      </div>
    );
  }

  const isClosed = caseData.status === "Resolved" || caseData.status === "Escalated";
  const student = caseData.student || {};
  const studentName = student.name || caseData.studentName || "Student";
  const studentInitials = getInitials(studentName);

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Top Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/cases")}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black transition bg-white/70 px-4 py-2 rounded-full border border-gray-200 shadow-sm"
          >
            ← Back to List
          </button>
          <div>
            <span className="font-mono text-xs font-bold text-gray-400">
              Case #{caseData.caseId}
            </span>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-0.5">
              {caseData.subject}
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <StatusBadge status={caseData.status} solid={true} />

          <button
            onClick={() => setShowStatusModal(true)}
            disabled={isClosed}
            className="px-4 py-2 text-xs font-bold bg-white text-gray-800 border border-gray-200 rounded-full hover:bg-gray-50 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Change Status
          </button>

          <button
            onClick={() => setShowEscalateModal(true)}
            disabled={isClosed}
            className="px-4 py-2 text-xs font-bold bg-red-50 text-red-600 border border-red-200 rounded-full hover:bg-red-100 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Escalate
          </button>

          <button
            onClick={() => setShowResolveConfirm(true)}
            disabled={isClosed}
            className="px-4 py-2 text-xs font-bold bg-black text-white rounded-full hover:bg-gray-800 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Resolve Case
          </button>
        </div>
      </div>

      {/* Main Grid: Chat Thread on Left, Student Details & Attachments on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat / Communication Panel */}
        <div className="lg:col-span-2 glass-panel rounded-3xl border border-white shadow-sm flex flex-col h-[600px] overflow-hidden bg-white/80">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h3 className="font-bold text-sm text-gray-900">Communication Thread</h3>
              <p className="text-[11px] text-gray-400">
                Official grievance resolution dialogue with student
              </p>
            </div>
            <button
              onClick={() => {
                setIsRefreshing(true);
                fetchCase();
              }}
              disabled={isRefreshing}
              className="text-xs text-gray-500 hover:text-black font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
              title="Refresh messages"
            >
              <span className={isRefreshing ? "animate-spin" : ""}>🔄</span>
              <span>Refresh</span>
            </button>
          </div>

          <ChatThread messages={caseData.messages || []} currentRole="admin" />

          <ChatInput
            onSend={handleSendMessage}
            disabled={isClosed}
            placeholder={
              caseData.status === "Escalated"
                ? "This case is escalated to Super Admin. Messaging is disabled."
                : caseData.status === "Resolved"
                ? "This case is marked as resolved. Messaging is closed."
                : "Type your official reply to the student..."
            }
            isSending={isSending}
          />
        </div>

        {/* Sidebar: Student Info & Case Details */}
        <div className="space-y-6">
          {/* Student Profile Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white shadow-sm bg-white/80 space-y-4">
            <h3 className="font-serif font-bold text-base text-gray-900 border-b border-gray-100 pb-3">
              Complainant Information
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                {studentInitials}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate">
                  {studentName}
                </p>
                <p className="text-xs text-gray-500">
                  {student.department || caseData.category || "Student"}
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-100 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-gray-400 font-semibold">Student ID:</span>
                <span className="font-mono text-gray-900 font-bold">
                  {student.studentId || "N/A"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400 font-semibold">Email:</span>
                <span className="text-gray-900 font-medium truncate max-w-[170px]">
                  {student.email || "N/A"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400 font-semibold">Phone:</span>
                <span className="text-gray-900 font-medium">
                  {student.phone || "N/A"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400 font-semibold">Filed Date:</span>
                <span className="text-gray-900 font-medium">
                  {formatDate(caseData.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white shadow-sm bg-white/80 space-y-3">
            <h3 className="font-serif font-bold text-base text-gray-900">
              Grievance Details
            </h3>
            <div className="text-xs text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-100 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
              {caseData.description || "No description provided."}
            </div>
          </div>

          {/* Attachments Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white shadow-sm bg-white/80">
            <h3 className="font-serif font-bold text-base text-gray-900 mb-3">
              Attachments ({caseData.attachments?.length || 0})
            </h3>
            <AttachmentList attachments={caseData.attachments || []} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <StatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        currentStatus={caseData.status}
        onConfirm={handleStatusChange}
        isLoading={actionLoading}
      />

      <EscalateModal
        isOpen={showEscalateModal}
        onClose={() => setShowEscalateModal(false)}
        caseId={caseData.caseId}
        onConfirm={handleEscalate}
        isLoading={actionLoading}
      />

      <ConfirmModal
        isOpen={showResolveConfirm}
        onClose={() => setShowResolveConfirm(false)}
        onConfirm={handleResolve}
        title="Resolve Case?"
        message={`Mark grievance #${caseData.caseId} as resolved and close it? This will finalize the case.`}
        confirmText="Confirm Resolve"
        isLoading={actionLoading}
      />
    </div>
  );
};

export default AdminCaseDetail;
