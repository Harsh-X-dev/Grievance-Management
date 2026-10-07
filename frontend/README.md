# Grievance.io 2.0 — React Migration

A modern, production-grade frontend implementation of the **University Student Grievance Redressal System**, rebuilt using **React 18**, **Vite**, **React Router v6**, and **Tailwind CSS**.

---

## 🚀 Key Highlights

- **Pure React Architecture**: Functional components, custom hooks, and zero imperative DOM mutations.
- **Strict Role-Based Access Control (RBAC)**: Dedicated route guards for `student`, `admin`, and `superadmin`.
- **Complete Feature Parity**: Preserves all grievance workflows, chat messaging, multipart file attachments, status audits, and binary report exports.
- **Identical Visual Language**: Seamlessly retains the original glassmorphism design system, typography (Inter & Playfair Display), 3D cylinder analytics chart, and micro-animations.
- **Zero Mock Data**: Operates against the live Express/MongoDB backend with graceful loading and empty states.

---

## 🛠️ Technology Stack

- **Core**: React 18.3, ReactDOM 18.3
- **Routing**: React Router DOM 6.26
- **Tooling & Build**: Vite 5.4, PostCSS, Autoprefixer
- **Styling**: Tailwind CSS 3.4 (with custom theme extensions)
- **API Communication**: Native Fetch API with centralized Bearer JWT injection

---

## 📋 Prerequisites

- **Node.js**: `v18.0.0` or higher (tested on Node v22.16)
- **npm**: `v9.0.0` or higher (tested on npm 11.17)

---

## ⚙️ Environment Configuration

The application automatically resolves the backend URL based on environment:

- **Local Development**: Defaults to `http://localhost:5000/api`
- **Production Deployment**: Defaults to `/api`

To override the backend URL, create or edit `.env` in the `grievance_2.0` directory:

```env
VITE_API_BASE_URL=https://grievance-backend-5s6p.onrender.com/api
```

*(Note: Never place private backend credentials or database connection strings into frontend environment variables).*

---

## 📦 Installation & Setup

1. Navigate to the `grievance_2.0` directory:
   ```bash
   cd grievance_2.0
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```
   Open your browser at: `http://localhost:5174`

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview the production build locally:
   ```bash
   npm run preview
   ```

---

## 🔐 Authentication & Roles

### 1. Storage & "Remember Me"
- When **Remember Me** is checked, session credentials are stored in `localStorage` under `grievance_session`.
- When unchecked, credentials are saved in `sessionStorage` under `grievance_session`.
- On every page refresh or application load, `AuthContext` validates the active JWT token with `GET /api/auth/me`.

### 2. Available Roles
| Role | Portal Route | Primary Capabilities |
|---|---|---|
| **`student`** | `/student/*` | File grievances with file attachments, track case progress, converse in message threads, view personal profile, change password. |
| **`admin`** | `/admin/*` | Review department case queue, investigate complaints, reply in message threads, change status with required remark, escalate cases, resolve cases, download reports. |
| **`superadmin`** | `/superadmin/*` | Campus-wide overview, 3D department bar chart, handle escalations, view all grievances, provision/edit/delete department admins, export university audit reports. |

---

## 🧭 Application Routes

```text
/                              Landing Page (Features, Tracker Demo, Testimonial Carousel)
/auth                          Authentication (Sign In, Registration, Forgot Password, OTP)

/student/dashboard             Student Dashboard (Active & Resolved counters, Recent cases)
/student/new-grievance         File Grievance (Category, Subject, Description, File uploads)
/student/cases                 My Cases (Search by keyword or ID, filter by status)
/student/cases/:caseId         Case Detail (Full dossier, message thread, attachments)
/student/profile               Student Profile (Information overview & Change Password)

/admin/dashboard               Admin Console Dashboard (4 queue metrics, pending cases)
/admin/cases                   Department Cases (Filter by status, search by student or ID)
/admin/cases/:caseId           Case Investigation (Status mutation, Escalate, Resolve, Chat)
/admin/reports                 Department Reports (Excel / PDF download)
/admin/profile                 Admin Profile & Security

/superadmin/dashboard          Super Admin Control Center (Institutional KPIs & 3D chart)
/superadmin/escalated          Escalated Cases (Active vs Resolved filter, Handle action)
/superadmin/grievances         All Department Grievances (Campus-wide search)
/superadmin/admins             Admin Management (Create, edit, and delete coordinators)
/superadmin/reports            Institutional Audit Reports (Export campus records)
/superadmin/profile            Master Admin Profile & Security
/superadmin/cases/:caseId      Escalation Dossier (Direct intervention & final closure)
```

---

## 📚 Detailed Architecture Documentation

Detailed architectural and workflow references can be found inside the `docs/` folder:

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): Architectural decisions and tech stack.
- [`docs/DATA_FLOW.md`](docs/DATA_FLOW.md): Sequence diagrams and step-by-step traces.
- [`docs/API_REFERENCE.md`](docs/API_REFERENCE.md): Exact backend endpoints, request bodies, and responses.
- [`docs/FOLDER_STRUCTURE.md`](docs/FOLDER_STRUCTURE.md): File directory index and responsibilities.
- [`docs/COMPONENT_MAP.md`](docs/COMPONENT_MAP.md): Component hierarchy tree and inventory.
- [`docs/MIGRATION_NOTES.md`](docs/MIGRATION_NOTES.md): Transformation guide from legacy Vanilla JS to React 2.0.

---

## 🛡️ License & Credits

Developed as part of the University Grievance Redressal Initiative.  
Maintained under Grievance.io 2.0.
