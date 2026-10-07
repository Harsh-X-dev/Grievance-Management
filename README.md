# Grievance.io 2.0

Full-stack University Student Grievance Redressal System built with a React 18 frontend and an Express / MongoDB backend.

---

## 📁 Project Structure

```text
grievence_2.0/
├── backend/                  # RESTful API (Express + MongoDB)
│   ├── src/                  # Controllers, models, routes, middleware, seed script
│   ├── server.js             # Server entry point (port 5000)
│   └── package.json
└── frontend/                 # Client Application (React 18 + Vite + Tailwind CSS)
    ├── src/                  # React components, pages, services, context
    ├── index.html
    └── package.json
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS
- **Backend**: Node.js, Express 5, MongoDB (Mongoose 9), JWT, Multer, Nodemailer, ExcelJS, PDFKit
- **Database**: MongoDB (local or Atlas)

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js** v18+ 
- **MongoDB** running locally on `localhost:27017` (or MongoDB Atlas URI)

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# (Optional) Configure environment variables in .env
# Defaults: PORT=5000, MONGO_URI=mongodb://127.0.0.1:27017/grievancedb

# Seed demo users and grievance cases
npm run seed

# Start backend server (runs on http://localhost:5000)
npm run dev
```

---

### 3. Frontend Setup

Open a second terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server (runs on http://localhost:5173)
npm run dev
```

---

## 🔑 Demo Accounts

Use these credentials after running `npm run seed`:

| Role | Email | Password | Access |
|---|---|---|---|
| **Super Admin** | `super@demo.com` | `demo123` | Full institution oversight, admin management, global reports |
| **Academic Admin** | `admin.academic@demo.com` | `demo123` | Academic department grievances & resolutions |
| **Admin (General)** | `admin.admin@demo.com` | `demo123` | Administrative department grievances |
| **Facilities Admin**| `admin.facilities@demo.com` | `demo123` | Facilities & hostel complaints |
| **IT Admin** | `admin.it@demo.com` | `demo123` | IT & technical issues |
| **Welfare Admin** | `admin.welfare@demo.com` | `demo123` | Student welfare grievances |
| **Student** | `arjun@demo.com` | `demo123` | Submit complaints, live messaging, case tracking |

---

## 🌐 API Overview

Base URL: `http://localhost:5000/api`

| Group | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | `POST` | `/auth/register` | Register student |
| | `POST` | `/auth/login` | Login & receive JWT |
| | `GET` | `/auth/me` | Fetch active user profile |
| **Cases** | `GET` | `/cases` | List cases (scoped by role) |
| | `POST` | `/cases` | File a new grievance (with file uploads) |
| | `GET` | `/cases/:id` | Case details & thread history |
| | `POST` | `/cases/:id/messages` | Post message / attachment to case thread |
| | `PUT` | `/cases/:id/status` | Update case status (`In Progress`, `Resolved`, etc.) |
| | `PUT` | `/cases/:id/escalate` | Escalate case to higher tier |
| **Admin** | `GET` | `/admin/users` | List staff/admins (SuperAdmin) |
| | `POST` | `/admin/users` | Create staff account (SuperAdmin) |
| **Reports** | `GET` | `/reports/download` | Export Excel / PDF report |

---

## 📜 Key Commands

| Directory | Command | Action |
|---|---|---|
| `backend/` | `npm run dev` | Start backend with hot reload |
| `backend/` | `npm run seed` | Populate database with sample data |
| `frontend/` | `npm run dev` | Start Vite dev server |
| `frontend/` | `npm run build` | Build production bundle |
