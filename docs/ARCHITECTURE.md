# MediSlot System Architecture

## Overview
MediSlot is a production-style doctor appointment management platform built as a **Modular Monolith** with a Spring Boot Java 21 backend and a React 18 + Vite frontend.

```
User Browser
    │
    ▼
Vercel Frontend (React + Vite + TanStack Router)
    │
    │ HTTPS REST API calls (JWT Bearer Auth)
    ▼
Railway Backend (Spring Boot 3.4.1 / Java 21)
    │
    ├── Spring Security (Stateless JWT Filter)
    ├── Bucket4j Rate Limiting Interceptor
    ├── AI Provider Router (Groq Primary ➔ Gemini Fallback)
    ├── Audit Logger (Isolated REQUIRES_NEW Transactions)
    └── Notification Logger (Masked Emails)
    │
    │ Railway Private Connection
    ▼
Railway PostgreSQL 18 (Flyway Migrations V1-V6, Full-Text Search tsvector)
```

## Core Modules
1. **Auth & Security (`com.medislot.auth`)**: JWT access tokens (24h), refresh tokens (7d), single-use token rotation, SHA-256 password reset tokens.
2. **Doctor Directory (`com.medislot.doctor`, `com.medislot.specialization`)**: Dynamic multi-criteria search (city, specialization, max fee, min experience).
3. **Doctor Availability (`com.medislot.availability`)**: Slot scheduling with PostgreSQL `btree_gist` overlapping slot prevention.
4. **Appointment Engine (`com.medislot.appointment`)**: High-concurrency booking with JPA `PESSIMISTIC_WRITE` locks and optimistic versioning.
5. **Clinic AI Assistant (`com.medislot.assistant`)**: Grounded RAG assistant using PostgreSQL Full-Text Search ranking and failover LLM router (Groq Llama-3.3-70b ➔ Gemini 1.5 Flash).
6. **User Profile & Administration (`com.medislot.user`, `com.medislot.admin`, `com.medislot.audit`, `com.medislot.notification`)**: Profile management, avatar upload validation, admin metrics, isolated audit logging, email notification logging.
