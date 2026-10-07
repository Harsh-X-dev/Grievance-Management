import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import caseService from "../../services/case.service.js";
import { useToast } from "../../context/ToastContext.jsx";
import { formatFileSize } from "../../utils/formatters.js";

const CATEGORIES = [
  "Hostel & Accommodation",
  "Examination & Grading",
  "Finance & Fees",
  "Infrastructure & Maintenance",
  "Harassment & Discipline",
  "Library & Labs",
  "IT & Technical Support",
  "General / Other",
];

export const StudentNewGrievance = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [category, setCategory] = useState(CATEGORIES[0]);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selected]);
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim()) {
      showToast("Required", "Please provide a subject line.", "error");
      return;
    }
    if (!description.trim()) {
      showToast("Required", "Please describe your grievance.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("category", category);
    formData.append("subject", subject.trim());
    formData.append("description", description.trim());

    files.forEach((file) => {
      formData.append("attachments", file);
    });

    setIsSubmitting(true);
    try {
      const result = await caseService.fileGrievance(formData);
      if (result.success && result.case) {
        showToast(
          "Grievance Filed!",
          `Case #${result.case.caseId} created successfully.`,
          "success"
        );
        navigate(`/student/cases/${result.case.caseId}`);
      } else {
        showToast("Error", result.message || "Failed to file grievance.", "error");
      }
    } catch {
      showToast("Error", "Could not connect to server.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-serif font-bold text-gray-900">File a Grievance</h2>
        <p className="text-sm text-gray-500 mt-1">
          Submit your concerns directly to the university administration.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-white shadow-sm bg-white/80">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm outline-none focus:bg-white focus:border-black transition font-medium"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of the issue (e.g. WiFi down in Hostel Block 3)"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm outline-none focus:bg-white focus:border-black transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Detailed Description
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the problem, dates, locations, and any previous attempts to resolve it..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm outline-none focus:bg-white focus:border-black transition leading-relaxed resize-y"
              required
            ></textarea>
          </div>

          {/* File Upload Section */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Supporting Attachments (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-2xl p-6 text-center transition cursor-pointer bg-gray-50/50">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload-input"
              />
              <label htmlFor="file-upload-input" className="cursor-pointer block">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 text-gray-500">
                  📎
                </div>
                <p className="text-sm font-semibold text-gray-800">
                  Click to select files or images
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PDF, DOC, PNG, JPG up to 10MB each
                </p>
              </label>
            </div>

            {/* Selected files list */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Attached Files ({files.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {files.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-xs"
                    >
                      <span className="font-semibold text-gray-700 max-w-[150px] truncate">
                        {f.name}
                      </span>
                      <span className="text-gray-400">{formatFileSize(f.size)}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="text-gray-400 hover:text-red-600 font-bold ml-1 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/student/dashboard")}
              className="px-6 py-3 rounded-full text-xs font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-full text-xs font-bold bg-black text-white hover:bg-gray-800 hover:scale-[1.02] transition shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                  <span>Submitting Grievance...</span>
                </>
              ) : (
                <span>Submit Grievance</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentNewGrievance;
