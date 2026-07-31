# MediSlot Deployment Guide

## Architecture Summary
- **Frontend**: React + Vite (deploy on Vercel)
- **Backend**: Spring Boot Java 21 (deploy on Railway via Dockerfile)
- **Database**: Railway PostgreSQL 18 (same Railway project)

---

## 1. Deploying Backend to Railway
1. Create a new project in Railway.
2. Add a **PostgreSQL** database service to the project.
3. Deploy the backend from GitHub pointing to the `Backend` directory using `Backend/Dockerfile`.
4. Add Environment Variables in Railway Service Settings:
   - `SPRING_PROFILES_ACTIVE=prod`
   - `DB_URL=${{Postgres.DATABASE_URL}}`
   - `DB_USERNAME=${{Postgres.PGUSER}}`
   - `DB_PASSWORD=${{Postgres.PGPASSWORD}}`
   - `JWT_SECRET=<your-generated-256bit-base64-secret>`
   - `GROQ_API_KEY=<your-groq-api-key>`
   - `GEMINI_API_KEY=<your-gemini-api-key>`
   - `CORS_ALLOWED_ORIGINS=https://<your-app-name>.vercel.app`
5. Railway will automatically inject the `PORT` variable and execute health checks on `/actuator/health`.

---

## 2. Deploying Frontend to Vercel
1. Import the repository in Vercel.
2. Select Root Directory: `Frontend`.
3. Build Settings:
   - Build Command: `npm run build`
   - Output Directory: `.output/public`
   - Install Command: `npm ci`
4. Add Environment Variable:
   - `VITE_API_BASE_URL=https://<your-railway-backend-domain>.up.railway.app`
5. Deploy. SPA rewrites in `vercel.json` ensure direct route refresh works cleanly.
