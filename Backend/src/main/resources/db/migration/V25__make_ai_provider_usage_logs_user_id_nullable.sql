-- V25: Allow anonymous/guest users to chat with the AI Assistant without requiring user_id
ALTER TABLE ai_provider_usage_logs ALTER COLUMN user_id DROP NOT NULL;
