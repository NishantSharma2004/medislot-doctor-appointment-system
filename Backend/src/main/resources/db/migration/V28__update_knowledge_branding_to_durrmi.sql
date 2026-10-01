-- V28: Update clinic_documents knowledge branding from MediSlot to Durrmi

UPDATE clinic_documents
SET title = REPLACE(title, 'MediSlot', 'Durrmi'),
    content = REPLACE(REPLACE(content, 'MediSlot Health Clinic', 'Durrmi Wellness Clinic'), 'MediSlot', 'Durrmi'),
    updated_at = NOW()
WHERE title LIKE '%MediSlot%' OR content LIKE '%MediSlot%';
