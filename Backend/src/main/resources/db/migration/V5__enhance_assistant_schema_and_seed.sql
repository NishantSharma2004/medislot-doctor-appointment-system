-- V5: Enhance assistant schema for full-text search, usage logging, and seed clinic documents

-- 1. Enhance ai_provider_usage_logs with detailed tracking metrics
ALTER TABLE ai_provider_usage_logs
    ADD COLUMN IF NOT EXISTS request_id UUID,
    ADD COLUMN IF NOT EXISTS model VARCHAR(100),
    ADD COLUMN IF NOT EXISTS success BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS fallback_used BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS status_code INT,
    ADD COLUMN IF NOT EXISTS input_tokens INT,
    ADD COLUMN IF NOT EXISTS output_tokens INT,
    ADD COLUMN IF NOT EXISTS error_category VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_ai_usage_request ON ai_provider_usage_logs (request_id);

-- 2. Enhance clinic_documents with PostgreSQL Full-Text Search tsvector
ALTER TABLE clinic_documents
    ADD COLUMN IF NOT EXISTS fts_document_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', coalesce(title, '') || ' ' || coalesce(section, '') || ' ' || coalesce(content, ''))
    ) STORED;

CREATE INDEX IF NOT EXISTS idx_clinic_documents_fts ON clinic_documents USING GIN (fts_document_vector);
CREATE INDEX IF NOT EXISTS idx_clinic_documents_active_fts ON clinic_documents (active) WHERE active = TRUE;

-- 3. Seed approved generic clinic policy documents
INSERT INTO clinic_documents (id, title, section, content, keywords, evidence_strength, active, created_at, updated_at)
VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'Clinic Hours and Contact Policy',
    'General Information',
    'MediSlot Health Clinic is open Monday through Saturday from 8:00 AM to 8:00 PM UTC. Emergency services are referred to local hospitals. You can contact the reception desk at +1-800-MEDISLOT or email contact@medislot.com.',
    '["hours", "timings", "contact", "phone", "email", "open"]'::jsonb,
    'STRONG',
    TRUE,
    NOW(),
    NOW()
),
(
    '22222222-2222-2222-2222-222222222222',
    'First Appointment Document Checklist',
    'Patient Guidelines',
    'For your first clinic appointment, please arrive 15 minutes early. Patients must bring a government-issued photo ID, any previous medical records or lab reports, a list of current medications, and insurance details if applicable.',
    '["documents", "checklist", "first visit", "bring", "id", "records", "preparation"]'::jsonb,
    'STRONG',
    TRUE,
    NOW(),
    NOW()
),
(
    '33333333-3333-3333-3333-333333333333',
    'Appointment Cancellation and Rescheduling Policy',
    'Booking Policies',
    'Appointments can be cancelled or rescheduled up to 2 hours prior to the scheduled start time through the MediSlot patient portal. Late cancellations or missed appointments may incur a clinic policy record. Slot fees are refunded per standard clinic refund terms.',
    '["cancellation", "reschedule", "cancel", "policy", "refund", "time limit"]'::jsonb,
    'STRONG',
    TRUE,
    NOW(),
    NOW()
),
(
    '44444444-4444-4444-4444-444444444444',
    'Telehealth and Online Consultation Guidelines',
    'Consultation Modes',
    'MediSlot offers both in-person clinic visits and virtual video consultations. Online appointments require a stable internet connection and a working video camera. Joining links are available in your appointment dashboard 10 minutes before the slot.',
    '["online", "telehealth", "video", "virtual", "consultation", "link"]'::jsonb,
    'MODERATE',
    TRUE,
    NOW(),
    NOW()
),
(
    '55555555-5555-5555-5555-555555555555',
    'General Patient Preparation Instructions',
    'Visit Preparation',
    'For fasting blood tests or routine health checkups, please abstain from food and drink (except water) for 8 to 12 hours prior to your scheduled morning appointment unless instructed otherwise by your doctor.',
    '["preparation", "fasting", "blood test", "instructions", "checkup"]'::jsonb,
    'MODERATE',
    TRUE,
    NOW(),
    NOW()
),
(
    '66666666-6666-6666-6666-666666666666',
    'MediSlot Application Help and Features',
    'Platform Navigation',
    'Patients can search for doctors by specialization or city, view live available time slots, book appointments, view upcoming or past appointments, and reschedule or cancel appointments directly from the MediSlot web dashboard.',
    '["help", "medislot", "book", "search", "features", "dashboard", "how to"]'::jsonb,
    'STRONG',
    TRUE,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO NOTHING;
