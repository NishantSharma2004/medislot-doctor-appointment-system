# MediSlot Testing Documentation

## Automated Tests
- **Backend Unit & Integration Tests**:
  ```bash
  cd Backend
  mvn clean test
  ```
  Runs 101 automated tests covering Flyway migrations V1–V6, Hibernate schema validation, JWT auth, concurrency locks, AI RAG vector search, rate limiting, and profile management.

- **Frontend Production Build Test**:
  ```bash
  cd Frontend
  npm ci
  npm run build
  ```
