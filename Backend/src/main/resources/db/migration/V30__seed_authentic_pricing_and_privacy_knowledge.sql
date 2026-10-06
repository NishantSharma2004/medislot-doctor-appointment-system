-- V30: Seed exact Durrmi website pricing plans and authentic privacy & credential guidelines

INSERT INTO clinic_documents (id, title, section, content, keywords, evidence_strength, active, created_at, updated_at) VALUES
    (
        'b2000001-0000-4000-8000-000000000043',
        'Durrmi Official Pricing and Package Plans',
        'Pricing & Plans',
        'Durrmi provides 100% transparent pricing with no hidden charges, forced commitments, or surprise fees. There are two primary ways to get support:
1. Pre-Consultation (Single Focused Session): Starts at ₹999 per session. This is a one-on-one focused session with a consultant where you pay only for the time you book with no commitment, and rates are set upfront by each consultant before booking.
2. Package Pricing (Multi-Session Bundles): Starts at ₹1,299 per package. Bundling multiple sessions with the same consultant provides lower effective rates, continuity of care, and flexible scheduling across sessions.
3. Dedicated Focused Plans (Available on /pricing):
- Single Session: ₹1,200 per session (or ₹1,080 on weekly support) - one focused session with a chosen consultant.
- 1-Hour Dedicated Session: ₹1,800 per session (or ₹1,620 on weekly support) - deep dive with single session flexibility.
- 5 Sessions Package: ₹5,000 per 5 sessions (or ₹4,500 on weekly support) - multi-session bundle with cancel-anytime policy.
- Full-Time Therapists: ₹1,200 per session (or ₹1,080 on weekly support) - dedicated therapist for ongoing progress.
Exact individual therapist fees and available live booking slots are transparently visible on each doctor profile card in the doctors directory (/doctors). Full package comparisons can be explored directly on the /pricing page.',
        '["price", "cost", "fee", "fees", "pricing", "charge", "rate", "how much", "package", "plans", "single session", "pre-consultation", "1200", "999", "1299", "1800", "5000", "pricing details"]'::jsonb,
        'STRONG',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        'b2000001-0000-4000-8000-000000000044',
        'Durrmi Authentic Privacy and Data Confidentiality Architecture',
        'Privacy & Data Policy',
        'Durrmi prioritizes user confidentiality, data protection, and emotional safety. Technical and operational safeguards include:
1. Encryption in Transit: All chat interactions, video consultations, and data transmissions are secured using industry-standard TLS encryption.
2. PII Protection: Sensitive personal identifiers such as user phone numbers and email addresses are automatically protected and redacted.
3. Commercial Confidentiality: User conversations and health reflections are never sold, rented, or shared with third-party advertisers.
4. Professional Care Boundary: Consultation notes taken during booked sessions are held under standard healthcare professional-patient confidentiality norms.
Users can manage their account information and profile details directly within their platform account.',
        '["privacy", "private", "confidential", "confidentiality", "security", "data", "who can see", "encryption", "policy", "chat privacy", "gdpr", "hipaa", "secure"]'::jsonb,
        'STRONG',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        'b2000001-0000-4000-8000-000000000045',
        'Durrmi Therapist Credentials and Verification Policy',
        'Clinical Credentials & Standards',
        'Durrmi partners with verified mental wellness professionals across diverse clinical disciplines. These include Clinical Psychologists (with recognized degrees such as M.Phil or Ph.D. in Clinical/Counseling Psychology, RCI registrations where applicable), Psychiatrists (MBBS with MD/DNB in Psychiatry for clinical mood and medical evaluations), and Certified Wellness & Mindset Coaches. Because qualifications vary by discipline and specialization, every specialist''s specific degree, registration, years of experience, and clinical background are displayed transparently and individually on their profile card in the doctors directory (/doctors). The platform does not make broad generalized claims; users can review exact credentials for each therapist before booking.',
        '["qualification", "qualifications", "credentials", "degrees", "certified", "verified", "clinical psychologist", "psychiatrist", "background", "experience", "doctor credentials", "license"]'::jsonb,
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
