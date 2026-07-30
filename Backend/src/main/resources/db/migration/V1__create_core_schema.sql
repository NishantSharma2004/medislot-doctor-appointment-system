-- V1: Core identity and profile tables
-- Extensions for UUID generation and case-insensitive email storage.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           CITEXT NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(100) NOT NULL,
    phone           VARCHAR(20),
    role            VARCHAR(20) NOT NULL,
    enabled         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_users_role CHECK (role IN ('ADMIN', 'DOCTOR', 'PATIENT'))
);

CREATE UNIQUE INDEX uq_users_email ON users (email);

CREATE TABLE specializations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX uq_specializations_name ON specializations (LOWER(name));

CREATE TABLE patient_profiles (
    user_id             UUID PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
    date_of_birth       DATE,
    gender              VARCHAR(20),
    address             TEXT,
    emergency_contact   VARCHAR(50),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE doctor_profiles (
    user_id                 UUID PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
    specialization_id       UUID NOT NULL REFERENCES specializations (id) ON DELETE RESTRICT,
    qualifications          VARCHAR(255) NOT NULL,
    years_of_experience     INT NOT NULL DEFAULT 0,
    consultation_fee        NUMERIC(10, 2) NOT NULL,
    clinic_name             VARCHAR(150) NOT NULL,
    city                    VARCHAR(100) NOT NULL,
    languages               JSONB NOT NULL DEFAULT '[]'::jsonb,
    about                   TEXT,
    registration_number     VARCHAR(50) NOT NULL,
    active                  BOOLEAN NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_doctor_years CHECK (years_of_experience >= 0),
    CONSTRAINT chk_doctor_fee CHECK (consultation_fee >= 0)
);

CREATE UNIQUE INDEX uq_doctor_registration ON doctor_profiles (registration_number);
CREATE INDEX idx_doctor_profiles_search ON doctor_profiles (specialization_id, city);
CREATE INDEX idx_doctor_profiles_city ON doctor_profiles (city);
CREATE INDEX idx_doctor_profiles_active ON doctor_profiles (active) WHERE active = TRUE;
