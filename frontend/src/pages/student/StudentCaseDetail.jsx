import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import caseService from "../../services/case.service.js";
import { useToast } from "../../context/ToastContext.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import ChatThread from "../../components/common/ChatThread.jsx";
import ChatInput from "../../components/common/ChatInput.jsx";
import AttachmentList from "../../components/common/AttachmentList.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import { formatDate } from "../../utils/formatters.js";

export const StudentCaseDetail = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [caseData, setCaseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCase = useCallback(async () => {
    try {
      const result = await caseService.getCaseById(caseId);
      if (result.success && result.case) {
        setCaseData(result.case);
      } else {
        showToast("Error", result.message || "Could not load case details.", "error");
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
    if (!caseData || caseData.status === "Resolved") return;
    setIsSending(true);
    try {
      const result = await caseService.sendMessage(caseId, text);
      if (result.success) {
        // Refresh case to show latest message thread
        const updated = await caseService.getCaseById(caseId);
        if (updated.success && updated.case) {
          setCaseData(updated.case);
        }
      } else {
        showToast("Failed to Send", result.message || "Message not delivered.", "error");
      }
    } catch {
      showToast("Error", "Could not connect to server.", "error");
    } finally {
      setIsSending(false);
    }
  };

  const handleRefreshChat = async () => {
    setIsRefreshing(true);
    await fetchCase();
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading grievance details..." />;
  }

  if (!caseData) {
    return (
      <div className="glass-panel p-8 rounded-3xl text-center space-y-4 max-w-lg mx-auto">
        <h3 className="font-serif font-bold text-xl">Case Not Found</h3>
        <p className="text-sm text-gray-500">
          The requested grievance #{caseId} could not be retrieved.
        </p>
        <button
          onClick={() => navigate("/student/cases")}
          className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-gray-800 transition"
        >
          Back to My Cases
        </button>
      </div>
    );
  }

  const isResolved = caseData.status === "Resolved";

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/student/cases")}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black transition bg-white/70 px-4 py-2 rounded-full border border-gray-200 shadow-sm"
          >
            ← Back to Cases
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

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            {caseData.category}
          </span>
          <StatusBadge status={caseData.status} solid={true} />
        </div>
      </div>

      {/* Main Grid: Chat Thread on Left, Details & Attachments on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat / Communication Panel */}
        <div className="lg:col-span-2 glass-panel rounded-3xl border border-white shadow-sm flex flex-col h-[580px] overflow-hidden bg-white/80">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h3 className="font-bold text-sm text-gray-900">Communication Thread</h3>
              <p className="text-[11px] text-gray-400">
                Direct messages between you and department coordinators
              </p>
            </div>
            <button
              onClick={handleRefreshChat}
              disabled={isRefreshing}
              className="text-xs text-gray-500 hover:text-black font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
              title="Refresh conversation"
            >
              <span className={isRefreshing ? "animate-spin" : ""}>🔄</span>
              <span>Refresh</span>
            </button>
          </div>

          <ChatThread messages={caseData.messages || []} currentRole="student" />

          <ChatInput
            onSend={handleSendMessage}
            disabled={isResolved}
            placeholder={
              isResolved
                ? "This case is resolved. Messaging is closed."
                : "Type a reply or question for administration..."
            }
            isSending={isSending}
          />
        </div>

        {/* Sidebar: Ticket Details & Attachments */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white shadow-sm bg-white/80 space-y-5">
            <h3 className="font-serif font-bold text-lg text-gray-900 border-b border-gray-100 pb-3">
              Ticket Details
            </h3>

            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Subject
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {caseData.subject}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Category
              </p>
              <p className="text-sm font-medium text-gray-700 mt-0.5">
                {caseData.category}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Submitted On
              </p>
              <p className="text-sm font-medium text-gray-700 mt-0.5">
                {formatDate(caseData.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Original Description
              </p>
              <div className="text-xs text-gray-600 mt-1 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                {caseData.description}
              </div>
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
    </div>
  );
};

export default StudentCaseDetail;
