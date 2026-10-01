-- V26: Seed Durrmi Mental Health Specialists and Abundant Active Future Availability Slots

-- 1. Ensure Mental Health Specializations exist
INSERT INTO specializations (id, name, description, active) VALUES
('a1000001-0000-4000-8000-000000000021', 'Anxiety & Panic Therapy', 'Cognitive behavioral therapy and somatic calming for generalized anxiety, phobias, and panic', TRUE),
('a1000001-0000-4000-8000-000000000022', 'Depression & Mood Care', 'Compassionate therapy for persistent sadness, low mood, burnout recovery, and emotional regulation', TRUE),
('a1000001-0000-4000-8000-000000000023', 'Couples & Relationship Therapy', 'Conflict resolution, communication restoration, and emotional intimacy coaching for couples', TRUE),
('a1000001-0000-4000-8000-000000000024', 'Sleep & Insomnia', 'CBT-I based circadian rhythm stabilization and behavioral sleep therapy', TRUE),
('a1000001-0000-4000-8000-000000000025', 'Stress & Burnout Specialist', 'Workplace decompression, executive stress management, and nervous system regulation', TRUE),
('a1000001-0000-4000-8000-000000000026', 'Career & Work Pressure', 'Career transition coaching, imposter syndrome resolution, and performance confidence', TRUE),
('a1000001-0000-4000-8000-000000000027', 'ADHD & Attention', 'Executive dysfunction support, focus structuring, and neurodivergence coaching', TRUE),
('a1000001-0000-4000-8000-000000000028', 'Loneliness & Isolation', 'Relational attachment therapy, social anxiety reduction, and building authentic connection', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 2. Ensure Additional Therapist User Accounts exist (password: Password123!)
INSERT INTO users (id, email, password_hash, full_name, phone, role, enabled, country_code, created_at, updated_at) VALUES
('d1000001-0000-4000-8000-000000000007', 'dr.vikram.sethi@durrmi.test', '$2a$10$eD4t0Zg7t1hQ1S5g3c2uEu/uN9Xq9J5v/5W/z6pW.4z3K1v5u7Y6W', 'Dr. Vikram Sethi', '+919876543217', 'DOCTOR', TRUE, '+91', NOW(), NOW()),
('d1000001-0000-4000-8000-000000000008', 'dr.rohan.kapoor@durrmi.test', '$2a$10$eD4t0Zg7t1hQ1S5g3c2uEu/uN9Xq9J5v/5W/z6pW.4z3K1v5u7Y6W', 'Dr. Rohan Kapoor', '+919876543218', 'DOCTOR', TRUE, '+91', NOW(), NOW()),
('d1000001-0000-4000-8000-000000000009', 'dr.shalini.gupta@durrmi.test', '$2a$10$eD4t0Zg7t1hQ1S5g3c2uEu/uN9Xq9J5v/5W/z6pW.4z3K1v5u7Y6W', 'Dr. Shalini Gupta', '+919876543219', 'DOCTOR', TRUE, '+91', NOW(), NOW()),
('d1000001-0000-4000-8000-000000000010', 'dr.tanya.sen@durrmi.test', '$2a$10$eD4t0Zg7t1hQ1S5g3c2uEu/uN9Xq9J5v/5W/z6pW.4z3K1v5u7Y6W', 'Dr. Tanya Sen', '+919876543220', 'DOCTOR', TRUE, '+91', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- 3. Ensure Doctor Profiles exist for newly added therapists
INSERT INTO doctor_profiles (user_id, specialization_id, qualifications, years_of_experience, consultation_fee, clinic_name, city, languages, about, registration_number, active, created_at, updated_at) VALUES
(
  'd1000001-0000-4000-8000-000000000007',
  'a1000001-0000-4000-8000-000000000024',
  'MBBS, Behavioral Sleep Medicine Specialist', 12, 650.00, 'Durrmi Sleep & Circadian Clinic', 'Delhi', '["English", "Hindi", "Punjabi"]'::jsonb,
  'Expert in CBT-I for chronic insomnia, sleep anxiety, circadian rhythm disorders, and night-waking protocols.',
  'RCI-DEL-707', TRUE, NOW(), NOW()
),
(
  'd1000001-0000-4000-8000-000000000008',
  'a1000001-0000-4000-8000-000000000026',
  'Certified Career Counselor, ICF Executive Coach', 9, 700.00, 'Durrmi Career & Mindset Hub', 'Mumbai', '["English", "Hindi"]'::jsonb,
  'Empowering young professionals to conquer workplace burnout, imposter syndrome, and high-stakes career transitions.',
  'RCI-MUM-808', TRUE, NOW(), NOW()
),
(
  'd1000001-0000-4000-8000-000000000009',
  'a1000001-0000-4000-8000-000000000027',
  'M.Phil Clinical Psychology, Neurodivergence Specialist', 11, 850.00, 'Durrmi Neurodivergence Center', 'Bengaluru', '["English", "Hindi"]'::jsonb,
  'Specialized in adult ADHD coping strategies, executive dysfunction coaching, and focus restructuring.',
  'RCI-BLR-909', TRUE, NOW(), NOW()
),
(
  'd1000001-0000-4000-8000-000000000010',
  'a1000001-0000-4000-8000-000000000028',
  'M.Sc Counseling Psychology, Attachment Therapy Certified', 8, 600.00, 'Durrmi Emotional Connection Studio', 'Kolkata', '["English", "Hindi", "Bengali"]'::jsonb,
  'Dedicated to helping individuals navigate loneliness, grief, social anxiety, and building authentic relationships.',
  'RCI-KOL-010', TRUE, NOW(), NOW()
)
ON CONFLICT (user_id) DO NOTHING;

-- 4. Seed Abundant Future Availability Slots from CURRENT_DATE to CURRENT_DATE + 14 days
INSERT INTO availability_slots (id, doctor_id, slot_date, start_time, end_time, slot_start_at, slot_end_at, status, created_at, updated_at)
SELECT
    gen_random_uuid(),
    doc.id,
    CURRENT_DATE + (day_offset || ' day')::interval,
    t.start_t,
    t.end_t,
    (CURRENT_DATE + (day_offset || ' day')::interval) + t.start_t,
    (CURRENT_DATE + (day_offset || ' day')::interval) + t.end_t,
    'AVAILABLE',
    NOW(),
    NOW()
FROM (
    VALUES
        ('d1000001-0000-4000-8000-000000000001'::uuid),
        ('d1000001-0000-4000-8000-000000000002'::uuid),
        ('d1000001-0000-4000-8000-000000000003'::uuid),
        ('d1000001-0000-4000-8000-000000000004'::uuid),
        ('d1000001-0000-4000-8000-000000000005'::uuid),
        ('d1000001-0000-4000-8000-000000000006'::uuid),
        ('d1000001-0000-4000-8000-000000000007'::uuid),
        ('d1000001-0000-4000-8000-000000000008'::uuid),
        ('d1000001-0000-4000-8000-000000000009'::uuid),
        ('d1000001-0000-4000-8000-000000000010'::uuid),
        ('d1000001-0000-4000-8000-000000000099'::uuid)
) AS doc(id)
CROSS JOIN generate_series(0, 14) AS day_offset
CROSS JOIN (
    VALUES
        ('10:00:00'::time, '10:45:00'::time),
        ('11:30:00'::time, '12:15:00'::time),
        ('14:00:00'::time, '14:45:00'::time),
        ('16:00:00'::time, '16:45:00'::time),
        ('18:00:00'::time, '18:45:00'::time)
) AS t(start_t, end_t)
ON CONFLICT DO NOTHING;
