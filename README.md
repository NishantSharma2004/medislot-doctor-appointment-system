# MediSlot — Doctor Appointment Management System

MediSlot is a production-grade full-stack Doctor Appointment Management System built with a **Java 21 / Spring Boot 3** Modular Monolith backend and a **React 18 / Vite / TanStack Router** frontend (originally generated via Lovable).

---

## Architecture Overview

```
User Browser
    │
    ▼
Vercel Frontend (React 18 + Vite + TanStack Router)
    │
    │ HTTPS REST API Requests (JWT Bearer Auth)
    ▼
Railway Backend (Spring Boot 3.4.1 / Java 21)
    │
    ├── Spring Security (Stateless JWT Filter & Token Rotation)
    ├── Bucket4j Rate Limiting Interceptor (In-Memory Token Bucket)
    ├── AI Provider Router (Groq Primary ➔ Gemini Fallback)
    ├── Audit Logger (Isolated REQUIRES_NEW Transactions)
    └── Notification Logger (Masked Emails)
    │
    │ Railway Private Connection
    ▼
Railway PostgreSQL 18 (Flyway Migrations V1-V6, Full-Text Search tsvector)
```

---

## Key Features

- **Authentication & Security**: JWT access token issuance (24h), refresh token rotation (7d), BCrypt password hashing, SHA-256 hashed password reset tokens.
- **Doctor Directory & Filtering**: Multi-criteria search (specialization, city, consultation fee range, minimum experience).
- **Doctor Availability Scheduling**: Single and bulk recurring slot creation with PostgreSQL `btree_gist` exclusion constraints preventing slot overlaps.
- **High-Concurrency Appointment Engine**: Slot booking with JPA `PESSIMISTIC_WRITE` locks and `@Version` optimistic locking preventing double-booking race conditions.
- **Clinic AI Assistant (RAG)**: Full-Text Search grounded knowledge retrieval from clinic documents with LLM provider failover (Groq Llama-3.3-70b ➔ Gemini 1.5 Flash), emergency medical pre-checks, prompt injection protection, and medical disclaimer enforcement.
- **User Profile Management**: Profile update, MIME-validated avatar image uploads (`image/jpeg`, `image/png`, `image/webp`, max 2MB), password change, and password reset flow.
- **Admin Analytics & Operations**: Overview of total patients, doctors, appointment status metrics, AI provider usage breakdown, audit logs, and document administration.
- **Doctor Dashboard**: Today's appointments, pending/completed metrics, and slot occupancy statistics.

---

## Technology Stack

- **Backend**: Java 21, Spring Boot 3.4.1, Spring Security 6, Spring Data JPA, Hibernate, Bucket4j, Flyway, JJWT, Maven.
- **Frontend**: React 18, Vite 5, TanStack Router, TanStack Query, TailwindCSS, Axios.
- **Database**: PostgreSQL 18 (with `citext`, `btree_gist`, and `tsvector` extensions).
- **Deployment**: Vercel (Frontend SPA), Railway (Spring Boot Backend Docker Container + PostgreSQL 18).

---

## Local Development & Setup

### Prerequisites
- Java JDK 21
- Maven 3.9+
- Node.js 20+ & npm
- PostgreSQL 18

### 1. Database Setup
Create local database:
```sql
CREATE DATABASE medislot_db;
```

### 2. Backend Setup
Copy environment file:
```bash
cp .env.example Backend/.env
```
Run backend tests and start server:
```bash
cd Backend
mvn clean test
mvn spring-boot:run
```

### 3. Frontend Setup
Install dependencies and run development server:
```bash
cd Frontend
npm ci
npm run dev
```

---

## Local Docker Setup
Run the entire application stack locally using Docker Compose:
```bash
docker compose config
docker compose up --build -d
```
Access backend health check at: `http://localhost:8080/actuator/health`

---

## Vercel & Railway Free Demo Deployment

- **Vercel Frontend Configuration**:
  - Root Directory: `Frontend`
  - Output Directory: `.output/public`
  - Build Command: `npm run build`
  - Environment Variable: `VITE_API_BASE_URL=https://<your-railway-backend-domain>`
- **Railway Backend Configuration**:
  - Deploy using `Backend/Dockerfile`.
  - Set `SPRING_PROFILES_ACTIVE=prod`.
  - Configure `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `GROQ_API_KEY`, `GEMINI_API_KEY`, `CORS_ALLOWED_ORIGINS`.

---

## Demonstrational Limitations & Demo Modes

- **Free Demo File Storage**: Profile avatars and document uploads are handled with strict MIME/size checks. In free containerized demo environments, extracted clinic document text and metadata persist in PostgreSQL while uploaded binaries are stored temporarily.
- **Email Demo Mode**: SMTP notification is disabled by default (`MAIL_ENABLED=false`) for demo safety. Email notifications are safely logged with masked recipient addresses (e.g. `p***8@medislot.com`).

---

## Medical Disclaimer

The MediSlot Clinic AI Assistant provides administrative information regarding clinic hours, appointment booking policies, and visit preparation based on official clinic documents. It **does not diagnose medical conditions, recommend treatments, or prescribe medications**. Emergency medical conditions are immediately flagged with instructions to seek immediate urgent care.

---

## License

This project is open-source and available under the MIT License.
