-- V9: Seed abundant future availability slots for today, tomorrow, and upcoming 7 days across all doctors

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
        ('d1000001-0000-4000-8000-000000000099'::uuid)
) AS doc(id)
CROSS JOIN generate_series(0, 7) AS day_offset
CROSS JOIN (
    VALUES
        ('10:00:00'::time, '10:30:00'::time),
        ('11:00:00'::time, '11:30:00'::time),
        ('12:00:00'::time, '12:30:00'::time),
        ('14:30:00'::time, '15:00:00'::time),
        ('15:30:00'::time, '16:00:00'::time),
        ('16:30:00'::time, '17:00:00'::time),
        ('18:00:00'::time, '18:30:00'::time),
        ('19:00:00'::time, '19:30:00'::time)
) AS t(start_t, end_t)
ON CONFLICT DO NOTHING;
