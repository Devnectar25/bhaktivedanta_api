# SKILL.md — Backend Development & Run Guidelines

This document provides guidelines, environment setup commands, and coding standards for developing and running the Bhaktivedanta Hospital backend.

---

## 1. Local Environment Setup

### Install Dependencies
Run the following command in the `bhaktivedanta-api` directory to download npm packages:
```powershell
npm install
```

### Run Server in Development Mode
To start the backend with automatic hot-reloading (via `nodemon`):
```powershell
npm run dev
```

### Run Server in Production Mode
To run the server without hot-reloading:
```powershell
npm start
```

---

## 2. API Testing Commands
You can run a quick check on the server using curl/Invoke-RestMethod in PowerShell.

### A. Health Heartbeat Check
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get
```

### B. List Doctors
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/doctors" -Method Get
```

### C. Create a Doctor
```powershell
$body = @{
  name = "Dr. test"
  qualifications = "MBBS"
  department = "Cardiology"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/doctors" -Method Post -Body $body -ContentType "application/json"
```

---

## 3. Code Conventions
1. **ES Modules Syntax**: Always use standard ES Modules (`import`/`export`) instead of CommonJS (`require`).
2. **Error Isolation**: Always wrap async route operations in try/catch blocks or pass exceptions to `next(err)`.
3. **Storage Mutability**: Always read the fresh dataset array using `readData`, apply adjustments, and save it using `writeData`.
