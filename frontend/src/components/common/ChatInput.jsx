import React, { useState } from "react";

export const ChatInput = ({
  onSend,
  disabled = false,
  placeholder = "Type a message...",
  isSending = false,
}) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled || isSending) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t border-gray-100 flex gap-2 items-center">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled || isSending}
        placeholder={placeholder}
        className="flex-1 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-full text-sm outline-none focus:bg-white focus:border-black transition disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim() || isSending}
        className="bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
      >
        {isSending ? (
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
        ) : (
          <span>Send</span>
        )}
      </button>
    </form>
  );
};

export default ChatInput;
