<div align="center">

# 🌐 SmartHire Client — Modern AI-Powered ATS & Recruitment Dashboard

**High-performance, responsive React web client for SmartHire Applicant Tracking System (ATS), featuring toggleable sidebars, AI match scoring meters, candidate pipeline boards, and enterprise profile management.**

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-4.5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Lucide Icons](https://img.shields.io/badge/Icons-Lucide_React-F56565?style=for-the-badge&logo=feather)](https://lucide.dev)
[![Recharts](https://img.shields.io/badge/Charts-Recharts-22c55e?style=for-the-badge)](https://recharts.org)
[![Axios](https://img.shields.io/badge/HTTP-Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>

---

## 📌 Platform Overview

**SmartHire Client** provides a modern, intuitive single-page interface engineered for talent acquisition leaders, hiring managers, and prospective candidates. Designed from real-world recruitment workflows, it provides instantaneous visibility into hiring pipelines, interactive candidate evaluation, scheduled interviews, and granular conversion telemetry.

---

## 🎯 Key Interface Features

### 📑 1. Interactive ATS Recruitment Dashboard
- **Application Status Matrix:** Color-coded KPI cards displaying applications across stages (*Applications Received, Shortlisted, Interview Scheduled, Offer Extended, Hired, Rejected*).
- **Jobs Overview Table:** Vacancy status overview with real-time applicant counters, department indicators, and deadline tracking.
- **Pending Requests Panel:** Sticky actionable approval panel for team job requisition reviews.
- **Upcoming Interviews Widget:** Live calendar agenda featuring candidate meeting links, interviewers, and time countdowns.

### 🎛️ 2. Dynamic Collapsible & Toggleable Sidebar
- **Full ATS Navigation Suite:** 1-click access to Dashboard, Applications, Jobs, Talent Pool, Interviews, Analytics Reports, and Settings.
- **Toggle Mechanism:** Hamburger menu button in the top navbar and close button in the sidebar header for instant Show/Hide.
- **Adaptive Grid Layout:** Main content workspace and top navigation expand to 100% width when collapsed and adjust to fixed drawer margins when visible.
- **Persistent State:** Saves user layout preferences to `localStorage` across page refreshes.

### 👤 3. World-Class Enterprise Profile Suite
- **Profile Photo Upload:** Direct image upload with real-time client preview, drag & drop, file validation (< 5MB), and removal options.
- **Multi-Tenant Profile Management:** Tabbed architecture covering Personal Details, Security & Password rotation, and Candidate CV Management.
- **Real-Time Synchronized Avatars:** Uploaded avatar instantly cascades across top Navbar, Sidebar status cards, and Profile views.

### 🧠 4. AI Candidate Matching & Pipeline Management
- **Visual AI Fit Score:** Color-coded gradient meters (0–100%) indicating technical match against job requirements.
- **Drag-and-Drop Resume Ingestion:** Automated PDF resume upload powered by `react-dropzone` with instant parsing progress.
- **Interactive Talent Pool:** Instant search, skills filtering, and candidate profile evaluation.

### 📈 5. Visual Analytics & Hiring Telemetry
- Interactive visualizations powered by **Recharts**:
  - Application velocity timeline trends
  - Department candidate distribution donut charts
  - Recruitment funnel conversion telemetry

---

## 📁 Component Architecture

```
src/
├── api/                  # Axios configuration & modular API client endpoints
│   ├── axios.js          # Base instance with JWT bearer interceptors
│   ├── auth.js           # Login, registration, profile & password APIs
│   ├── jobs.js           # Vacancy queries, creations & department stats
│   ├── candidates.js     # Applications, candidate profiles & CV upload
│   ├── interviews.js     # Interview schedule, calendar & agenda
│   └── dashboard.js      # Consolidated dashboard aggregate metrics
├── components/
│   ├── layout/           # Sidebar (toggleable), Navbar, Layout, SubNav
│   ├── dashboard/        # Status cards, Jobs overview, Interviews, Requests
│   ├── jobs/             # Job cards, vacancy lists, creation forms & details
│   ├── candidates/       # Candidate cards, resume dropzone, profile drawer
│   ├── interviews/       # Schedule interview modal, upcoming list & cards
│   ├── auth/             # Sign-in & Sign-up forms with validation
│   └── common/           # Button, Card, Input, Modal, Badge, Table, Loader
├── context/              # AuthContext & persistent state provider
├── hooks/                # useAuth, useFetch custom hooks
├── pages/                # Route page components (Dashboard, Jobs, Applications, Profile...)
├── utils/                # Helpers, date formatters, and route constants
├── App.jsx               # React Router v6 setup with ProtectedRoute guards
└── main.jsx              # DOM root entrypoint
```

---

## ⚙️ Quick Start

### 1. Prerequisites
- Node.js 18+
- npm or pnpm
- Running [SmartHire API](https://github.com/aminur167/smarthire-api) instance on port 8000

### 2. Installation
```bash
git clone https://github.com/aminur167/smarthire-client.git
cd smarthire-client
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).

---

<div align="center">
Made with ❤️ by <a href="https://github.com/aminur167">Aminur Rahman</a>
</div>
