import API from "./api.js";

export const caseService = {
  /**
   * File a new grievance with optional attachments (FormData)
   * @param {FormData} formData - includes category, subject, description, attachments
   */
  fileGrievance: async (formData) => {
    return await API.request("POST", "/cases", formData, true);
  },

  /**
   * Get student's own filed grievances
   */
  getMyCases: async () => {
    return await API.request("GET", "/cases/my");
  },

  /**
   * Get grievances for admin's department
   * @param {object} filters - { status, search, slaBreached }
   */
  getDepartmentCases: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "" && v !== "All Status") {
        params.append(k, v);
      }
    });
    const qs = params.toString();
    return await API.request("GET", `/cases/department${qs ? "?" + qs : ""}`);
  },

  /**
   * Get all grievances across all departments (Super Admin)
   * @param {object} filters - { status, department, search }
   */
  getAllCases: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "" && v !== "all" && v !== "All Status") {
        params.append(k, v);
      }
    });
    const qs = params.toString();
    return await API.request("GET", `/cases/all${qs ? "?" + qs : ""}`);
  },

  /**
   * Get escalated cases (Super Admin)
   */
  getEscalatedCases: async () => {
    return await API.request("GET", "/cases/escalated");
  },

  /**
   * Get dashboard statistics
   */
  getStats: async () => {
    return await API.request("GET", "/cases/stats");
  },

  /**
   * Get a single grievance by ID (e.g. 'G-1024')
   * @param {string} caseId
   */
  getCaseById: async (caseId) => {
    return await API.request("GET", `/cases/${caseId}`);
  },

  /**
   * Send a message in a grievance thread
   * @param {string} caseId
   * @param {string} text
   * @param {boolean} isInternal
   */
  sendMessage: async (caseId, text, isInternal = false) => {
    return await API.request("POST", `/cases/${caseId}/message`, {
      text,
      isInternal,
    });
  },

  /**
   * Change status of a case (Admin / Super Admin)
   * @param {string} caseId
   * @param {string} status
   * @param {string} remark
   */
  changeStatus: async (caseId, status, remark) => {
    return await API.request("PUT", `/cases/${caseId}/status`, {
      status,
      remark,
    });
  },

  /**
   * Escalate a grievance (Admin)
   * @param {string} caseId
   * @param {string} escalateTo
   * @param {string} reason
   */
  escalateCase: async (caseId, escalateTo = "Super Admin", reason) => {
    return await API.request("PUT", `/cases/${caseId}/escalate`, {
      escalateTo,
      reason,
    });
  },

  /**
   * Mark grievance as resolved and closed (Admin / Super Admin)
   * @param {string} caseId
   */
  resolveCase: async (caseId) => {
    return await API.request("PUT", `/cases/${caseId}/resolve`);
  },
};

export default caseService;
