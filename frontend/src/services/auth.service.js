import API from "./api.js";

export const authService = {
  /**
   * Login user
   * @param {string} email
   * @param {string} password
   * @param {boolean} rememberMe
   */
  login: async (email, password, rememberMe = true) => {
    const result = await API.request("POST", "/auth/login", {
      email,
      password,
    });
    if (result.success && result.user && result.token) {
      API.saveSession(result.user, result.token, rememberMe);
    }
    return result;
  },

  /**
   * Register new student
   * @param {object} userData - { name, email, password, studentId, phone }
   */
  register: async (userData) => {
    const result = await API.request("POST", "/auth/register", userData);
    if (result.success && result.user && result.token) {
      API.saveSession(result.user, result.token, true);
    }
    return result;
  },

  /**
   * Get current authenticated user profile from backend (validates token)
   */
  getMe: async () => {
    return await API.request("GET", "/auth/me");
  },

  /**
   * Change password for logged-in user
   * @param {string} currentPassword
   * @param {string} newPassword
   */
  changePassword: async (currentPassword, newPassword) => {
    return await API.request("PUT", "/auth/change-password", {
      currentPassword,
      newPassword,
    });
  },

  /**
   * Request password reset OTP
   * @param {string} email
   */
  forgotPassword: async (email) => {
    return await API.request("POST", "/auth/forgot-password", { email });
  },

  /**
   * Verify reset OTP
   * @param {string} email
   * @param {string} otp
   */
  verifyOtp: async (email, otp) => {
    return await API.request("POST", "/auth/verify-otp", { email, otp });
  },

  /**
   * Reset password with OTP
   * @param {string} email
   * @param {string} otp
   * @param {string} newPassword
   */
  resetPassword: async (email, otp, newPassword) => {
    return await API.request("POST", "/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
  },

  /**
   * Logout user and clear session
   */
  logout: () => {
    API.logout();
  },

  /**
   * Get current session user
   */
  getCurrentUser: () => {
    return API.getCurrentUser();
  },

  /**
   * Check if session uses persistent storage
   */
  isPersistent: () => {
    return API.getSessionStorage() === localStorage;
  },
};

export default authService;
