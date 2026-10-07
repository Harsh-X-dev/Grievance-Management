import API from "./api.js";

export const adminService = {
  /**
   * Get all admins (Super Admin)
   */
  getAdmins: async () => {
    return await API.request("GET", "/admin/list");
  },

  /**
   * Create a new department admin (Super Admin)
   * @param {object} adminData - { name, email, department, password }
   */
  createAdmin: async (adminData) => {
    return await API.request("POST", "/admin/create", adminData);
  },

  /**
   * Update admin profile (Super Admin)
   * @param {string} adminId
   * @param {object} data - { email, department }
   */
  updateAdmin: async (adminId, data) => {
    return await API.request("PUT", `/admin/${adminId}`, data);
  },

  /**
   * Delete an admin (Super Admin)
   * @param {string} adminId
   */
  deleteAdmin: async (adminId) => {
    return await API.request("DELETE", `/admin/${adminId}`);
  },
};

export default adminService;
