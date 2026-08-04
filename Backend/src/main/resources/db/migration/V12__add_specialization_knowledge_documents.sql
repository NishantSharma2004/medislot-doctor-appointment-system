-- V12: Add detailed specialization guides and clinic knowledge documents to clinic_documents table

INSERT INTO clinic_documents (id, title, section, content, keywords, evidence_strength, active) VALUES
    (
        'b2000001-0000-4000-8000-000000000010',
        'Specialization Guide - Dermatology (Skin, Hair & Nails)',
        'Specializations',
        'Dermatology is the medical branch specializing in skin, hair, and nail health. Consult a Dermatologist for skin checkups, acne, rashes, eczema, psoriasis, hair loss, skin allergies, fungal infections, mole evaluation, and cosmetic skin care.',
        '["skin", "dermatology", "dermatologist", "acne", "hair", "nail", "rash", "allergy", "face", "skin checkup"]'::jsonb,
        'STRONG',
        TRUE
    ),
    (
        'b2000001-0000-4000-8000-000000000011',
        'Specialization Guide - Gynecology & Obstetrics (Pregnancy & Women''s Health)',
        'Specializations',
        'Gynecology and Obstetrics focuses on women''s reproductive health, pregnancy care, prenatal and postnatal health, childbirth, fertility, PCOS, irregular periods, and menopause. For pregnancy checkups, maternity care, or female health issues, consult a Gynecologist / Obstetrician.',
        '["pregnancy", "pregnant", "gynecology", "gynecologist", "obstetrics", "women", "maternity", "period", "pcos", "female", "baby"]'::jsonb,
        'STRONG',
        TRUE
    ),
    (
        'b2000001-0000-4000-8000-000000000012',
        'Specialization Guide - Gastroenterology & Hepatology (Liver, Stomach & Digestive System)',
        'Specializations',
        'Gastroenterology and Hepatology specializes in the digestive system, liver, stomach, intestines, gallbladder, and pancreas. For liver problems, jaundice, fatty liver, acidity, stomach ulcers, gas, or digestive issues, consult a Gastroenterologist or Hepatologist (or start with a General Physician for initial guidance).',
        '["liver", "gastroenterology", "gastroenterologist", "hepatology", "stomach", "digestive", "jaundice", "acidity", "gut", "pancreas"]'::jsonb,
        'STRONG',
        TRUE
    ),
    (
        'b2000001-0000-4000-8000-000000000013',
        'Specialization Guide - Cardiology (Heart & Blood Vessels)',
        'Specializations',
        'Cardiology specializes in heart health, high blood pressure (hypertension), blood vessels, and cardiovascular diseases. Consult a Cardiologist for chest discomfort, high BP, shortness of breath on exertion, heart palpitations, and routine cardiac checkups.',
        '["heart", "cardiology", "cardiologist", "blood pressure", "chest pain", "bp", "cardiac", "hypertension"]'::jsonb,
        'STRONG',
        TRUE
    ),
    (
        'b2000001-0000-4000-8000-000000000014',
        'Specialization Guide - Orthopedics (Bones, Joints & Spine)',
        'Specializations',
        'Orthopedics specializes in bones, joints, muscles, ligaments, tendons, and spine health. Consult an Orthopedist / Orthopedic Surgeon for joint pain, arthritis, bone fractures, back pain, knee issues, or sports injuries.',
        '["bones", "orthopedics", "orthopedist", "joint", "back pain", "knee", "fracture", "arthritis", "spine"]'::jsonb,
        'STRONG',
        TRUE
    ),
    (
        'b2000001-0000-4000-8000-000000000015',
        'Specialization Guide - Pediatrics (Child & Infant Care)',
        'Specializations',
        'Pediatrics specializes in healthcare for newborns, infants, children, and teenagers. Consult a Pediatrician for childhood illnesses, growth monitoring, child vaccination schedules, fever in children, and nutritional guidance.',
        '["child", "children", "pediatrics", "pediatrician", "baby", "infant", "vaccination", "kids", "growth"]'::jsonb,
        'STRONG',
        TRUE
    ),
    (
        'b2000001-0000-4000-8000-000000000016',
        'Specialization Guide - ENT (Ear, Nose & Throat)',
        'Specializations',
        'ENT (Otolaryngology) specializes in conditions of the ear, nose, throat, sinuses, and neck. Consult an ENT Specialist for hearing loss, ear infections, nasal congestion, sinus pain, throat infection, and tonsillitis.',
        '["ear", "nose", "throat", "ent", "sinus", "hearing", "tonsil", "cough", "cold"]'::jsonb,
        'STRONG',
        TRUE
    ),
    (
        'b2000001-0000-4000-8000-000000000017',
        'Specialization Guide - Neurology (Brain, Nerves & Spinal Cord)',
        'Specializations',
        'Neurology specializes in disorders of the brain, spinal cord, and nervous system. Consult a Neurologist for chronic headaches, migraines, numbness, seizures, memory disorders, tremors, or nerve pain.',
        '["brain", "neurology", "neurologist", "nerve", "headache", "migraine", "seizure", "numbness"]'::jsonb,
        'STRONG',
        TRUE
    ),
    (
        'b2000001-0000-4000-8000-000000000018',
        'Specialization Guide - Psychiatry (Mental & Emotional Health)',
        'Specializations',
        'Psychiatry specializes in mental health, emotional wellness, mood disorders, and psychological care. Consult a Psychiatrist for anxiety, depression, insomnia/sleep issues, panic attacks, and severe stress management.',
        '["mental", "psychiatry", "psychiatrist", "anxiety", "depression", "stress", "sleep", "mood"]'::jsonb,
        'STRONG',
        TRUE
    ),
    (
        'b2000001-0000-4000-8000-000000000019',
        'Specialization Guide - Ophthalmology (Eye Care)',
        'Specializations',
        'Ophthalmology specializes in eye health, vision evaluation, and eye diseases. Consult an Ophthalmologist for vision impairment, eye pain, redness, cataract evaluation, glaucoma, or routine vision testing.',
        '["eye", "ophthalmology", "ophthalmologist", "vision", "specs", "sight", "cataract", "redness"]'::jsonb,
        'STRONG',
        TRUE
    ),
    (
        'b2000001-0000-4000-8000-000000000020',
        'Specialization Guide - General Physician (Primary Care & General Checkup)',
        'Specializations',
        'A General Physician provides primary medical care, general body checkups, treatment for common infections, fever, viral illness, blood pressure and blood sugar monitoring, and initial diagnosis. They serve as the primary consultation point and refer patients to specific medical specialists when required.',
        '["general", "physician", "doctor", "fever", "checkup", "health", "cold", "blood test", "primary", "routine"]'::jsonb,
        'STRONG',
        TRUE
    ),
    (
        'b2000001-0000-4000-8000-000000000021',
        'Master Guide - All Medical Specializations Overview',
        'Specializations',
        'MediSlot features certified doctors across key medical departments: 1. Dermatology (Skin, Hair, Nails), 2. Gynecology & Obstetrics (Pregnancy & Women''s Health), 3. Gastroenterology & Hepatology (Liver, Stomach, Digestion), 4. Cardiology (Heart & BP), 5. Orthopedics (Bones & Joints), 6. Pediatrics (Children & Infants), 7. ENT (Ear, Nose, Throat), 8. Neurology (Brain & Nerves), 9. Psychiatry (Mental Health), 10. Ophthalmology (Eye Care), 11. General Physician (Overall Health Checkup & Primary Care).',
        '["specialization", "specialist", "department", "work", "list", "types", "differ", "which doctor", "konsa doctor", "doctor list"]'::jsonb,
        'STRONG',
        TRUE
    )
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    section = EXCLUDED.section,
    content = EXCLUDED.content,
    keywords = EXCLUDED.keywords,
    evidence_strength = EXCLUDED.evidence_strength,
    active = EXCLUDED.active;
