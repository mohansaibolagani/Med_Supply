# MedSupply — REST API Reference Documentation

**Base URL:** `http://localhost:5000/api`  
**Authentication Scheme:** Bearer Token (JSON Web Token) in HTTP Header `Authorization: Bearer <TOKEN>`

---

## 1. Authentication Routes (`/auth`)

### `POST /auth/register`
Registers a new user account.

**Request Body:**
```json
{
  "name": "Dr. Suresh Varma",
  "email": "donor@medsupply.org",
  "password": "Password@123",
  "phone": "+91 98480 12345",
  "role": "donor",
  "city": "Vijayawada",
  "district": "NTR District",
  "verificationOrg": "GGH Vijayawada"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65b...",
    "name": "Dr. Suresh Varma",
    "email": "donor@medsupply.org",
    "role": "donor",
    "city": "Vijayawada",
    "district": "NTR District"
  }
}
```

### `POST /auth/login`
Authenticates existing credentials and returns a JWT.

**Request Body:**
```json
{
  "email": "donor@medsupply.org",
  "password": "demo123"
}
```

---

## 2. Emergency Feed Routes (`/emergency`)

### `GET /emergency`
Retrieves live emergency requests sorted by urgency (`CRITICAL` &lt; 2h first).

**Query Parameters:**
- `status`: `ACTIVE` | `FULFILLED` | `all`
- `urgencyLevel`: `CRITICAL` | `HIGH` | `MODERATE`
- `requestType`: `blood` | `equipment`
- `bloodGroup`: `O-` | `O+` | `A+` etc.
- `city`: `Vijayawada` | `Guntur`
- `district`: `NTR District` | `Guntur District`

**Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "dataSource": "MongoDB (Indexed)",
  "data": [
    {
      "_id": "em1",
      "requestType": "blood",
      "patientName": "K. Venkata Rao (Age 58)",
      "hospitalName": "Government General Hospital (GGH), Vijayawada",
      "bloodGroup": "O-",
      "unitsRequired": 2,
      "urgencyLevel": "CRITICAL",
      "requiredWithinHours": 2,
      "city": "Vijayawada",
      "district": "NTR District",
      "attendantName": "K. Sai Krishna",
      "attendantPhone": "+91 98481 99881",
      "whatsappNumber": "919848199881",
      "verificationStatus": "VERIFIED_HOSPITAL",
      "status": "ACTIVE"
    }
  ]
}
```

### `POST /emergency`
Publishes a new emergency SOS and automatically triggers WhatsApp broadcast simulation to matching nearby donors.

### `PATCH /emergency/:id/resolve`
Marks the request as fulfilled once donor/equipment is secured.

### `GET /emergency/:id/whatsapp-action`
Returns a ready-to-launch pre-formatted `https://wa.me/` action link.

---

## 3. Blood Donor Directory Routes (`/donors`)

### `GET /donors`
Queries donors with support for blood group filtering, district filtering, availability toggles, and geospatial coordinates `$near`.

**Query Parameters:**
- `bloodGroup`: Filter by group (e.g. `O-`)
- `city`: Filter by city
- `district`: Filter by district
- `isAvailable`: `true` | `false`
- `lng`, `lat`: Coordinates for `$near` geospatial lookup
- `maxKm`: Search radius in kilometers (default 50)

### `PATCH /donors/:id/toggle-availability`
Toggles a donor's status between `AVAILABLE` and `RESTING`.

### `GET /donors/:id/eligibility`
Calculates 90-day cooldown status:
```json
{
  "success": true,
  "isEligible": true,
  "daysSinceLastDonation": 95,
  "daysRemaining": 0,
  "nextEligibleDate": "2026-11-01",
  "message": "Eligible to donate. Cooldown period completed!"
}
```

---

## 4. Medical Equipment Routes (`/equipment`)

### `GET /equipment`
Lists available equipment with category, pricing, and availability filters.

### `PATCH /equipment/:id/status`
Updates equipment status (`available`, `reserved`, `rented`) and records borrower/return date.

### `GET /equipment/:id/whatsapp-link`
Generates equipment reservation WhatsApp inquiry hook.

---

## 5. Dashboard Routes (`/dashboard`)

### `GET /dashboard`
Aggregates user donation records, active equipment loans, and summary metrics.

### `PATCH /dashboard/equipment/:id/return`
Marks rented/reserved equipment as returned, immediately making it available for other patients.
