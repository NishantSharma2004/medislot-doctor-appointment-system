-- V10: Add doctor notes / prescription column to appointments table
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS notes TEXT;
