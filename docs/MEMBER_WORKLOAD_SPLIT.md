# MedSupply — 3-Member Workload Split & Evaluation Rubric

> **Project Title:** MedSupply: Local Blood & Urgent Medical Equipment Exchange  
> **Course / Program:** Capstone Project / Full-Stack Web Development Training  
> **Architecture:** MERN Stack (MongoDB, Express.js, React 18, Node.js) with WhatsApp Action Hooks & Geospatial Indexing  

---

## Executive Summary of Workload Distribution

To satisfy modern academic standards of individual accountability and engineering rigor, the project responsibilities are formally divided among three members:

```
+---------------------------------------------------------------------------------------------------+
|                                      MEDSUPPLY ARCHITECTURE                                       |
+---------------------------------+---------------------------------+-------------------------------+
|     MEMBER 1: BACKEND & APIS     |      MEMBER 2: FRONTEND UI      |  MEMBER 3: VERIFICATION & OPS |
+---------------------------------+---------------------------------+-------------------------------+
| * Express.js REST Routes        | * React 18 Component Hierarchy  | * WhatsApp Action Hooks (wa.me)
| * Mongoose Schemas & Validation | * Responsive Tailwind CSS Theme | * Emergency Broadcast Engine  |
| * 2dsphere Geospatial Indexing  | * Live Emergency SOS Feed       | * 25+ Record Seed Script      |
| * Compound Query Optimizations  | * Availability Toggle Buttons   | * Resilient In-Memory Fallback|
| * JWT Auth & Role-Based Guard   | * Rental Reservation Workflow   | * Docker & Docker Compose     |
| * 90-Day Cooldown Calculator    | * Return Tracker Dashboard      | * Postman Collection & Docs   |
+---------------------------------+---------------------------------+-------------------------------+
```

---

## Member 1: Backend Engineering & Core APIs

### Primary Role & Objective
Member 1 designed and authored the server-side architecture, Mongoose data modeling, database indexing strategies, authentication layers, and business logic.

### Technical Deliverables & Key Files
1. **Express Server & Routing Architecture:**
   - [`backend/server.js`](file:///c:/Users/lenovo/OneDrive%20-%20Vignan%20University/My_Projects/Med_Supply/backend/server.js): Server bootstrap, middleware pipeline, CORS, Morgan logger, and centralized 404/500 handlers.
   - [`backend/routes/`](file:///c:/Users/lenovo/OneDrive%20-%20Vignan%20University/My_Projects/Med_Supply/backend/routes/): Modular routing for `authRoutes`, `donorRoutes`, `equipmentRoutes`, `emergencyRoutes`, and `dashboardRoutes`.

2. **MongoDB Schemas & Geospatial Modeling:**
   - [`backend/models/DonorProfile.js`](file:///c:/Users/lenovo/OneDrive%20-%20Vignan%20University/My_Projects/Med_Supply/backend/models/DonorProfile.js): GeoJSON point coordinates with `2dsphere` index, enabling `$near` geospatial radius searches.
   - [`backend/models/Equipment.js`](file:///c:/Users/lenovo/OneDrive%20-%20Vignan%20University/My_Projects/Med_Supply/backend/models/Equipment.js): Equipment catalog with category categorization, rental pricing, deposit constraints, and reservation status.
   - [`backend/models/EmergencyRequest.js`](file:///c:/Users/lenovo/OneDrive%20-%20Vignan%20University/My_Projects/Med_Supply/backend/models/EmergencyRequest.js): High-priority schema capturing urgency levels (`CRITICAL`, `HIGH`, `MODERATE`), patient condition, hospital name, and verification badges.
   - [`backend/models/DonationHistory.js`](file:///c:/Users/lenovo/OneDrive%20-%20Vignan%20University/My_Projects/Med_Supply/backend/models/DonationHistory.js): Historical donation tracking and equipment return logs.

3. **Authentication & Authorization Middleware:**
   - [`backend/middleware/auth.js`](file:///c:/Users/lenovo/OneDrive%20-%20Vignan%20University/My_Projects/Med_Supply/backend/middleware/auth.js): Bearer JWT token verification, role extraction, role guards (`authorize('hospital', 'admin')`), and non-blocking `optionalAuth` for public emergencies.

4. **Specialized Business Algorithms:**
   - **90-Day Blood Donation Cooldown Calculator:** Computes elapsed days since `lastDonationDate`, ensuring medical safety before allowing a donor to be marked as available.
   - **Geospatial Distance Queries:** Uses `$near` and `$maxDistance` in meters to prioritize donors within 15–50 km of the reporting hospital.

---

## Member 2: Frontend UI & Interactive UX

### Primary Role & Objective
Member 2 engineered the client-side single-page application (SPA), responsive layout, real-time-styled emergency cards, modal forms, and state management.

### Technical Deliverables & Key Files
1. **Component Hierarchy & Tailwind Design System:**
   - [`frontend/src/components/Navbar.jsx`](file:///c:/Users/lenovo/OneDrive%20-%20Vignan%20University/My_Projects/Med_Supply/frontend/src/components/Navbar.jsx): Sticky navigation bar with live emergency announcement banner, flashing pulse indicators, and 1-click demo role switchers.
   - [`frontend/src/components/EmergencyFeedCard.jsx`](file:///c:/Users/lenovo/OneDrive%20-%20Vignan%20University/My_Projects/Med_Supply/frontend/src/components/EmergencyFeedCard.jsx): Card component featuring urgency badges, time elapsed counter, verified hospital stamp, and action hooks.
   - [`frontend/src/components/DonorCard.jsx`](file:///c:/Users/lenovo/OneDrive%20-%20Vignan%20University/My_Projects/Med_Supply/frontend/src/components/DonorCard.jsx): Blood group badge, donor verification badge, and interactive availability toggle button.
   - [`frontend/src/components/EquipmentCard.jsx`](file:///c:/Users/lenovo/OneDrive%20-%20Vignan%20University/My_Projects/Med_Supply/frontend/src/components/EquipmentCard.jsx): Image presentation, daily rental rate vs. free emergency badge, and status switcher (`available` vs. `reserved`).

2. **Interactive Modal Dialogs & CRUD Workflows:**
   - [`frontend/src/components/EmergencyRequestModal.jsx`](file:///c:/Users/lenovo/OneDrive%20-%20Vignan%20University/My_Projects/Med_Supply/frontend/src/components/EmergencyRequestModal.jsx): Dynamic form allowing citizens or hospital staff to broadcast SOS requests with urgency level selection.
   - [`frontend/src/components/DonorRegisterModal.jsx`](file:///c:/Users/lenovo/OneDrive%20-%20Vignan%20University/My_Projects/Med_Supply/frontend/src/components/DonorRegisterModal.jsx): Donor registration with blood group selection and last donation date entry.
   - [`frontend/src/components/AddEquipmentModal.jsx`](file:///c:/Users/lenovo/OneDrive%20-%20Vignan%20University/My_Projects/Med_Supply/frontend/src/components/AddEquipmentModal.jsx): Equipment listing form with categories, security deposit, and free BPL waiver option.

3. **User Dashboard & Return Date Tracker:**
   - [`frontend/src/pages/DashboardPage.jsx`](file:///c:/Users/lenovo/OneDrive%20-%20Vignan%20University/My_Projects/Med_Supply/frontend/src/pages/DashboardPage.jsx): Tracks active equipment out on loan, computes return due dates, and provides a 1-click **"Mark Returned"** button that immediately updates the equipment back to available status.

---

## Member 3: Verification, External Integrations & Operations

### Primary Role & Objective
Member 3 implemented the external communication pipeline (WhatsApp/SMS action hooks and Meta Cloud API simulator), realistic seed dataset, high-resiliency offline database fallback, containerization, and technical documentation.

### Technical Deliverables & Key Files
1. **WhatsApp & SMS Gateway Action Hooks:**
   - [`backend/services/whatsappService.js`](file:///c:/Users/lenovo/OneDrive%20-%20Vignan%20University/My_Projects/Med_Supply/backend/services/whatsappService.js): Constructs structured `https://wa.me/` URLs with pre-filled, emoji-rich SOS text containing patient name, blood group, hospital location, and attendant phone.
   - [`frontend/src/components/WhatsAppModal.jsx`](file:///c:/Users/lenovo/OneDrive%20-%20Vignan%20University/My_Projects/Med_Supply/frontend/src/components/WhatsAppModal.jsx): User-facing preview modal displaying the exact WhatsApp template with 1-click launch to WhatsApp Web / Mobile app.
   - Broadcast simulation engine: Logs alerts dispatched to nearby matching donors whenever a critical emergency is posted.

2. **Realistic Seed Data Generation:**
   - [`backend/seed/seedData.js`](file:///c:/Users/lenovo/OneDrive%20-%20Vignan%20University/My_Projects/Med_Supply/backend/seed/seedData.js): Script populating 25+ realistic records covering Vijayawada, Guntur, Tenali, and Mangalagiri hospitals (GGH, Ramesh Hospitals, NRI, AIIMS).

3. **Resilient In-Memory Mock Store Fallback:**
   - [`backend/data/mockStore.js`](file:///c:/Users/lenovo/OneDrive%20-%20Vignan%20University/My_Projects/Med_Supply/backend/data/mockStore.js): Embedded data engine that seamlessly activates if MongoDB is not running locally. Ensures 100% demo reliability during college presentations with zero database downtime.

4. **DevOps & Containerization:**
   - [`docker-compose.yml`](file:///c:/Users/lenovo/OneDrive%20-%20Vignan%20University/My_Projects/Med_Supply/docker-compose.yml): Multi-container orchestration (MongoDB, Node backend, React/Nginx frontend).
   - Multi-stage [`frontend/Dockerfile`](file:///c:/Users/lenovo/OneDrive%20-%20Vignan%20University/My_Projects/Med_Supply/frontend/Dockerfile) and [`backend/Dockerfile`](file:///c:/Users/lenovo/OneDrive%20-%20Vignan%20University/My_Projects/Med_Supply/backend/Dockerfile).

5. **API Documentation & Postman Collection:**
   - [`docs/API_DOCUMENTATION.md`](file:///c:/Users/lenovo/OneDrive%20-%20Vignan%20University/My_Projects/Med_Supply/docs/API_DOCUMENTATION.md) and [`docs/MedSupply_API.postman_collection.json`](file:///c:/Users/lenovo/OneDrive%20-%20Vignan%20University/My_Projects/Med_Supply/docs/MedSupply_API.postman_collection.json).
