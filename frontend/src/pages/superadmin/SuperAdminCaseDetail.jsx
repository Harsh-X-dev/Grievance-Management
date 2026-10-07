import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import caseService from "../../services/case.service.js";
import { useToast } from "../../context/ToastContext.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import ChatThread from "../../components/common/ChatThread.jsx";
import ChatInput from "../../components/common/ChatInput.jsx";
import AttachmentList from "../../components/common/AttachmentList.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import ConfirmModal from "../../components/common/ConfirmModal.jsx";
import { formatDate, getInitials } from "../../utils/formatters.js";

export const SuperAdminCaseDetail = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [caseData, setCaseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showResolveConfirm, setShowResolveConfirm] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  // Originating view tracking for back navigation
  const originatingFrom = location.state?.from || "escalated";

  const handleBack = () => {
    if (originatingFrom === "overview") {
      navigate("/superadmin/dashboard");
    } else if (originatingFrom === "all-grievances") {
      navigate("/superadmin/grievances");
    } else {
      navigate("/superadmin/escalated");
    }
  };

  const fetchCase = useCallback(async () => {
    try {
      const result = await caseService.getCaseById(caseId);
      if (result.success && result.case) {
        setCaseData(result.case);
      } else {
        showToast("Error", result.message || "Case not found.", "error");
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
    if (!caseData || caseData.status !== "Escalated") return;
    setIsSending(true);
    try {
      const result = await caseService.sendMessage(caseId, text);
      if (result.success) {
        const updated = await caseService.getCaseById(caseId);
        if (updated.success && updated.case) {
          setCaseData(updated.case);
        }
        showToast("Message Sent", "Official Super Admin response recorded.", "success");
      } else {
        showToast("Failed to Send", result.message || "Message failed.", "error");
      }
    } catch {
      showToast("Error", "Could not connect to server.", "error");
    } finally {
      setIsSending(false);
    }
  };

  const handleResolve = async () => {
    setIsResolving(true);
    try {
      const result = await caseService.resolveCase(caseId);
      if (result.success) {
        showToast("Case Resolved", `Escalation #${caseId} resolved and closed.`, "success");
        setShowResolveConfirm(false);
        handleBack();
      } else {
        showToast("Error", result.message || "Could not resolve case.", "error");
      }
    } catch {
      showToast("Error", "Could not connect to server.", "error");
    } finally {
      setIsResolving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading escalation dossier..." />;
  }

  if (!caseData) {
    return (
      <div className="glass-panel p-8 rounded-3xl text-center space-y-4 max-w-lg mx-auto">
        <h3 className="font-serif font-bold text-xl">Case Not Found</h3>
        <p className="text-sm text-gray-500">
          The requested grievance #{caseId} could not be located in university records.
        </p>
        <button
          onClick={handleBack}
          className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-gray-800 transition"
        >
          Return to List
        </button>
      </div>
    );
  }

  const isEscalated = caseData.status === "Escalated";
  const student = caseData.student || {};
  const studentName = student.name || caseData.studentName || "Student";
  const studentInitials = getInitials(studentName);

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Top Header & Resolution Action */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black transition bg-white/70 px-4 py-2 rounded-full border border-gray-200 shadow-sm"
          >
            ← Back
          </button>
          <div>
            <span className="font-mono text-xs font-bold text-gray-400">
              #{caseData.caseId} • {caseData.department}
            </span>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-0.5">
              {caseData.subject}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={caseData.status} solid={true} />
          {isEscalated && (
            <button
              onClick={() => setShowResolveConfirm(true)}
              className="bg-black text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-gray-800 transition shadow-md"
            >
              Resolve Escalation
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat / Communication Panel */}
        <div className="lg:col-span-2 glass-panel rounded-3xl border border-white shadow-sm flex flex-col h-[600px] overflow-hidden bg-white/80">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h3 className="font-bold text-sm text-gray-900">Case Communication Thread</h3>
              <p className="text-[11px] text-gray-400">
                Audited message history between student and university authorities
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

          <ChatThread messages={caseData.messages || []} currentRole="superadmin" />

          {isEscalated ? (
            <ChatInput
              onSend={handleSendMessage}
              placeholder="Type an official Super Admin intervention message..."
              isSending={isSending}
            />
          ) : (
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500">
              {caseData.status === "Resolved"
                ? "This grievance has been resolved and closed. Case thread is archived."
                : "This case is handled by its designated department coordinator. View-only access."}
            </div>
          )}
        </div>

        {/* Sidebar: Metadata, Student, Description, Attachments */}
        <div className="space-y-6">
          {/* Metadata & Escalation Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white shadow-sm bg-white/80 space-y-4">
            <h3 className="font-serif font-bold text-base text-gray-900 border-b border-gray-100 pb-3">
              Case Metadata
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-gray-400 font-semibold">Department:</span>
                <span className="text-gray-900 font-bold">{caseData.department}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400 font-semibold">Category:</span>
                <span className="text-gray-900 font-medium">{caseData.category}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400 font-semibold">Filed Date:</span>
                <span className="text-gray-900 font-medium">
                  {formatDate(caseData.createdAt)}
                </span>
              </div>
            </div>

            {caseData.escalationReason && (
              <div className="mt-3 p-3.5 bg-red-50 rounded-2xl border border-red-100">
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-1">
                  Department Escalation Note
                </p>
                <p className="text-xs text-red-900 italic leading-relaxed">
                  "{caseData.escalationReason}"
                </p>
              </div>
            )}
          </div>

          {/* Student Profile Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white shadow-sm bg-white/80 space-y-3">
            <h3 className="font-serif font-bold text-base text-gray-900 border-b border-gray-100 pb-3">
              Student Details
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
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

            <div className="space-y-1.5 pt-2 text-xs border-t border-gray-100">
              <div className="flex justify-between py-1">
                <span className="text-gray-400 font-semibold">Roll Number:</span>
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
                <span className="text-gray-900 font-medium">{student.phone || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Description & Attachments */}
          <div className="glass-panel p-6 rounded-3xl border border-white shadow-sm bg-white/80 space-y-3">
            <h3 className="font-serif font-bold text-base text-gray-900">
              Original Grievance
            </h3>
            <div className="text-xs text-gray-700 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap">
              {caseData.description || "No description provided."}
            </div>
            <div className="pt-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Attachments ({caseData.attachments?.length || 0})
              </p>
              <AttachmentList attachments={caseData.attachments || []} />
            </div>
          </div>
        </div>
      </div>

      {/* Resolve Confirmation Modal */}
      <ConfirmModal
        isOpen={showResolveConfirm}
        onClose={() => setShowResolveConfirm(false)}
        onConfirm={handleResolve}
        title="Resolve Escalated Grievance?"
        message={`Mark escalation #${caseData.caseId} as officially resolved? This will conclude the case across all departments.`}
        confirmText="Confirm Resolve"
        isLoading={isResolving}
      />
    </div>
  );
};

export default SuperAdminCaseDetail;
