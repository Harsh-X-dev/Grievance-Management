import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import authService from "../services/auth.service.js";
import API from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const session = API.getSession();
        if (!session?.token) {
          setIsLoading(false);
          return;
        }

        setToken(session.token);
        setUser(session);

        // Validate token with backend
        const result = await authService.getMe();
        if (result.success && result.user) {
          const isPersist = authService.isPersistent();
          API.saveSession(result.user, session.token, isPersist);
          setUser({ ...result.user, token: session.token });
        } else {
          // Token is invalid/expired
          authService.logout();
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.error("[AuthContext] Session restore error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(async (email, password, rememberMe = true) => {
    const result = await authService.login(email, password, rememberMe);
    if (result.success && result.user && result.token) {
      setUser(result.user);
      setToken(result.token);
    }
    return result;
  }, []);

  const register = useCallback(async (userData) => {
    const result = await authService.register(userData);
    if (result.success && result.user && result.token) {
      setUser(result.user);
      setToken(result.token);
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const result = await authService.getMe();
    if (result.success && result.user) {
      const activeToken = API.getToken();
      const isPersist = authService.isPersistent();
      API.saveSession(result.user, activeToken, isPersist);
      setUser({ ...result.user, token: activeToken });
      return result.user;
    }
    return null;
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
