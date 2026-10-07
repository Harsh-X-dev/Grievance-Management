# Folder Structure Documentation — Grievance.io 2.0

Comprehensive map and responsibility breakdown of all files in the `grievance_2.0` repository.

```text
grievance_2.0/
│
├── public/                     # Static public assets served by Vite
│
├── docs/                       # Migration architectural documentation
│   ├── ARCHITECTURE.md         # Architecture, design principles, and tech stack
│   ├── DATA_FLOW.md            # Concrete sequence traces for data & actions
│   ├── API_REFERENCE.md        # Exact backend API contract & endpoints used
│   ├── FOLDER_STRUCTURE.md     # Directory blueprint & responsibility catalogue
│   ├── COMPONENT_MAP.md        # UI component hierarchy & visual trees
│   └── MIGRATION_NOTES.md      # Legacy-to-React mapping & architectural transitions
│
├── src/
│   ├── assets/                 # Local image, icon, and font assets
│   │
│   ├── components/             # Reusable UI components
│   │   ├── common/             # Cross-role design system components
│   │   │   ├── AttachmentList.jsx  # Renders clickable attachment files with sizes
│   │   │   ├── ChatInput.jsx       # Standard message input with auto-disabled state
│   │   │   ├── ChatThread.jsx      # Message bubbles with auto-scroll and timestamps
│   │   │   ├── ConfirmModal.jsx    # Destructive or operational confirmation dialog
│   │   │   ├── EmptyState.jsx      # Fallback UI for zero-data responses
│   │   │   ├── LoadingSpinner.jsx  # Accessible loading spinner indicator
│   │   │   ├── Modal.jsx           # Accessible glassmorphism base modal container
│   │   │   ├── PasswordModal.jsx   # Change-password modal with validation & toggles
│   │   │   ├── StatCard.jsx        # Glassmorphic numerical metric card with accent border
│   │   │   └── StatusBadge.jsx     # Badges for Pending, In Progress, Escalated, Resolved
│   │   │
│   │   ├── admin/              # Department administrator components
│   │   │   ├── EscalateModal.jsx   # Forward case to Super Admin with reason
│   │   │   └── StatusModal.jsx     # Update case status with transition guards & remark
│   │   │
│   │   └── superadmin/         # Super administrator components
│   │       ├── AddAdminModal.jsx   # Form to provision new department admin accounts
│   │       ├── EditAdminModal.jsx  # Form to edit existing coordinator details
│   │       └── DeptBarChart.jsx    # 3D glossy cylinder bar chart for department cases
│   │
│   ├── constants/              # Centralized application constants
│   │   └── index.js            # Departments, valid status transitions, and theme styles
│   │
│   ├── context/                # Global React context providers
│   │   ├── AuthContext.jsx     # Authentication state, login/logout, session persistence
│   │   └── ToastContext.jsx    # System feedback notifications (success, error, warning)
│   │
│   ├── layouts/                # Portal shell layouts with navigation and headers
│   │   ├── StudentLayout.jsx   # Student portal sidebar, header, breadcrumb, and outlet
│   │   ├── AdminLayout.jsx     # Admin console sidebar, header, department info, and outlet
│   │   └── SuperAdminLayout.jsx# Super Admin control center grouped sidebar and outlet
│   │
│   ├── pages/                  # Top-level screen views
│   │   ├── LandingPage.jsx     # Marketing home, feature demo, and testimonial carousel
│   │   ├── AuthPage.jsx        # Login, registration, forgot password, and OTP reset
│   │   │
│   │   ├── student/            # Student portal pages
│   │   │   ├── StudentDashboard.jsx     # High-level stats and recent submissions
│   │   │   ├── StudentNewGrievance.jsx  # Multi-file grievance submission form
│   │   │   ├── StudentCases.jsx         # Searchable, filterable table of my cases
│   │   │   ├── StudentCaseDetail.jsx    # Interactive thread, attachments, and dossier
│   │   │   └── StudentProfile.jsx       # Student record overview and password change
│   │   │
│   │   ├── admin/              # Department admin pages
│   │   │   ├── AdminDashboard.jsx       # Department queue metrics and pending items
│   │   │   ├── AdminCases.jsx           # Department grievance inventory with filters
│   │   │   ├── AdminCaseDetail.jsx      # Admin review, status update, escalate, resolve
│   │   │   ├── AdminReports.jsx         # Generate and export departmental Excel/PDF reports
│   │   │   └── AdminProfile.jsx         # Coordinator credentials and security
│   │   │
│   │   └── superadmin/         # Super administrator pages
│   │       ├── SuperAdminDashboard.jsx  # Master overview, 3D chart, recent escalations
│   │       ├── EscalatedCases.jsx       # Active and resolved escalation queues
│   │       ├── AllGrievances.jsx        # Campus-wide cross-departmental complaint list
│   │       ├── AdminManagement.jsx      # Provision, update, and remove admin coordinators
│   │       ├── SuperAdminReports.jsx    # Institutional audit logs and report downloads
│   │       ├── SuperAdminProfile.jsx    # Master admin credentials and security
│   │       └── SuperAdminCaseDetail.jsx # Escalation intervention, chat, and resolution
│   │
│   ├── routes/                 # Navigation structure and route protection
│   │   ├── AppRoutes.jsx       # Root Route configuration tree
│   │   ├── ProtectedRoute.jsx  # Verifies active session presence
│   │   └── RoleRoute.jsx       # Restricts route access strictly by user role
│   │
│   ├── services/               # Isolated backend API communication tier
│   │   ├── api.js              # Centralized fetch wrapper with automatic JWT injection
│   │   ├── auth.service.js     # Auth, registration, token validation, password resets
│   │   ├── case.service.js     # Case operations, status mutations, message threads
│   │   ├── admin.service.js    # Coordinator CRUD operations
│   │   └── report.service.js   # Binary Blob downloads for Excel and PDF files
│   │
│   ├── utils/                  # Helper utilities
│   │   └── formatters.js       # Date formatting, file size calculations, user initials
│   │
│   ├── App.jsx                 # Root application wrapper with context providers
│   ├── main.jsx                # DOM mounting entry point with BrowserRouter
│   └── index.css               # Tailwind directives, glassmorphic card utilities, animations
│
├── .env                        # Vite environment configuration
├── .gitignore                  # Git exclusions for dependencies and build artifacts
├── index.html                  # HTML entry point with Google Fonts preconnections
├── package.json                # Project dependencies, scripts, and metadata
├── postcss.config.js           # PostCSS configuration for Tailwind CSS
├── tailwind.config.js          # Tailwind theme extension for colors and typography
├── vite.config.js              # Vite bundling, server port, and path alias configuration
└── README.md                   # Operational guide, developer instructions, and feature map
```
