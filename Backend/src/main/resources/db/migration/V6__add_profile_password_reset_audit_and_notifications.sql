-- V6: Profile management, password reset tokens, audit logging, notification logs, and document management enhancements.

-- 1. Extend user / patient profile fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS country_code VARCHAR(10) DEFAULT '+1';
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR(500);

ALTER TABLE patient_profiles ADD COLUMN IF NOT EXISTS address_line_1 VARCHAR(255);
ALTER TABLE patient_profiles ADD COLUMN IF NOT EXISTS address_line_2 VARCHAR(255);
ALTER TABLE patient_profiles ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE patient_profiles ADD COLUMN IF NOT EXISTS state VARCHAR(100);
ALTER TABLE patient_profiles ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20);
ALTER TABLE patient_profiles ADD COLUMN IF NOT EXISTS country VARCHAR(100);

-- 2. Password reset tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    token_hash      VARCHAR(255) NOT NULL,
    expires_at      TIMESTAMPTZ NOT NULL,
    used_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    attempt_count   INT NOT NULL DEFAULT 0,
    CONSTRAINT uq_password_reset_token_hash UNIQUE (token_hash),
    CONSTRAINT chk_password_reset_attempts CHECK (attempt_count >= 0)
);

CREATE INDEX IF NOT EXISTS idx_pwd_reset_user ON password_reset_tokens (user_id);
CREATE INDEX IF NOT EXISTS idx_pwd_reset_token ON password_reset_tokens (token_hash) WHERE used_at IS NULL;

-- 3. Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id   UUID REFERENCES users (id) ON DELETE SET NULL,
    actor_role      VARCHAR(20) NOT NULL,
    action          VARCHAR(50) NOT NULL,
    entity_type     VARCHAR(50),
    entity_id       UUID,
    result          VARCHAR(20) NOT NULL,
    request_id      VARCHAR(100),
    ip_hash         VARCHAR(64),
    metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs (actor_user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs (action, created_at);

-- 4. Notification logs
CREATE TABLE IF NOT EXISTS notification_logs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID REFERENCES users (id) ON DELETE SET NULL,
    appointment_id      UUID REFERENCES appointments (id) ON DELETE SET NULL,
    channel             VARCHAR(20) NOT NULL,
    template_name       VARCHAR(100) NOT NULL,
    recipient_masked    VARCHAR(255) NOT NULL,
    status              VARCHAR(20) NOT NULL,
    provider_message_id VARCHAR(100),
    error_category      VARCHAR(100),
    sent_at             TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    retry_count         INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_notif_logs_user ON notification_logs (user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notif_logs_status ON notification_logs (status);

-- 5. Extend clinic_documents for document administration
ALTER TABLE clinic_documents ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'GENERAL';
ALTER TABLE clinic_documents ADD COLUMN IF NOT EXISTS version VARCHAR(20) DEFAULT '1.0';
ALTER TABLE clinic_documents ADD COLUMN IF NOT EXISTS source_filename VARCHAR(255);
ALTER TABLE clinic_documents ADD COLUMN IF NOT EXISTS mime_type VARCHAR(100);
ALTER TABLE clinic_documents ADD COLUMN IF NOT EXISTS uploaded_by UUID REFERENCES users (id) ON DELETE SET NULL;
