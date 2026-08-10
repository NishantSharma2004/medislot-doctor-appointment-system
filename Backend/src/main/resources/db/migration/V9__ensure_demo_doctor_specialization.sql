-- V9: Ensure demo doctor profile has a valid non-null specialization ID if missing
UPDATE doctor_profiles 
SET specialization_id = COALESCE(
  (SELECT id FROM specializations WHERE LOWER(name) LIKE '%general%' OR LOWER(name) LIKE '%physician%' LIMIT 1),
  (SELECT id FROM specializations LIMIT 1)
)
WHERE specialization_id IS NULL;
