# 🏥 MediSlot — Doctor Appointment & Clinic Management System

MediSlot is a production-grade, full-stack Healthcare & Clinic Workspace built with a **Java 21 / Spring Boot 3** backend and a **React 18 / Vite 8 / TanStack Router** frontend.

---

## 🌐 Live Production Links

* **Live Frontend (Vercel)**: [https://medislot-doctor-appointment-system.vercel.app](https://medislot-doctor-appointment-system.vercel.app)
* **Live Backend API (Render)**: [https://medislot-doctor-appointment-system.onrender.com](https://medislot-doctor-appointment-system.onrender.com)
* **Swagger API Documentation**: [https://medislot-doctor-appointment-system.onrender.com/swagger-ui.html](https://medislot-doctor-appointment-system.onrender.com/swagger-ui.html)
* **OpenAPI 3.0 Spec**: [https://medislot-doctor-appointment-system.onrender.com/v3/api-docs](https://medislot-doctor-appointment-system.onrender.com/v3/api-docs)

---

## 🏗️ System Architecture

```
User Browser / Mobile
    │
    ▼
Vercel Edge Network (React 18 + Vite 8 + TanStack Router + TailwindCSS)
    │
    │ HTTPS REST API Requests (JWT Bearer Auth & CORS Allowed Origins)
    ▼
Render Web Service (Docker Container: Spring Boot 3.4.1 / Java 21 LTS)
    │
    ├── Spring Security (Stateless JWT Filters & CORS Origin Patterns)
    ├── Bucket4j Rate Limiter (In-Memory Token Bucket Defense)
    ├── Dual-LLM Router (Groq Primary Llama-3.3-70b ➔ Gemini 1.5 Flash Fallback)
    ├── Audit & Notification Logger (Isolated REQUIRES_NEW Transactions)
    └── Cold-Start Warmup Health Handler (/actuator/health)
    │
    │ Internal SSL Connection
    ▼
Render PostgreSQL 17 Database (Flyway Schema Migrations V1-V7, CIText, Full-Text Search)
```

---

## ✨ Key Features & Capabilities

- **Multi-Role Workspaces**: Distinct dashboards tailored for `PATIENT`, `DOCTOR`, and `ADMIN`.
- **6-Digit OTP Password Reset**: Secure password recovery via 6-digit numeric OTP email with automated SMTP timeout safety fallback.
- **Medi AI Assistant (Grounded RAG)**: 24/7 AI chatbot accessible to both **signed-in users and guest visitors**. Uses PostgreSQL Full-Text Search for clinic context retrieval with dual-LLM failover (Groq ➔ Gemini) and emergency medical pre-checks.
- **Doctor Availability Scheduling**: Flexible single and recurring time slot creation with PostgreSQL exclusion constraints preventing slot overlaps.
- **Zero-Conflict Appointment Booking**: Pessimistic/optimistic JPA locking preventing double-booking race conditions during high concurrency.
- **Global Navigation & Back Button Support**: Smooth back-navigation throughout auth routes (`/login`, `/register`, `/forgot-password`, `/reset-password`) and application shells.
- **Automated Background Warmup**: Background ping automatically pre-warms Render free containers on frontend load.
- **Rate-Limiting Protection**: Bucket4j token bucket defense protecting sensitive endpoints (Booking, OTP, Reset Password).

---

## 🛠️ Technology Stack

* **Frontend**: React 18, Vite 8, TanStack Router, TanStack Query, TailwindCSS, Lucide Icons, Axios, Sonner Toasts.
* **Backend**: Java 21 (Temurin LTS), Spring Boot 3.4.1, Spring Security 6, Spring Data JPA, Hibernate, Bucket4j, Flyway, JJWT.
* **Database**: PostgreSQL 17 (with `citext`, `btree_gist`, and `tsvector` full-text search extensions).
* **AI Layer**: Groq Cloud (`llama-3.3-70b-versatile`) with automatic fallback to Google Gemini (`gemini-1.5-flash`).
* **Deployment & CI/CD**: Vercel (Frontend SPA), Render (Dockerized Backend + Managed PostgreSQL 17), GitHub Actions CI.

---

## 💻 Local Development Setup

### Prerequisites
- Java JDK 21
- Maven 3.9+
- Node.js 20+ & npm
- PostgreSQL 17

### 1. Database Setup
Create local database:
```sql
CREATE DATABASE medislot_db;
```

### 2. Backend Setup
Copy environment file and run tests:
```bash
cd Backend
mvn clean test
mvn spring-boot:run
```

### 3. Frontend Setup
Install dependencies and run dev server:
```bash
cd Frontend
npm install
npm run dev
```

---

## 🔑 Demo Test Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Patient** | `patient@medislot.test` | `password123` |
| **Doctor** | `doctor@medislot.test` | `password123` |
| **Admin** | `admin@medislot.test` | `password123` |

---

## ⚠️ Medical Disclaimer

The MediSlot Clinic AI Assistant provides administrative information regarding clinic hours, appointment booking policies, and visit preparation based on official clinic documents. It **does not diagnose medical conditions, recommend treatments, or prescribe medications**. Emergency medical queries trigger immediate instructions to call emergency services.

---

## 📄 License

This project is open-source under the MIT License.
