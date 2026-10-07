import React from "react";
import { UPLOADS_BASE } from "../../services/api.js";
import { formatFileSize } from "../../utils/formatters.js";

export const AttachmentList = ({ attachments = [] }) => {
  if (!attachments || attachments.length === 0) {
    return <p className="text-xs text-gray-400 italic">No attachments.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {attachments.map((a, index) => {
        const name = a.originalName || a.filename || `Attachment-${index + 1}`;
        const ext = name.split(".").pop().toUpperCase() || "FILE";
        const isImage = /jpg|jpeg|png|gif/i.test(ext);
        const url = `${UPLOADS_BASE}/uploads/${a.filename}`;
        const bgColor = isImage
          ? "bg-blue-100 text-blue-700"
          : "bg-gray-200 text-gray-700";

        return (
          <a
            key={a._id || a.filename || index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl hover:bg-white hover:shadow-sm transition cursor-pointer group"
          >
            <div
              className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0`}
            >
              {ext.slice(0, 3)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate max-w-[140px]">
                {name}
              </p>
              {a.size && (
                <p className="text-[10px] text-gray-400">
                  {formatFileSize(a.size)}
                </p>
              )}
            </div>
            <svg
              className="w-3.5 h-3.5 text-gray-400 group-hover:text-black ml-1 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        );
      })}
    </div>
  );
};

export default AttachmentList;
