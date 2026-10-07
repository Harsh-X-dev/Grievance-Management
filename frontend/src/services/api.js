/**
 * Centralized API Client
 * Connects to the Express/MongoDB backend.
 * Auto-detects: uses relative /api in production, localhost:5000 in dev
 */

const envApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "")
  .trim()
  .replace(/\/+$/, "");

export const BASE_URL =
  envApiBaseUrl ||
  (typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")
    ? "http://localhost:5000/api"
    : "/api");

// Base URL for uploaded file attachments (strips /api suffix)
export const UPLOADS_BASE = BASE_URL.replace("/api", "");

export const SESSION_KEY = "grievance_session";

export const API = {
  /**
   * Determine storage type used for current session
   */
  getSessionStorage: () => {
    if (typeof window === "undefined") return null;
    if (localStorage.getItem(SESSION_KEY)) return localStorage;
    if (sessionStorage.getItem(SESSION_KEY)) return sessionStorage;
    return null;
  },

  /**
   * Save session into localStorage (if persist) or sessionStorage
   */
  saveSession: (user, token, persist = true) => {
    if (typeof window === "undefined") return;
    const targetStorage = persist ? localStorage : sessionStorage;
    const otherStorage = persist ? sessionStorage : localStorage;

    otherStorage.removeItem(SESSION_KEY);
    targetStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ ...user, token })
    );
  },

  /**
   * Get active session
   */
  getSession: () => {
    if (typeof window === "undefined") return null;
    const storage = API.getSessionStorage();
    const data = storage?.getItem(SESSION_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  /**
   * Get stored JWT token
   */
  getToken: () => {
    const session = API.getSession();
    return session ? session.token : null;
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: () => {
    return API.getSession();
  },

  /**
   * Clear session
   */
  logout: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  },

  /**
   * Build request headers with Bearer token
   */
  getHeaders: (isFormData = false) => {
    const headers = {};
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }
    const token = API.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  },

  /**
   * Generic fetch wrapper with robust error handling
   */
  request: async (method, endpoint, body = null, isFormData = false) => {
    try {
      const options = {
        method,
        headers: API.getHeaders(isFormData),
      };
      if (body) {
        options.body = isFormData ? body : JSON.stringify(body);
      }

      const res = await fetch(`${BASE_URL}${endpoint}`, options);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return {
          success: false,
          status: res.status,
          message: data.message || `Error ${res.status}`,
        };
      }
      return data;
    } catch (err) {
      console.error(`[API] ${method} ${endpoint} failed:`, err);
      return {
        success: false,
        message: "Cannot connect to server. Is it running?",
      };
    }
  },

  uploadsBase: UPLOADS_BASE,
  baseUrl: BASE_URL,
};

export default API;
