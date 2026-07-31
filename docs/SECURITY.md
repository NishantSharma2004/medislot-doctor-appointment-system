# MediSlot Security Policy & Hardening

## Security Hardening Features
1. **Stateless JWT Security**: Access tokens (24h) and single-use refresh token rotation (7d).
2. **Password Security**: BCrypt password hashing. SHA-256 token hashing for password reset.
3. **Rate Limiting**: Bucket4j rate limiting on login, registration, password reset, profile updates, and document uploads.
4. **Audit Logging**: Isolated `REQUIRES_NEW` transactions capturing user actions with PostgreSQL `jsonb` metadata.
5. **AI Safety**: Medical emergency pre-checks, prompt injection filters, and sensitive data redaction before external API calls.
6. **File Upload Hardening**: Strict MIME type validation (`image/jpeg`, `image/png`, `image/webp`), max 2MB size limit, UUID filename sanitization preventing path traversal.

## Generating JWT Secret Command
To generate a secure 256-bit Base64 JWT secret:
```bash
openssl rand -base64 32
```
