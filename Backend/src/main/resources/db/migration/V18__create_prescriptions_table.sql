-- V18: Create Prescriptions and Prescription Medicines Tables for E-Prescription (Rx) System

CREATE TABLE IF NOT EXISTS prescriptions (
    id UUID PRIMARY KEY,
    appointment_id UUID NOT NULL UNIQUE REFERENCES appointments(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES users(id),
    doctor_id UUID NOT NULL REFERENCES doctor_profiles(id),
    rx_number VARCHAR(50) NOT NULL UNIQUE,
    diagnosis TEXT,
    symptoms TEXT,
    lab_tests_recommended TEXT,
    clinical_advice TEXT,
    follow_up_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS prescription_medicines (
    id UUID PRIMARY KEY,
    prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
    medicine_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    timing VARCHAR(100),
    duration_days VARCHAR(100)
);

-- Fast Lookups for Prescription Search & History
CREATE INDEX IF NOT EXISTS idx_prescriptions_appointment ON prescriptions (appointment_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions (patient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor ON prescriptions (doctor_id, created_at DESC);
