-- V3: Refresh tokens, clinic documents (RAG), and AI provider usage logs.

CREATE TABLE refresh_tokens (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    token_hash      VARCHAR(255) NOT NULL,
    expires_at      TIMESTAMPTZ NOT NULL,
    revoked_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_refresh_token_hash UNIQUE (token_hash)
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens (user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens (expires_at)
    WHERE revoked_at IS NULL;

CREATE TABLE clinic_documents (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title               VARCHAR(255) NOT NULL,
    section             VARCHAR(100),
    content             TEXT NOT NULL,
    keywords            JSONB NOT NULL DEFAULT '[]'::jsonb,
    evidence_strength   VARCHAR(20) NOT NULL,
    active              BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_clinic_evidence CHECK (
        evidence_strength IN ('STRONG', 'MODERATE', 'LIMITED', 'NONE')
    )
);

CREATE INDEX idx_clinic_documents_keywords ON clinic_documents USING GIN (keywords);
CREATE INDEX idx_clinic_documents_active ON clinic_documents (active) WHERE active = TRUE;

CREATE TABLE ai_provider_usage_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    provider        VARCHAR(20) NOT NULL,
    outcome         VARCHAR(20) NOT NULL,
    latency_ms      INT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_ai_provider CHECK (provider IN ('GROQ', 'GEMINI')),
    CONSTRAINT chk_ai_outcome CHECK (outcome IN ('SUCCESS', 'FALLBACK', 'FAILURE'))
);

CREATE INDEX idx_ai_usage_user_created ON ai_provider_usage_logs (user_id, created_at);
