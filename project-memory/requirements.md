# requirements.md — API Requirements & Route Contracts

This document outlines the REST API requirements, payloads, and response structures for the Bhaktivedanta Hospital backend.

---

## 1. CORS & Middleware Requirements
- The server must allow requests from the React SPA origin (default `http://localhost:5173`).
- Request payloads must be accepted as application/json.
- Errors must return a structured JSON response instead of HTML traces.

---

## 2. API Endpoint Contracts

### A. Heartbeat check
- **Endpoint**: `GET /api/health`
- **Response**: `{ status: "success", message: "...", timestamp: "..." }`

### B. Doctors API
- **GET** `/api/doctors`: Fetch list of all doctors.
- **POST** `/api/doctors`: Add a new doctor (id is auto-generated).
  - Body: `{ name, qualifications, department, subSpeciality, experience, availability, featured, status, image }`
- **PUT** `/api/doctors/:id`: Update existing doctor.
- **DELETE** `/api/doctors/:id`: Delete a doctor profile.

### C. Appointments API
- **GET** `/api/appointments`: Fetch list of bookings.
- **POST** `/api/appointments`: Create a patient appointment booking.
  - Body: `{ patientName, patientPhone, doctorName, department, dateTime, payment, status }`
- **PUT** `/api/appointments/:id`: Update appointment status, payment, details.
- **DELETE** `/api/appointments/:id`: Cancel/Delete booking.

### D. Specialities State API
- **GET** `/api/specialities-state`: Fetch categories and specialities config structure.
- **PUT** `/api/specialities-state`: Save modified categories and specialities.
  - Body: Complete categories and specialities JSON object.

### E. Events API
- **GET** `/api/events`
- **POST** `/api/events`
- **PUT** `/api/events/:id`
- **DELETE** `/api/events/:id`

### F. Testimonials API
- **GET** `/api/testimonials`
- **POST** `/api/testimonials`
- **PUT** `/api/testimonials/:id`
- **DELETE** `/api/testimonials/:id`

### G. News API
- **GET** `/api/news`
- **POST** `/api/news`
- **PUT** `/api/news/:id`
- **DELETE** `/api/news/:id`

### H. Gallery API
- **GET** `/api/gallery`
- **POST** `/api/gallery`
- **PUT** `/api/gallery/:id`
- **DELETE** `/api/gallery/:id`

### I. Queries API
- **GET** `/api/queries`
- **POST** `/api/queries`
- **PUT** `/api/queries/:id`
- **DELETE** `/api/queries/:id`

### J. Subadmins API
- **GET** `/api/subadmins`
- **POST** `/api/subadmins`
- **PUT** `/api/subadmins/:username`
- **DELETE** `/api/subadmins/:username`
