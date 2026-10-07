export const DEPARTMENTS = [
  "Academic Affairs",
  "Administration",
  "Facilities & Infrastructure",
  "IT & Technical Support",
  "Student Welfare & Discipline",
];

export const STATUS_LIST = ["Pending", "In Progress", "Escalated", "Resolved"];

export const STATUS_STYLES = {
  Pending: {
    badge: "bg-yellow-50 text-yellow-600 border border-yellow-200",
    badgeSolid: "bg-yellow-100 text-yellow-700",
    text: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-400",
  },
  "In Progress": {
    badge: "bg-blue-50 text-blue-600 border border-blue-200",
    badgeSolid: "bg-blue-100 text-blue-700",
    text: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-400",
  },
  Escalated: {
    badge: "bg-red-50 text-red-600 border border-red-200",
    badgeSolid: "bg-red-100 text-red-700",
    text: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-500",
  },
  Resolved: {
    badge: "bg-green-50 text-green-600 border border-green-200",
    badgeSolid: "bg-green-100 text-green-700",
    text: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-500",
  },
};

export const ALLOWED_STATUS_TRANSITIONS = {
  Pending: ["In Progress"],
  "In Progress": ["Resolved", "Escalated"],
  Escalated: ["Resolved"],
  Resolved: [],
};
