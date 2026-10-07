# Backend API Reference — Grievance.io 2.0

All endpoints correspond to the active Express / MongoDB backend contract. No endpoints have been modified, renamed, or mocked.

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 `POST /api/auth/login`
- **Purpose**: Authenticates a user (student, admin, superadmin) and returns session token and profile.
- **Auth Required**: No (Public)
- **Request Body**:
  ```json
  {
    "email": "user@university.edu",
    "password": "Password123"
  }
  ```
- **Response Data Used**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "_id": "64f1...",
      "name": "Jane Doe",
      "email": "user@university.edu",
      "role": "student | admin | superadmin",
      "department": "IT Support",
      "studentId": "2024CS101"
    }
  }
  ```
- **Service Handler**: `authService.login(email, password, rememberMe)`
- **Consumers**: `AuthPage.jsx`

---

### 1.2 `POST /api/auth/register`
- **Purpose**: Registers a new student account.
- **Auth Required**: No (Public)
- **Request Body**:
  ```json
  {
    "name": "Alex Student",
    "email": "alex@university.edu",
    "password": "Password123",
    "studentId": "2024CS102",
    "phone": "+1234567890"
  }
  ```
- **Response Data Used**:
  ```json
  {
    "success": true,
    "token": "eyJ...",
    "user": { "_id": "...", "name": "...", "role": "student" }
  }
  ```
- **Service Handler**: `authService.register(userData)`
- **Consumers**: `AuthPage.jsx`

---

### 1.3 `GET /api/auth/me`
- **Purpose**: Validates active JWT token and retrieves the latest user profile.
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Query / Body**: None
- **Response Data Used**:
  ```json
  {
    "success": true,
    "user": {
      "_id": "...",
      "name": "...",
      "email": "...",
      "role": "student | admin | superadmin",
      "department": "...",
      "studentId": "...",
      "phone": "..."
    }
  }
  ```
- **Service Handler**: `authService.getMe()`
- **Consumers**: `AuthContext.jsx` (session restoration on application load)

---

### 1.4 `PUT /api/auth/change-password`
- **Purpose**: Updates password for the authenticated user.
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Request Body**:
  ```json
  {
    "currentPassword": "OldPassword123",
    "newPassword": "NewPassword456"
  }
  ```
- **Response Data Used**: `{ "success": true, "message": "Password changed successfully" }`
- **Service Handler**: `authService.changePassword(currentPassword, newPassword)`
- **Consumers**: `PasswordModal.jsx` (used in `StudentProfile`, `AdminProfile`, `SuperAdminProfile`)

---

### 1.5 `POST /api/auth/forgot-password`
- **Purpose**: Dispatches a 6-digit OTP to the user's registered university email.
- **Auth Required**: No (Public)
- **Request Body**: `{ "email": "user@university.edu" }`
- **Response Data Used**: `{ "success": true, "message": "OTP sent to email" }`
- **Service Handler**: `authService.forgotPassword(email)`
- **Consumers**: `AuthPage.jsx`

---

### 1.6 `POST /api/auth/verify-otp`
- **Purpose**: Validates the 6-digit OTP code.
- **Auth Required**: No (Public)
- **Request Body**: `{ "email": "user@university.edu", "otp": "123456" }`
- **Response Data Used**: `{ "success": true, "resetToken": "..." }`
- **Service Handler**: `authService.verifyOtp(email, otp)`
- **Consumers**: `AuthPage.jsx`

---

### 1.7 `POST /api/auth/reset-password`
- **Purpose**: Sets a new password using verified email and OTP code.
- **Auth Required**: No (Public)
- **Request Body**:
  ```json
  {
    "email": "user@university.edu",
    "otp": "123456",
    "newPassword": "BrandNewPassword123"
  }
  ```
- **Response Data Used**: `{ "success": true, "message": "Password reset successfully" }`
- **Service Handler**: `authService.resetPassword(email, otp, newPassword)`
- **Consumers**: `AuthPage.jsx`

---

## 2. Grievance & Case Endpoints (`/api/cases`)

### 2.1 `POST /api/cases`
- **Purpose**: Submits a new grievance with optional file attachments.
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Request Format**: `multipart/form-data`
  - `category`: string
  - `subject`: string
  - `description`: string
  - `attachments`: File[] (multiple binary file parts)
- **Response Data Used**:
  ```json
  {
    "success": true,
    "case": {
      "_id": "...",
      "caseId": "G-1025",
      "subject": "...",
      "category": "...",
      "status": "Pending",
      "createdAt": "2026-10-07T..."
    }
  }
  ```
- **Service Handler**: `caseService.fileGrievance(formData)`
- **Consumers**: `StudentNewGrievance.jsx`

---

### 2.2 `GET /api/cases/my`
- **Purpose**: Retrieves all grievances filed by the authenticated student.
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Response Data Used**:
  ```json
  {
    "success": true,
    "cases": [
      {
        "_id": "...",
        "caseId": "G-1024",
        "subject": "Hostel WiFi Issue",
        "category": "Hostel & Accommodation",
        "status": "In Progress",
        "createdAt": "2026-10-01T..."
      }
    ]
  }
  ```
- **Service Handler**: `caseService.getMyCases()`
- **Consumers**: `StudentDashboard.jsx`, `StudentCases.jsx`

---

### 2.3 `GET /api/cases/department`
- **Purpose**: Retrieves grievances assigned to the logged-in administrator's department.
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Query Parameters**:
  - `status`: string (e.g. `Pending`, `In Progress`, `Escalated`, `Resolved`)
  - `search`: string (case ID or keyword query)
- **Response Data Used**:
  ```json
  {
    "success": true,
    "cases": [
      {
        "_id": "...",
        "caseId": "G-1024",
        "studentName": "Alex Student",
        "subject": "...",
        "category": "...",
        "status": "Pending",
        "createdAt": "..."
      }
    ]
  }
  ```
- **Service Handler**: `caseService.getDepartmentCases(filters)`
- **Consumers**: `AdminDashboard.jsx`, `AdminCases.jsx`

---

### 2.4 `GET /api/cases/all`
- **Purpose**: Retrieves all grievances across all departments for Super Admin control.
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Query Parameters**:
  - `status`: string
  - `department`: string
  - `search`: string
- **Response Data Used**: `{ "success": true, "cases": [ ... ] }`
- **Service Handler**: `caseService.getAllCases(filters)`
- **Consumers**: `SuperAdminDashboard.jsx`, `EscalatedCases.jsx`, `AllGrievances.jsx`

---

### 2.5 `GET /api/cases/escalated`
- **Purpose**: Fetches active escalated grievances requiring Super Admin intervention.
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Response Data Used**: `{ "success": true, "cases": [ ... ] }`
- **Service Handler**: `caseService.getEscalatedCases()`
- **Consumers**: `SuperAdminDashboard.jsx`

---

### 2.6 `GET /api/cases/stats`
- **Purpose**: Fetches aggregated numerical dashboard metrics.
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Response Data Used**:
  ```json
  {
    "success": true,
    "stats": {
      "total": 42,
      "pending": 8,
      "inProgress": 14,
      "escalated": 3,
      "resolved": 17
    }
  }
  ```
- **Service Handler**: `caseService.getStats()`
- **Consumers**: `StudentDashboard.jsx`, `AdminDashboard.jsx`, `SuperAdminDashboard.jsx`

---

### 2.7 `GET /api/cases/:caseId`
- **Purpose**: Retrieves complete case dossier, including attachments, student details, and message thread.
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Response Data Used**:
  ```json
  {
    "success": true,
    "case": {
      "caseId": "G-1024",
      "subject": "...",
      "category": "...",
      "description": "...",
      "department": "...",
      "status": "In Progress",
      "escalationReason": "...",
      "student": {
        "name": "...",
        "email": "...",
        "studentId": "...",
        "phone": "...",
        "department": "..."
      },
      "attachments": [
        { "filename": "1696...png", "originalName": "error.png", "size": 24050 }
      ],
      "messages": [
        {
          "sender": "Student | Admin | Super Admin",
          "text": "Hello, any update?",
          "time": "2026-10-07T10:00:00Z"
        }
      ],
      "createdAt": "..."
    }
  }
  ```
- **Service Handler**: `caseService.getCaseById(caseId)`
- **Consumers**: `StudentCaseDetail.jsx`, `AdminCaseDetail.jsx`, `SuperAdminCaseDetail.jsx`

---

### 2.8 `POST /api/cases/:caseId/message`
- **Purpose**: Appends a new message to the case communication thread.
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Request Body**:
  ```json
  {
    "text": "The technician has been scheduled.",
    "isInternal": false
  }
  ```
- **Response Data Used**: `{ "success": true, "message": "Message sent" }`
- **Service Handler**: `caseService.sendMessage(caseId, text, isInternal)`
- **Consumers**: `StudentCaseDetail.jsx`, `AdminCaseDetail.jsx`, `SuperAdminCaseDetail.jsx`

---

### 2.9 `PUT /api/cases/:caseId/status`
- **Purpose**: Changes status of a case and logs an audit remark.
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Request Body**:
  ```json
  {
    "status": "In Progress | Resolved | Escalated",
    "remark": "Investigating with campus infrastructure team"
  }
  ```
- **Response Data Used**: `{ "success": true, "case": { ... } }`
- **Service Handler**: `caseService.changeStatus(caseId, status, remark)`
- **Consumers**: `AdminCaseDetail.jsx`

---

### 2.10 `PUT /api/cases/:caseId/escalate`
- **Purpose**: Forwards a case to Super Admin with a justification reason.
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Request Body**:
  ```json
  {
    "escalateTo": "Super Admin",
    "reason": "Exceeds department budget limit"
  }
  ```
- **Response Data Used**: `{ "success": true, "case": { ... } }`
- **Service Handler**: `caseService.escalateCase(caseId, escalateTo, reason)`
- **Consumers**: `AdminCaseDetail.jsx`

---

### 2.11 `PUT /api/cases/:caseId/resolve`
- **Purpose**: Formally closes and resolves a grievance.
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Response Data Used**: `{ "success": true, "case": { ... } }`
- **Service Handler**: `caseService.resolveCase(caseId)`
- **Consumers**: `AdminCaseDetail.jsx`, `SuperAdminCaseDetail.jsx`

---

## 3. Administrator Management (`/api/admin`)

### 3.1 `GET /api/admin/list`
- **Purpose**: Lists all department administrators.
- **Auth Required**: Yes (Super Admin)
- **Response Data Used**:
  ```json
  {
    "success": true,
    "admins": [
      {
        "_id": "60a...",
        "name": "Dr. Sharma",
        "email": "sharma@university.edu",
        "department": "Academic Affairs"
      }
    ]
  }
  ```
- **Service Handler**: `adminService.getAdmins()`
- **Consumers**: `SuperAdminDashboard.jsx`, `AdminManagement.jsx`

---

### 3.2 `POST /api/admin/create`
- **Purpose**: Provisions a new department coordinator.
- **Auth Required**: Yes (Super Admin)
- **Request Body**:
  ```json
  {
    "name": "Prof. Rao",
    "email": "rao@university.edu",
    "department": "Facilities & Infrastructure",
    "password": "Welcome@123"
  }
  ```
- **Response Data Used**: `{ "success": true, "admin": { ... } }`
- **Service Handler**: `adminService.createAdmin(adminData)`
- **Consumers**: `AdminManagement.jsx`

---

### 3.3 `PUT /api/admin/:adminId`
- **Purpose**: Updates email or department assignment of an admin.
- **Auth Required**: Yes (Super Admin)
- **Request Body**:
  ```json
  {
    "email": "updated.email@university.edu",
    "department": "IT & Technical Support"
  }
  ```
- **Response Data Used**: `{ "success": true }`
- **Service Handler**: `adminService.updateAdmin(adminId, data)`
- **Consumers**: `AdminManagement.jsx`

---

### 3.4 `DELETE /api/admin/:adminId`
- **Purpose**: Deletes an administrator account.
- **Auth Required**: Yes (Super Admin)
- **Response Data Used**: `{ "success": true, "message": "Admin deleted" }`
- **Service Handler**: `adminService.deleteAdmin(adminId)`
- **Consumers**: `AdminManagement.jsx`

---

## 4. Reports & Exports (`/api/reports`)

### 4.1 `GET /api/reports/download`
- **Purpose**: Generates and streams binary report files (`.xlsx` or `.pdf`).
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Query Parameters**:
  - `period`: `weekly | monthly | quarterly | annual`
  - `format`: `excel | pdf`
  - `department`: optional (e.g. `all` or specific department)
- **Response**: Binary Octet-Stream with `Content-Disposition: attachment; filename="report_....xlsx"`
- **Service Handler**: `reportService.downloadReport(params)`
- **Consumers**: `AdminReports.jsx`, `SuperAdminReports.jsx`
