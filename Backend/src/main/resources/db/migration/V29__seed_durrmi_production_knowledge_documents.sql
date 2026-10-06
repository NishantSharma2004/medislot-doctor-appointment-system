-- V29: Seed authoritative Durrmi production knowledge documents for pricing, online modality, privacy, and emergency boundaries

INSERT INTO clinic_documents (id, title, section, content, keywords, evidence_strength, active, created_at, updated_at) VALUES
    (
        'b2000001-0000-4000-8000-000000000039',
        'Durrmi Session Pricing and Consultation Fees',
        'Pricing & Payments',
        'Durrmi therapy, psychological counseling, and psychiatric consultation sessions standardly range from ₹500 to ₹1200 per 45–60 minute session, depending on the specialist''s experience, degrees, and specialization. All fees are completely transparent with no hidden platform charges. Patients can view exact real-time per-session fees and available booking slots directly on each therapist profile card in the doctors directory (/doctors). Payment is processed securely online before the scheduled slot.',
        '["price", "cost", "fee", "fees", "pricing", "charge", "charges", "rate", "how much", "rupees", "inr", "session price", "consultation fee"]'::jsonb,
        'STRONG',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        'b2000001-0000-4000-8000-000000000040',
        'Durrmi Service Modality, Nationwide Online Coverage and Physical Clinic Boundaries',
        'Service Delivery & Locations',
        'Durrmi operates exclusively as a secure, nationwide digital tele-health platform across India. All 1-on-1 consultations with verified psychologists, counselors, and psychiatrists are conducted virtually via encrypted private video and audio calls through the Durrmi web app. Durrmi does NOT operate physical walk-in clinics or in-person therapy centers in specific cities (such as Jaipur, Lucknow, Delhi, or Bangalore). Furthermore, while Durrmi therapists support general behavioral challenges and emotional distress, Durrmi does NOT operate specialized in-person rehabilitation facilities or inpatient centers for gambling or substance addictions.',
        '["in person", "offline", "clinic", "branch", "location", "jaipur", "delhi", "mumbai", "city", "gambling", "addiction", "rehab", "online", "video call", "telehealth", "modality"]'::jsonb,
        'STRONG',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        'b2000001-0000-4000-8000-000000000041',
        'Durrmi Privacy, Data Security, and Confidentiality Architecture',
        'Privacy & Data Policy',
        'Durrmi takes client privacy and health data confidentiality with extreme seriousness. All chats, appointments, and medical notes are protected by industry-standard TLS encryption in transit and secure database storage. Sensitive personal identifiable information (such as phone numbers and emails) is protected, and chat transcripts are never sold or shared with third-party advertisers. Conversation notes are strictly confidential and shared only with your booked licensed therapist for clinical consultation context. Digital records can be deleted or reviewed by the user through their account settings.',
        '["privacy", "private", "confidential", "confidentiality", "data", "who can see", "security", "encryption", "policy", "chat privacy", "records", "hipaa", "secure"]'::jsonb,
        'STRONG',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        'b2000001-0000-4000-8000-000000000042',
        'Durrmi Clinical Emergency Boundaries and Realistic Care Expectations',
        'Clinical Safety & Boundaries',
        'Durrmi is a scheduled 1-on-1 digital consultation platform for emotional wellness, counseling, and outpatient psychiatric care. Durrmi is NOT a 24/7 emergency psychiatric hospital, trauma casualty unit, or immediate crisis ward. Furthermore, mental health therapy is an evidence-based, collaborative process; Durrmi does NOT guarantee unrealistic rapid cures or "7-day miracle cures". If a user is experiencing an acute psychiatric emergency, self-harm crisis, or immediate danger, they must not wait for a scheduled session and must immediately contact 24/7 free national helplines: Tele-MANAS (Dial 14416 or 1800-891-4416), KIRAN (1800-599-0019), or Vandrevala Foundation (+91 9999 666 555), or visit their nearest hospital emergency department.',
        '["emergency", "24/7", "hospital", "urgent", "cure", "guarantee", "7 days", "miracle", "crisis", "suicide", "safety", "tele-manas", "casualty"]'::jsonb,
        'STRONG',
        TRUE,
        NOW(),
        NOW()
    )
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    section = EXCLUDED.section,
    content = EXCLUDED.content,
    keywords = EXCLUDED.keywords,
    evidence_strength = EXCLUDED.evidence_strength,
    active = EXCLUDED.active,
    updated_at = NOW();
