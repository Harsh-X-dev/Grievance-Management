# Migration Notes — Grievance.io 2.0

Comprehensive record of how the legacy Vanilla JavaScript and multi-page HTML architecture was transformed into React 2.0.

---

## 1. Architectural Transformation Summary

| Feature / System | Legacy Implementation | React 2.0 Implementation |
|---|---|---|
| **Architecture** | Multi-Page Application (MPA) with 5 static HTML files | Single Page Application (SPA) with React Router v6 |
| **DOM Manipulation** | Imperative (`document.getElementById`, `innerHTML`, `classList`) | Declarative JSX driven by state (`useState`, `useEffect`) |
| **Styling** | Tailwind CSS via CDN script with inline runtime config | Production Tailwind CSS v3 via PostCSS and Vite build |
| **Authentication** | Imperative script execution in `auth.js` | `AuthContext` + `auth.service.js` with declarative session restoration |
| **Route Protection** | URL checks inside `core.js` redirecting via `window.location.href` | Declarative route guards (`ProtectedRoute`, `RoleRoute`) |
| **API Client** | Global `window.API` object with raw `fetch()` calls | Modular `src/services/api.js` + domain service modules |
| **Feedback / Alerts** | Browser `alert()`, `confirm()`, and manual DOM toast | `ToastContext` provider + React `Modal` & `ConfirmModal` |
| **Form Handling** | Direct input extraction on form submit event listener | Controlled React states with validation feedback |
| **File Uploads** | Imperative `FormData` append from input files | React `FormData` construction with file preview and remove badges |
| **Binary Downloads** | Imperative DOM anchor creation | `reportService.downloadReport()` with Blob stream and memory cleanup |
| **Carousel** | Imperative setInterval + manual style transform DOM manipulation | React state-driven index with CSS transforms and pause-on-hover |
| **3D Bar Chart** | Injected raw HTML string with style tags | Pure React component (`DeptBarChart.jsx`) with dynamic props |

---

## 2. Source-to-Target File Mapping

### 2.1 API & Core Modules
- **`js/api.js`** → **`src/services/api.js`** + Domain services:
  - Extracted authentication methods to `src/services/auth.service.js`.
  - Extracted grievance/case methods to `src/services/case.service.js`.
  - Extracted admin management methods to `src/services/admin.service.js`.
  - Extracted binary report streaming to `src/services/report.service.js`.
  - Retained session storage keys (`grievance_session`), token resolution, and automatic `Authorization: Bearer` attachment.

### 2.2 Navigation & Routing
- **`pages/index.html`** & **`index.html`** → **`src/pages/LandingPage.jsx`**
  - Replaced imperative scroll observers with React effects.
  - Converted imperative testimonial slider into an auto-advancing, pauseable React state carousel.
- **`pages/auth.html` & `js/auth.js`** → **`src/pages/AuthPage.jsx`**
  - Consolidated 4 views (Login, Register, Forgot Password, OTP Reset) into a clean state machine (`view === 'login' \| 'register' \| 'forgot' \| 'otp'`).
  - Integrated password visibility toggles using React state.
  - Eliminated `.hidden-view` / `.active-view` DOM class manipulation in favor of declarative JSX rendering.
- **`js/core.js`** → **`src/routes/AppRoutes.jsx` + Layouts**
  - The legacy `Core.navTo()` view-switching mechanism (hiding/showing `.view-section` divs) was replaced with URL-driven React Router navigation (`/student/cases`, `/admin/cases`, etc.).
  - Legacy `Core.checkRoleAccess()` was mapped into reusable `RoleRoute` components.

### 2.3 Student Domain
- **`pages/student_dashboard.html` & `js/student.js`** →
  - `src/layouts/StudentLayout.jsx`: Navigation shell with active item highlighting, mobile drawer, and header.
  - `src/pages/student/StudentDashboard.jsx`: Metrics and recent table.
  - `src/pages/student/StudentNewGrievance.jsx`: Complaint filing with multi-file attachment preview.
  - `src/pages/student/StudentCases.jsx`: Filterable, searchable case list.
  - `src/pages/student/StudentCaseDetail.jsx`: Communication thread, message composer, and file viewer.
  - `src/pages/student/StudentProfile.jsx`: Profile summary and password modal.

### 2.4 Admin Domain
- **`pages/normal_admin.html` & `js/admin.js`** →
  - `src/layouts/AdminLayout.jsx`: Admin console shell with department label and header.
  - `src/pages/admin/AdminDashboard.jsx`: 4 status counters and pending table.
  - `src/pages/admin/AdminCases.jsx`: Departmental grievance table with search.
  - `src/pages/admin/AdminCaseDetail.jsx`: Case investigation, chat thread, status transition modal, and escalation modal.
  - `src/pages/admin/AdminReports.jsx`: Department report export.
  - `src/pages/admin/AdminProfile.jsx`: Coordinator profile and password change.

### 2.5 Super Admin Domain
- **`pages/superadmin.html` & `js/superadmin.js`** →
  - `src/layouts/SuperAdminLayout.jsx`: Grouped sidebar navigation shell.
  - `src/pages/superadmin/SuperAdminDashboard.jsx`: Master metrics, 3D cylinder chart, recent escalations.
  - `src/components/superadmin/DeptBarChart.jsx`: 3D cylinder bar chart with elliptical caps.
  - `src/pages/superadmin/EscalatedCases.jsx`: Filter toggle between Active and Resolved escalations.
  - `src/pages/superadmin/AllGrievances.jsx`: Cross-departmental case search.
  - `src/pages/superadmin/AdminManagement.jsx`: Coordinator card grid with Add, Edit, and Delete modals.
  - `src/pages/superadmin/SuperAdminReports.jsx`: University-wide report export.
  - `src/pages/superadmin/SuperAdminProfile.jsx`: Root admin settings.
  - `src/pages/superadmin/SuperAdminCaseDetail.jsx`: Escalation dossier with origin back tracking.

---

## 3. Key Behavioral & Security Parity Verified

1. **Remember Me Persistence**:
   - `rememberMe = true` stores in `localStorage`.
   - `rememberMe = false` stores in `sessionStorage`.
   - Storage key is preserved as `grievance_session`.
2. **Backend Unmodified**:
   - No backend routes or schemas were changed.
   - All query parameters (`?status=...&search=...`) and payload formats remain identical.
3. **Multipart File Handling**:
   - `attachments` continue to be submitted as `FormData` binary parts.
   - Uploaded files continue to be accessed via `${API.uploadsBase}/uploads/${filename}`.
4. **Binary Report Streaming**:
   - Binary octet-streams are received as `Blob` objects.
   - Content-Disposition headers are parsed to extract official server filenames.
5. **No Mock Data**:
   - The application does not contain hardcoded fake statistics or synthetic complaints.
   - Clean empty states are displayed when no backend records exist.
