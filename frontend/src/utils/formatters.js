export const formatDate = (dateStr, options = { month: "short", day: "numeric", year: "numeric" }) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", options);
  } catch {
    return "—";
  }
};

export const formatShortDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "—";
  }
};

export const formatTime = (timeStr) => {
  if (!timeStr) return "";
  try {
    return new Date(timeStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

export const formatFileSize = (bytes) => {
  if (!bytes || isNaN(bytes)) return "";
  return `${(bytes / 1024).toFixed(1)} KB`;
};

export const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
