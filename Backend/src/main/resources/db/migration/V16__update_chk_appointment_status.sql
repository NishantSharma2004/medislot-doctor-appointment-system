-- Drop existing restrictive appointment status check constraint
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS chk_appointment_status;

-- Add updated check constraint supporting IN_CONSULTATION, EXPIRED, MISSED, and SKIPPED
ALTER TABLE appointments ADD CONSTRAINT chk_appointment_status CHECK (
    status IN ('PENDING', 'CONFIRMED', 'IN_CONSULTATION', 'REJECTED', 'COMPLETED', 'CANCELLED', 'EXPIRED', 'MISSED', 'SKIPPED')
);
