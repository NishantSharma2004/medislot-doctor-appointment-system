-- V4: Reference seed data only (no users, credentials, or appointments).

INSERT INTO specializations (id, name, description) VALUES
    ('a1000001-0000-4000-8000-000000000001', 'General Physician', 'Primary care and routine health consultations'),
    ('a1000001-0000-4000-8000-000000000002', 'Cardiology', 'Heart and cardiovascular system'),
    ('a1000001-0000-4000-8000-000000000003', 'Dermatology', 'Skin, hair, and nail conditions'),
    ('a1000001-0000-4000-8000-000000000004', 'Orthopedics', 'Bones, joints, and musculoskeletal system'),
    ('a1000001-0000-4000-8000-000000000005', 'Pediatrics', 'Medical care for infants and children'),
    ('a1000001-0000-4000-8000-000000000006', 'Gynecology', 'Women''s reproductive health'),
    ('a1000001-0000-4000-8000-000000000007', 'ENT', 'Ear, nose, and throat disorders'),
    ('a1000001-0000-4000-8000-000000000008', 'Psychiatry', 'Mental health and behavioral disorders'),
    ('a1000001-0000-4000-8000-000000000009', 'Ophthalmology', 'Eye and vision care'),
    ('a1000001-0000-4000-8000-000000000010', 'Neurology', 'Brain and nervous system');

INSERT INTO clinic_documents (id, title, section, content, keywords, evidence_strength) VALUES
    (
        'b2000001-0000-4000-8000-000000000001',
        'Appointment Booking Policy',
        'Booking',
        'Patients can book appointments through the MediSlot portal by selecting a doctor, choosing an available time slot, and confirming the booking. Appointments remain in PENDING status until the doctor confirms them.',
        '["book", "booking", "appointment", "schedule", "slot"]'::jsonb,
        'STRONG'
    ),
    (
        'b2000001-0000-4000-8000-000000000002',
        'Cancellation Policy',
        'Cancellation',
        'Patients may cancel an appointment at any time before the scheduled slot. Cancelled appointments free the time slot for other patients. Repeated no-shows may result in booking restrictions.',
        '["cancel", "cancellation", "refund", "no-show"]'::jsonb,
        'STRONG'
    ),
    (
        'b2000001-0000-4000-8000-000000000003',
        'Rescheduling Policy',
        'Rescheduling',
        'To reschedule, select a new available slot from the same or a different doctor. Rescheduled appointments return to PENDING status and require doctor confirmation again.',
        '["reschedule", "change", "move", "postpone"]'::jsonb,
        'STRONG'
    ),
    (
        'b2000001-0000-4000-8000-000000000004',
        'Clinic Timings',
        'Hours',
        'The clinic operates Monday through Saturday, 8:00 AM to 8:00 PM. Sunday hours are 9:00 AM to 1:00 PM for emergency consultations only. Online booking is available 24/7.',
        '["hours", "timing", "open", "closed", "schedule"]'::jsonb,
        'STRONG'
    ),
    (
        'b2000001-0000-4000-8000-000000000005',
        'Choosing a Specialization',
        'Specializations',
        'Use the doctor search filters to browse by specialization and city. If you are unsure which specialist to consult, start with a General Physician who can refer you to the appropriate department.',
        '["specialization", "specialist", "department", "choose", "find doctor"]'::jsonb,
        'MODERATE'
    ),
    (
        'b2000001-0000-4000-8000-000000000006',
        'AI Assistant Disclaimer',
        'Assistant',
        'The MediSlot AI assistant provides general clinic information only. It does not diagnose conditions, interpret symptoms, or recommend medicines. Always consult a qualified doctor for medical advice.',
        '["assistant", "chatbot", "ai", "help", "disclaimer"]'::jsonb,
        'STRONG'
    );
