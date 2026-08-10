-- V8: Seed canonical demo accounts for quick 1-click testing (doctor@medislot.test and patient@medislot.test)

-- 1. Create Patient Demo Account (password: Password123!)
INSERT INTO users (id, email, password_hash, full_name, phone, role, enabled, country_code, created_at, updated_at) VALUES
('e1000001-0000-4000-8000-000000000001', 'patient@medislot.test', '$2a$10$eD4t0Zg7t1hQ1S5g3c2uEu/uN9Xq9J5v/5W/z6pW.4z3K1v5u7Y6W', 'Demo Patient', '+919876500001', 'PATIENT', TRUE, '+91', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO patient_profiles (user_id, date_of_birth, gender, city, created_at, updated_at) VALUES
('e1000001-0000-4000-8000-000000000001', '1995-05-15', 'MALE', 'Delhi', NOW(), NOW())
ON CONFLICT (user_id) DO NOTHING;

-- 2. Create Doctor Demo Account (password: Password123!)
INSERT INTO users (id, email, password_hash, full_name, phone, role, enabled, country_code, created_at, updated_at) VALUES
('d1000001-0000-4000-8000-000000000099', 'doctor@medislot.test', '$2a$10$eD4t0Zg7t1hQ1S5g3c2uEu/uN9Xq9J5v/5W/z6pW.4z3K1v5u7Y6W', 'Dr. Rajesh Sharma', '+919876500099', 'DOCTOR', TRUE, '+91', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO doctor_profiles (user_id, specialization_id, qualifications, years_of_experience, consultation_fee, clinic_name, city, languages, about, registration_number, active, created_at, updated_at) VALUES
(
  'd1000001-0000-4000-8000-000000000099',
  COALESCE((SELECT id FROM specializations WHERE LOWER(name) LIKE '%general%' OR LOWER(name) LIKE '%physician%' LIMIT 1), (SELECT id FROM specializations LIMIT 1)),
  'MBBS, MD (General Medicine)', 15, 500.00, 'MediSlot Care Clinic', 'Delhi', '["English", "Hindi"]'::jsonb,
  'Senior Physician available for online consultations and clinic appointments on MediSlot.',
  'REG-DEMO-999', TRUE, NOW(), NOW()
)
ON CONFLICT (user_id) DO NOTHING;

-- Seed future slots for demo doctor
INSERT INTO availability_slots (id, doctor_id, slot_date, start_time, end_time, slot_start_at, slot_end_at, status, created_at, updated_at) VALUES
(gen_random_uuid(), 'd1000001-0000-4000-8000-000000000099', CURRENT_DATE, '10:00:00', '10:30:00', CURRENT_DATE + TIME '10:00:00', CURRENT_DATE + TIME '10:30:00', 'AVAILABLE', NOW(), NOW()),
(gen_random_uuid(), 'd1000001-0000-4000-8000-000000000099', CURRENT_DATE + INTERVAL '1 day', '11:00:00', '11:30:00', CURRENT_DATE + INTERVAL '1 day' + TIME '11:00:00', CURRENT_DATE + INTERVAL '1 day' + TIME '11:30:00', 'AVAILABLE', NOW(), NOW())
ON CONFLICT DO NOTHING;
