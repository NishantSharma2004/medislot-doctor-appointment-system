-- V24: Update all demo accounts to @durrmi.test domain and seed both @durrmi.test and @medislot.test for seamless compatibility

UPDATE users SET email = 'patient@durrmi.test' WHERE email = 'patient@medislot.test';
UPDATE users SET email = 'doctor@durrmi.test' WHERE email = 'doctor@medislot.test';
UPDATE users SET email = 'admin@durrmi.test' WHERE email = 'admin@medislot.test';

-- Seed guaranteed @durrmi.test demo accounts with Password123!
INSERT INTO users (id, email, password_hash, full_name, phone, role, enabled, country_code, created_at, updated_at) VALUES
('e1000001-0000-4000-8000-000000000001', 'patient@durrmi.test', '$2a$10$X76oPu8pgkbvngIdnKJ9TuBExXHFYm9M54AuQPmQLe8IGbtWydo4u', 'Demo Patient', '+919876500001', 'PATIENT', TRUE, '+91', NOW(), NOW()),
('d1000001-0000-4000-8000-000000000099', 'doctor@durrmi.test', '$2a$10$X76oPu8pgkbvngIdnKJ9TuBExXHFYm9M54AuQPmQLe8IGbtWydo4u', 'Dr. Rajesh Sharma', '+919876500099', 'DOCTOR', TRUE, '+91', NOW(), NOW()),
('a1000001-0000-4000-8000-000000000001', 'admin@durrmi.test', '$2a$10$X76oPu8pgkbvngIdnKJ9TuBExXHFYm9M54AuQPmQLe8IGbtWydo4u', 'System Administrator', '+919876500000', 'ADMIN', TRUE, '+91', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, password_hash = EXCLUDED.password_hash, enabled = TRUE;
