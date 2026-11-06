# 📊 MedSupply: PowerPoint Presentation Slides Deck & Viva Notes

> **Presentation File:** [`MedSupply_Project_Presentation.pptx`](../MedSupply_Project_Presentation.pptx)  
> **Course / Program:** Class Training Project / Academic Capstone 2026  
> **Repository:** [https://github.com/mohansaibolagani/Med_Supply](https://github.com/mohansaibolagani/Med_Supply)  
> **Live Web App:** [https://medsupply-web.onrender.com](https://medsupply-web.onrender.com)

---

## Slide 1: Project Title and Team Details
- **Project Title:** MedSupply: Local Blood & Urgent Medical Equipment Exchange
- **Category:** Academic Capstone Presentation • Class Training Project 2026
- **Tagline:** A Localized MERN Emergency Healthcare & Diagnostic Rental Platform
- **Team Workload Split:**
  - **Member 1 (Backend & APIs):** Mohan Sai Bolagani  
    *Responsibilities:* Express RESTful routes (`/api/emergency`, `/api/donors`, `/api/equipment`), MongoDB `2dsphere` geospatial indexing (`$near`), compound indexing `{ bloodGroup, isAvailable, city }`, JWT authentication and role-based access control.
  - **Member 2 (Frontend UI & UX):**  
    *Responsibilities:* React 18 Single-Page Application (SPA) with Vite, Tailwind CSS 3.4, live Emergency SOS Feed with pulsating urgency badges, interactive modal workflows, and status toggle buttons.
  - **Member 3 (Verification & Ops):**  
    *Responsibilities:* WhatsApp Web & Meta Cloud API deep action hooks (`wa.me`), broadcast simulator, 25+ database seed records with in-memory fallback engine, Render cloud deployment (`render.yaml`).

---

## Slide 2: Introduction and Problem Statement
- **The Healthcare Bottleneck:**
  - Emergency blood requests and post-ICU equipment searches are scattered across chaotic, unverified messaging groups.
  - 80%+ of forward requests lack vital clinical details (patient blood units, attending physician contact, hospital ward).
  - Delayed transfusions during the "Golden Hour" of trauma and surgeries cause preventable mortality.
  - Patients discharged from ICUs encounter steep rental friction and zero return date tracking for home-care medical equipment (oxygen concentrators, CPAPs).
- **The MedSupply Solution:**
  - A verified, district-level emergency exchange tailored for Vijayawada, Guntur, and neighboring clinical clusters.
  - Real-time donor discovery with automated 90-day cooldown enforcement to protect donor health.
  - Direct 1-click WhatsApp action hooks eliminating manual number transcription errors.

---

## Slide 3: Project Objectives
1. **Real-Time Emergency SOS Broadcast:** Sub-2-hour emergency blood requisition with real-time urgency classification (`CRITICAL < 2hrs` vs `URGENT < 6hrs`).
2. **Clinical Donor Safety Engine:** Automated calculation of 90-day donation rest periods to eliminate donor burnout.
3. **Medical Equipment Rental Exchange:** Transparent marketplace for oxygen concentrators, wheelchairs, and CPAPs with refundable deposits and free welfare loans.
4. **Instant WhatsApp Action Hooks:** Pre-populated clinical case summaries opened directly in WhatsApp (`wa.me`).
5. **Zero-Downtime Deployment & Resiliency:** Dual-engine architecture (MongoDB Atlas + In-Memory Mock Store fallback) deployed on Render.

---

## Slide 4: Technologies and Tools Used (MERN Stack)
- **Frontend Tier:**
  - React 18 (Component-driven Single Page Application)
  - Vite 6 (Lightning-fast HMR and build bundling)
  - Tailwind CSS 3.4 (Modern responsive utility design)
  - Lucide React (Accessible healthcare iconography)
  - HTML5 Geolocation API (Proximity calculations)
- **Backend API Tier:**
  - Node.js v24 (High-concurrency asynchronous runtime)
  - Express.js 4 (REST routing, middleware, error handling)
  - JSON Web Tokens (JWT) & BcryptJS (Secure stateless auth)
  - Morgan Logger & CORS (Cross-origin resource sharing)
- **Database Tier:**
  - MongoDB 7+ & Mongoose ODM (Document store)
  - `2dsphere` Geospatial Index (Spatial radius queries)
  - Compound Indexing: `{ bloodGroup: 1, isAvailable: 1, city: 1 }`
  - High-Fidelity In-Memory Store (Resilient offline fallback)
- **DevOps & Integrations:**
  - Render Cloud Platform (Blueprint `render.yaml` infrastructure)
  - WhatsApp Deep Action Hooks (`wa.me`)
  - Docker & Docker Compose (Containerization)
  - Git & GitHub (CI/CD integration)

---

## Slide 5: System Architecture and Workflow
- **3-Tier System Architecture:**
  1. *Client Tier:* React 18 SPA, Fullscreen Video Intro, Geolocation, Modal Forms.
  2. *API Gateway Tier:* Express.js, JWT Auth Guard, Dual Prefix Route Handler (`/api` and `/`).
  3. *Data & Service Tier:* MongoDB Atlas / Embedded Mock Store, Geospatial Engine, WhatsApp Gateway.
- **5-Step Emergency Request Workflow:**
  1. Attendant or Hospital posts emergency SOS request with clinical context.
  2. Backend performs compound geospatial query for eligible, un-cooldown donors.
  3. Emergency feed updates in real-time; alert broadcast simulated.
  4. Donors click 1-touch WhatsApp action hook with auto-populated message.
  5. Request marked fulfilled; donor records donation to trigger 90-day rest timer.

---

## Slide 6: Features and Functionalities
1. **Live Emergency Feed:** Urgency hierarchy (`CRITICAL`, `URGENT`, `STANDARD`), hospital verification stamps, real-time counters.
2. **Blood Donor Cooldown Tracker:** 90-day clinical rest calculation protecting donor health.
3. **Medical Equipment Rental Exchange:** Transparent daily rates, refundable security deposits, and Free Community Loan tier.
4. **1-Click WhatsApp Action Hooks:** Eliminates copy-paste errors with pre-formatted case templates.
5. **Attendant Dashboard & Active Return Tracker:** Live countdown for active rentals with one-click "Mark Returned" status toggle.
6. **Fullscreen Video Intro & Role Selector:** Engaging unmuted video briefing followed by Donor, Provider, or Patient persona selection.

---

## Slide 7: Database Design and API Integration
- **Entity Relationship & Schema Design:**
  - `User`: Name, email, hashed password, role (`donor`, `provider`, `patient`), phone, city, district.
  - `Donor`: Blood group, availability, last donation date, total donations, coordinates, verification badge.
  - `Equipment`: Category, daily rate, security deposit, reservation status, sanitized certification.
  - `EmergencyRequest`: Patient, hospital ward, required blood units, urgency level, active status.
- **RESTful Endpoints Table:**
  - `POST /api/auth/login` - Authenticate user & issue JWT
  - `GET /api/emergency` - Filter emergency requests by urgency, blood group & district
  - `POST /api/emergency` - Post new SOS & dispatch broadcast
  - `GET /api/donors` - Search eligible donors respecting 90-day cooldown
  - `PATCH /api/donors/:id/toggle` - Toggle donor availability status
  - `GET /api/equipment` - Browse medical rental inventory
  - `PATCH /api/dashboard/equipment/:id/return` - Mark rented item returned & release deposit

---

## Slide 8: Screenshots of the Project
- **Live Emergency Feed:** Pulsating critical case badges, required units, and 1-click WhatsApp modal buttons.
- **Blood Donor Directory:** Verified donors, blood group pills, and 90-day cooldown countdown timer.
- **Medical Equipment Exchange:** Oxygen concentrators, wheelchairs, and free community loan tiers.
- **Attendant Dashboard:** Active equipment rental return deadlines and donation history tracking.

---

## Slide 9: Challenges Faced and Future Scope
- **Engineering Challenges Solved:**
  - *Route Prefix Normalization:* Dual mounted `/api/*` and `/*` in Express to prevent Render proxy rewrites from dropping the `/api` prefix.
  - *Clinical Cooldown Integrity:* Enforced strict date mathematical validation preventing ineligible donor requests.
  - *Zero-Dependency Resilience:* Developed an embedded in-memory data store with pre-seeded data for offline grading.
  - *Audio Autoplay Compliance:* Designed an unmuted video briefing adhering to browser autoplay policies.
- **Future Roadmap:**
  - Integration with Government e-RaktKosh and Aadhaar verification APIs.
  - IoT GPS telemetry sensors on rented oxygen concentrators.
  - Autonomous drone delivery integration for urgent rural blood transport.
  - Multilingual voice support (Telugu, Hindi, English).

---

## Slide 10: Conclusion
- **Project Summary:** Centralizes chaotic, unverified community medical requests into a structured, localized, life-saving platform.
- **Academic & Engineering Value:** Robust MERN stack architecture with verifiable 3-member workload split, comprehensive test suites, and live cloud deployment.
- **Deliverables:**
  - Presentation PowerPoint: `MedSupply_Project_Presentation.pptx`
  - GitHub Repository: `https://github.com/mohansaibolagani/Med_Supply`
  - Live Render Application: `https://medsupply-web.onrender.com`
