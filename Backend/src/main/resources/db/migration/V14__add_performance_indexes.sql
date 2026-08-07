-- High-Performance B-Tree Database Indexes for MediSlot PostgreSQL Database

-- 1. Appointment Queries (Patient history & Doctor schedule lookups)
CREATE INDEX IF NOT EXISTS idx_appointments_patient_start ON appointments(patient_id, slot_start_at);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_start_status ON appointments(doctor_id, slot_start_at, status);
CREATE INDEX IF NOT EXISTS idx_appointments_status_start ON appointments(status, slot_start_at);

-- 2. Doctor Search & Filtering (City & Specialization)
CREATE INDEX IF NOT EXISTS idx_doctor_profiles_city_spec ON doctor_profiles(city, specialization_id);
CREATE INDEX IF NOT EXISTS idx_doctor_profiles_user_id ON doctor_profiles(user_id);

-- 3. Availability Slot Search (Open slot query optimization)
CREATE INDEX IF NOT EXISTS idx_availability_slots_doctor_date_status ON availability_slots(doctor_id, slot_date, status);

-- 4. User Lookup (Email auth & Role indexing)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
