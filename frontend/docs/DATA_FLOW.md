# Data Flow Specification — Grievance.io 2.0

## 1. General Data Flow Pattern

All user interactions and data mutations follow a unidirectional, predictable lifecycle:

```text
User Interaction (Click, Submit, Input)
       │
       ▼
React Component / Page View
       │
       ▼
Local Hook / Context Dispatcher
       │
       ▼
Domain Service (`*.service.js`)
       │
       ▼
API Client (`api.js`)
       │  (Injects Authorization: Bearer JWT & Base URL)
       ▼
Backend Express / MongoDB Server
       │
       ▼
HTTP Response (JSON or Binary Blob)
       │
       ▼
Promise Resolution / Error Interception
       │
       ▼
State Update (Context or `useState`)
       │
       ▼
Declarative React Re-render & User Feedback (Toast / Modal)
```

---

## 2. Concrete Workflow Traces

### 2.1 Authentication & Login Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant AuthPage as AuthPage.jsx
    participant AuthContext as AuthContext.jsx
    participant AuthService as auth.service.js
    participant API as api.js
    participant Backend as Express Backend
    participant Storage as localStorage/sessionStorage

    User->>AuthPage: Submits email, password, rememberMe
    AuthPage->>AuthContext: login(email, password, rememberMe)
    AuthContext->>AuthService: login(email, password, rememberMe)
    AuthService->>API: request("POST", "/auth/login", { email, password })
    API->>Backend: POST /api/auth/login
    Backend-->>API: 200 OK { success: true, token, user }
    API->>Storage: saveSession(user, token, persist)
    API-->>AuthService: Return result
    AuthService-->>AuthContext: Update user & token state
    AuthContext-->>AuthPage: Success response
    AuthPage->>User: Navigate to Role Dashboard (/student, /admin, /superadmin)
```

1. **User Action**: The user inputs credentials and chooses whether to check "Remember me".
2. **Form Handler**: `AuthPage.jsx` validates input presence and triggers `login()` from `useAuth()`.
3. **Service Layer**: `authService.login()` prepares JSON payload.
4. **Client Layer**: `API.request()` executes HTTP `POST /api/auth/login`.
5. **Storage Persistence**:
   - If `rememberMe === true`: Writes to `localStorage` under `grievance_session`.
   - If `rememberMe === false`: Writes to `sessionStorage` under `grievance_session`.
6. **State & Redirection**: `AuthContext` updates its `user` and `token` states; `AuthPage` redirects to the appropriate dashboard matching `user.role`.

---

### 2.2 Student Grievance Filing (Multipart FormData)

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Page as StudentNewGrievance.jsx
    participant CaseService as case.service.js
    participant API as api.js
    participant Backend as Express Backend

    Student->>Page: Fills Category, Subject, Description, Attachments
    Student->>Page: Clicks "Submit Grievance"
    Page->>Page: Builds FormData with multipart files
    Page->>CaseService: fileGrievance(formData)
    CaseService->>API: request("POST", "/cases", formData, isFormData=true)
    API->>API: Injects Bearer JWT; omits manual Content-Type (browser sets boundary)
    API->>Backend: POST /api/cases
    Backend-->>API: 201 Created { success: true, case: { caseId: "G-1025", ... } }
    API-->>CaseService: Case record
    CaseService-->>Page: Success response
    Page->>Student: Toast: "Grievance Filed!" & Navigate to /student/cases/G-1025
```

---

### 2.3 Real-Time Case Messaging Flow

```mermaid
sequenceDiagram
    autonumber
    actor Participant as Student / Coordinator
    participant DetailPage as CaseDetail.jsx
    participant ChatInput as ChatInput.jsx
    participant CaseService as case.service.js
    participant API as api.js
    participant Backend as Express Backend

    Participant->>ChatInput: Types message text & clicks Send
    ChatInput->>DetailPage: onSend(text)
    DetailPage->>CaseService: sendMessage(caseId, text, isInternal=false)
    CaseService->>API: request("POST", `/cases/${caseId}/message`, { text, isInternal })
    API->>Backend: POST /api/cases/:caseId/message
    Backend-->>API: 200 OK { success: true }
    API-->>DetailPage: Success
    DetailPage->>CaseService: getCaseById(caseId)
    CaseService->>Backend: GET /api/cases/:caseId
    Backend-->>CaseService: Updated case with appended message in thread
    CaseService-->>DetailPage: Updated case state
    DetailPage->>DetailPage: Re-renders ChatThread & scrolls to bottom
```

---

### 2.4 Admin Status Transition Flow

```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant DetailPage as AdminCaseDetail.jsx
    participant Modal as StatusModal.jsx
    participant CaseService as case.service.js
    participant Backend as Express Backend

    Admin->>DetailPage: Clicks "Change Status"
    DetailPage->>Modal: Opens with allowed transitions (e.g., Pending -> In Progress)
    Admin->>Modal: Selects new status & inputs mandatory remark
    Modal->>DetailPage: onConfirm(newStatus, remark)
    DetailPage->>CaseService: changeStatus(caseId, newStatus, remark)
    CaseService->>Backend: PUT /api/cases/:caseId/status { status, remark }
    Backend-->>CaseService: 200 OK { success: true }
    CaseService-->>DetailPage: Success
    DetailPage->>DetailPage: Re-fetches case dossier
    DetailPage->>Admin: Toast: Status Updated to "In Progress"
```

---

### 2.5 Super Admin Coordinator Management Flow

```mermaid
sequenceDiagram
    autonumber
    actor SuperAdmin
    participant MgmtPage as AdminManagement.jsx
    participant Modal as AddAdminModal.jsx
    participant AdminService as admin.service.js
    participant Backend as Express Backend

    SuperAdmin->>MgmtPage: Clicks "+ Add New Admin"
    MgmtPage->>Modal: Opens modal form
    SuperAdmin->>Modal: Fills Name, Email, Department, Password
    Modal->>MgmtPage: onConfirm(adminData)
    MgmtPage->>AdminService: createAdmin(adminData)
    AdminService->>Backend: POST /api/admin/create adminData
    Backend-->>AdminService: 201 Created { success: true, admin }
    AdminService-->>MgmtPage: Success
    MgmtPage->>AdminService: getAdmins()
    AdminService->>Backend: GET /api/admin/list
    Backend-->>MgmtPage: Updated list of coordinators
    MgmtPage->>SuperAdmin: Toast: Admin Created & grid card re-renders
```

---

### 2.6 Binary Report Export & Blob Download

```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant ReportPage as Reports.jsx
    participant ReportService as report.service.js
    participant API as api.js
    participant Backend as Express Backend
    participant Browser as Browser DOM

    Admin->>ReportPage: Selects period (monthly) and format (excel/pdf)
    Admin->>ReportPage: Clicks "Download Report"
    ReportPage->>ReportService: downloadReport({ period, format })
    ReportService->>API: getToken()
    ReportService->>Backend: fetch(`${BASE_URL}/reports/download?period=monthly&format=excel`, headers)
    Backend-->>ReportService: HTTP 200 (Binary Octet-Stream with Content-Disposition header)
    ReportService->>ReportService: res.blob()
    ReportService->>ReportService: Parses filename from Content-Disposition header
    ReportService->>Browser: URL.createObjectURL(blob)
    ReportService->>Browser: Creates temporary <a> element, sets href & download attribute, clicks <a>
    ReportService->>Browser: Cleans up DOM element and revokes Object URL
    ReportService-->>ReportPage: { success: true, filename }
    ReportPage->>Admin: Toast: "Report downloaded successfully."
```
