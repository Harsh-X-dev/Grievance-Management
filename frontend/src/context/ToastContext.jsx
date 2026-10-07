import React, { createContext, useContext, useState, useCallback, useRef } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const timeoutRef = useRef(null);

  const hideToast = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast(null);
  }, []);

  const showToast = useCallback((title, message, type = "success") => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast({ title, message, type });
    timeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  const typeConfig = {
    success: {
      icon: "✓",
      iconClass: "bg-green-100 text-green-600",
    },
    error: {
      icon: "✕",
      iconClass: "bg-red-100 text-red-600",
    },
    warning: {
      icon: "⚠",
      iconClass: "bg-yellow-100 text-yellow-600",
    },
  };

  const currentConfig = toast ? typeConfig[toast.type] || typeConfig.success : typeConfig.success;

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}

      {/* Global Toast Component */}
      <div
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white/90 backdrop-blur-xl border border-gray-200/80 p-4 rounded-2xl shadow-xl transition-all duration-300 transform max-w-sm w-full ${
          toast
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-20 opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${currentConfig.iconClass}`}
        >
          {currentConfig.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">
            {toast?.title}
          </p>
          <p className="text-xs text-gray-500 line-clamp-2">
            {toast?.message}
          </p>
        </div>
        <button
          onClick={hideToast}
          className="text-gray-400 hover:text-black p-1 transition"
          aria-label="Close notification"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export default ToastContext;
