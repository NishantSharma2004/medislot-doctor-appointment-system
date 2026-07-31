-- V7: Seed diverse doctors and future availability slots across multiple specializations & cities

-- 1. Ensure Specializations exist
INSERT INTO specializations (id, name, description, active) VALUES
('a1000001-0000-4000-8000-000000000001', 'General Physician', 'Primary care and routine health consultations', TRUE),
('a1000001-0000-4000-8000-000000000002', 'Cardiology', 'Heart and cardiovascular system', TRUE),
('a1000001-0000-4000-8000-000000000003', 'Dermatology', 'Skin, hair, and nail conditions', TRUE),
('a1000001-0000-4000-8000-000000000004', 'Orthopedics', 'Bones, joints, and musculoskeletal system', TRUE),
('a1000001-0000-4000-8000-000000000005', 'Pediatrics', 'Medical care for infants and children', TRUE),
('a1000001-0000-4000-8000-000000000007', 'ENT', 'Ear, nose, and throat disorders', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 2. Create User Accounts for Doctors (password: Password123!)
INSERT INTO users (id, email, password_hash, full_name, phone, role, enabled, country_code, created_at, updated_at) VALUES
('d1000001-0000-4000-8000-000000000001', 'dr.sharma@medislot.com', '$2a$10$eD4t0Zg7t1hQ1S5g3c2uEu/uN9Xq9J5v/5W/z6pW.4z3K1v5u7Y6W', 'Dr. Rajesh Sharma', '+919876543210', 'DOCTOR', TRUE, '+91', NOW(), NOW()),
('d1000001-0000-4000-8000-000000000002', 'dr.ananya@medislot.com', '$2a$10$eD4t0Zg7t1hQ1S5g3c2uEu/uN9Xq9J5v/5W/z6pW.4z3K1v5u7Y6W', 'Dr. Ananya Roy', '+919876543211', 'DOCTOR', TRUE, '+91', NOW(), NOW()),
('d1000001-0000-4000-8000-000000000003', 'dr.vikram@medislot.com', '$2a$10$eD4t0Zg7t1hQ1S5g3c2uEu/uN9Xq9J5v/5W/z6pW.4z3K1v5u7Y6W', 'Dr. Vikram Patel', '+919876543212', 'DOCTOR', TRUE, '+91', NOW(), NOW()),
('d1000001-0000-4000-8000-000000000004', 'dr.priya@medislot.com', '$2a$10$eD4t0Zg7t1hQ1S5g3c2uEu/uN9Xq9J5v/5W/z6pW.4z3K1v5u7Y6W', 'Dr. Priya Nair', '+919876543213', 'DOCTOR', TRUE, '+91', NOW(), NOW()),
('d1000001-0000-4000-8000-000000000005', 'dr.amit@medislot.com', '$2a$10$eD4t0Zg7t1hQ1S5g3c2uEu/uN9Xq9J5v/5W/z6pW.4z3K1v5u7Y6W', 'Dr. Amit Verma', '+919876543214', 'DOCTOR', TRUE, '+91', NOW(), NOW()),
('d1000001-0000-4000-8000-000000000006', 'dr.sunita@medislot.com', '$2a$10$eD4t0Zg7t1hQ1S5g3c2uEu/uN9Xq9J5v/5W/z6pW.4z3K1v5u7Y6W', 'Dr. Sunita Kulkarni', '+919876543215', 'DOCTOR', TRUE, '+91', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- 3. Create Doctor Profiles using Dynamic Subqueries for Specialization IDs
INSERT INTO doctor_profiles (user_id, specialization_id, qualifications, years_of_experience, consultation_fee, clinic_name, city, languages, about, registration_number, active, created_at, updated_at) VALUES
(
  'd1000001-0000-4000-8000-000000000001',
  (SELECT id FROM specializations WHERE LOWER(name) LIKE '%general%' OR LOWER(name) LIKE '%physician%' LIMIT 1),
  'MBBS, MD (General Medicine)', 14, 500.00, 'Apollo Health Clinic', 'Delhi', '["English", "Hindi"]'::jsonb,
  'Experienced Senior Physician specializing in preventative medicine, diabetes care, and lifestyle health management.',
  'REG-DEL-101', TRUE, NOW(), NOW()
),
(
  'd1000001-0000-4000-8000-000000000002',
  (SELECT id FROM specializations WHERE LOWER(name) LIKE '%cardio%' LIMIT 1),
  'MBBS, DM (Cardiology)', 18, 800.00, 'HeartCare Specialist Center', 'Mumbai', '["English", "Hindi", "Bengali"]'::jsonb,
  'Interventional Cardiologist focused on coronary artery disease, heart failure prevention, and echocardiography.',
  'REG-MUM-202', TRUE, NOW(), NOW()
),
(
  'd1000001-0000-4000-8000-000000000003',
  (SELECT id FROM specializations WHERE LOWER(name) LIKE '%dermato%' LIMIT 1),
  'MBBS, MD (Dermatology)', 10, 600.00, 'Skin & Wellness Clinic', 'Bangalore', '["English", "Hindi", "Gujarati"]'::jsonb,
  'Cosmetic and Clinical Dermatologist specializing in acne treatment, laser therapies, and anti-aging care.',
  'REG-BLR-303', TRUE, NOW(), NOW()
),
(
  'd1000001-0000-4000-8000-000000000004',
  (SELECT id FROM specializations WHERE LOWER(name) LIKE '%ortho%' LIMIT 1),
  'MBBS, MS (Orthopedics)', 12, 700.00, 'OrthoJoint Bone Care', 'Pune', '["English", "Hindi", "Malayalam"]'::jsonb,
  'Orthopedic Specialist with expertise in joint replacement, sports injury rehab, and spine management.',
  'REG-PUN-404', TRUE, NOW(), NOW()
),
(
  'd1000001-0000-4000-8000-000000000005',
  (SELECT id FROM specializations WHERE LOWER(name) LIKE '%pedia%' LIMIT 1),
  'MBBS, DCH (Pediatrics)', 15, 450.00, 'Little Angels Children Clinic', 'Hyderabad', '["English", "Hindi", "Telugu"]'::jsonb,
  'Compassionate Pediatrician offering child growth tracking, newborn vaccination, and pediatric nutrition guidance.',
  'REG-HYD-505', TRUE, NOW(), NOW()
),
(
  'd1000001-0000-4000-8000-000000000006',
  (SELECT id FROM specializations WHERE LOWER(name) LIKE '%ent%' LIMIT 1),
  'MBBS, MS (ENT)', 11, 550.00, 'ENT & Hearing Care Center', 'Pune', '["English", "Hindi", "Marathi"]'::jsonb,
  'ENT Surgeon specializing in sinus surgery, hearing evaluations, allergic rhinitis, and throat care.',
  'REG-PUN-606', TRUE, NOW(), NOW()
)
ON CONFLICT (user_id) DO NOTHING;

-- 4. Seed Future Available Slots for Doctors
INSERT INTO availability_slots (id, doctor_id, slot_date, start_time, end_time, slot_start_at, slot_end_at, status, created_at, updated_at) VALUES
(gen_random_uuid(), 'd1000001-0000-4000-8000-000000000001', CURRENT_DATE, '09:00:00', '09:30:00', CURRENT_DATE + TIME '09:00:00', CURRENT_DATE + TIME '09:30:00', 'AVAILABLE', NOW(), NOW()),
(gen_random_uuid(), 'd1000001-0000-4000-8000-000000000001', CURRENT_DATE, '10:00:00', '10:30:00', CURRENT_DATE + TIME '10:00:00', CURRENT_DATE + TIME '10:30:00', 'AVAILABLE', NOW(), NOW()),
(gen_random_uuid(), 'd1000001-0000-4000-8000-000000000001', CURRENT_DATE + INTERVAL '1 day', '11:00:00', '11:30:00', CURRENT_DATE + INTERVAL '1 day' + TIME '11:00:00', CURRENT_DATE + INTERVAL '1 day' + TIME '11:30:00', 'AVAILABLE', NOW(), NOW()),
(gen_random_uuid(), 'd1000001-0000-4000-8000-000000000002', CURRENT_DATE, '11:00:00', '11:30:00', CURRENT_DATE + TIME '11:00:00', CURRENT_DATE + TIME '11:30:00', 'AVAILABLE', NOW(), NOW()),
(gen_random_uuid(), 'd1000001-0000-4000-8000-000000000002', CURRENT_DATE + INTERVAL '1 day', '15:00:00', '15:30:00', CURRENT_DATE + INTERVAL '1 day' + TIME '15:00:00', CURRENT_DATE + INTERVAL '1 day' + TIME '15:30:00', 'AVAILABLE', NOW(), NOW()),
(gen_random_uuid(), 'd1000001-0000-4000-8000-000000000003', CURRENT_DATE, '10:00:00', '10:30:00', CURRENT_DATE + TIME '10:00:00', CURRENT_DATE + TIME '10:30:00', 'AVAILABLE', NOW(), NOW()),
(gen_random_uuid(), 'd1000001-0000-4000-8000-000000000003', CURRENT_DATE + INTERVAL '1 day', '12:00:00', '12:30:00', CURRENT_DATE + INTERVAL '1 day' + TIME '12:00:00', CURRENT_DATE + INTERVAL '1 day' + TIME '12:30:00', 'AVAILABLE', NOW(), NOW()),
(gen_random_uuid(), 'd1000001-0000-4000-8000-000000000004', CURRENT_DATE, '09:30:00', '10:00:00', CURRENT_DATE + TIME '09:30:00', CURRENT_DATE + TIME '10:00:00', 'AVAILABLE', NOW(), NOW()),
(gen_random_uuid(), 'd1000001-0000-4000-8000-000000000005', CURRENT_DATE, '10:30:00', '11:00:00', CURRENT_DATE + TIME '10:30:00', CURRENT_DATE + TIME '11:00:00', 'AVAILABLE', NOW(), NOW()),
(gen_random_uuid(), 'd1000001-0000-4000-8000-000000000006', CURRENT_DATE, '11:30:00', '12:00:00', CURRENT_DATE + TIME '11:30:00', CURRENT_DATE + TIME '12:00:00', 'AVAILABLE', NOW(), NOW())
ON CONFLICT DO NOTHING;
