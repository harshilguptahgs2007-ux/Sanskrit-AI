/**
 * Shlokawise — Sanskrit AI Shloka Translator & Analyzer
 * Frontend Application Logic (Vanilla JavaScript)
 */

(function () {
    "use strict";

    // -------------------------------------------------------------------------
    // 1. Configuration & API Endpoints
    // -------------------------------------------------------------------------
    function getBaseApiUrl() {
        if (typeof window !== "undefined" && (window.location.protocol === "http:" || window.location.protocol === "https:")) {
            // If hosted directly on backend port 8000 or served through Vercel / serverless proxy
            if (window.location.port === "8000" || window.location.pathname.startsWith("/api") || window.location.hostname.includes("vercel.app")) {
                return "";
            }
        }
        return "http://127.0.0.1:8000";
    }

    const INTERPRET_ENDPOINT = `${getBaseApiUrl()}/interpret`;
    const TRANSLATE_ENDPOINT = `${getBaseApiUrl()}/translate`;
    const LOGIN_ENDPOINT = `${getBaseApiUrl()}/login`;

    // Authentic Sanskrit verses for the 5 example buttons
    const SCRIPTURE_EXAMPLES = {
        bg247: {
            title: "Bhagavad Gita 2.47",
            text: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥"
        },
        gayatri: {
            title: "Gayatri Mantra (Rigveda 3.62.10)",
            text: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं।\nभर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥"
        },
        yogasutras: {
            title: "Patanjali Yoga Sutras 1.2",
            text: "योगश्चित्तवृत्तिनिरोधः॥\nतदा द्रष्टुः स्वरूपेऽवस्थानम्॥"
        },
        shanti: {
            title: "Taittiriya Shanti Mantra",
            text: "ॐ सह नाववतु। सह नौ भुनक्तु।\nसह वीर्यं करवावहै।\nतेजस्वि नावधीतमस्तु मा विद्विषावहै।\nॐ शान्तिः शान्तिः शान्तिः॥"
        },
        ishavasya: {
            title: "Isha Upanishad — Verse 1",
            text: "ईशा वास्यमिदं सर्वं यत्किञ्च जगत्यां जगत्।\nतेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम्॥"
        }
    };

    // Offline Scholarly Data Cache (Enables rich exploration even when FastAPI is offline)
    const OFFLINE_CANONICAL_DATA = {
        "bg247": {
            "title": "Bhagavad Gita — Chapter 2, Verse 47 (Karma Yoga)",
            "shloka": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
            "meter": "Anuṣṭubh Chhandas (8-8-8-8 syllables)",
            "transliteration": "karmaṇy-evādhikāras te mā phaleṣu kadācana |\nmā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi ||",
            "translation": "You have a right only to perform your prescribed duty, but never to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to inaction.",
            "word_by_word": [
                {"word": "कर्मणि", "transliteration": "karmaṇi", "grammar": "Locative singular of karman (n.)", "meaning": "in action / prescribed duty"},
                {"word": "एव", "transliteration": "eva", "grammar": "Indeclinable emphasis", "meaning": "alone / only"},
                {"word": "अधिकारः", "transliteration": "adhikāraḥ", "grammar": "Nominative singular of adhikāra (m.)", "meaning": "right, jurisdiction, entitlement"},
                {"word": "ते", "transliteration": "te", "grammar": "Genitive singular of yuṣmad", "meaning": "your / to you"},
                {"word": "मा", "transliteration": "mā", "grammar": "Negative particle", "meaning": "never / not"},
                {"word": "फलेषु", "transliteration": "phaleṣu", "grammar": "Locative plural of phala (n.)", "meaning": "in the fruits or outcomes"},
                {"word": "कदाचन", "transliteration": "kadācana", "grammar": "Indeclinable adverb", "meaning": "at any time"},
                {"word": "कर्मफलहेतुः", "transliteration": "karma-phala-hetuḥ", "grammar": "Compound (Tatpuruṣa)", "meaning": "motivated by fruits of action"},
                {"word": "भूः", "transliteration": "bhūḥ", "grammar": "Aorist 2nd person singular of bhū", "meaning": "do not become"},
                {"word": "सङ्गः", "transliteration": "saṅgaḥ", "grammar": "Nominative singular of saṅga (m.)", "meaning": "attachment / clinging"},
                {"word": "अस्तु", "transliteration": "astu", "grammar": "Imperative 3rd person singular of as", "meaning": "let there be"},
                {"word": "अकर्मणि", "transliteration": "akarmaṇi", "grammar": "Locative singular of akarman (n.)", "meaning": "in inaction / passivity"}
            ],
            "philosophical_meaning": "This immortal shloka encapsulates Nishkama Karma—selfless action devoid of egoic grasping. Sri Krishna instructs that while human agency controls intention and exertion, the cosmic unfolding governs outcomes. Clinging to results produces psychological anxiety and suffering, whereas abandoning action leads to tamasic stagnation. The elevated path is detached dedication to duty as a sacred offering.",
            "context": "Spoken by Bhagavan Sri Krishna to Arjuna in the second chapter (Sankhya Yoga) of the Bhagavad Gita.",
            "key_takeaways": [
                "Focus 100% of conscious energy on process, ethics, and effort rather than obsessive anticipation of results.",
                "Avoid complacency: freedom from results is never an excuse for lethargy or retreating from moral duties.",
                "Liberate your mental health from external validation by grounding dignity in duty itself."
            ],
            "reflection_questions": [
                "In which areas of your daily endeavors is anxiety about the outcome hindering the quality of your execution?",
                "How can you reframe your daily work today as an act of selfless service rather than a transaction for approval?"
            ],
            "cross_faith": {
                "universal_teaching": "The universal dichotomy of control: distinguishing what lies within our sovereign power (our choices and virtues) from what lies beyond it (fortune and consequences).",
                "comparisons": [
                    { "tradition": "Stoicism (Epictetus)", "quote_or_concept": "Enchiridion: 'Some things are in our control and others not.'", "insight": "Epictetus teaches that tranquility emerges when we concern ourselves solely with our own judgments and actions, treating external outcomes with equanimity (amor fati)." },
                    { "tradition": "Taoism (Laozi)", "quote_or_concept": "Tao Te Ching: 'Act without expectation; accomplish without claiming credit.'", "insight": "Wu Wei (effortless action) mirrors Nishkama Karma—flowing with cosmic order without forcing self-centered outcomes." },
                    { "tradition": "Christianity (Colossians 3:23)", "quote_or_concept": "'Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.'", "insight": "Dedication of labor to the divine, releasing vanity and anxiety regarding worldly applause." }
                ]
            }
        },
        "gayatri": {
            "title": "Rigveda — Mandala 3, Sukta 62, Verse 10 (Gayatri Mantra)",
            "shloka": "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं।\nभर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥",
            "meter": "Gāyatrī Chhandas (24 syllables)",
            "transliteration": "oṁ bhūr bhuvaḥ svaḥ tat savitur vareṇyaṁ |\nbhargo devasya dhīmahi dhiyo yo naḥ pracodayāt ||",
            "translation": "Om, the physical, subtle, and celestial realms. We meditate upon the supreme, adorable spiritual radiance of the divine Sun (Savitur); may that Divine Light illuminate and awaken our intellect and consciousness.",
            "word_by_word": [
                {"word": "ॐ", "transliteration": "om", "grammar": "Pranava", "meaning": "primordial cosmic sound of Supreme Reality"},
                {"word": "भूः", "transliteration": "bhūḥ", "grammar": "Vyahriti (f.)", "meaning": "the physical realm / earth"},
                {"word": "भुवः", "transliteration": "bhuvaḥ", "grammar": "Vyahriti (n.)", "meaning": "the subtle atmospheric realm"},
                {"word": "स्वः", "transliteration": "svaḥ", "grammar": "Vyahriti (n.)", "meaning": "the celestial realm / heavenly consciousness"},
                {"word": "तत्", "transliteration": "tat", "grammar": "Demonstrative pronoun", "meaning": "that ultimate essence"},
                {"word": "सवितुः", "transliteration": "savituḥ", "grammar": "Genitive singular of savitṛ", "meaning": "of the solar deity, progenitor of light"},
                {"word": "वरेण्यम्", "transliteration": "vareṇyam", "grammar": "Accusative singular", "meaning": "most adorable, choicest, venerable"},
                {"word": "भर्गः", "transliteration": "bhargaḥ", "grammar": "Accusative singular", "meaning": "effulgence, divine purifying splendor"},
                {"word": "देवस्य", "transliteration": "devasya", "grammar": "Genitive singular of deva", "meaning": "of the luminous divine being"},
                {"word": "धीमहि", "transliteration": "dhīmahi", "grammar": "Optative 1st person plural", "meaning": "we meditate upon / internalize"},
                {"word": "धियः", "transliteration": "dhiyaḥ", "grammar": "Accusative plural of dhī", "meaning": "intellects, intuitive wisdom"},
                {"word": "यः", "transliteration": "yaḥ", "grammar": "Relative pronoun", "meaning": "who / that which"},
                {"word": "नः", "transliteration": "naḥ", "grammar": "Genitive/Accusative plural", "meaning": "our / for us"},
                {"word": "प्रचोदयात्", "transliteration": "pracodayāt", "grammar": "Optative 3rd person singular", "meaning": "may inspire, guide, and illuminate"}
            ],
            "philosophical_meaning": "The Gayatri Mantra shifts human prayer from material acquisition to divine illumination (Dhi-shakti). The external sun is recognized as an emblem of the inner luminous Atman. By attuning our mind to this pristine effulgence, ignorance and delusion are dispelled, granting discerning wisdom.",
            "context": "Revealed through Brahmarshi Vishvamitra in the Rigveda (3.62.10). Traditionally chanted during Sandhya for spiritual purification.",
            "key_takeaways": [
                "True sovereignty lies in an enlightened, clear, and serene intellect (Buddhi).",
                "The prayer is collective ('naḥ' = 'our intellects'), wishing illumination for all beings.",
                "Contemplation on inner light cleanses mental agitations."
            ],
            "reflection_questions": [
                "Are you seeking external solutions when what is needed is internal clarity of discernment?",
                "How does holding goodwill for the illumination of all beings shift your perspective?"
            ],
            "cross_faith": {
                "universal_teaching": "Invocation of the Primordial Light that dispels darkness, ignorance, and spiritual blindness.",
                "comparisons": [
                    { "tradition": "Zoroastrianism", "quote_or_concept": "Ahura Mazda & Ashem Vohu", "insight": "Veneration of light and the solar archetype as the visible symbol of supreme truth (Asha)." },
                    { "tradition": "Christianity (John 8:12)", "quote_or_concept": "'I am the light of the world; whoever follows me will not walk in darkness.'", "insight": "Divine light illuminating human consciousness from within." }
                ]
            }
        },
        "yogasutras": {
            "title": "Patanjali Yoga Sutras — Samadhi Pada 1.2 & 1.3",
            "shloka": "योगश्चित्तवृत्तिनिरोधः॥\nतदा द्रष्टुः स्वरूपेऽवस्थानम्॥",
            "meter": "Sutra Style (Aphoristic Prose)",
            "transliteration": "yogaś citta-vṛtti-nirodhaḥ ||\ntadā draṣṭuḥ svarūpe 'vasthānam ||",
            "translation": "Yoga is the cessation of the modifications and fluctuations of the mind-field. Then, the Seer (pure Consciousness) abides in its own authentic essential nature.",
            "word_by_word": [
                {"word": "योगः", "transliteration": "yogaḥ", "grammar": "Nominative singular of yoga", "meaning": "Yoga / integration / supreme union"},
                {"word": "चित्त", "transliteration": "citta", "grammar": "Compound stem", "meaning": "mind-field / consciousness apparatus"},
                {"word": "वृत्ति", "transliteration": "vṛtti", "grammar": "Compound stem", "meaning": "whirlpools, fluctuations, thought-waves"},
                {"word": "निरोधः", "transliteration": "nirodhaḥ", "grammar": "Nominative singular of nirodha", "meaning": "stilling, cessation, mastery"},
                {"word": "तदा", "transliteration": "tadā", "grammar": "Indeclinable adverb", "meaning": "then / at that state"},
                {"word": "द्रष्टुः", "transliteration": "draṣṭuḥ", "grammar": "Genitive singular of draṣṭṛ", "meaning": "of the Seer / pure witness consciousness"},
                {"word": "स्वरूपे", "transliteration": "svarūpe", "grammar": "Locative singular of svarūpa", "meaning": "in one's own true, essential nature"},
                {"word": "अवस्थानम्", "transliteration": "avasthānam", "grammar": "Nominative singular", "meaning": "abiding, resting, establishment"}
            ],
            "philosophical_meaning": "Maharshi Patanjali defines Raja Yoga. When the surface of the mental lake becomes perfectly still through disciplined practice (abhyasa) and dispassion (vairagya), the witness consciousness (Purusha) ceases falsely identifying with mental drama and recognizes its timeless reality.",
            "context": "Opening core definition in Patanjali's Yoga Sutras (1.2–1.3).",
            "key_takeaways": [
                "You are not your fleeting thoughts or emotional turbulence; you are the silent witness awareness behind them.",
                "Mastery of mind is achieved through calm awareness and systematic stilling of cognitive ripple.",
                "Resting in your essential nature brings invulnerable peace independent of external circumstances."
            ],
            "reflection_questions": [
                "Which thought patterns or mental whirlpools are currently dominating your attention?",
                "What happens to your stress level when you observe your thoughts without adopting them as your identity?"
            ],
            "cross_faith": {
                "universal_teaching": "Stillness of the mental faculty is the prerequisite for discovering transcendent truth and self-realization.",
                "comparisons": [
                    { "tradition": "Zen Buddhism", "quote_or_concept": "Mushin (No-Mind)", "insight": "Quietening conceptual chatter to perceive original Buddha-nature directly as it is." },
                    { "tradition": "Christian Contemplation (Psalm 46:10)", "quote_or_concept": "'Be still, and know that I am God.'", "insight": "Stepping beyond discursive intellect into sacred divine presence." }
                ]
            }
        },
        "shanti": {
            "title": "Taittiriya Upanishad — Shanti Patha (Peace Invocation)",
            "shloka": "ॐ सह नाववतु। सह नौ भुनक्तु।\nसह वीर्यं करवावहै।\nतेजस्वि नावधीतमस्तु मा विद्विषावहै।\nॐ शान्तिः शान्तिः शान्तिः॥",
            "meter": "Vedic Anustubh variation / Sacred Prose Chant",
            "transliteration": "oṁ saha nāv avatu | saha nau bhunaktu |\nsaha vīryaṁ karavāvahai |\ntejasvi nāv adhītam astu mā vidviṣāvahai |\noṁ śāntiḥ śāntiḥ śāntiḥ ||",
            "translation": "Om, may the Divine protect both teacher and student together. May He nourish us together. May we work together with great energy and capacity. May our study be brilliant and fruitful. May there be no animosity or misunderstanding between us. Om Peace, Peace, Peace.",
            "word_by_word": [
                {"word": "ॐ", "transliteration": "om", "grammar": "Sacred sound", "meaning": "primordial cosmic presence"},
                {"word": "सह", "transliteration": "saha", "grammar": "Preposition", "meaning": "together / jointly"},
                {"word": "नौ", "transliteration": "nau", "grammar": "Accusative dual of asmad", "meaning": "both of us (teacher and student)"},
                {"word": "अवतु", "transliteration": "avatu", "grammar": "Imperative 3rd singular", "meaning": "may He protect and preserve"},
                {"word": "भुनक्तु", "transliteration": "bhunaktu", "grammar": "Imperative 3rd singular", "meaning": "may He nourish and sustain"},
                {"word": "वीर्यम्", "transliteration": "vīryam", "grammar": "Accusative singular", "meaning": "vigor, dynamic capacity"},
                {"word": "करवावहै", "transliteration": "karavāvahai", "grammar": "Imperative 1st dual", "meaning": "may we both accomplish"},
                {"word": "तेजस्वि", "transliteration": "tejasvi", "grammar": "Nominative singular", "meaning": "luminous, brilliant, potent"},
                {"word": "अधीतम्", "transliteration": "adhītam", "grammar": "Noun", "meaning": "learning / knowledge studied"},
                {"word": "अस्तु", "transliteration": "astu", "grammar": "Imperative 3rd singular", "meaning": "may it be"},
                {"word": "मा", "transliteration": "mā", "grammar": "Negative particle", "meaning": "never / let not"},
                {"word": "विद्विषावहै", "transliteration": "vidviṣāvahai", "grammar": "Subjunctive 1st dual", "meaning": "may we harbor dislike or enmity"},
                {"word": "शान्तिः", "transliteration": "śāntiḥ", "grammar": "Nominative singular", "meaning": "peace across physical, subtle, and celestial realms"}
            ],
            "philosophical_meaning": "Establishes sacred symbiosis between mentor and disciple. Authentic spiritual knowledge requires mutual reverence, shared dedication, and harmonious alignment without transactional friction.",
            "context": "Traditional invocation found in Krishna Yajurveda, recited before initiating sacred study.",
            "key_takeaways": [
                "Collaborative empathy and mutual respect are essential prerequisites for deep learning.",
                "Protecting oneself from hostility ('mā vidviṣāvahai') safeguards intellect and relationship.",
                "Holistic peace requires tranquility within oneself, with society, and in relation to nature."
            ],
            "reflection_questions": [
                "Are your collaborative relationships grounded in competitive tension or mutual synergy?",
                "What steps can you take today to resolve lingering grievances before entering intellectual inquiry?"
            ],
            "cross_faith": {
                "universal_teaching": "The sacred fellowship of seeker and teacher united in humble pursuit of highest truth without rivalry.",
                "comparisons": [
                    { "tradition": "Judaism (Havruta)", "quote_or_concept": "Pirkei Avot", "insight": "Study partners sharpen each other like iron sharpening iron, bonded in shared dedication to truth." },
                    { "tradition": "Christian Community (Matthew 18:20)", "quote_or_concept": "'Where two or three gather in my name, there am I with them.'", "insight": "Spiritual presence flourishing in collective concord." }
                ]
            }
        },
        "ishavasya": {
            "title": "Isha Upanishad — Verse 1 (Shukla Yajurveda)",
            "shloka": "ईशा वास्यमिदं सर्वं यत्किञ्च जगत्यां जगत्।\nतेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम्॥",
            "meter": "Anuṣṭubh Chhandas (32 syllables)",
            "transliteration": "īśā vāsyam idaṁ sarvaṁ yat kiñca jagatyāṁ jagat |\ntena tyaktena bhuñjīthā mā gṛdhaḥ kasya svid dhanam ||",
            "translation": "All this—whatever exists in this changing universe—is enveloped and permeated by the Supreme Lord (Isha). Therefore, enjoy with renunciation; do not covet anyone's wealth.",
            "word_by_word": [
                {"word": "ईशा", "transliteration": "īśā", "grammar": "Instrumental singular of īś", "meaning": "by the Supreme Ruler / divine consciousness"},
                {"word": "वास्यम्", "transliteration": "vāsyam", "grammar": "Gerundive neuter", "meaning": "to be enveloped, covered, inhabited"},
                {"word": "इदम्", "transliteration": "idam", "grammar": "Demonstrative pronoun", "meaning": "this manifest world"},
                {"word": "सर्वम्", "transliteration": "sarvam", "grammar": "Nominative neuter", "meaning": "all / entire universe"},
                {"word": "यत्किञ्च", "transliteration": "yat kiñca", "grammar": "Indefinite compound", "meaning": "whatever tiny entity"},
                {"word": "जगत्याम्", "transliteration": "jagatyām", "grammar": "Locative singular of jagatī", "meaning": "in this ever-moving, transient cosmos"},
                {"word": "जगत्", "transliteration": "jagat", "grammar": "Nominative neuter", "meaning": "that which changes and moves"},
                {"word": "तेन", "transliteration": "tena", "grammar": "Instrumental pronoun", "meaning": "by that / therefore"},
                {"word": "त्यक्तेन", "transliteration": "tyaktena", "grammar": "Instrumental of tyakta", "meaning": "with renunciation / through detachment"},
                {"word": "भुञ्जीथाः", "transliteration": "bhuñjīthāḥ", "grammar": "Optative 2nd singular", "meaning": "enjoy, protect, sustain life"},
                {"word": "मा", "transliteration": "mā", "grammar": "Negative particle", "meaning": "do not"},
                {"word": "गृधः", "transliteration": "gṛdhaḥ", "grammar": "Aorist 2nd singular of gṛdh", "meaning": "covet, crave, be greedy"},
                {"word": "कस्यस्वित्", "transliteration": "kasya svit", "grammar": "Interrogative + particle", "meaning": "of whomsoever / of anyone"},
                {"word": "धनम्", "transliteration": "dhanam", "grammar": "Accusative singular", "meaning": "wealth, possession, material goods"}
            ],
            "philosophical_meaning": "Establishes divine immanence: the cosmos is not a godless commodity to exploit, but the sacred manifestation of the Divine. 'Tyaktena bhuñjīthā' resolves the paradox of consumption and renunciation: enjoy life joyfully as a trustee with detachment.",
            "context": "The celebrated opening mantra of the Isha Upanishad (40th chapter of Shukla Yajurveda Samhita).",
            "key_takeaways": [
                "Perceive the sacred in all matter and life, fostering ecological and spiritual reverence.",
                "Freedom from greed brings genuine joy: utilize what is given without neurotic hoarding.",
                "Wealth is a transient custody, not an ultimate badge of identity."
            ],
            "reflection_questions": [
                "In what ways are you treating resources or relationships with possession rather than reverence?",
                "How does the understanding that everything is enveloped by the Divine change your lifestyle?"
            ],
            "cross_faith": {
                "universal_teaching": "Sacred stewardship: the universe belongs to the Divine, and humans are custodians called to live with joyful reverence and detachment.",
                "comparisons": [
                    { "tradition": "Indigenous Earth Wisdom", "quote_or_concept": "All My Relations (Mitakuye Oyasin)", "insight": "Recognizing the divine heartbeat inside all created things and taking only what is needed." },
                    { "tradition": "Christian Stewardship (Psalm 24:1)", "quote_or_concept": "'The earth is the Lord's, and everything in it.'", "insight": "Living as humble trustees rather than absolute owners." }
                ]
            }
        }
    };

    // Vocabulary quick-load triggers
    const VOCABULARY_SHLOKAS = {
        "धर्म (Dharma)": "धर्मो रक्षति रक्षितः। तस्माद्धर्मो न हन्तव्यो मा नो धर्मो हतोऽवधीत्॥",
        "सत्य (Satya)": "सत्यमेव जयते नानृतं सत्येन पन्था विततो देवयानः॥",
        "मोक्ष (Moksha)": "यदा सर्वे प्रमुच्यन्ते कामा येऽस्य हृदि श्रिताः। अथ मर्त्योऽमृतो भवत्यत्र ब्रह्म समश्नुते॥",
        "ब्रह्मन् (Brahman)": "सर्वं खल्विदं ब्रह्म तज्जलानिति शान्त उपासीत॥",
        "आत्मन् (Atman)": "अयमात्मा ब्रह्म। प्रज्ञानं ब्रह्म। अहं ब्रह्मास्मि। तत्त्वमसि॥",
        "अहिंसा (Ahimsa)": "अहिंसा परमो धर्मस्तथाहिंसा परं तपः। अहिंसा परमं सत्यं यतो धर्मः प्रवर्तते॥"
    };

    // -------------------------------------------------------------------------
    // 2. English-to-Devanagari Phonetic Transliteration Engine
    //    Enables users without a Hindi keyboard to type phonetically in English!
    // -------------------------------------------------------------------------
    function transliterateEnglishToDevanagari(input) {
        if (!input) return "";

        const specialWords = {
            "harshil": "हर्षिल",
            "harshila": "हर्षिलः",
            "harsh": "हर्ष",
            "namaste": "नमस्ते",
            "namaskar": "नमस्कार",
            "om": "ॐ",
            "aum": "ॐ",
            "shri": "श्री",
            "shree": "श्री",
            "swaha": "स्वाहा",
            "svaha": "स्वाहा",
            "shanti": "शान्ति",
            "dharma": "धर्म",
            "karma": "कर्म",
            "krishna": "कृष्ण",
            "rama": "राम",
            "ram": "राम",
            "shiva": "शिव",
            "shiv": "शिव",
            "satya": "सत्य",
            "satyam": "सत्यम्",
            "yoga": "योग",
            "shloka": "श्लोक",
            "sloka": "श्लोक",
            "moksha": "मोक्ष",
            "ahimsa": "अहिंसा",
            "brahman": "ब्रह्मन्",
            "atman": "आत्मन्",
            "guru": "गुरु",
            "gita": "गीता",
            "bhagavad": "भगवद्",
            "sanskrit": "संस्कृत"
        };

        const vowels = {
            "aa": "आ", "A": "आ", "ii": "ई", "ee": "ई", "I": "ई", "uu": "ऊ", "oo": "ऊ", "U": "ऊ",
            "ai": "ऐ", "au": "औ", "ou": "औ", "ri": "ऋ", "r^i": "ऋ", "R": "ऋ",
            "a": "अ", "i": "इ", "u": "उ", "e": "ए", "o": "ओ"
        };

        const matras = {
            "aa": "ा", "A": "ा", "ii": "ी", "ee": "ी", "I": "ी", "uu": "ू", "oo": "ू", "U": "ू",
            "ai": "ै", "au": "ौ", "ou": "ौ", "ri": "ृ", "r^i": "ृ", "R": "ृ",
            "a": "", "i": "ि", "u": "ु", "e": "े", "o": "ो"
        };

        const consonants = [
            ["ksha", "क्ष"], ["ksh", "क्ष्"], ["gya", "ज्ञ"], ["gy", "ज्ञ्"], ["jnya", "ज्ञ"], ["jny", "ज्ञ्"],
            ["shra", "श्र"], ["shr", "श्र्"], ["tra", "त्र"], ["tr", "त्र्"],
            ["chha", "छ"], ["chh", "छ्"], ["kha", "ख"], ["kh", "ख्"],
            ["gha", "घ"], ["gh", "घ्"], ["cha", "च"], ["ch", "च्"],
            ["jha", "झ"], ["jh", "झ्"],
            ["Tha", "ठ"], ["Th", "ठ्"], ["tha", "थ"], ["th", "थ्"],
            ["Dha", "ढ"], ["Dh", "ढ्"], ["dha", "ध"], ["dh", "ध्"],
            ["pha", "फ"], ["ph", "फ्"], ["bha", "भ"], ["bh", "भ्"],
            ["shha", "ष"], ["shh", "ष्"], ["Sha", "ष"], ["Sh", "ष्"],
            ["sha", "श"], ["sh", "श्"], ["nga", "ङ"], ["ng", "ङ्"],
            ["nya", "ञ"], ["ny", "ञ्"],
            ["ka", "क"], ["k", "क्"], ["ga", "ग"], ["g", "ग्"],
            ["ja", "ज"], ["j", "ज्"],
            ["Ta", "ट"], ["T", "ट्"], ["ta", "त"], ["t", "त्"],
            ["Da", "ड"], ["D", "ड्"], ["da", "द"], ["d", "द्"],
            ["Na", "ण"], ["N", "ण्"], ["na", "न"], ["n", "न्"],
            ["pa", "प"], ["p", "प्"], ["ba", "ब"], ["b", "ब्"], ["ma", "म"], ["m", "म्"],
            ["ya", "य"], ["y", "य्"], ["ra", "र"], ["r", "र्"],
            ["la", "ल"], ["l", "ल्"], ["va", "व"], ["v", "व्"], ["wa", "व"], ["w", "व्"],
            ["sa", "स"], ["s", "स्"], ["ha", "ह"], ["h", "ह्"]
        ];

        function convertWord(word) {
            if (!word) return "";
            const lower = word.toLowerCase();
            if (specialWords[lower]) return specialWords[lower];

            let out = "";
            let i = 0;
            const len = word.length;

            while (i < len) {
                let ch = word[i];

                if (!/[a-zA-Z]/.test(ch)) {
                    out += ch;
                    i++;
                    continue;
                }

                // Match consonants first
                let matchedCons = null;
                let consStr = "";
                for (const [cKey, cVal] of consonants) {
                    if (word.substring(i).startsWith(cKey)) {
                        matchedCons = cVal;
                        consStr = cKey;
                        break;
                    }
                }
                if (!matchedCons) {
                    for (const [cKey, cVal] of consonants) {
                        if (word.substring(i).toLowerCase().startsWith(cKey.toLowerCase())) {
                            matchedCons = cVal;
                            consStr = cKey;
                            break;
                        }
                    }
                }

                if (matchedCons) {
                    i += consStr.length;
                    if (consStr.endsWith("a")) {
                        let matchedMatra = null;
                        let matraStr = "";
                        for (const mKey of ["a", "i", "u", "e", "o"]) {
                            if (word.substring(i).toLowerCase().startsWith(mKey)) {
                                matchedMatra = matras["a" + mKey] || matras[mKey];
                                matraStr = mKey;
                                break;
                            }
                        }
                        if (matchedMatra) {
                            out += matchedCons.slice(0, -1) + matchedMatra;
                            i += matraStr.length;
                        } else {
                            out += matchedCons;
                        }
                    } else {
                        let matchedMatra = null;
                        let matraStr = "";
                        const vowelKeys = ["aa", "A", "ii", "ee", "I", "uu", "oo", "U", "ai", "au", "ou", "ri", "a", "i", "u", "e", "o", "R"];
                        for (const vk of vowelKeys) {
                            if (word.substring(i).toLowerCase().startsWith(vk.toLowerCase())) {
                                matchedMatra = matras[vk] !== undefined ? matras[vk] : matras[vk.toLowerCase()];
                                matraStr = vk;
                                break;
                            }
                        }

                        if (matchedMatra !== null && matchedMatra !== undefined) {
                            const baseChar = matchedCons.endsWith("्") ? matchedCons.slice(0, -1) : matchedCons;
                            out += baseChar + matchedMatra;
                            i += matraStr.length;
                        } else {
                            const isEnd = (i >= len || !/[a-zA-Z]/.test(word[i]));
                            if (isEnd) {
                                out += (matchedCons.endsWith("्") ? matchedCons.slice(0, -1) : matchedCons);
                            } else {
                                out += matchedCons;
                            }
                        }
                    }
                } else {
                    let matchedVowel = null;
                    let vStr = "";
                    const vowelKeys = ["aa", "A", "ii", "ee", "I", "uu", "oo", "U", "ai", "au", "ou", "ri", "a", "i", "u", "e", "o", "R"];
                    for (const vk of vowelKeys) {
                        if (word.substring(i).toLowerCase().startsWith(vk.toLowerCase())) {
                            matchedVowel = vowels[vk] || vowels[vk.toLowerCase()];
                            vStr = vk;
                            break;
                        }
                    }

                    if (matchedVowel) {
                        out += matchedVowel;
                        i += vStr.length;
                    } else {
                        out += ch;
                        i++;
                    }
                }
            }

            return out;
        }

        return input.replace(/([a-zA-Z]+)/g, (match) => convertWord(match));
    }

    // -------------------------------------------------------------------------
    // 3. DOM Elements
    // -------------------------------------------------------------------------
    const shlokaInput = document.getElementById("shlokaInput");
    const charCounter = document.getElementById("charCounter");
    const validationBanner = document.getElementById("validationBanner");
    const validationText = document.getElementById("validationText");

    // Action buttons
    const interpretBtn = document.getElementById("interpretBtn");
    const btnLabel = document.getElementById("btnLabel");
    const btnSpinner = document.getElementById("btnSpinner");
    const translateBtn = document.getElementById("translateBtn");
    const translateBtnLabel = document.getElementById("translateBtnLabel");
    const translateSpinner = document.getElementById("translateSpinner");

    // Keyboard & Language tools
    const liveTranslitToggle = document.getElementById("liveTranslitToggle");
    const transliterateBtn = document.getElementById("transliterateBtn");
    const toggleVirtualKbBtn = document.getElementById("toggleVirtualKbBtn");
    const closeVirtualKbBtn = document.getElementById("closeVirtualKbBtn");
    const virtualKeyboardPanel = document.getElementById("virtualKeyboardPanel");
    const translitStatusBar = document.getElementById("translitStatusBar");
    const translitStatusMsg = document.getElementById("translitStatusMsg");
    const miniTranslitBtn = document.getElementById("miniTranslitBtn");
    const miniTranslateBtn = document.getElementById("miniTranslateBtn");
    const vkSpaceBtn = document.getElementById("vkSpaceBtn");
    const vkBackspaceBtn = document.getElementById("vkBackspaceBtn");
    const vkClearBtn = document.getElementById("vkClearBtn");

    const modeButtons = document.querySelectorAll(".mode-btn");
    const exampleButtons = document.querySelectorAll(".example-btn");

    // Results elements
    const resultsSection = document.getElementById("resultsSection");
    const resultTitle = document.getElementById("resultTitle");
    const resultModeBadge = document.getElementById("resultModeBadge");
    const resultMeter = document.getElementById("resultMeter");
    const resSanskrit = document.getElementById("resSanskrit");
    const resTransliteration = document.getElementById("resTransliteration");
    const resTranslation = document.getElementById("resTranslation");
    const resWordTableBody = document.getElementById("resWordTableBody");
    const resPhilosophical = document.getElementById("resPhilosophical");
    const resContext = document.getElementById("resContext");
    const resTakeaways = document.getElementById("resTakeaways");
    const resReflections = document.getElementById("resReflections");
    const resUniversalTeaching = document.getElementById("resUniversalTeaching");
    const resCrossFaithGrid = document.getElementById("resCrossFaithGrid");

    // Containers
    const cardTransliteration = document.getElementById("cardTransliteration");
    const cardWordByWord = document.getElementById("cardWordByWord");
    const cardPhilosophical = document.getElementById("cardPhilosophical");
    const cardContext = document.getElementById("cardContext");
    const cardTakeaways = document.getElementById("cardTakeaways");
    const cardReflections = document.getElementById("cardReflections");
    const cardCrossFaith = document.getElementById("cardCrossFaith");

    const copyShlokaBtn = document.getElementById("copyShlokaBtn");
    const copyTranslationBtn = document.getElementById("copyTranslationBtn");
    const copyAllBtn = document.getElementById("copyAllBtn");
    const newInterpretBtn = document.getElementById("newInterpretBtn");

    // Error Section
    const errorSection = document.getElementById("errorSection");
    const errorTitle = document.getElementById("errorTitle");
    const errorMessage = document.getElementById("errorMessage");
    const errorCloseBtn = document.getElementById("errorCloseBtn");
    const copyCmdBtn = document.getElementById("copyCmdBtn");
    const fallbackExploreBtn = document.getElementById("fallbackExploreBtn");

    // Navigation & Authentication Elements
    const navLoginBtn = document.getElementById("navLoginBtn");
    const profileDropdownContainer = document.getElementById("profileDropdownContainer");
    const profileBtn = document.getElementById("profileBtn");
    const profileMenu = document.getElementById("profileMenu");
    const navUsername = document.getElementById("navUsername");
    const menuUserName = document.getElementById("menuUserName");
    const menuUserEmail = document.getElementById("menuUserEmail");
    const menuSignOut = document.getElementById("menuSignOut");
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileDrawer = document.getElementById("mobileDrawer");
    const mobileAuthBtn = document.getElementById("mobileAuthBtn");
    const mobileAuthLabel = document.getElementById("mobileAuthLabel");

    // Login Modal Elements
    const loginModal = document.getElementById("loginModal");
    const closeLoginModalBtn = document.getElementById("closeLoginModalBtn");
    const authForm = document.getElementById("authForm");
    const authNameInput = document.getElementById("authNameInput");
    const authEmailInput = document.getElementById("authEmailInput");
    const authPasswordInput = document.getElementById("authPasswordInput");
    const authSubmitBtn = document.getElementById("authSubmitBtn");
    const authSpinner = document.getElementById("authSpinner");
    const authBtnLabel = document.getElementById("authBtnLabel");
    const authGuestBtn = document.getElementById("authGuestBtn");

    const toastNotification = document.getElementById("toastNotification");
    const toastMessage = document.getElementById("toastMessage");

    const dailyInterpretBtn = document.getElementById("dailyInterpretBtn");
    const dailySanskritText = document.getElementById("dailySanskritText");

    // State Variables
    let selectedMode = "full";
    let lastInterpretationData = null;
    let isRequestInProgress = false;
    let pendingActionAfterLogin = null;

    // -------------------------------------------------------------------------
    // 4. Seeker Authentication & Database Sync
    // -------------------------------------------------------------------------
    function getCurrentUser() {
        try {
            const raw = localStorage.getItem("shlokawise_user");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    function setCurrentUser(user) {
        try {
            localStorage.setItem("shlokawise_user", JSON.stringify(user));
        } catch (e) {
            console.warn("localStorage error:", e);
        }
        updateAuthUI();
    }

    function clearCurrentUser() {
        try {
            localStorage.removeItem("shlokawise_user");
        } catch (e) {
            console.warn("localStorage error:", e);
        }
        updateAuthUI();
    }

    function updateAuthUI() {
        const user = getCurrentUser();

        if (user && user.name) {
            if (navLoginBtn) navLoginBtn.hidden = true;
            if (profileDropdownContainer) profileDropdownContainer.hidden = false;

            const parts = user.name.trim().split(/\s+/);
            const shortName = parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : parts[0];
            if (navUsername) navUsername.textContent = shortName;
            if (menuUserName) menuUserName.textContent = user.name;
            if (menuUserEmail) menuUserEmail.textContent = user.email || "seeker@shlokawise.org";
            if (mobileAuthLabel) mobileAuthLabel.textContent = `${shortName} (Signed In)`;
        } else {
            if (navLoginBtn) navLoginBtn.hidden = false;
            if (profileDropdownContainer) profileDropdownContainer.hidden = true;
            if (mobileAuthLabel) mobileAuthLabel.textContent = "Log In / Sign Up";
        }
    }

    function openLoginModal(actionCallback = null) {
        if (actionCallback) {
            pendingActionAfterLogin = actionCallback;
        }
        if (loginModal) {
            loginModal.hidden = false;
            if (authNameInput) authNameInput.focus();
        }
    }

    function closeLoginModal() {
        if (loginModal) {
            loginModal.hidden = true;
        }
    }

    async function handleAuthSubmit(e) {
        if (e) e.preventDefault();
        const name = authNameInput ? authNameInput.value.trim() : "";
        const email = authEmailInput ? authEmailInput.value.trim().toLowerCase() : "";
        const password = authPasswordInput ? authPasswordInput.value.trim() : "seeker123";

        if (!name) {
            showToast("Please enter your name.");
            if (authNameInput) authNameInput.focus();
            return;
        }
        if (!email || !email.includes("@")) {
            showToast("Please enter a valid email address.");
            if (authEmailInput) authEmailInput.focus();
            return;
        }

        if (authSubmitBtn) authSubmitBtn.disabled = true;
        if (authSpinner) authSpinner.hidden = false;
        if (authBtnLabel) authBtnLabel.textContent = "Authenticating...";

        try {
            // Save in SQLite Database via FastAPI backend
            const response = await fetch(LOGIN_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            let userData;
            if (response.ok) {
                const data = await response.json();
                userData = data.user || { name, email };
            } else {
                const errData = await response.json().catch(() => ({}));
                console.warn("Backend auth notice:", errData);
                userData = { name, email };
            }

            setCurrentUser(userData);
            closeLoginModal();
            showToast(`Welcome, ${userData.name}! ✦`);

            // Automatically execute the pending English-to-Sanskrit conversion!
            if (typeof pendingActionAfterLogin === "function") {
                const action = pendingActionAfterLogin;
                pendingActionAfterLogin = null;
                setTimeout(() => action(), 150);
            }

        } catch (err) {
            console.warn("Offline auth fallback:", err);
            const userData = { name, email };
            setCurrentUser(userData);
            closeLoginModal();
            showToast(`Welcome, ${name}! (Offline mode) ✦`);

            if (typeof pendingActionAfterLogin === "function") {
                const action = pendingActionAfterLogin;
                pendingActionAfterLogin = null;
                setTimeout(() => action(), 150);
            }
        } finally {
            if (authSubmitBtn) authSubmitBtn.disabled = false;
            if (authSpinner) authSpinner.hidden = true;
            if (authBtnLabel) authBtnLabel.textContent = "Sign In & Convert ✦";
        }
    }

    function handleGuestLogin() {
        const guestUser = {
            name: "Guest Seeker",
            email: `seeker_${Date.now().toString().slice(-4)}@shlokawise.org`
        };

        // Async save to SQLite DB
        fetch(LOGIN_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: guestUser.name, email: guestUser.email, password: "guest" })
        }).catch(() => {});

        setCurrentUser(guestUser);
        closeLoginModal();
        showToast("Signed in as Guest Seeker ✦");

        if (typeof pendingActionAfterLogin === "function") {
            const action = pendingActionAfterLogin;
            pendingActionAfterLogin = null;
            setTimeout(() => action(), 150);
        }
    }

    // -------------------------------------------------------------------------
    // 4. UI Helpers: Character Count, Toast, Errors
    // -------------------------------------------------------------------------
    function updateCharacterCount() {
        if (!shlokaInput || !charCounter) return;
        const count = shlokaInput.value.length;
        charCounter.textContent = `${count} / 4000 characters`;
        if (count > 4000) {
            charCounter.style.color = "#dc2626";
        } else {
            charCounter.style.color = "var(--text-light-brown)";
        }

        // Check if current text has English letters
        checkEnglishTextPresence();
    }

    function checkEnglishTextPresence() {
        if (!shlokaInput || !translitStatusBar) return;
        const val = shlokaInput.value;
        const hasEnglish = /[a-zA-Z]/.test(val);
        if (hasEnglish) {
            translitStatusBar.hidden = false;
            if (translitStatusMsg) {
                const words = val.trim().split(/\s+/);
                const lastWord = words[words.length - 1] || "";
                if (lastWord && /[a-zA-Z]/.test(lastWord)) {
                    const preview = transliterateEnglishToDevanagari(lastWord);
                    translitStatusMsg.innerHTML = `English detected: <strong>"${escapeHtml(lastWord)}"</strong> ➔ <strong>${escapeHtml(preview)}</strong>`;
                } else {
                    translitStatusMsg.textContent = "English text detected. Click below to convert or translate to Sanskrit:";
                }
            }
        } else {
            translitStatusBar.hidden = true;
        }
    }

    function showValidation(msg) {
        if (!validationBanner || !validationText) return;
        validationText.textContent = msg;
        validationBanner.hidden = false;
    }

    function hideValidation() {
        if (!validationBanner) return;
        validationBanner.hidden = true;
    }

    function showToast(message) {
        if (!toastNotification || !toastMessage) return;
        toastMessage.textContent = message;
        toastNotification.classList.add("show");
        setTimeout(() => {
            toastNotification.classList.remove("show");
        }, 2600);
    }

    function showError(title, msg) {
        if (!errorSection) return;
        if (errorTitle) errorTitle.textContent = title;
        if (errorMessage) errorMessage.textContent = msg;
        errorSection.hidden = false;
        errorSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function hideError() {
        if (errorSection) {
            errorSection.hidden = true;
        }
    }

    // Insert text at current cursor position in textarea
    function insertAtCursor(text) {
        if (!shlokaInput) return;
        shlokaInput.focus();
        const start = shlokaInput.selectionStart;
        const end = shlokaInput.selectionEnd;
        const val = shlokaInput.value;
        shlokaInput.value = val.substring(0, start) + text + val.substring(end);
        shlokaInput.selectionStart = shlokaInput.selectionEnd = start + text.length;
        updateCharacterCount();
        hideValidation();
    }

    // -------------------------------------------------------------------------
    // 5. English-to-Sanskrit Live Transliteration & Virtual Keyboard
    // -------------------------------------------------------------------------
    // Space-key trigger for live word-by-word phonetic transliteration
    if (shlokaInput) {
        shlokaInput.addEventListener("keydown", (e) => {
            // Check for Ctrl+Enter or Cmd+Enter to interpret
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                handleInterpretation();
                return;
            }

            // Live transliteration on space
            if (liveTranslitToggle && liveTranslitToggle.checked && (e.key === " " || e.code === "Space")) {
                const cursorPos = shlokaInput.selectionStart;
                const textBeforeCursor = shlokaInput.value.substring(0, cursorPos);
                const match = textBeforeCursor.match(/([a-zA-Z]+)$/);

                if (match) {
                    const engWord = match[1];
                    const devWord = transliterateEnglishToDevanagari(engWord);
                    const replaceStart = cursorPos - engWord.length;

                    // Replace with devanagari word plus the space
                    const textAfterCursor = shlokaInput.value.substring(cursorPos);
                    shlokaInput.value = shlokaInput.value.substring(0, replaceStart) + devWord + " " + textAfterCursor;
                    const newCursor = replaceStart + devWord.length + 1;
                    shlokaInput.selectionStart = shlokaInput.selectionEnd = newCursor;

                    e.preventDefault(); // Handled space insertion
                    updateCharacterCount();
                }
            }
        });

        shlokaInput.addEventListener("input", () => {
            updateCharacterCount();
            hideValidation();
        });
    }

    // Convert whole input from English to Sanskrit Devanagari button
    function convertInputToDevanagari() {
        if (!shlokaInput) return;
        const val = shlokaInput.value;
        if (!val.trim()) {
            showValidation("Please type English text (e.g. harshil, namaste, BG 2.47) to convert to Sanskrit.");
            shlokaInput.focus();
            return;
        }

        // Gate with login
        if (!getCurrentUser()) {
            openLoginModal(() => convertInputToDevanagari());
            return;
        }

        const converted = transliterateEnglishToDevanagari(val);
        shlokaInput.value = converted;
        updateCharacterCount();
        hideValidation();
        showToast("Converted English to Sanskrit Devanagari ✦");
    }

    if (transliterateBtn) {
        transliterateBtn.addEventListener("click", convertInputToDevanagari);
    }
    if (miniTranslitBtn) {
        miniTranslitBtn.addEventListener("click", convertInputToDevanagari);
    }

    // Virtual Keyboard Toggle
    if (toggleVirtualKbBtn && virtualKeyboardPanel) {
        toggleVirtualKbBtn.addEventListener("click", () => {
            virtualKeyboardPanel.hidden = !virtualKeyboardPanel.hidden;
            if (!virtualKeyboardPanel.hidden) {
                virtualKeyboardPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        });
    }

    if (closeVirtualKbBtn && virtualKeyboardPanel) {
        closeVirtualKbBtn.addEventListener("click", () => {
            virtualKeyboardPanel.hidden = true;
        });
    }

    // Virtual Keyboard character keys
    document.querySelectorAll(".vk-key[data-char]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const char = btn.getAttribute("data-char");
            if (char) {
                insertAtCursor(char);
            }
        });
    });

    if (vkSpaceBtn) {
        vkSpaceBtn.addEventListener("click", (e) => {
            e.preventDefault();
            insertAtCursor(" ");
        });
    }

    if (vkBackspaceBtn) {
        vkBackspaceBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (!shlokaInput) return;
            shlokaInput.focus();
            const start = shlokaInput.selectionStart;
            const end = shlokaInput.selectionEnd;
            const val = shlokaInput.value;
            if (start === end) {
                if (start > 0) {
                    shlokaInput.value = val.substring(0, start - 1) + val.substring(end);
                    shlokaInput.selectionStart = shlokaInput.selectionEnd = start - 1;
                }
            } else {
                shlokaInput.value = val.substring(0, start) + val.substring(end);
                shlokaInput.selectionStart = shlokaInput.selectionEnd = start;
            }
            updateCharacterCount();
        });
    }

    if (vkClearBtn) {
        vkClearBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (shlokaInput) {
                shlokaInput.value = "";
                updateCharacterCount();
                shlokaInput.focus();
            }
        });
    }

    // -------------------------------------------------------------------------
    // 6. English-to-Sanskrit AI Translation Integration
    // -------------------------------------------------------------------------
    function setTranslatingState(translating) {
        if (!translateBtn) return;
        translateBtn.disabled = translating;
        if (translating) {
            if (translateSpinner) translateSpinner.hidden = false;
            if (translateBtnLabel) translateBtnLabel.textContent = "Translating...";
        } else {
            if (translateSpinner) translateSpinner.hidden = true;
            if (translateBtnLabel) translateBtnLabel.textContent = "Translate English ➔ Sanskrit ॐ";
        }
    }

    async function handleTranslation() {
        if (isRequestInProgress) return;

        const rawText = shlokaInput ? shlokaInput.value.trim() : "";
        if (!rawText) {
            showValidation("Please enter English text or phrase to translate to Sanskrit.");
            if (shlokaInput) shlokaInput.focus();
            return;
        }

        // Gate with login
        if (!getCurrentUser()) {
            openLoginModal(() => handleTranslation());
            return;
        }

        hideValidation();
        hideError();
        setTranslatingState(true);

        try {
            const response = await fetch(TRANSLATE_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    text: rawText,
                    source_language_code: "en-IN"
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.detail || `Translation returned status ${response.status}.`);
            }

            const data = await response.json();
            if (data.sanskrit_text && shlokaInput) {
                shlokaInput.value = data.sanskrit_text;
                updateCharacterCount();
                showToast(`Translated: "${rawText}" ➔ "${data.sanskrit_text}" ✦`);
                showValidation("Click 'Interpret ✦' to view complete scholarly analysis and breakdown!");
            }

        } catch (err) {
            console.warn("Backend translation unreachable, falling back to local transliteration:", err);
            // If backend is offline, perform instant offline phonetic conversion!
            const phonetic = transliterateEnglishToDevanagari(rawText);
            if (shlokaInput) {
                shlokaInput.value = phonetic;
                updateCharacterCount();
            }

            if (err.name === "TypeError" && err.message.toLowerCase().includes("fetch")) {
                showToast(`Converted phonetically: ${phonetic} (Backend offline)`);
                showError(
                    "FastAPI Backend Server is Offline",
                    `Unable to connect to ${TRANSLATE_ENDPOINT}. The app performed instant offline phonetic transliteration to Sanskrit. To enable Sarvam AI contextual translation and deep interpretation, please start the local backend server.`
                );
            } else {
                showToast(`Converted to Devanagari: ${phonetic}`);
            }
        } finally {
            setTranslatingState(false);
        }
    }

    if (translateBtn) {
        translateBtn.addEventListener("click", handleTranslation);
    }
    if (miniTranslateBtn) {
        miniTranslateBtn.addEventListener("click", handleTranslation);
    }

    // -------------------------------------------------------------------------
    // 7. Navigation & Profile Dropdown & Authentication Modal
    // -------------------------------------------------------------------------
    if (navLoginBtn) {
        navLoginBtn.addEventListener("click", () => openLoginModal());
    }

    if (mobileAuthBtn) {
        mobileAuthBtn.addEventListener("click", () => {
            if (getCurrentUser()) {
                clearCurrentUser();
                showToast("Signed out of Seeker account");
            } else {
                openLoginModal();
            }
        });
    }

    if (closeLoginModalBtn) {
        closeLoginModalBtn.addEventListener("click", closeLoginModal);
    }

    if (loginModal) {
        loginModal.addEventListener("click", (e) => {
            if (e.target === loginModal) {
                closeLoginModal();
            }
        });
    }

    if (authForm) {
        authForm.addEventListener("submit", handleAuthSubmit);
    }

    if (authGuestBtn) {
        authGuestBtn.addEventListener("click", handleGuestLogin);
    }

    if (menuSignOut) {
        menuSignOut.addEventListener("click", () => {
            clearCurrentUser();
            const container = document.querySelector(".profile-dropdown-container");
            if (container) container.classList.remove("open");
            if (profileBtn) profileBtn.setAttribute("aria-expanded", "false");
            showToast("Signed out of Seeker account");
        });
    }

    if (profileBtn && profileMenu) {
        profileBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const container = profileBtn.closest(".profile-dropdown-container");
            const isOpen = container.classList.toggle("open");
            profileBtn.setAttribute("aria-expanded", isOpen);
        });

        document.addEventListener("click", (e) => {
            const container = document.querySelector(".profile-dropdown-container");
            if (container && !container.contains(e.target)) {
                container.classList.remove("open");
                if (profileBtn) profileBtn.setAttribute("aria-expanded", "false");
            }
        });
    }

    if (mobileMenuBtn && mobileDrawer) {
        mobileMenuBtn.addEventListener("click", () => {
            const isOpen = mobileMenuBtn.classList.toggle("open");
            mobileDrawer.classList.toggle("open", isOpen);
        });

        mobileDrawer.querySelectorAll(".mobile-nav-link").forEach((link) => {
            link.addEventListener("click", () => {
                mobileMenuBtn.classList.remove("open");
                mobileDrawer.classList.remove("open");
            });
        });
    }

    if (errorCloseBtn) {
        errorCloseBtn.addEventListener("click", hideError);
    }

    if (copyCmdBtn) {
        copyCmdBtn.addEventListener("click", () => {
            copyTextToClipboard("uvicorn backend.app:app --reload --port 8000", "Server start command copied!", copyCmdBtn);
        });
    }

    if (fallbackExploreBtn) {
        fallbackExploreBtn.addEventListener("click", () => {
            hideError();
            const verseData = SCRIPTURE_EXAMPLES.bg247;
            if (shlokaInput && verseData) {
                shlokaInput.value = verseData.text;
                updateCharacterCount();
                renderResults(OFFLINE_CANONICAL_DATA.bg247, selectedMode);
                if (resultsSection) {
                    resultsSection.hidden = false;
                    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
                }
                showToast("Loaded Bhagavad Gita 2.47 in offline mode ✦");
            }
        });
    }

    // -------------------------------------------------------------------------
    // 8. Example Shloka Buttons Interaction
    // -------------------------------------------------------------------------
    exampleButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const verseKey = btn.getAttribute("data-verse");
            const verseData = SCRIPTURE_EXAMPLES[verseKey];

            if (verseData && shlokaInput) {
                exampleButtons.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");

                shlokaInput.value = verseData.text;
                updateCharacterCount();
                hideValidation();
                hideError();

                shlokaInput.focus();
                showToast(`Loaded: ${verseData.title}`);
            }
        });
    });

    document.querySelectorAll(".quick-load-link").forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const verseKey = link.getAttribute("data-verse");
            const verseData = SCRIPTURE_EXAMPLES[verseKey];
            if (verseData && shlokaInput) {
                shlokaInput.value = verseData.text;
                updateCharacterCount();
                hideValidation();
                hideError();
                document.getElementById("interpret").scrollIntoView({ behavior: "smooth" });
                shlokaInput.focus();
                showToast(`Loaded: ${verseData.title}`);
            }
        });
    });

    // -------------------------------------------------------------------------
    // 9. Mode Selector Buttons Interaction
    // -------------------------------------------------------------------------
    modeButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            modeButtons.forEach((b) => {
                b.classList.remove("active");
                b.setAttribute("aria-checked", "false");
            });

            btn.classList.add("active");
            btn.setAttribute("aria-checked", "true");
            selectedMode = btn.getAttribute("data-mode");

            let modeTitle = "Full Interpretation Mode";
            if (selectedMode === "quick") modeTitle = "Quick Summary Mode";
            if (selectedMode === "cross_faith") modeTitle = "Cross-Faith Comparative Mode";
            showToast(`Mode set to: ${modeTitle}`);
        });
    });

    // -------------------------------------------------------------------------
    // 10. Interpret Action & API Integration
    // -------------------------------------------------------------------------
    function setLoadingState(loading) {
        isRequestInProgress = loading;
        if (!interpretBtn) return;

        interpretBtn.disabled = loading;
        if (loading) {
            if (btnSpinner) btnSpinner.hidden = false;
            if (btnLabel) btnLabel.textContent = "Interpreting...";
        } else {
            if (btnSpinner) btnSpinner.hidden = true;
            if (btnLabel) btnLabel.textContent = "Interpret ✦";
        }
    }

    // Match canonical offline verses by keyword / text
    function findOfflineCanonicalMatch(text) {
        const clean = text.replace(/[\s।॥,\.\?!;:"'0-9\n\r]/g, "");
        for (const [key, item] of Object.entries(OFFLINE_CANONICAL_DATA)) {
            const cleanCanon = item.shloka.replace(/[\s।॥,\.\?!;:"'0-9\n\r]/g, "");
            if (clean === cleanCanon || clean.includes(cleanCanon.substring(0, 15)) || cleanCanon.includes(clean.substring(0, 15))) {
                return item;
            }
        }
        return null;
    }

    async function handleInterpretation() {
        if (isRequestInProgress) return;

        let rawText = shlokaInput ? shlokaInput.value.trim() : "";

        if (!rawText) {
            showValidation("Please paste or type a Sanskrit shloka to interpret.");
            if (shlokaInput) shlokaInput.focus();
            return;
        }

        if (rawText.length > 4000) {
            showValidation("Shloka text exceeds the maximum 4000 character limit.");
            return;
        }

        // Gate English conversion with login
        const hasEnglish = /[a-zA-Z]/.test(rawText);
        if (hasEnglish && !getCurrentUser()) {
            openLoginModal(() => handleInterpretation());
            return;
        }

        hideValidation();
        hideError();

        // 1. Check if offline canonical match exists
        const canonicalOffline = findOfflineCanonicalMatch(rawText);

        setLoadingState(true);

        try {
            // Call FastAPI Backend POST /interpret
            const response = await fetch(INTERPRET_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    shloka: rawText,
                    mode: selectedMode
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errMsg = errorData.detail || `Server returned error status ${response.status}.`;
                throw new Error(errMsg);
            }

            const data = await response.json();
            lastInterpretationData = data;

            // If auto-converted from English by backend, update input field
            if (data.converted_from_english && data.translated_sanskrit && shlokaInput) {
                shlokaInput.value = data.translated_sanskrit;
                updateCharacterCount();
                showToast(`Converted "${data.original_input}" ➔ "${data.translated_sanskrit}" ✦`);
            }

            renderResults(data, selectedMode);

            if (resultsSection) {
                resultsSection.hidden = false;
                resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }

            showToast("Interpretation rendered successfully ✦");

        } catch (err) {
            console.error("Interpretation request failed:", err);

            // If backend is offline, check if we have offline canonical data!
            if (canonicalOffline) {
                lastInterpretationData = canonicalOffline;
                renderResults(canonicalOffline, selectedMode);
                if (resultsSection) {
                    resultsSection.hidden = false;
                    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
                }
                showToast("Rendered canonical scripture using offline scholarly engine ✦");
                return;
            }

            // If backend is unavailable or offline
            if (err.name === "TypeError" && err.message.toLowerCase().includes("fetch")) {
                showError(
                    "FastAPI Backend Server is Offline",
                    `Unable to connect to ${INTERPRET_ENDPOINT}. Please ensure your local FastAPI server is running.`
                );
            } else {
                showError(
                    "Interpretation Notice",
                    err.message || "An unexpected error occurred while analyzing the shloka."
                );
            }
        } finally {
            setLoadingState(false);
        }
    }

    if (interpretBtn) {
        interpretBtn.addEventListener("click", handleInterpretation);
    }

    // -------------------------------------------------------------------------
    // 11. Results Dynamic Rendering
    // -------------------------------------------------------------------------
    function renderResults(data, mode) {
        if (!resultsSection) return;

        // Title, Mode, Meter
        if (resultTitle) {
            resultTitle.textContent = data.title || "Sanskrit Shloka Interpretation";
        }

        if (resultModeBadge) {
            if (mode === "quick") {
                resultModeBadge.textContent = "✦ QUICK SUMMARY";
            } else if (mode === "cross_faith") {
                resultModeBadge.textContent = "✦ CROSS-FAITH COMPARISON";
            } else {
                resultModeBadge.textContent = "✦ FULL INTERPRETATION";
            }
        }

        if (resultMeter) {
            resultMeter.textContent = `Meter: ${data.meter || "Classical Sanskrit Chhandas"}`;
        }

        // Sanskrit Display
        if (resSanskrit) {
            const rawShloka = data.shloka || (shlokaInput ? shlokaInput.value : "");
            resSanskrit.innerHTML = escapeHtml(rawShloka).replace(/\n/g, "<br>");
        }

        // Transliteration
        if (resTransliteration && cardTransliteration) {
            if (data.transliteration) {
                resTransliteration.innerHTML = escapeHtml(data.transliteration).replace(/\n/g, "<br>");
                cardTransliteration.hidden = false;
            } else {
                cardTransliteration.hidden = true;
            }
        }

        // Translation
        if (resTranslation) {
            resTranslation.textContent = data.translation || "Translation not provided.";
        }

        // Word-by-Word Analysis (Full & Cross-Faith)
        if (cardWordByWord && resWordTableBody) {
            if (mode === "quick" || !data.word_by_word || data.word_by_word.length === 0) {
                cardWordByWord.hidden = true;
            } else {
                cardWordByWord.hidden = false;
                resWordTableBody.innerHTML = "";

                data.word_by_word.forEach((item) => {
                    const tr = document.createElement("tr");

                    const tdWord = document.createElement("td");
                    tdWord.className = "sanskrit-word-cell";
                    tdWord.textContent = item.word || "";

                    const tdTranslit = document.createElement("td");
                    tdTranslit.className = "translit-word-cell";
                    tdTranslit.textContent = item.transliteration || "";

                    const tdGrammar = document.createElement("td");
                    tdGrammar.className = "grammar-word-cell";
                    tdGrammar.textContent = item.grammar || "Padacheda";

                    const tdMeaning = document.createElement("td");
                    tdMeaning.className = "meaning-word-cell";
                    tdMeaning.textContent = item.meaning || "";

                    tr.appendChild(tdWord);
                    tr.appendChild(tdTranslit);
                    tr.appendChild(tdGrammar);
                    tr.appendChild(tdMeaning);

                    resWordTableBody.appendChild(tr);
                });
            }
        }

        // Philosophical Meaning
        if (cardPhilosophical && resPhilosophical) {
            if (mode === "quick" && data.short_meaning) {
                resPhilosophical.textContent = data.short_meaning;
                cardPhilosophical.hidden = false;
            } else if (data.philosophical_meaning) {
                resPhilosophical.textContent = data.philosophical_meaning;
                cardPhilosophical.hidden = false;
            } else {
                cardPhilosophical.hidden = true;
            }
        }

        // Historical & Spiritual Context
        if (cardContext && resContext) {
            if (mode === "quick" || !data.context) {
                cardContext.hidden = true;
            } else {
                resContext.textContent = data.context;
                cardContext.hidden = false;
            }
        }

        // Key Takeaways
        if (cardTakeaways && resTakeaways) {
            const takeaways = data.key_takeaways || [];
            if (takeaways.length === 0) {
                cardTakeaways.hidden = true;
            } else {
                cardTakeaways.hidden = false;
                resTakeaways.innerHTML = "";
                takeaways.forEach((point) => {
                    const li = document.createElement("li");
                    li.className = "takeaway-item";
                    li.innerHTML = `<span class="takeaway-bullet">✦</span> <span>${escapeHtml(point)}</span>`;
                    resTakeaways.appendChild(li);
                });
            }
        }

        // Reflection Questions
        if (cardReflections && resReflections) {
            const reflections = data.reflection_questions || [];
            if (mode === "quick" || reflections.length === 0) {
                cardReflections.hidden = true;
            } else {
                cardReflections.hidden = false;
                resReflections.innerHTML = "";
                reflections.forEach((question, idx) => {
                    const div = document.createElement("div");
                    div.className = "reflection-item";
                    div.innerHTML = `
                        <div class="reflection-index">${idx + 1}</div>
                        <div class="reflection-query">${escapeHtml(question)}</div>
                    `;
                    resReflections.appendChild(div);
                });
            }
        }

        // Cross-Faith Section
        if (cardCrossFaith && resCrossFaithGrid) {
            const crossData = data.cross_faith;
            if (crossData && (mode === "cross_faith" || crossData.comparisons)) {
                cardCrossFaith.hidden = false;

                if (resUniversalTeaching) {
                    resUniversalTeaching.textContent = crossData.universal_teaching || "Universal human truth transcending geographic borders.";
                }

                resCrossFaithGrid.innerHTML = "";
                const comparisons = crossData.comparisons || [];

                comparisons.forEach((item) => {
                    const div = document.createElement("div");
                    div.className = "tradition-item";
                    div.innerHTML = `
                        <div class="tradition-name">${escapeHtml(item.tradition || "Tradition")}</div>
                        <div class="tradition-concept">${escapeHtml(item.quote_or_concept || "")}</div>
                        <div class="tradition-insight">${escapeHtml(item.insight || "")}</div>
                    `;
                    resCrossFaithGrid.appendChild(div);
                });
            } else {
                cardCrossFaith.hidden = true;
            }
        }
    }

    // -------------------------------------------------------------------------
    // 12. Copy to Clipboard Functionality
    // -------------------------------------------------------------------------
    async function copyTextToClipboard(text, successMessage, buttonElement) {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            showToast(successMessage);

            if (buttonElement) {
                const textSpan = buttonElement.querySelector(".copy-text") || buttonElement.querySelector("span:not(.icon)");
                const originalText = textSpan ? textSpan.textContent : buttonElement.textContent;
                if (textSpan) textSpan.textContent = "Copied!";
                setTimeout(() => {
                    if (textSpan) textSpan.textContent = originalText;
                }, 1800);
            }
        } catch (err) {
            console.error("Clipboard copy failed:", err);
            showToast("Failed to copy automatically. Please select text manually.");
        }
    }

    if (copyShlokaBtn) {
        copyShlokaBtn.addEventListener("click", () => {
            const text = resSanskrit ? resSanskrit.innerText.trim() : "";
            copyTextToClipboard(text, "Sanskrit verse copied to clipboard", copyShlokaBtn);
        });
    }

    if (copyTranslationBtn) {
        copyTranslationBtn.addEventListener("click", () => {
            const text = resTranslation ? resTranslation.innerText.trim() : "";
            copyTextToClipboard(text, "English translation copied to clipboard", copyTranslationBtn);
        });
    }

    if (copyAllBtn) {
        copyAllBtn.addEventListener("click", () => {
            if (!lastInterpretationData) {
                showToast("No interpretation data available to copy.");
                return;
            }

            const d = lastInterpretationData;
            let report = `# ${d.title || "Sanskrit Shloka Interpretation"}\n`;
            if (d.meter) report += `Meter: ${d.meter}\n\n`;
            report += `## Sanskrit Shloka\n${d.shloka || ""}\n\n`;
            if (d.transliteration) report += `## IAST Transliteration\n${d.transliteration}\n\n`;
            report += `## Translation\n${d.translation || ""}\n\n`;

            if (d.word_by_word && d.word_by_word.length > 0) {
                report += `## Word-by-Word Breakdown\n`;
                d.word_by_word.forEach((w) => {
                    report += `- ${w.word} (${w.transliteration || ""}): ${w.meaning} [${w.grammar}]\n`;
                });
                report += "\n";
            }

            if (d.philosophical_meaning) report += `## Philosophical Meaning\n${d.philosophical_meaning}\n\n`;
            if (d.context) report += `## Context\n${d.context}\n\n`;

            if (d.key_takeaways && d.key_takeaways.length > 0) {
                report += `## Key Takeaways\n`;
                d.key_takeaways.forEach((t) => (report += `- ${t}\n`));
                report += "\n";
            }

            if (d.cross_faith && d.cross_faith.comparisons) {
                report += `## Universal & Cross-Faith Parallels\n${d.cross_faith.universal_teaching || ""}\n`;
                d.cross_faith.comparisons.forEach((c) => {
                    report += `### ${c.tradition}: ${c.quote_or_concept}\n${c.insight}\n`;
                });
            }

            report += "\n---\nReport generated by Shlokawise (BY SANATANA360)";
            copyTextToClipboard(report, "Full interpretation report copied in Markdown format", copyAllBtn);
        });
    }

    if (newInterpretBtn) {
        newInterpretBtn.addEventListener("click", () => {
            if (shlokaInput) {
                shlokaInput.value = "";
                updateCharacterCount();
                shlokaInput.focus();
            }
            if (resultsSection) {
                resultsSection.hidden = true;
            }
            document.getElementById("interpret").scrollIntoView({ behavior: "smooth" });
        });
    }

    // -------------------------------------------------------------------------
    // 13. Daily Shloka & Learn Glossary Interactions
    // -------------------------------------------------------------------------
    if (dailyInterpretBtn && dailySanskritText) {
        dailyInterpretBtn.addEventListener("click", () => {
            const cleanText = dailySanskritText.innerText.trim();
            if (shlokaInput) {
                shlokaInput.value = cleanText;
                updateCharacterCount();
                hideValidation();
                hideError();

                modeButtons.forEach((b) => {
                    if (b.getAttribute("data-mode") === "full") {
                        b.classList.add("active");
                    } else {
                        b.classList.remove("active");
                    }
                });
                selectedMode = "full";

                document.getElementById("interpret").scrollIntoView({ behavior: "smooth" });
                shlokaInput.focus();

                handleInterpretation();
            }
        });
    }

    document.querySelectorAll(".term-pill").forEach((pill) => {
        pill.addEventListener("click", () => {
            const termName = pill.textContent.trim();
            const verse = VOCABULARY_SHLOKAS[termName];

            if (verse && shlokaInput) {
                shlokaInput.value = verse;
                updateCharacterCount();
                hideValidation();
                hideError();
                document.getElementById("interpret").scrollIntoView({ behavior: "smooth" });
                shlokaInput.focus();
                showToast(`Loaded key shloka for ${termName}`);
            } else {
                showToast(`Selected concept: ${termName}`);
            }
        });
    });

    const joinCommunityBtn = document.getElementById("joinCommunityBtn");
    if (joinCommunityBtn) {
        joinCommunityBtn.addEventListener("click", () => {
            showToast("Welcome to the Sanatana360 discussion circle! Feature coming soon.");
        });
    }

    const footerAboutLink = document.getElementById("footerAboutLink");
    if (footerAboutLink) {
        footerAboutLink.addEventListener("click", () => {
            showToast("Sanatana360 is dedicated to preserving ancient Sanskrit wisdom.");
        });
    }
    const footerApiDocsLink = document.getElementById("footerApiDocsLink");
    if (footerApiDocsLink) {
        footerApiDocsLink.addEventListener("click", () => {
            showToast("FastAPI endpoints: POST /interpret and POST /translate at http://127.0.0.1:8000");
        });
    }
    const footerPrivacyLink = document.getElementById("footerPrivacyLink");
    if (footerPrivacyLink) {
        footerPrivacyLink.addEventListener("click", () => {
            showToast("Privacy: No sacred Sanskrit texts or user queries are sold.");
        });
    }
    const footerTermsLink = document.getElementById("footerTermsLink");
    if (footerTermsLink) {
        footerTermsLink.addEventListener("click", () => {
            showToast("Terms: For educational, spiritual, and contemplation purposes.");
        });
    }

    // -------------------------------------------------------------------------
    // 14. Helper: HTML Escaper
    // -------------------------------------------------------------------------
    function escapeHtml(str) {
        if (!str) return "";
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Initialize character counter & Authentication UI
    updateCharacterCount();
    updateAuthUI();

})();
