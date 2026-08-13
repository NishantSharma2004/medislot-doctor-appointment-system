-- V17: Advanced Composite B-Tree Indexes for OPD Queue, Doctor Sorting & Auto-Cleanup

-- 1. Ultra-Fast OPD Token Queue Queries (0.1ms B-Tree lookup for OPD Queue & Live Callers)
CREATE INDEX IF NOT EXISTS idx_appointments_today_opd_queue 
    ON appointments (doctor_id, slot_start_at ASC) 
    WHERE status NOT IN ('CANCELLED', 'REJECTED', 'EXPIRED');

-- 2. Doctor Search Multi-Sort Indexing (Experience & Fee sorting)
CREATE INDEX IF NOT EXISTS idx_doctor_profiles_active_exp_fee 
    ON doctor_profiles (active, years_of_experience DESC, consultation_fee ASC);

-- 3. Automatic Past Slot Cleanup Indexing (Lean DB Storage)
CREATE INDEX IF NOT EXISTS idx_availability_slots_expired_cleanup 
    ON availability_slots (status, slot_end_at) 
    WHERE status = 'AVAILABLE';

-- 4. User Notification Stream Indexing (Instant Bell Counter)
CREATE INDEX IF NOT EXISTS idx_notification_logs_user_status 
    ON notification_logs (user_id, status, created_at DESC);
