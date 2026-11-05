# MedSupply: Local Blood & Urgent Medical Equipment Exchange

[![MERN Stack](https://img.shields.io/badge/Stack-MongoDB%20%7C%20Express%20%7C%20React%20%7C%20Node-emerald.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%203.4-blue.svg)](https://tailwindcss.com/)
[![Geospatial](https://img.shields.io/badge/MongoDB-2dsphere%20Geospatial-green.svg)](https://www.mongodb.com/)
[![WhatsApp Hook](https://img.shields.io/badge/Integration-WhatsApp%20Deep%20Hooks-25D366.svg)](https://wa.me/)
[![Academic Capstone](https://img.shields.io/badge/Project-Class%20Training%20Capstone-amber.svg)](#3-member-workload-split)

> A localized healthcare emergency platform connecting urgent blood donors, diagnostic centers, and patients seeking home-care medical rentals (oxygen concentrators, wheelchairs, CPAP/BiPAP machines) across Vijayawada, Guntur, and neighboring districts.

---

## 📌 The Problem
Finding immediate emergency blood donors or temporary home-care medical equipment during acute crises is chaotic, slow, and scattered across unverified messaging groups. Messages lack verification, vital clinical context (hospital ward, required blood units, doctor contacts) is omitted, and equipment returns are never tracked.

## 🚀 The MedSupply Solution
1. **Live Emergency SOS Feed:** Real-time verified broadcast requests with pulsating badges for critical cases (< 2 hours), hospital verification stamps, and 1-click WhatsApp deep-link action hooks (`wa.me`).
2. **Blood Donor Directory & Cooldown Tracker:** Geospatial & compound-indexed donor directory with automated **90-day cooldown calculation** to protect donor health.
3. **Medical Equipment Rental Exchange:** Transparent listing of oxygen concentrators, wheelchairs, CPAP/BiPAP units, and hospital beds with rental terms, refundable deposits, and free loans for underprivileged families.
4. **User & Diagnostic Dashboard:** Live tracker for active equipment loans, expected return date countdowns, and one-click **"Mark Returned"** status toggles.

---

## 👥 3-Member Workload Split (Evaluation Rubric)

This project has been architected with a strict, verifiable division of engineering responsibilities:

| Team Member | Engineering Focus | Core Responsibilities & Deliverables |
|---|---|---|
| **Member 1** | **Backend & APIs** | • Express RESTful routes (`/api/donors`, `/api/equipment`, `/api/emergency`, `/api/auth`)<br>• MongoDB `2dsphere` geospatial indexing & compound indexes `{ bloodGroup: 1, isAvailable: 1, city: 1 }`<br>• JWT Authentication & Role-Based Access Control (`protect`, `authorize`)<br>• 90-Day Blood Donation Cooldown business logic |
| **Member 2** | **Frontend UI & UX** | • Responsive React 18 SPA built with Vite, Tailwind CSS, and Lucide icons<br>• Real-time styled Emergency Request Feed with visual urgency hierarchy<br>• Interactive modal forms for SOS broadcast, donor registration, and equipment listing<br>• One-click Status Toggle buttons (Donor Available/Resting, Equipment Available/Reserved)<br>• Active equipment return date tracker with "Mark Returned" workflow |
| **Member 3** | **Verification & Ops** | • External WhatsApp Web / Mobile deep link action hooks (`wa.me`) with pre-formatted SOS templates<br>• Automated WhatsApp broadcast simulation engine with delivery logs<br>• 25+ record database seed dataset (`backend/seed/seedData.js`)<br>• Zero-dependency resilient In-Memory Mock Store fallback for offline presentation<br>• Multi-stage Docker containerization (`docker-compose.yml`) & Postman Collection |

*See [`docs/MEMBER_WORKLOAD_SPLIT.md`](docs/MEMBER_WORKLOAD_SPLIT.md) for full academic breakdown and viva defense pointers.*

---

## 🛠️ Technology Stack

- **Client:** React 18, Vite, Tailwind CSS, Lucide React Icons.
- **Server:** Node.js, Express.js REST API, JSON Web Tokens (JWT), BcryptJS.
- **Database:** MongoDB & Mongoose (with `2dsphere` geospatial and compound indexes).
- **Resiliency:** Embedded In-Memory Data Engine fallback (runs out of the box even without local MongoDB installed).
- **Communication:** WhatsApp Web Action Hooks, Meta WhatsApp Cloud API / Twilio simulator.
- **DevOps:** Docker, Docker Compose, Nginx multi-stage build.

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js (v18+ or v20+)
- npm (v9+)
- *(Optional)* MongoDB or Docker (not required; project includes an automatic in-memory mock store fallback!)

### Option A: Run Locally (Recommended for Development)

1. **Clone the repository:**
   ```bash
   git clone <repo_url>
   cd Med_Supply
   ```

2. **Install backend & frontend dependencies:**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   cd ..
   ```

3. **Start the Backend Server (Port 5000):**
   ```bash
   cd backend
   node server.js
   ```
   *Terminal will show:*
   ```text
   =======================================================
   🚀 MedSupply Backend Server running on port 5000
   🌐 Base URL: http://localhost:5000
   🩺 Mode: development
   💾 DB Engine: In-Memory Mock Store (Resilient Demo Mode)
   =======================================================
   ```

4. **Start the Frontend Application (Port 5173):**
   *(In a new terminal window)*
   ```bash
   cd frontend
   npm run dev
   ```

5. **Open in your browser:**
   ```text
   http://localhost:5173
   ```

---

### Option B: Run with Docker Compose

Deploy the complete multi-tier application (MongoDB, Backend, Frontend) with a single command:
```bash
docker-compose up --build
```
- Frontend: `http://localhost`
- Backend API: `http://localhost:5000`
- MongoDB: `localhost:27017`

---

## 🔑 Fast Demo Accounts (1-Click Switcher Available in UI)

MedSupply includes pre-configured roles in the top navbar for immediate demonstration:

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **Emergency Requester** | `patient@medsupply.org` | `demo123` | Post emergency blood/equipment SOS |
| **Universal Blood Donor (O-)** | `donor@medsupply.org` | `demo123` | Toggle availability, update cooldown |
| **Equipment Provider / Center** | `equipment@medsupply.org` | `demo123` | List units, set terms, mark reserved/returned |
| **Hospital Emergency Desk** | `hospital@medsupply.org` | `demo123` | Issue verified medical stamps |

---

## 📡 REST API Summary

| Method | Endpoint | Description | Member Role |
|---|---|---|---|
| `POST` | `/api/auth/login` | User login & JWT issuance | Member 1 |
| `GET` | `/api/emergency` | Filter emergency feed by urgency & location | Member 1 & 2 |
| `POST` | `/api/emergency` | Post emergency request & dispatch broadcast | Member 1 & 3 |
| `PATCH` | `/api/emergency/:id/resolve` | Mark emergency request fulfilled | Member 1 & 2 |
| `GET` | `/api/donors` | Query donors with blood group & `$near` location | Member 1 |
| `PATCH` | `/api/donors/:id/toggle-availability` | Toggle donor availability (Available/Resting) | Member 1 & 2 |
| `GET` | `/api/donors/:id/eligibility` | Compute 90-day cooldown countdown | Member 1 |
| `GET` | `/api/equipment` | Browse equipment catalog & rental terms | Member 1 |
| `PATCH` | `/api/equipment/:id/status` | Mark equipment Reserved or Available | Member 1 & 2 |
| `GET` | `/api/dashboard` | Dashboard metrics & active equipment return dates | Member 1 & 2 |
| `PATCH` | `/api/dashboard/equipment/:id/return` | Mark rented equipment as returned | Member 1 & 2 |
| `POST` | `/api/notifications/test-dispatch` | Live test WhatsApp action hook gateway | Member 3 |

*Full endpoint schemas available in [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md).*

---

## 📂 Project Repository Structure

```text
Med_Supply/
├── backend/
│   ├── config/             # DB connection & environment constants
│   ├── controllers/        # Express route handlers
│   ├── data/               # In-memory mock store fallback engine
│   ├── middleware/         # Auth, validation, and error handlers
│   ├── models/             # Mongoose schemas (Donor, Equipment, Emergency, User)
│   ├── routes/             # RESTful API route declarations
│   ├── seed/               # Realistic seed script (25+ records)
│   ├── services/           # WhatsApp deep link & broadcast simulator
│   ├── Dockerfile          # Backend container
│   ├── package.json        # Backend dependencies
│   └── server.js           # Server entrypoint
├── frontend/
│   ├── src/
│   │   ├── components/     # Cards, badges, modals, filter bars, navbar
│   │   ├── context/        # Auth & user state context
│   │   ├── pages/          # Home, Emergency, Donors, Equipment, Dashboard, Workload
│   │   ├── services/       # API communication client
│   │   ├── App.jsx         # Root router & modal manager
│   │   └── index.css       # Tailwind directives
│   ├── Dockerfile          # Nginx production container
│   ├── package.json        # Frontend dependencies
│   ├── tailwind.config.js  # Color palette & custom animations
│   └── vite.config.js      # Vite build configuration & API proxy
├── docs/
│   ├── MEMBER_WORKLOAD_SPLIT.md              # University evaluation rubric
│   ├── API_DOCUMENTATION.md                  # REST API reference
│   ├── VIVA_DEFENSE_GUIDE.md                 # 25 External Examiner Viva Q&As
│   └── MedSupply_API.postman_collection.json # Importable Postman collection
├── docker-compose.yml      # Multi-tier container orchestration
└── README.md               # Main project documentation
```

---

## 🎓 University Viva Presentation Pointers

When presenting this project to professors or external evaluators:
1. **Highlight the High-Impact Problem:** Explain why standard social messaging groups fail during acute blood and oxygen emergencies.
2. **Demonstrate the Workload Tab:** Click on **"Team Workload Split"** in the navigation bar to present Member 1, Member 2, and Member 3's contributions directly on screen.
3. **Execute Live Action Hooks:** Click **"WhatsApp SOS Action"** on any emergency card to show the pre-formatted, verified WhatsApp deep link.
4. **Showcase Resiliency:** Explain the dual-mode database manager (`backend/config/db.js`) that automatically ensures 100% demo uptime.

---

## 📄 License
This project is developed for educational and training purposes under the **MIT License**.
