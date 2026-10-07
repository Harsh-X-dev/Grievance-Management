# Architecture Specification — Grievance.io 2.0

## 1. Executive Overview

**Grievance.io 2.0** is a modernized, production-grade frontend migration of the University Student Grievance Redressal System from legacy Vanilla JavaScript and multi-page HTML into a Single Page Application (SPA) built on **React 18**, **Vite**, and **Tailwind CSS**.

The architecture preserves the complete backend API contract, business logic, role-based workflows, and design aesthetics while replacing imperative DOM manipulations (`document.getElementById`, `innerHTML`, global mutable state) with declarative React component trees, custom hooks, centralized context providers, and domain-isolated service layers.

---

## 2. High-Level Architectural Diagram

```text
┌─────────────────────────────────────────────────────────────┐
│                       Browser / User                        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 React Router v6 SPA Layer                   │
│   ┌────────────────────┬──────────────────┬──────────────┐  │
│   │   Public Routes    │   Auth Routes    │ Role Portals │  │
│   │    LandingPage     │     AuthPage     │ Protected    │  │
│   └────────────────────┴──────────────────┴──────┬───────┘  │
└──────────────────────────────────────────────────┼──────────┘
                                                   │
                       ┌───────────────────────────┴──────────┐
                       ▼                                      ▼
        ┌─────────────────────────────┐        ┌─────────────────────────────┐
        │   Context & State Layer     │        │      Layout Architecture    │
        │ - AuthContext (JWT/User)    │        │ - StudentLayout             │
        │ - ToastContext (Feedback)   │        │ - AdminLayout               │
        │ - Local Component States    │        │ - SuperAdminLayout          │
        └──────────────┬──────────────┘        └──────────────┬──────────────┘
                       │                                      │
                       ▼                                      ▼
        ┌─────────────────────────────────────────────────────────────┐
        │                 Domain Service Abstraction                  │
        │  - auth.service.js   - case.service.js                      │
        │  - admin.service.js  - report.service.js                    │
        └──────────────────────────────┬──────────────────────────────┘
                                       │
                                       ▼
        ┌─────────────────────────────────────────────────────────────┐
        │               Centralized API Client (api.js)               │
        │  - Automatic Bearer JWT Injection                           │
        │  - Dynamic Base URL Resolution (Dev / Prod)                 │
        │  - JSON & FormData Multi-part Handling                      │
        │  - Binary Blob File Streams (Excel / PDF)                   │
        └──────────────────────────────┬──────────────────────────────┘
                                       │
                                       ▼
        ┌─────────────────────────────────────────────────────────────┐
        │               External Express / MongoDB Backend            │
        │                      (Endpoints Untouched)                  │
        └─────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack & Key Choices

| Tier | Technology | Rationale |
|---|---|---|
| **Build & Tooling** | Vite 5.x | Ultra-fast HMR, instant ES module compilation, optimized production bundling. |
| **Framework** | React 18.x | Functional components, Concurrent Mode, hooks (`useState`, `useEffect`, `useCallback`, `useMemo`). |
| **Routing** | React Router v6 | Declarative nested routing, history management, memory-efficient route guards. |
| **Styling** | Tailwind CSS 3.x (PostCSS) | Maintainable utility classes replacing the CDN script, custom theme extending brand fonts and glassmorphism. |
| **Typography** | Inter & Playfair Display | Preserves exact editorial styling from original design. |

---

## 4. Routing Architecture & Access Control

The application implements strict role-based access control (RBAC) via nested route guards:

### 4.1 Route Guard Hierarchy

1. **`ProtectedRoute`**: Verifies whether an active session and token exist. If loading, renders a clean session verification spinner; if unauthenticated, redirects to `/auth` with the attempted location preserved in navigation state.
2. **`RoleRoute`**: Verifies whether the authenticated user's role matches the required role permissions for the branch:
   - Students cannot access `/admin/*` or `/superadmin/*`.
   - Department Admins cannot access `/student/*` or `/superadmin/*`.
   - Super Administrators have unrestricted administrative governance over root management routes.
   - If unauthorized, users are safely redirected to their own home dashboard.

### 4.2 Route Layout Matrix

- **`/`**: Public landing page featuring feature mockups, real-time tracking preview, and testimonial carousel.
- **`/auth`**: Authentication hub (Sign In, Student Registration, Forgot Password, OTP Reset).
- **`/student`** (StudentLayout):
  - `/student/dashboard`: Key statistics and recent cases.
  - `/student/new-grievance`: File a grievance with multi-file attachment uploads.
  - `/student/cases`: Search, status filter, and full grievance list.
  - `/student/cases/:caseId`: Case conversation thread, details, and attachments.
  - `/student/profile`: Account information and secure password changing.
- **`/admin`** (AdminLayout):
  - `/admin/dashboard`: Department queue stats and pending cases.
  - `/admin/cases`: Departmental case filtering and search.
  - `/admin/cases/:caseId`: Investigation dossier, status changes, escalation, and resolution.
  - `/admin/reports`: Excel and PDF report generation.
  - `/admin/profile`: Department coordinator profile.
- **`/superadmin`** (SuperAdminLayout):
  - `/superadmin/dashboard`: Campus-wide overview, 3D cylinder department chart, recent escalations.
  - `/superadmin/escalated`: Active and resolved escalations.
  - `/superadmin/grievances`: Institutional grievance repository across all departments.
  - `/superadmin/admins`: Coordinator provisioning, editing, and deletion.
  - `/superadmin/reports`: Comprehensive institutional audit reports.
  - `/superadmin/profile`: Root admin security.
  - `/superadmin/cases/:caseId`: Escalation intervention, messaging, and root closure.

---

## 5. Authentication Architecture

### 5.1 Session Storage Strategy
Session persistence maintains strict parity with the legacy app:
- **`Remember Me` Checked**: Stores session in `localStorage` under `grievance_session`.
- **`Remember Me` Unchecked**: Stores session in `sessionStorage` under `grievance_session`.
- Key structure:
  ```json
  {
    "_id": "60d...",
    "name": "Alex Student",
    "email": "alex@university.edu",
    "role": "student",
    "studentId": "2024CS101",
    "department": "Computer Science",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
  ```

### 5.2 Token Lifecycle & Auto-Restoration
On initial application mount:
1. `AuthContext` queries storage for `grievance_session`.
2. If token exists, calls `GET /api/auth/me`.
3. If valid, updates profile in state and storage.
4. If expired or invalid (HTTP 401), automatically clears storage and prompts for re-authentication.

---

## 6. Service & API Layer

Components **never** make ad-hoc `fetch()` calls. All communications flow through domain services:

1. **`api.js`**: Core HTTP client with `request()` wrapper, dynamic base URL detection, automatic `Authorization: Bearer <token>` injection, and error formatting.
2. **`auth.service.js`**: Login, registration, password reset, and session verification.
3. **`case.service.js`**: Filing cases with `FormData`, fetching metrics, sending thread messages, updating status, escalating, and resolving.
4. **`admin.service.js`**: CRUD operations on department admin accounts.
5. **`report.service.js`**: Binary `Blob` handling for Excel (`.xlsx`) and PDF (`.pdf`) downloads.

---

## 7. State Management Strategy

To ensure high performance and prevent unnecessary re-renders:
- **Global State**: Minimal and focused. Handled via React Context (`AuthContext` for credentials; `ToastContext` for feedback notifications).
- **Route State**: Managed via React Router (`useParams` for case IDs, `useLocation` for navigation origins).
- **Local State**: Managed with `useState` and `useCallback` inside individual components (search filters, debounce timers, modal visibilities, form inputs).
