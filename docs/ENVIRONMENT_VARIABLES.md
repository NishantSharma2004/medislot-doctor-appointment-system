# MediSlot Environment Variables Inventory

| Variable Name | Platform | Required / Optional | Purpose | Example / Default |
|---|---|---|---|---|
| `VITE_API_BASE_URL` | Vercel (Frontend) | Required | Public backend REST API URL | `https://api.medislot.app` |
| `VITE_USE_MOCK_API` | Vercel (Frontend) | Optional | Toggle mock mode | `false` |
| `SPRING_PROFILES_ACTIVE` | Railway (Backend) | Required | Active Spring profile | `prod` |
| `PORT` | Railway (Backend) | Required | Server listening port | `8080` |
| `DB_URL` | Railway (Backend) | Required | PostgreSQL JDBC connection URL | `jdbc:postgresql://localhost:5432/medislot_db` |
| `DB_USERNAME` | Railway (Backend) | Required | Database username | `postgres` |
| `DB_PASSWORD` | Railway (Backend) | Required | Database password | `postgres` |
| `JWT_SECRET` | Railway (Backend) | Required | Base64 256-bit signing key | `<base64-secret>` |
| `GROQ_API_KEY` | Railway (Backend) | Optional | Primary AI LLM API key | `gsk_...` |
| `GEMINI_API_KEY` | Railway (Backend) | Optional | Fallback AI LLM API key | `AIza...` |
| `MAIL_ENABLED` | Railway (Backend) | Optional | Toggle SMTP email sending | `false` |
| `CORS_ALLOWED_ORIGINS` | Railway (Backend) | Required | Allowed CORS origins | `https://medislot.vercel.app` |
