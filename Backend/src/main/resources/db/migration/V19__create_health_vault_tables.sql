-- V19: Create Health Vault Files and Appointment Shared Records Tables for EHR System

CREATE TABLE IF NOT EXISTS health_vault_files (
    id UUID PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_size_bytes BIGINT,
    category VARCHAR(50) DEFAULT 'OTHER' NOT NULL,
    file_url TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS appointment_shared_records (
    id UUID PRIMARY KEY,
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    vault_file_id UUID NOT NULL REFERENCES health_vault_files(id) ON DELETE CASCADE,
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_appointment_vault_file UNIQUE (appointment_id, vault_file_id)
);

-- Fast Lookups for Vault Search & Appointment Shared Records
CREATE INDEX IF NOT EXISTS idx_health_vault_patient ON health_vault_files (patient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointment_shared_records ON appointment_shared_records (appointment_id);
