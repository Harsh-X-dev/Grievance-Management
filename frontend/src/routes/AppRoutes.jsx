import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Route Guards
import ProtectedRoute from "./ProtectedRoute.jsx";
import RoleRoute from "./RoleRoute.jsx";

// Layouts
import StudentLayout from "../layouts/StudentLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import SuperAdminLayout from "../layouts/SuperAdminLayout.jsx";

// Public Pages
import LandingPage from "../pages/LandingPage.jsx";
import AuthPage from "../pages/AuthPage.jsx";

// Student Pages
import StudentDashboard from "../pages/student/StudentDashboard.jsx";
import StudentNewGrievance from "../pages/student/StudentNewGrievance.jsx";
import StudentCases from "../pages/student/StudentCases.jsx";
import StudentCaseDetail from "../pages/student/StudentCaseDetail.jsx";
import StudentProfile from "../pages/student/StudentProfile.jsx";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminCases from "../pages/admin/AdminCases.jsx";
import AdminCaseDetail from "../pages/admin/AdminCaseDetail.jsx";
import AdminReports from "../pages/admin/AdminReports.jsx";
import AdminProfile from "../pages/admin/AdminProfile.jsx";

// Super Admin Pages
import SuperAdminDashboard from "../pages/superadmin/SuperAdminDashboard.jsx";
import EscalatedCases from "../pages/superadmin/EscalatedCases.jsx";
import AllGrievances from "../pages/superadmin/AllGrievances.jsx";
import AdminManagement from "../pages/superadmin/AdminManagement.jsx";
import SuperAdminReports from "../pages/superadmin/SuperAdminReports.jsx";
import SuperAdminProfile from "../pages/superadmin/SuperAdminProfile.jsx";
import SuperAdminCaseDetail from "../pages/superadmin/SuperAdminCaseDetail.jsx";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Student Portal (Protected, Student Role Only) */}
      <Route
        path="/student"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["student"]}>
              <StudentLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="new-grievance" element={<StudentNewGrievance />} />
        <Route path="cases" element={<StudentCases />} />
        <Route path="cases/:caseId" element={<StudentCaseDetail />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* Admin Console (Protected, Admin Role Only) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="cases" element={<AdminCases />} />
        <Route path="cases/:caseId" element={<AdminCaseDetail />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Super Admin Control Center (Protected, SuperAdmin Role Only) */}
      <Route
        path="/superadmin"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["superadmin"]}>
              <SuperAdminLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        <Route path="escalated" element={<EscalatedCases />} />
        <Route path="grievances" element={<AllGrievances />} />
        <Route path="admins" element={<AdminManagement />} />
        <Route path="reports" element={<SuperAdminReports />} />
        <Route path="profile" element={<SuperAdminProfile />} />
        <Route path="cases/:caseId" element={<SuperAdminCaseDetail />} />
      </Route>

      {/* 404 / Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
