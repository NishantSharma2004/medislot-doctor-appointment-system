-- V12: Seed guaranteed Admin demo account (admin@medislot.test / Password123!)
INSERT INTO users (id, email, password_hash, full_name, phone, role, enabled, country_code, created_at, updated_at) VALUES
('a1000001-0000-4000-8000-000000000001', 'admin@medislot.test', '$2a$10$X76oPu8pgkbvngIdnKJ9TuBExXHFYm9M54AuQPmQLe8IGbtWydo4u', 'System Administrator', '+919876500000', 'ADMIN', TRUE, '+91', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, enabled = TRUE;
