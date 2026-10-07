import React, { useState } from "react";
import reportService from "../../services/report.service.js";
import { useToast } from "../../context/ToastContext.jsx";

export const AdminReports = () => {
  const { showToast } = useToast();
  const [period, setPeriod] = useState("monthly");
  const [format, setFormat] = useState("excel");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e) => {
    e.preventDefault();
    setIsDownloading(true);
    showToast("Generating", "Preparing your department report download...", "warning");

    try {
      const result = await reportService.downloadReport({ period, format });
      if (result.success) {
        showToast("Downloaded", `Report saved as ${result.filename || "file"}.`, "success");
      } else {
        showToast("Error", result.message || "Failed to download report.", "error");
      }
    } catch {
      showToast("Error", "Could not connect to server.", "error");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-serif font-bold text-gray-900">
          Department Reports
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Export verified grievance analytics and case histories
        </p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-white shadow-sm bg-white/80 space-y-6">
        <form onSubmit={handleDownload} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Time Period
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm outline-none focus:bg-white focus:border-black transition font-semibold"
            >
              <option value="weekly">Past 7 Days (Weekly)</option>
              <option value="monthly">Past 30 Days (Monthly)</option>
              <option value="quarterly">Quarterly (Past 3 Months)</option>
              <option value="annual">Annual (Past Year)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label
                className={`border-2 rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition ${
                  format === "excel"
                    ? "border-black bg-black/5"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value="excel"
                  checked={format === "excel"}
                  onChange={() => setFormat("excel")}
                  className="hidden"
                />
                <span className="text-2xl">📊</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">Excel (.xlsx)</p>
                  <p className="text-[11px] text-gray-400">Structured raw data</p>
                </div>
              </label>

              <label
                className={`border-2 rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition ${
                  format === "pdf"
                    ? "border-black bg-black/5"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value="pdf"
                  checked={format === "pdf"}
                  onChange={() => setFormat("pdf")}
                  className="hidden"
                />
                <span className="text-2xl">📄</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">PDF Document</p>
                  <p className="text-[11px] text-gray-400">Printable audit report</p>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isDownloading}
              className="bg-black text-white px-8 py-3 rounded-full text-xs font-bold hover:bg-gray-800 transition shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              {isDownloading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                  <span>Generating Report...</span>
                </>
              ) : (
                <span>Download Report ↓</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminReports;
