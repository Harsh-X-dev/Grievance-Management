import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import authService from "../services/auth.service.js";

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    <circle cx="12" cy="12" r="3" strokeWidth="1.8" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 3l18 18" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M10.584 10.587a2 2 0 102.828 2.828" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9.88 5.09A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.154 5.145M6.228 6.228A9.965 9.965 0 002.458 12c1.274 4.057 5.064 7 9.542 7a9.96 9.96 0 005.772-1.772" />
  </svg>
);

export const AuthPage = () => {
  const { user, isAuthenticated, login, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [view, setView] = useState("login"); // 'login' | 'register' | 'forgot' | 'otp'

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerStudentId, setRegisterStudentId] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // OTP reset state
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      const role = user.role.toLowerCase();
      if (role === "student") navigate("/student/dashboard", { replace: true });
      else if (role === "admin") navigate("/admin/dashboard", { replace: true });
      else if (role === "superadmin") navigate("/superadmin/dashboard", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword) {
      showToast("Missing Fields", "Please enter email and password.", "error");
      return;
    }

    setIsLoggingIn(true);
    try {
      const result = await login(loginEmail.trim(), loginPassword, rememberMe);
      if (result.success && result.user) {
        showToast("Welcome Back", `Signed in as ${result.user.name}`, "success");
        const role = result.user.role?.toLowerCase();
        if (role === "student") navigate("/student/dashboard");
        else if (role === "admin") navigate("/admin/dashboard");
        else if (role === "superadmin") navigate("/superadmin/dashboard");
      } else {
        showToast("Sign In Failed", result.message || "Invalid credentials.", "error");
      }
    } catch {
      showToast("Error", "Could not connect to authentication server.", "error");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerName.trim() || !registerEmail.trim() || !registerPassword) {
      showToast("Missing Fields", "Please fill in all required fields.", "error");
      return;
    }

    setIsRegistering(true);
    try {
      const result = await register({
        name: registerName.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
        studentId: registerStudentId.trim(),
        phone: registerPhone.trim(),
      });

      if (result.success) {
        showToast("Account Created", "Welcome to Grievance.io!", "success");
        navigate("/student/dashboard");
      } else {
        showToast("Registration Failed", result.message || "Could not register.", "error");
      }
    } catch {
      showToast("Error", "Could not connect to server.", "error");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      showToast("Required", "Please enter your university email.", "error");
      return;
    }

    setIsSendingOtp(true);
    try {
      const result = await authService.forgotPassword(forgotEmail.trim());
      if (result.success) {
        showToast("OTP Sent", "Please check your email for the 6-digit code.", "success");
        setView("otp");
      } else {
        showToast("Error", result.message || "Failed to send reset code.", "error");
      }
    } catch {
      showToast("Error", "Could not connect to server.", "error");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (otpCode.trim().length !== 6) {
      showToast("Invalid OTP", "Please enter a valid 6-digit code.", "error");
      return;
    }
    if (!newPassword) {
      showToast("Required", "Please enter a new password.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Mismatch", "Passwords do not match.", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("Too Short", "Password must be at least 6 characters.", "error");
      return;
    }

    setIsResetting(true);
    try {
      const result = await authService.resetPassword(forgotEmail, otpCode.trim(), newPassword);
      if (result.success) {
        showToast("Password Reset", "Your password has been reset! Please sign in.", "success");
        setOtpCode("");
        setNewPassword("");
        setConfirmPassword("");
        setView("login");
      } else {
        showToast("Reset Failed", result.message || "Could not reset password.", "error");
      }
    } catch {
      showToast("Error", "Could not connect to server.", "error");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="bg-[#f5f5f7] min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-60 -z-10 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-50 rounded-full blur-3xl opacity-60 -z-10 pointer-events-none"></div>

      <div className="glass-card w-full max-w-5xl min-h-[640px] rounded-[2.5rem] flex overflow-hidden shadow-2xl relative border border-white">
        {/* Left Brand Panel */}
        <div className="hidden lg:flex w-1/2 bg-black text-white flex-col justify-between p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>

          <Link to="/" className="flex items-center gap-2 z-10 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold text-xs">
              G
            </div>
            <span className="font-semibold tracking-tight text-lg">/ Grievance.io</span>
          </Link>

          <div className="z-10 relative">
            <h2 className="text-5xl font-serif leading-tight mb-6">
              Your voice matters.<br />Let's fix it.
            </h2>
            <p className="text-gray-400 max-w-xs leading-relaxed">
              Join students and campus administrators actively shaping a better university environment through transparent communication.
            </p>
          </div>

          <div className="z-10 text-xs text-gray-500">
            &copy; 2026 University Redressal System
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative bg-white/40">
          <Link
            to="/"
            className="absolute top-8 right-8 text-gray-400 hover:text-black transition"
            aria-label="Back to home"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>

          {/* VIEW: LOGIN */}
          {view === "login" && (
            <div className="animate-fade-in max-w-sm mx-auto w-full">
              <div className="mb-6">
                <h3 className="text-3xl font-serif text-brandBlack mb-2">Welcome back</h3>
                <p className="text-gray-500 text-sm">Please enter your details to sign in.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-3">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="auth-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-3">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="auth-input pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition"
                      aria-label={showLoginPassword ? "Hide password" : "Show password"}
                    >
                      {showLoginPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs px-2">
                  <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setView("forgot")}
                    className="font-medium text-black hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-black text-white py-3.5 rounded-full font-medium shadow-lg hover:bg-gray-800 hover:scale-[1.02] transition transform duration-200 mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoggingIn ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                      <span>Signing in…</span>
                    </>
                  ) : (
                    <span>Sign in</span>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setView("register")}
                  className="font-bold text-black hover:underline"
                >
                  Create account
                </button>
              </div>
            </div>
          )}

          {/* VIEW: REGISTER */}
          {view === "register" && (
            <div className="animate-fade-in max-w-sm mx-auto w-full">
              <div className="mb-4">
                <h3 className="text-3xl font-serif text-brandBlack mb-2">Create Account</h3>
                <p className="text-gray-500 text-sm">Start filing grievances today.</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    placeholder="Full Name"
                    className="auth-input"
                    required
                  />
                </div>

                <div>
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="University Email"
                    className="auth-input"
                    required
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={registerStudentId}
                    onChange={(e) => setRegisterStudentId(e.target.value)}
                    placeholder="Student ID / Roll Number"
                    className="auth-input"
                    required
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                    placeholder="Phone Number"
                    className="auth-input"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showRegisterPassword ? "text" : "password"}
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Create Password"
                    className="auth-input pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition"
                    aria-label={showRegisterPassword ? "Hide password" : "Show password"}
                  >
                    {showRegisterPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full bg-black text-white py-3.5 rounded-full font-medium shadow-lg hover:bg-gray-800 hover:scale-[1.02] transition transform duration-200 mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isRegistering ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                      <span>Creating account…</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-500">
                Already a member?{" "}
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="font-bold text-black hover:underline"
                >
                  Log in
                </button>
              </div>
            </div>
          )}

          {/* VIEW: FORGOT PASSWORD */}
          {view === "forgot" && (
            <div className="animate-fade-in max-w-sm mx-auto w-full">
              <div className="mb-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 14l-1 1-1 1H6v-1l4-4 4-4H9a1 1 0 00-1-1 1 1 0 001-1 1 1 0 001-1 1 1 0 001-1z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-serif text-brandBlack mb-2">Reset Password</h3>
                <p className="text-gray-500 text-sm">
                  Enter your university email and we'll send you a 6-digit OTP to reset your password.
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-3">
                    University Email
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="auth-input"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full bg-black text-white py-3.5 rounded-full font-medium shadow-lg hover:bg-gray-800 hover:scale-[1.02] transition transform duration-200 mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSendingOtp ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                      <span>Sending OTP…</span>
                    </>
                  ) : (
                    <span>Send OTP</span>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="text-sm font-medium text-gray-500 hover:text-black flex items-center justify-center gap-2 mx-auto"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Login
                </button>
              </div>
            </div>
          )}

          {/* VIEW: OTP CODE & NEW PASSWORD */}
          {view === "otp" && (
            <div className="animate-fade-in max-w-sm mx-auto w-full">
              <div className="mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-serif text-brandBlack mb-2">Check Your Email</h3>
                <p className="text-gray-500 text-sm">
                  Enter the OTP sent to <strong>{forgotEmail}</strong> along with your new password.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-3">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="6-digit OTP"
                    maxLength={6}
                    className="auth-input font-mono tracking-widest text-center text-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-3">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New Password"
                      className="auth-input pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition"
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-3">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm New Password"
                      className="auth-input pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isResetting}
                  className="w-full bg-black text-white py-3.5 rounded-full font-medium shadow-lg hover:bg-gray-800 hover:scale-[1.02] transition transform duration-200 mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isResetting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                      <span>Resetting Password…</span>
                    </>
                  ) : (
                    <span>Reset Password</span>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setView("forgot")}
                  className="text-sm font-medium text-gray-500 hover:text-black flex items-center justify-center gap-2 mx-auto"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
