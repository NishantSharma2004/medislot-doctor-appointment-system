-- V11: Force reset demo account credentials to Password123! with guaranteed BCrypt hash
UPDATE users
SET password_hash = '$2a$10$X76oPu8pgkbvngIdnKJ9TuBExXHFYm9M54AuQPmQLe8IGbtWydo4u',
    enabled = TRUE,
    updated_at = NOW()
WHERE email IN ('doctor@medislot.test', 'patient@medislot.test');

-- Guarantee Doctor demo account existence
INSERT INTO users (id, email, password_hash, full_name, phone, role, enabled, country_code, created_at, updated_at) VALUES
('d1000001-0000-4000-8000-000000000099', 'doctor@medislot.test', '$2a$10$X76oPu8pgkbvngIdnKJ9TuBExXHFYm9M54AuQPmQLe8IGbtWydo4u', 'Dr. Rajesh Sharma', '+919876500099', 'DOCTOR', TRUE, '+91', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, enabled = TRUE;

INSERT INTO doctor_profiles (user_id, qualifications, years_of_experience, consultation_fee, clinic_name, city, languages, about, registration_number, active, created_at, updated_at) VALUES
(
  'd1000001-0000-4000-8000-000000000099',
  'MBBS, MD (General Medicine)', 15, 500.00, 'MediSlot Care Clinic', 'Delhi', '["English", "Hindi"]'::jsonb,
  'Senior Physician available for online consultations and clinic appointments on MediSlot.',
  'REG-DEMO-999', TRUE, NOW(), NOW()
)
ON CONFLICT (user_id) DO NOTHING;

-- Guarantee Patient demo account existence
INSERT INTO users (id, email, password_hash, full_name, phone, role, enabled, country_code, created_at, updated_at) VALUES
('e1000001-0000-4000-8000-000000000001', 'patient@medislot.test', '$2a$10$X76oPu8pgkbvngIdnKJ9TuBExXHFYm9M54AuQPmQLe8IGbtWydo4u', 'Demo Patient', '+919876500001', 'PATIENT', TRUE, '+91', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, enabled = TRUE;

INSERT INTO patient_profiles (user_id, date_of_birth, gender, city, created_at, updated_at) VALUES
('e1000001-0000-4000-8000-000000000001', '1995-05-15', 'MALE', 'Delhi', NOW(), NOW())
ON CONFLICT (user_id) DO NOTHING;
