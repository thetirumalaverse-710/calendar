-- ============================================================
-- TIRUMALA VERSE — TOKEN FAQS DATABASE ARCHITECTURE
-- Database schema migration for admin-configurable Token FAQs
-- ============================================================

-- 1. Create token_faqs table
CREATE TABLE IF NOT EXISTS public.token_faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    question_te TEXT NOT NULL DEFAULT '',
    answer_te TEXT NOT NULL DEFAULT '',
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_token_faqs_sort_order 
    ON public.token_faqs(sort_order ASC);

CREATE INDEX IF NOT EXISTS idx_token_faqs_is_active 
    ON public.token_faqs(is_active);

-- 2. Enable Row Level Security
ALTER TABLE public.token_faqs ENABLE ROW LEVEL SECURITY;

-- 3. Row Level Security Policies

-- Public read access:
-- Anonymous and public visitors can only read active FAQs
DROP POLICY IF EXISTS "Public read token_faqs" ON public.token_faqs;
DROP POLICY IF EXISTS "Allow public read access to token faqs" ON public.token_faqs;
CREATE POLICY "Public read token_faqs" 
    ON public.token_faqs 
    FOR SELECT 
    TO anon, authenticated 
    USING (is_active = true);

-- Authorized Admin read access:
-- Authorized admin can read all FAQ rows, including inactive/hidden ones
DROP POLICY IF EXISTS "Admin select token_faqs" ON public.token_faqs;
DROP POLICY IF EXISTS "Allow admin to select token faqs" ON public.token_faqs;
CREATE POLICY "Admin select token_faqs" 
    ON public.token_faqs 
    FOR SELECT 
    TO authenticated 
    USING (
        auth.uid() = '7cf7f7f7-7216-4296-8ab3-bb4a78a4b7db'::uuid OR
        (auth.jwt() ->> 'email') = 'admin@thetirumalaverse.in'
    );

-- Strict Admin Write Access:
-- Uses the same admin authorization model as push_notifications.sql / docs/uml/02-er-diagram.md
-- Only the designated admin account or UID can insert, update, or delete FAQs.
DROP POLICY IF EXISTS "Admin insert token_faqs" ON public.token_faqs;
DROP POLICY IF EXISTS "Allow admin to insert token faqs" ON public.token_faqs;
CREATE POLICY "Admin insert token_faqs" 
    ON public.token_faqs 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (
        auth.uid() = '7cf7f7f7-7216-4296-8ab3-bb4a78a4b7db'::uuid OR
        (auth.jwt() ->> 'email') = 'admin@thetirumalaverse.in'
    );

DROP POLICY IF EXISTS "Admin update token_faqs" ON public.token_faqs;
DROP POLICY IF EXISTS "Allow admin to update token faqs" ON public.token_faqs;
CREATE POLICY "Admin update token_faqs" 
    ON public.token_faqs 
    FOR UPDATE 
    TO authenticated 
    USING (
        auth.uid() = '7cf7f7f7-7216-4296-8ab3-bb4a78a4b7db'::uuid OR
        (auth.jwt() ->> 'email') = 'admin@thetirumalaverse.in'
    ) 
    WITH CHECK (
        auth.uid() = '7cf7f7f7-7216-4296-8ab3-bb4a78a4b7db'::uuid OR
        (auth.jwt() ->> 'email') = 'admin@thetirumalaverse.in'
    );

DROP POLICY IF EXISTS "Admin delete token_faqs" ON public.token_faqs;
DROP POLICY IF EXISTS "Allow admin to delete token faqs" ON public.token_faqs;
CREATE POLICY "Admin delete token_faqs" 
    ON public.token_faqs 
    FOR DELETE 
    TO authenticated 
    USING (
        auth.uid() = '7cf7f7f7-7216-4296-8ab3-bb4a78a4b7db'::uuid OR
        (auth.jwt() ->> 'email') = 'admin@thetirumalaverse.in'
    );

-- 4. Seed with initial 8 records directly from project source (src/data/tokenFaqData.js)
-- Preserves verified English and Telugu content verbatim
INSERT INTO public.token_faqs (id, question, answer, question_te, answer_te, sort_order, is_active)
VALUES
(
    'ssd-vs-dd',
    'What is the difference between Slotted Sarva Darshan (SSD) and Divya Darshan (DD) tokens?',
    'Both are free offline darshan tokens issued by TTD in Tirupati. Slotted Sarva Darshan (SSD) tokens assign pilgrims a specific reporting date and time for Sarva Darshan at Tirumala. Divya Darshan (DD) tokens are free offline tokens specifically associated with the pedestrian pilgrimage route via Srivari Mettu.',
    'స్లాటెడ్ సర్వ దర్శనం (SSD) మరియు దివ్య దర్శనం (DD) టోకెన్ల మధ్య తేడా ఏమిటి?',
    'ఈ రెండూ తిరుపతిలో టీటీడీ ఉచితంగా జారీ చేసే ఆఫ్‌లైన్ దర్శన టోకెన్లు. స్లాటెడ్ సర్వ దర్శనం (SSD) టోకెన్లు భక్తులకు తిరుమలలో సర్వదర్శనం కోసం నిర్దిష్ట తేదీ మరియు రిపోర్టింగ్ సమయాన్ని కేటాయిస్తాయి. దివ్య దర్శనం (DD) టోకెన్లు శ్రీవారి మెట్టు కాలినడక మార్గం ద్వారా వెళ్ళే భక్తులకు కేటాయించిన ఉచిత టోకెన్లు.',
    1,
    true
),
(
    'counter-locations',
    'Where are SSD and DD token counters located in Tirupati?',
    'SSD tokens are issued at Srinivasam Complex (near Tirupati Bus Stand), Vishnu Nivasam (opposite Tirupati Railway Station), and Bhudevi Complex (near Alipiri). A dedicated Divya Darshan (DD) token counter is located separately at Bhudevi Complex near Alipiri.',
    'తిరుపతిలో SSD మరియు DD టోకెన్ కౌంటర్లు ఎక్కడ ఉన్నాయి?',
    'SSD టోకెన్లు శ్రీనివాసం కాంప్లెక్స్ (తిరుపతి బస్ స్టాండ్ సమీపంలో), విష్ణు నివాసం (తిరుపతి రైల్వే స్టేషన్ ఎదురుగా) మరియు భూదేవి కాంప్లెక్స్ (అలిపిరి సమీపంలో) వద్ద జారీ చేయబడతాయి. ప్రత్యేక దివ్య దర్శనం (DD) కౌంటర్ అలిపిరి వద్ద ఉన్న భూదేవి కాంప్లెక్స్‌లో ఉంది.',
    2,
    true
),
(
    'documents-required',
    'What documents are required to obtain a token?',
    'Pilgrims must carry their original Aadhaar card. Each person must physically stand in the queue to obtain an individual token.',
    'టోకెన్ పొందడానికి ఏ పత్రాలు అవసరం?',
    'భక్తులు తప్పనిసరిగా అసలు (ఒరిజినల్) ఆధార్ కార్డును వెంట తీసుకురావాలి. ప్రతి వ్యక్తి స్వయంగా క్యూ లైనులో నిలబడి తమ టోకెన్ పొందాలి.',
    3,
    true
),
(
    'reporting-rules',
    'Where do token holders report in Tirumala, and what are the rules for DD holders?',
    'The reporting point for both SSD and DD token holders is ATGH Circle according to the assigned date and time. DD token holders must travel through Srivari Mettu only and must scan their token at the 1200th step on the day of darshan before reporting.',
    'టోకెన్ పొందిన భక్తులు తిరుమలలో ఎక్కడ రిపోర్ట్ చేయాలి, DD భక్తులకు నియమాలు ఏమిటి?',
    'SSD మరియు DD టోకెన్ పొందిన భక్తులిద్దరూ తమ టోకెన్‌పై కేటాయించిన తేదీ మరియు సమయానికి తిరుమలలోని ATGH సర్కిల్ వద్ద రిపోర్ట్ చేయాలి. DD టోకెన్ దారులు తప్పనిసరిగా శ్రీవారి మెట్టు మార్గం ద్వారా మాత్రమే ప్రయాణించాలి మరియు దర్శనం రోజున 1200వ మెట్టు వద్ద టోకెన్ స్కాన్ చేసుకోవాలి.',
    4,
    true
),
(
    'timing-availability',
    'Are token issuance timings and daily quotas fixed?',
    'Token issuance times are not fixed and may vary depending on crowd conditions and operational arrangements. Historical timings shown on this portal are recorded information only and should not be treated as a guaranteed schedule. Token information is refreshed every 10 minutes.',
    'టోకెన్ జారీ సమయాలు మరియు రోజువారీ కోటా స్థిరంగా ఉంటాయా?',
    'టోకెన్ల జారీ సమయాలు స్థిరంగా ఉండవు. భక్తుల రద్దీ మరియు నిర్వహణ పరిస్థితులపై ఆధారపడి సమయాలు మారవచ్చు. ఇక్కడ చూపించే సమయాలు నమోదైన సమాచారం మాత్రమే. ఈ వెబ్‌సైట్‌లో టోకెన్ సమాచారం ప్రతి 10 నిమిషాలకు స్వయంచాలకంగా నవీకరించబడుతుంది.',
    5,
    true
),
(
    'dress-code',
    'What is the dress code required when reporting for darshan with an SSD or DD token?',
    'Pilgrims reporting for darshan at Tirumala must follow traditional attire: Men must wear a Dhoti with Towel or Kurta Pyjama; Women must wear a Saree, Half-Saree, or Churidar / Salwar Kameez with Dupatta. Western attire (such as jeans, t-shirts, and shorts) is strictly restricted in sanctum lines. Please note that this dress code applies to temple entry at Tirumala; casual modest attire is acceptable when waiting in the token issuance queue in Tirupati.',
    'SSD లేదా DD టోకెన్‌తో దర్శనానికి వెళ్ళేటప్పుడు పాటించవలసిన సాంప్రదాయ దుస్తుల నిబంధన ఏమిటి?',
    'తిరుమలలో శ్రీవారి ఆలయ ప్రవేశం మరియు దర్శన క్యూ లైన్లలో భక్తులు తప్పనిసరిగా సాంప్రదాయ దుస్తులను ధరించాలి: పురుషులు ధోతి-ఉత్తరీయం లేదా కుర్తా-పైజామా; మహిళలు చీర, లంగా-ఓణీ లేదా చుడీదార్/సల్వార్ కమీజ్ దుపట్టాతో ధరించాలి. జీన్స్, టీ-షర్టులు, షార్ట్స్ వంటి పాశ్చాత్య దుస్తులు గర్భాలయ దర్శన వరుసలలో అనుమతించబడవు. ఈ నిబంధన తిరుమలలో దర్శన ప్రవేశానికి మాత్రమే వర్తిస్తుంది; తిరుపతిలోని టోకెన్ జారీ కౌంటర్ల వద్ద సాధారణ హుందైన దుస్తులు సరిపోతాయి.',
    6,
    true
),
(
    'wednesday-rule',
    'Are SSD and DD tokens issued on Wednesdays?',
    'No tokens are issued on Wednesdays for Thursday darshan.',
    'బుధవారాలలో SSD మరియు DD టోకెన్లు జారీ చేయబడతాయా?',
    'గురువారం దర్శనం కోసం బుధవారం నాడు టోకెన్లు జారీ చేయబడవు.',
    7,
    true
),
(
    'brahmotsavam-pause',
    'Is SSD and DD token issuance paused during annual Brahmotsavams?',
    'Yes. For the 2026 annual Salakatla Brahmotsavams, SSD and DD token issuance is paused from September 14 to September 23, 2026 to manage peak festival pilgrim congestion. Tokens for September 24, 2026 are scheduled to be issued on September 23 at 4:00 PM.',
    'వార్షిక బ్రహ్మోత్సవాల సమయంలో SSD మరియు DD టోకెన్ల జారీ నిలిపివేయబడుతుందా?',
    'అవును. 2026 వార్షిక సాలకట్ల బ్రహ్మోత్సవాల రద్దీ కారణంగా 2026 సెప్టెంబర్ 14 నుండి 23 వరకు SSD మరియు DD టోకెన్ల జారీ నిలిపివేయబడుతుంది. సెప్టెంబర్ 24, 2026 దర్శనానికి సంబంధించిన టోకెన్లు సెప్టెంబర్ 23 సాయంత్రం 4:00 గంటలకు జారీ చేయబడతాయి.',
    8,
    true
)
ON CONFLICT (id) DO UPDATE SET
    question = EXCLUDED.question,
    answer = EXCLUDED.answer,
    question_te = EXCLUDED.question_te,
    answer_te = EXCLUDED.answer_te,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = now();
