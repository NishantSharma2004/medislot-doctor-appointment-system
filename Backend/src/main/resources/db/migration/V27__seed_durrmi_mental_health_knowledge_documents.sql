-- V27: Seed Durrmi mental health, emotional wellness, career counseling, and therapy knowledge documents

INSERT INTO clinic_documents (id, title, section, content, keywords, evidence_strength, active, created_at, updated_at) VALUES
    (
        'b2000001-0000-4000-8000-000000000030',
        'Specialization Guide - Career & Workplace Pressure (Imposter Syndrome & Burnout)',
        'Mental Health & Counseling',
        'Durrmi provides dedicated 1-on-1 counseling and mindset coaching for career and workplace pressures. Consult a Career & Mindset Coach or Workplace Counselor for career confusion, imposter syndrome, executive burnout, professional crossroads, workplace anxiety, fear of failure, toxic work environments, and career transitions. They help you clarify your goals, overcome self-doubt, set workplace boundaries, navigate corporate stress, and regain career confidence.',
        '["career", "work", "job", "profession", "imposter", "syndrome", "workplace", "boss", "office", "promotion", "confusion", "transition", "burnout", "corporate", "resign", "growth"]'::jsonb,
        'STRONG',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        'b2000001-0000-4000-8000-000000000031',
        'Specialization Guide - Stress & Burnout Management',
        'Mental Health & Counseling',
        'Stress and burnout management focuses on emotional exhaustion, chronic workplace overload, high-achiever fatigue, and nervous system dysregulation. Consult a Stress & Burnout Specialist or CBT Therapist for chronic exhaustion, overwhelm, physical fatigue from stress, and work-life balance restoration. Therapy incorporates evidence-based grounding techniques, boundary setting, and nervous system decompression.',
        '["stress", "burnout", "exhaustion", "overwhelmed", "fatigue", "drained", "tired", "workload", "pressure", "relax", "calm", "cbt"]'::jsonb,
        'STRONG',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        'b2000001-0000-4000-8000-000000000032',
        'Specialization Guide - Anxiety, Panic & Overthinking',
        'Mental Health & Counseling',
        'Anxiety counseling focuses on generalized anxiety disorder (GAD), panic attacks, racing thoughts, social anxiety, and chronic worry loops. Consult an Anxiety & Panic Specialist or Clinical Psychologist for grounding exercises, cognitive reframing, exposure therapy, panic de-escalation, and nervous system calming.',
        '["anxiety", "panic", "overthinking", "worry", "fear", "nervous", "palpitation", "phobia", "racing thoughts", "calm"]'::jsonb,
        'STRONG',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        'b2000001-0000-4000-8000-000000000033',
        'Specialization Guide - Sleep & Insomnia (CBT-I Coaching)',
        'Mental Health & Counseling',
        'Sleep & Insomnia therapy uses evidence-based Cognitive Behavioral Therapy for Insomnia (CBT-I), circadian rhythm resets, and stimulus control. Consult a Sleep & Insomnia Specialist for trouble falling asleep, frequent nighttime awakenings, revenge bedtime procrastination, sleep anxiety, and non-restorative sleep.',
        '["sleep", "insomnia", "sleepless", "night", "awake", "cbt-i", "circadian", "bedtime", "restless"]'::jsonb,
        'STRONG',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        'b2000001-0000-4000-8000-000000000034',
        'Specialization Guide - Relationships & Couples Therapy',
        'Mental Health & Counseling',
        'Relationships and couples therapy focuses on romantic relationships, marriage counseling, family dynamics, breakup recovery, codependency, and attachment styles. Consult a Relationship & Couples Counselor for communication breakdowns, trust rebuilding, boundary setting, and healthy conflict resolution.',
        '["relationship", "couple", "marriage", "partner", "love", "breakup", "divorce", "attachment", "family", "codependency", "dating"]'::jsonb,
        'STRONG',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        'b2000001-0000-4000-8000-000000000035',
        'Specialization Guide - Depression, Low Mood & Emotional Fatigue',
        'Mental Health & Counseling',
        'Depression counseling focuses on low mood, loss of interest (anhedonia), deep sadness, persistent fatigue, and emotional numbness. Consult a Clinical Psychologist or Psychiatrist for compassionate therapeutic intervention, behavioral activation, and psychological healing.',
        '["depression", "sad", "hopeless", "low mood", "crying", "unmotivated", "numb", "lethargic", "depressed", "apathy"]'::jsonb,
        'STRONG',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        'b2000001-0000-4000-8000-000000000036',
        'Specialization Guide - ADHD & Executive Dysfunction',
        'Mental Health & Counseling',
        'ADHD coaching and therapy addresses attention-deficit/hyperactivity challenges, chronic procrastination, executive dysfunction, time blindness, and emotional dysregulation. Consult an ADHD & Focus Specialist for personalized neurodivergent systems, dopamine regulation, and habit formation.',
        '["adhd", "focus", "attention", "procrastination", "distraction", "executive dysfunction", "hyperactivity", "time blindness"]'::jsonb,
        'STRONG',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        'b2000001-0000-4000-8000-000000000037',
        'Specialization Guide - Loneliness & Social Connection',
        'Mental Health & Counseling',
        'Loneliness therapy addresses feelings of isolation, lack of deep emotional connection, social anxiety, and navigating major life transitions like moving cities or lifestyle changes. Consult a Loneliness & Connection Counselor for rebuilding self-worth and meaningful interpersonal bonds.',
        '["lonely", "loneliness", "alone", "isolated", "isolation", "connection", "friends", "empty", "abandoned"]'::jsonb,
        'STRONG',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        'b2000001-0000-4000-8000-000000000038',
        'Durrmi Platform Overview - Holistic Mental & Medical Care',
        'Overview',
        'Durrmi provides compassionate, confidential 1-on-1 consultations with verified specialists across emotional wellness, mental health, career coaching, relationships, and medical care. Our verified experts include: 1. Stress & Burnout Specialists, 2. Anxiety & Panic Therapists, 3. Career & Mindset Coaches, 4. Relationship & Couples Counselors, 5. Sleep & CBT-I Specialists, 6. ADHD & Focus Coaches, 7. Loneliness Counselors, 8. Psychiatrists & Clinical Psychologists, 9. General Physicians and Medical Specialists (Dermatology, Gynecology, etc.).',
        '["durrmi", "wellness", "mental health", "therapy", "therapist", "counselor", "consultation", "specialists", "doctors"]'::jsonb,
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
