-- V2: Availability slots, appointments, double-booking protection, and indexes.

CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE availability_slots (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id       UUID NOT NULL REFERENCES doctor_profiles (user_id) ON DELETE CASCADE,
    slot_date       DATE NOT NULL,
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    slot_start_at   TIMESTAMPTZ NOT NULL,
    slot_end_at     TIMESTAMPTZ NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    version         BIGINT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_slot_status CHECK (status IN ('AVAILABLE', 'BOOKED', 'BLOCKED')),
    CONSTRAINT chk_slot_times CHECK (start_time < end_time),
    CONSTRAINT chk_slot_timestamptz CHECK (slot_start_at < slot_end_at),
    CONSTRAINT uq_slot_doctor_date_start UNIQUE (doctor_id, slot_date, start_time)
);

-- Required for composite FK ensuring appointment.doctor_id matches slot.doctor_id.
CREATE UNIQUE INDEX uq_availability_slots_id_doctor ON availability_slots (id, doctor_id);

-- Prevent overlapping availability windows for the same doctor.
ALTER TABLE availability_slots
    ADD CONSTRAINT excl_doctor_availability_overlap
    EXCLUDE USING gist (
        doctor_id WITH =,
        tstzrange(slot_start_at, slot_end_at, '[)') WITH &&
    );

CREATE INDEX idx_availability_doctor_date ON availability_slots (doctor_id, slot_date, status);
CREATE INDEX idx_availability_future ON availability_slots (slot_start_at)
    WHERE status = 'AVAILABLE';

CREATE TABLE appointments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id          UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    doctor_id           UUID NOT NULL REFERENCES doctor_profiles (user_id) ON DELETE RESTRICT,
    slot_id             UUID NOT NULL REFERENCES availability_slots (id) ON DELETE RESTRICT,
    slot_start_at       TIMESTAMPTZ NOT NULL,
    slot_end_at         TIMESTAMPTZ NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    reason              TEXT,
    consultation_fee    NUMERIC(10, 2) NOT NULL,
    version             BIGINT NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_appointment_status CHECK (
        status IN ('PENDING', 'CONFIRMED', 'REJECTED', 'COMPLETED', 'CANCELLED')
    ),
    CONSTRAINT chk_appointment_slot_times CHECK (slot_start_at < slot_end_at),
    CONSTRAINT fk_appointments_slot_doctor FOREIGN KEY (slot_id, doctor_id)
        REFERENCES availability_slots (id, doctor_id) ON DELETE RESTRICT
);

-- One non-cancelled/non-rejected appointment per slot at the database level.
CREATE UNIQUE INDEX uq_appointments_active_slot ON appointments (slot_id)
    WHERE status IN ('PENDING', 'CONFIRMED', 'COMPLETED');

-- Prevent overlapping active appointments for the same patient.
ALTER TABLE appointments
    ADD CONSTRAINT excl_patient_appointment_overlap
    EXCLUDE USING gist (
        patient_id WITH =,
        tstzrange(slot_start_at, slot_end_at, '[)') WITH &&
    ) WHERE (status IN ('PENDING', 'CONFIRMED'));

CREATE INDEX idx_appointments_patient ON appointments (patient_id, status);
CREATE INDEX idx_appointments_doctor ON appointments (doctor_id, status);
CREATE INDEX idx_appointments_slot ON appointments (slot_id);
CREATE INDEX idx_appointments_slot_start ON appointments (slot_start_at);
