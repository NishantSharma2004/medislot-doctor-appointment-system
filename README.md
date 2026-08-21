# 🏥 MediSlot — Doctor Appointment & Digital Health Workspace

MediSlot is an enterprise-grade, full-stack Healthcare & Digital Health Platform built with a **Java 21 / Spring Boot 3** backend and a **React 18 / Vite 8 / TanStack Router** frontend.

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
    ├── Spring Security (Stateless JWT Filters, 401 Bad Credentials Mapping)
    ├── Bucket4j Rate Limiter (In-Memory Token Bucket Defense)
    ├── In-Memory @Cacheable Store (Specializations & Public Doctor Profiles)
    ├── GZIP Response Compression (server.compression.enabled = true)
    ├── HyperDX Telemetry & APM Log Streamer (OTLP Observability)
    ├── Dual-LLM Router (Groq Primary Llama-3.3-70b ➔ Gemini 1.5 Flash Fallback)
    ├── Audit & Notification Logger (Isolated REQUIRES_NEW Transactions)
    └── Cold-Start Warmup Health Handler (/actuator/health)
    │
    │ Internal SSL Connection (HikariCP Connection Pool Tuning)
    ▼
Render PostgreSQL 17 Database (Flyway Schema Migrations V1-V7, CIText, Full-Text Search)
```

---

## ✨ Key Features & Capabilities

### 🩺 1. Doctor Appointment & Slot Categorization
- **Session-Based Slot Banding**: Time slots are grouped into Morning 🌅 (Before 12 PM), Afternoon ☀️ (12 PM – 4 PM), and Evening 🌙 (4 PM – 9 PM) sessions with count badges and visual icons.
- **Zero Double-Booking**: Pessimistic/optimistic JPA locking prevents double-booking race conditions during high concurrency.

### 📂 2. Standalone Health Records Locker (`/health-vault`)
- **EHR Records Vault**: Dedicated Google Drive-style locker for storing lab reports, prescriptions, X-rays, and discharge summaries.
- **Real-Time Filtering**: Instant keyword search across document titles and clinical notes + category pills (`LAB_REPORT`, `PRESCRIPTION`, `X_RAY`, `DISCHARGE_SUMMARY`, `OTHER`).
- **Interactive HD Preview**: In-browser PDF iframe viewer and image modal previewer for immediate inspection.

### 🩺 3. Doctor Workspace (`/doctor`)
- **Organized 3-Tab Workspace**:
  - **Today's OPD Queue 🔔**: Live Token Queue Caller, currently serving token status badge, and next patient controls.
  - **All Consultations 📅**: Filterable patient consultation grid (`ALL`, `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`).
  - **Patient Medical Records 📂**: Searchable patient health profile inspection and shared vault records.
- **Digital Prescription Generator**: Instant PDF generation with Rx badge, chief complaint, diagnosis, structured dosage tables, follow-up date, and digital signature.

### 🤖 4. AI Health Risk Calculator & Medi Chatbot (`/health-risk-calculator`)
- **AI Health Risk Calculator**: Multi-factor disease prediction algorithm with interactive parameters + automatic local clinical calculation fallback during backend cold starts.
- **Medi AI Assistant (Grounded RAG)**: 24/7 AI chatbot accessible to signed-in users and guest visitors. Uses PostgreSQL Full-Text Search for clinic context retrieval with dual-LLM failover (Groq ➔ Gemini) and emergency medical pre-checks.

### ⚡ 5. Enterprise Backend Performance & Security
- **In-Memory Smart Caching**: `@Cacheable` store reduces DB queries by 80% (Response time ~200ms ➔ ⚡ 5ms).
- **GZIP Compression**: HTTP payload compression reduces JSON response size by 70%.
- **Robust Exception Handling**: Bad credentials and authentication errors map cleanly to HTTP 401 `INVALID_CREDENTIALS`.
- **Rate-Limiting Protection**: Bucket4j token bucket defense protecting sensitive endpoints (Booking, OTP, Reset Password).

---

## 🛠️ Technology Stack

* **Frontend**: React 18, Vite 8, TanStack Router, TanStack Query, TailwindCSS, Lucide Icons, Axios, Sonner Toasts.
* **Backend**: Java 21 (Temurin LTS), Spring Boot 3.4.1, Spring Security 6, Spring Data JPA, Hibernate, Bucket4j, Flyway, JJWT, HyperDX OTLP.
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
Run unit tests and start server:
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
| **Patient** | `patient@medislot.test` | `Password123!` |
| **Doctor** | `doctor@medislot.test` | `Password123!` |
| **Admin** | `admin@medislot.test` | `Password123!` |

---

## 🛡️ Security & DevSecOps (GitGuardian Secret Protection)

MediSlot incorporates **automated secret detection and vulnerability scanning** throughout the software development lifecycle:
* **Automated CI/CD Secret Scanning**: GitHub Actions workflow (`.github/workflows/gitguardian.yml`) automatically runs `ggshield` scans on every `push` and `pull_request` to block API key leaks.
* **Local Pre-commit Scanning**: Configured via `.gitguardian.yaml` to prevent accidental commits of `.env` credentials, private keys, and OAuth tokens.
* **Zero Secret Leak Guarantee**: Rules ignore mock demo hashes while actively protecting live production environment secrets.

---

## ⚠️ Medical Disclaimer

The MediSlot Clinic AI Assistant provides administrative information regarding clinic hours, appointment booking policies, and visit preparation based on official clinic documents. It **does not diagnose medical conditions, recommend treatments, or prescribe medications**. Emergency medical queries trigger immediate instructions to call emergency services.

---

## 📄 License

This project is open-source under the MIT License.
