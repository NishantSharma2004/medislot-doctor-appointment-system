-- V13: Add medical document upload and digital prescription columns to appointments table
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS medical_document_url TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS medical_document_name VARCHAR(255);
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS diagnosis TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS prescription_json TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS lab_tests TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS follow_up_date VARCHAR(50);
