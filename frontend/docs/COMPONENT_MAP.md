# Component Map & Hierarchy — Grievance.io 2.0

Comprehensive component relationship tree and layout hierarchy.

---

## 1. Top-Level Component Hierarchy

```text
App (Root)
│
├── AuthProvider (Maintains token, user, session storage)
│
└── ToastProvider (Global notification toasts & alerts)
    │
    └── BrowserRouter
        │
        └── AppRoutes (Central Switchboard)
            │
            ├── Public Routes
            │   └── LandingPage
            │       ├── TestimonialCarousel (Controlled timer & pause-on-hover)
            │       └── LiveTrackerDemo
            │
            ├── Auth Routes
            │   └── AuthPage
            │       ├── LoginForm (Email, Password toggle, RememberMe)
            │       ├── RegisterForm (Name, Email, StudentId, Phone, Password)
            │       ├── ForgotPasswordForm (Email -> Send OTP)
            │       └── OtpResetForm (OTP code, New password, Confirm password)
            │
            ├── Student Routes (Wrapped by ProtectedRoute + RoleRoute["student"])
            │   └── StudentLayout (Desktop Sidebar, Mobile Header/Drawer, User Badge)
            │       ├── StudentDashboard
            │       │   ├── StatCard (Active, Resolved, Total)
            │       │   ├── QuickActionBanner (+ File Grievance)
            │       │   └── RecentCasesTable (Check Button -> Case Detail)
            │       │
            │       ├── StudentNewGrievance
            │       │   ├── CategorySelect
            │       │   ├── FormInputs (Subject, Description)
            │       │   └── MultiFileUpload (Preview badges with remove buttons)
            │       │
            │       ├── StudentCases
            │       │   ├── SearchInput (Debounced query)
            │       │   ├── StatusFilterDropdown
            │       │   └── CaseTable (StatusBadge, View Details)
            │       │
            │       ├── StudentCaseDetail
            │       │   ├── CaseHeader (Back Button, StatusBadge, Metadata)
            │       │   ├── ChatThread (Message bubbles, timestamps, avatars)
            │       │   ├── ChatInput (Send message; disabled when Resolved)
            │       │   ├── TicketSidebar (Original description, submitted date)
            │       │   └── AttachmentList (Downloadable file cards with extensions)
            │       │
            │       └── StudentProfile
            │           ├── ProfileOverviewCard
            │           └── PasswordModal (Change password form)
            │
            ├── Admin Routes (Wrapped by ProtectedRoute + RoleRoute["admin"])
            │   └── AdminLayout (Desktop Sidebar, Department Title, User Avatar)
            │       ├── AdminDashboard
            │       │   ├── StatCard x 4 (Pending, In Progress, Escalated, Resolved)
            │       │   └── PendingCasesTable (Open Case button)
            │       │
            │       ├── AdminCases
            │       │   ├── SearchInput (Debounced query)
            │       │   ├── StatusFilterDropdown
            │       │   └── DepartmentCaseTable (Manage button)
            │       │
            │       ├── AdminCaseDetail
            │       │   ├── CaseHeader (Change Status, Escalate, Resolve)
            │       │   ├── ComplainantCard (Student details, roll, email, phone)
            │       │   ├── ChatThread
            │       │   ├── ChatInput (Disabled if Resolved or Escalated)
            │       │   ├── AttachmentList
            │       │   ├── StatusModal (Allowed status transitions & remark)
            │       │   ├── EscalateModal (Escalate to Super Admin & reason)
            │       │   └── ConfirmModal (Resolve confirmation)
            │       │
            │       ├── AdminReports
            │       │   └── ReportExportForm (Period select, Format radio, Download)
            │       │
            │       └── AdminProfile
            │           ├── AdminCredentialsCard
            │           └── PasswordModal
            │
            └── SuperAdmin Routes (Wrapped by ProtectedRoute + RoleRoute["superadmin"])
                └── SuperAdminLayout (Grouped Sections Sidebar, Header, Avatar)
                    ├── SuperAdminDashboard
                    │   ├── StatCard x 4 (Total, Resolved, Escalated, Admins)
                    │   ├── DeptBarChart (3D cylinder charts with top caps)
                    │   └── RecentEscalationsList (Handle button -> Case Detail)
                    │
                    ├── EscalatedCases
                    │   ├── FilterToggle (Active Escalations vs Resolved)
                    │   ├── DepartmentFilterDropdown
                    │   ├── SearchInput
                    │   └── EscalatedTable (Manage button)
                    │
                    ├── AllGrievances
                    │   ├── DepartmentFilterDropdown
                    │   ├── SearchInput
                    │   └── AllCasesTable (View Details)
                    │
                    ├── AdminManagement
                    │   ├── CoordinatorGrid (Admin cards with Initials & Dept)
                    │   ├── AddAdminModal (Create coordinator account)
                    │   ├── EditAdminModal (Update email & department)
                    │   └── ConfirmModal (Delete coordinator account)
                    │
                    ├── SuperAdminReports
                    │   └── InstitutionalAuditForm (Period, Format, Dept scope)
                    │
                    ├── SuperAdminProfile
                    │   ├── RootCredentialsCard
                    │   └── PasswordModal
                    │
                    └── SuperAdminCaseDetail
                        ├── EscalationHeader (Back to origin, Resolve Escalation)
                        ├── MetadataCard (Department escalation reason note)
                        ├── ComplainantCard
                        ├── ChatThread
                        ├── ChatInput (Active when Escalated, notice when closed)
                        ├── AttachmentList
                        └── ConfirmModal (Final closure confirmation)
```

---

## 2. Reusable Component Inventory

| Component | Path | Responsibility |
|---|---|---|
| `Modal` | `components/common/Modal.jsx` | Accessible dialog with escape key listener and background backdrop. |
| `ConfirmModal` | `components/common/ConfirmModal.jsx` | Confirmation dialog with custom buttons and danger states. |
| `PasswordModal` | `components/common/PasswordModal.jsx` | Password change form with real-time validation and visibility toggles. |
| `StatusBadge` | `components/common/StatusBadge.jsx` | Consistent badge rendering for all 4 grievance statuses. |
| `StatCard` | `components/common/StatCard.jsx` | Glassmorphic KPI card with left border color coding. |
| `EmptyState` | `components/common/EmptyState.jsx` | Zero-state graphic and helpful message with optional CTA. |
| `LoadingSpinner` | `components/common/LoadingSpinner.jsx` | Accessible spinner with status text. |
| `AttachmentList` | `components/common/AttachmentList.jsx` | File preview cards with extension icon, file size, and external links. |
| `ChatThread` | `components/common/ChatThread.jsx` | Auto-scrolling conversation bubbles differentiating student and admin. |
| `ChatInput` | `components/common/ChatInput.jsx` | Rounded input with send action and disabled state when resolved. |
| `StatusModal` | `components/admin/StatusModal.jsx` | Admin modal enforcing valid state transitions with required remarks. |
| `EscalateModal` | `components/admin/EscalateModal.jsx` | Admin modal to forward case to Super Admin with reason. |
| `AddAdminModal` | `components/superadmin/AddAdminModal.jsx` | Super Admin form to create new department admin. |
| `EditAdminModal` | `components/superadmin/EditAdminModal.jsx` | Super Admin form to update admin email and department. |
| `DeptBarChart` | `components/superadmin/DeptBarChart.jsx` | Visual representation of cases by department matching original styling. |
