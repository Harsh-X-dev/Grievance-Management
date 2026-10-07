import React, { useEffect, useRef } from "react";
import { formatTime } from "../../utils/formatters.js";

export const ChatThread = ({ messages = [], currentRole = "student" }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center py-10">
        <p className="text-center text-xs text-gray-400">
          No messages yet. Start the conversation!
        </p>
      </div>
    );
  }

  const isCurrentUser = (sender) => {
    if (currentRole === "student") {
      return sender === "Student";
    }
    if (currentRole === "admin") {
      return sender !== "Student" && sender !== "Super Admin";
    }
    if (currentRole === "superadmin") {
      return sender === "Super Admin" || sender === "Admin";
    }
    return false;
  };

  const getAvatarLabel = (sender) => {
    if (sender === "Student") return "S";
    if (sender === "Super Admin") return "SA";
    return "A";
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[420px] scroll-smooth"
    >
      {messages.map((m, idx) => {
        const isMine = isCurrentUser(m.sender);
        const time = formatTime(m.time);

        return (
          <div
            key={m._id || idx}
            className={`flex gap-3 ${isMine ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${
                isMine ? "bg-black text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {isMine ? (currentRole === "student" ? "You" : getAvatarLabel(m.sender)) : getAvatarLabel(m.sender)}
            </div>

            <div
              className={`p-3.5 text-sm max-w-[80%] shadow-sm ${
                isMine
                  ? "bg-black text-white rounded-2xl rounded-tr-none"
                  : "bg-white border border-gray-100 rounded-2xl rounded-tl-none text-gray-800"
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
              <p
                className={`text-[10px] mt-1.5 ${
                  isMine ? "text-gray-400 text-right" : "text-gray-400"
                }`}
              >
                {m.sender} • {time}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatThread;
