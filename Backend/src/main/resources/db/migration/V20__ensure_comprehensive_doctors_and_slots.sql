-- V20: Comprehensive seeding of all specializations, demo patients, doctors, and abundant future availability slots

-- 1. Ensure all standard Medical Specializations exist
INSERT INTO specializations (id, name, description, active) VALUES
('a1000001-0000-4000-8000-000000000001', 'General Physician', 'Primary care and routine health consultations', TRUE),
('a1000001-0000-4000-8000-000000000002', 'Cardiology', 'Heart and cardiovascular system care', TRUE),
('a1000001-0000-4000-8000-000000000003', 'Dermatology', 'Skin, hair, and nail conditions', TRUE),
('a1000001-0000-4000-8000-000000000004', 'Orthopedics', 'Bones, joints, and musculoskeletal system', TRUE),
('a1000001-0000-4000-8000-000000000005', 'Pediatrics', 'Medical care for infants and children', TRUE),
('a1000001-0000-4000-8000-000000000007', 'ENT', 'Ear, nose, and throat disorders', TRUE),
('a1000001-0000-4000-8000-000000000008', 'Neurology', 'Brain, nerve, and spinal cord care', TRUE),
('a1000001-0000-4000-8000-000000000009', 'Gynecology', 'Womens health and reproductive medicine', TRUE),
('a1000001-0000-4000-8000-000000000010', 'Ophthalmology', 'Eye care and vision surgery', TRUE),
('a1000001-0000-4000-8000-000000000011', 'Psychiatry', 'Mental health and behavioral wellness', TRUE),
('a1000001-0000-4000-8000-000000000012', 'Gastroenterology', 'Digestive system and liver health', TRUE)
ON CONFLICT (id) DO UPDATE SET active = TRUE;

-- 2. Seed All Demo Patient Accounts (password: Password123!)
-- BCrypt Hash: $2a$10$X76oPu8pgkbvngIdnKJ9TuBExXHFYm9M54AuQPmQLe8IGbtWydo4u (Password123!)
INSERT INTO users (id, email, password_hash, full_name, phone, role, enabled, country_code, created_at, updated_at) VALUES
('e1000001-0000-4000-8000-000000000001', 'patient@medislot.com', '$2a$10$X76oPu8pgkbvngIdnKJ9TuBExXHFYm9M54AuQPmQLe8IGbtWydo4u', 'Demo Patient', '+919876500001', 'PATIENT', TRUE, '+91', NOW(), NOW()),
('e1000001-0000-4000-8000-000000000002', 'nishantsharma78779@gmail.com', '$2a$10$X76oPu8pgkbvngIdnKJ9TuBExXHFYm9M54AuQPmQLe8IGbtWydo4u', 'Nishant Sharma', '+919876578899', 'PATIENT', TRUE, '+91', NOW(), NOW()),
('e1000001-0000-4000-8000-000000000003', 'nishantbansiya@gmail.com', '$2a$10$X76oPu8pgkbvngIdnKJ9TuBExXHFYm9M54AuQPmQLe8IGbtWydo4u', 'Nishant Bansiya', '+919876543210', 'PATIENT', TRUE, '+91', NOW(), NOW()),
('e1000001-0000-4000-8000-000000000004', 'manojsharma0371@gmail.com', '$2a$10$X76oPu8pgkbvngIdnKJ9TuBExXHFYm9M54AuQPmQLe8IGbtWydo4u', 'Manoj Sharma', '+919876503710', 'PATIENT', TRUE, '+91', NOW(), NOW()),
('e1000001-0000-4000-8000-000000000005', 'manisha@medislot.com', '$2a$10$X76oPu8pgkbvngIdnKJ9TuBExXHFYm9M54AuQPmQLe8IGbtWydo4u', 'Manisha Sharma', '+919876500005', 'PATIENT', TRUE, '+91', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, enabled = TRUE;

INSERT INTO patient_profiles (user_id, date_of_birth, gender, city, created_at, updated_at) VALUES
('e1000001-0000-4000-8000-000000000001', '1995-05-15', 'MALE', 'Delhi', NOW(), NOW()),
('e1000001-0000-4000-8000-000000000002', '2004-01-01', 'MALE', 'Delhi', NOW(), NOW()),
('e1000001-0000-4000-8000-000000000003', '2004-01-01', 'MALE', 'Delhi', NOW(), NOW()),
('e1000001-0000-4000-8000-000000000004', '1992-03-10', 'MALE', 'Mumbai', NOW(), NOW()),
('e1000001-0000-4000-8000-000000000005', '1998-08-20', 'FEMALE', 'Bangalore', NOW(), NOW())
ON CONFLICT (user_id) DO NOTHING;

-- 3. Seed Doctors for ALL Specializations (password: Password123!)
INSERT INTO users (id, email, password_hash, full_name, phone, role, enabled, country_code, created_at, updated_at) VALUES
('d1000001-0000-4000-8000-000000000001', 'dr.sharma@medislot.com', '$2a$10$X76oPu8pgkbvngIdnKJ9TuBExXHFYm9M54AuQPmQLe8IGbtWydo4u', 'Dr. Rajesh Sharma', '+919876543210', 'DOCTOR', TRUE, '+91', NOW(), NOW()),
('d1000001-0000-4000-8000-000000000002', 'dr.ananya@medislot.com', '$2a$10$X76oPu8pgkbvngIdnKJ9TuBExXHFYm9M54AuQPmQLe8IGbtWydo4u', 'Dr. Ananya Roy', '+919876543211', 'DOCTOR', TRUE, '+91', NOW(), NOW()),
('d1000001-0000-4000-8000-000000000003', 'dr.vikram@medislot.com', '$2a$10$X76oPu8pgkbvngIdnKJ9TuBExXHFYm9M54AuQPmQLe8IGbtWydo4u', 'Dr. Vikram Patel', '+919876543212', 'DOCTOR', TRUE, '+91', NOW(), NOW()),
('d1000001-0000-4000-8000-000000000004', 'dr.priya@medislot.com', '$2a$10$X76oPu8pgkbvngIdnKJ9TuBExXHFYm9M54AuQPmQLe8IGbtWydo4u', 'Dr. Priya Nair', '+919876543213', 'DOCTOR', TRUE, '+91', NOW(), NOW()),
('d1000001-0000-4000-8000-000000000005', 'dr.amit@medislot.com', '$2a$10$X76oPu8pgkbvngIdnKJ9TuBExXHFYm9M54AuQPmQLe8IGbtWydo4u', 'Dr. Amit Verma', '+919876543214', 'DOCTOR', TRUE, '+91', NOW(), NOW()),
('d1000001-0000-4000-8000-000000000006', 'dr.sunita@medislot.com', '$2a$10$X76oPu8pgkbvngIdnKJ9TuBExXHFYm9M54AuQPmQLe8IGbtWydo4u', 'Dr. Sunita Kulkarni', '+919876543215', 'DOCTOR', TRUE, '+91', NOW(), NOW()),
('d1000001-0000-4000-8000-000000000007', 'dr.alok@medislot.com', '$2a$10$X76oPu8pgkbvngIdnKJ9TuBExXHFYm9M54AuQPmQLe8IGbtWydo4u', 'Dr. Alok Banerjee', '+919876543216', 'DOCTOR', TRUE, '+91', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, enabled = TRUE;

INSERT INTO doctor_profiles (user_id, specialization_id, qualifications, years_of_experience, consultation_fee, clinic_name, city, languages, about, registration_number, active, created_at, updated_at) VALUES
('d1000001-0000-4000-8000-000000000001', 'a1000001-0000-4000-8000-000000000001', 'MBBS, MD (General Medicine)', 16, 500.00, 'MediSlot Care Clinic', 'Delhi', '["English", "Hindi"]'::jsonb, 'Senior General Physician specializing in diabetes management, hypertension, and preventive healthcare.', 'REG-DEL-101', TRUE, NOW(), NOW()),
('d1000001-0000-4000-8000-000000000002', 'a1000001-0000-4000-8000-000000000002', 'MBBS, DM (Cardiology)', 18, 800.00, 'HeartCare Specialist Center', 'Mumbai', '["English", "Hindi", "Bengali"]'::jsonb, 'Interventional Cardiologist focused on coronary artery disease, heart failure prevention, and echocardiography.', 'REG-MUM-202', TRUE, NOW(), NOW()),
('d1000001-0000-4000-8000-000000000003', 'a1000001-0000-4000-8000-000000000003', 'MBBS, MD (Dermatology)', 10, 600.00, 'Skin & Wellness Clinic', 'Bangalore', '["English", "Hindi", "Gujarati"]'::jsonb, 'Cosmetic and Clinical Dermatologist specializing in acne treatment, laser therapies, and anti-aging care.', 'REG-BLR-303', TRUE, NOW(), NOW()),
('d1000001-0000-4000-8000-000000000004', 'a1000001-0000-4000-8000-000000000004', 'MBBS, MS (Orthopedics)', 12, 700.00, 'OrthoJoint Bone Care', 'Pune', '["English", "Hindi", "Malayalam"]'::jsonb, 'Orthopedic Specialist with expertise in joint replacement, sports injury rehab, and spine management.', 'REG-PUN-404', TRUE, NOW(), NOW()),
('d1000001-0000-4000-8000-000000000005', 'a1000001-0000-4000-8000-000000000005', 'MBBS, DCH (Pediatrics)', 15, 450.00, 'Little Angels Children Clinic', 'Hyderabad', '["English", "Hindi", "Telugu"]'::jsonb, 'Compassionate Pediatrician offering child growth tracking, newborn vaccination, and pediatric nutrition guidance.', 'REG-HYD-505', TRUE, NOW(), NOW()),
('d1000001-0000-4000-8000-000000000006', 'a1000001-0000-4000-8000-000000000007', 'MBBS, MS (ENT)', 14, 550.00, 'Apex ENT & Allergy Center', 'Chennai', '["English", "Hindi", "Tamil"]'::jsonb, 'ENT Specialist with focus on sinus treatments, hearing disorders, voice therapy, and pediatric ENT.', 'REG-CHE-606', TRUE, NOW(), NOW()),
('d1000001-0000-4000-8000-000000000007', 'a1000001-0000-4000-8000-000000000008', 'MBBS, DM (Neurology)', 15, 900.00, 'NeuroCare Institute', 'Delhi', '["English", "Hindi"]'::jsonb, 'Consultant Neurologist specializing in stroke management, epilepsy, migraine treatment, and neuropathy.', 'REG-DEL-707', TRUE, NOW(), NOW())
ON CONFLICT (user_id) DO UPDATE SET active = TRUE;

-- 4. Seed Abundant Future Availability Slots across next 90 days (Aug 15 to Nov 15 2026) for ALL doctors
DO $$
DECLARE
    d_id UUID;
    s_date DATE;
    s_time TIME;
    slot_ts TIMESTAMPTZ;
BEGIN
    FOR d_id IN SELECT user_id FROM doctor_profiles WHERE active = TRUE LOOP
        FOR day_offset IN 0..45 LOOP
            s_date := CURRENT_DATE + day_offset;
            FOR hour_val IN 10..17 LOOP
                s_time := (hour_val || ':00:00')::TIME;
                slot_ts := (s_date || ' ' || s_time || '+00')::TIMESTAMPTZ;

                INSERT INTO availability_slots (id, doctor_id, slot_date, start_time, end_time, slot_start_at, is_booked, is_available, created_at, updated_at)
                VALUES (
                    gen_random_uuid(),
                    d_id,
                    s_date,
                    s_time,
                    (s_time + INTERVAL '30 minutes')::TIME,
                    slot_ts,
                    FALSE,
                    TRUE,
                    NOW(),
                    NOW()
                )
                ON CONFLICT DO NOTHING;
            END FOR;
        END FOR;
    END LOOP;
END $$;
