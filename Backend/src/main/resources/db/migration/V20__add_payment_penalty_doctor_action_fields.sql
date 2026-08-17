-- Flyway Migration V20: Add payment, penalty, and doctor decision fields

-- 1. Add penalty and missed visit tracking fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS no_show_count INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_missed_visits INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_cash_booking_suspended BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_accumulated_dues NUMERIC(10,2) DEFAULT 0.00;

-- 2. Add payment mode, razorpay IDs, penalty amount, and doctor decision fields to appointments table
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_mode VARCHAR(30) DEFAULT 'PAY_AT_CLINIC';
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_status VARCHAR(30) DEFAULT 'PENDING_AT_CLINIC';
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(255);
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(255);
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS penalty_amount NUMERIC(10,2) DEFAULT 0.00;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS doctor_action_status VARCHAR(30) DEFAULT 'ACCEPTED';
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
