# MediSlot Release Checklist

- [x] All 101 backend Maven unit & integration tests pass (`mvn clean test`).
- [x] Flyway migrations V1–V6 validate cleanly on PostgreSQL 18.
- [x] Hibernate `ddl-auto=validate` passes.
- [x] Frontend Vite production build succeeds (`npm run build`).
- [x] Docker multi-stage build verified (`docker compose build`).
- [x] Secrets removed from source code and `.gitignore` updated.
- [x] Health check readiness endpoint `/actuator/health/readiness` enabled.
- [x] Rate limiting configured via Bucket4j for auth and sensitive APIs.
- [x] Documentation & architecture files updated.
