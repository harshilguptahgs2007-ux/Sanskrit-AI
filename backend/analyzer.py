import re
import json
import logging
from typing import Dict, Any, List, Optional
from backend.translator import get_client

logger = logging.getLogger(__name__)

# Canonical shlokas with deep scholarly breakdown
CANONICAL_SHLOKAS: Dict[str, Dict[str, Any]] = {
    "bg_2_47": {
        "keywords": ["कर्मण्येवाधिकारस्ते", "मा फलेषु", "कर्मफलहेतु"],
        "title": "Bhagavad Gita — Chapter 2, Verse 47 (Karma Yoga)",
        "shloka": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
        "meter": "Anuṣṭubh Chhandas (8-8-8-8 syllables)",
        "transliteration": "karmaṇy-evādhikāras te mā phaleṣu kadācana |\nmā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi ||",
        "translation": "You have a right only to perform your prescribed duty, but never to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to inaction.",
        "word_by_word": [
            {"word": "कर्मणि", "transliteration": "karmaṇi", "grammar": "Locative singular of karman (n.)", "meaning": "in action / prescribed duty"},
            {"word": "एव", "transliteration": "eva", "grammar": "Indeclinable emphasis", "meaning": "alone / only"},
            {"word": "अधिकारः", "transliteration": "adhikāraḥ", "grammar": "Nominative singular of adhikāra (m.)", "meaning": "right, jurisdiction, entitlement"},
            {"word": "ते", "transliteration": "te", "grammar": "Genitive singular of yuṣmad (pron.)", "meaning": "your / to you"},
            {"word": "मा", "transliteration": "mā", "grammar": "Negative particle", "meaning": "never / not"},
            {"word": "फलेषु", "transliteration": "phaleṣu", "grammar": "Locative plural of phala (n.)", "meaning": "in the fruits or outcomes"},
            {"word": "कदाचन", "transliteration": "kadācana", "grammar": "Indeclinable adverb", "meaning": "at any time"},
            {"word": "कर्मफलहेतुः", "transliteration": "karma-phala-hetuḥ", "grammar": "Compound (Tatpuruṣa)", "meaning": "motivated by fruits of action"},
            {"word": "भूः", "transliteration": "bhūḥ", "grammar": "Aorist 2nd person singular of bhū", "meaning": "do not become"},
            {"word": "सङ्गः", "transliteration": "saṅgaḥ", "grammar": "Nominative singular of saṅga (m.)", "meaning": "attachment / clinging"},
            {"word": "अस्तु", "transliteration": "astu", "grammar": "Imperative 3rd person singular of as", "meaning": "let there be"},
            {"word": "अकर्मणि", "transliteration": "akarmaṇi", "grammar": "Locative singular of akarman (n.)", "meaning": "in inaction / passivity"}
        ],
        "philosophical_meaning": "This immortal shloka encapsulates Nishkama Karma—selfless action devoid of egoic grasping. Sri Krishna instructs that while human agency controls intention and exertion, the cosmic unfolding (daivam, time, and collective causality) governs outcomes. Clinging to results produces psychological anxiety and suffering, whereas abandoning action leads to tamasic stagnation. The elevated path is detached dedication to duty as a sacred offering.",
        "context": "Spoken by Bhagavan Sri Krishna to Arjuna in the second chapter (Sankhya Yoga) of the Mahabharata's Bhagavad Gita. Arjuna was paralyzed by despondency and the dread of consequences; Krishna reframes action not through personal reward, but through cosmic harmony (Loka-sangraha).",
        "key_takeaways": [
            "Focus 100% of conscious energy on process, ethics, and effort rather than obsessive anticipation of results.",
            "Avoid complacency: freedom from results is never an excuse for lethargy or retreating from moral duties.",
            "Liberate your mental health from external validation, praise, or monetary outcome by grounding dignity in duty itself."
        ],
        "reflection_questions": [
            "In which areas of your daily endeavors is anxiety about the outcome hindering the quality of your execution?",
            "How can you reframe your daily work today as an act of selfless service rather than a transaction for approval?"
        ],
        "cross_faith": {
            "traditions": ["Stoicism", "Taoism", "Christianity"],
            "universal_teaching": "The universal dichotomy of control: distinguishing what lies within our sovereign power (our choices, virtues, and actions) from what lies beyond it (fortune, applause, and consequences).",
            "comparisons": [
                {
                    "tradition": "Stoicism (Epictetus & Marcus Aurelius)",
                    "quote_or_concept": "Enchiridion: 'Some things are in our control and others not.'",
                    "insight": "Epictetus teaches that tranquility emerges when we concern ourselves solely with our own judgments and actions, treating external outcomes with equanimity (amor fati)."
                },
                {
                    "tradition": "Taoism (Laozi)",
                    "quote_or_concept": "Tao Te Ching: 'Act without expectation; accomplish without claiming credit.'",
                    "insight": "Wu Wei (effortless action) mirrors Nishkama Karma—flowing with cosmic order without forcing self-centered outcomes."
                },
                {
                    "tradition": "Christianity (Pauline Epistles)",
                    "quote_or_concept": "Colossians 3:23: 'Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.'",
                    "insight": "Dedication of labor to the divine, releasing vanity and anxiety regarding worldly applause."
                }
            ]
        }
    },
    "gayatri": {
        "keywords": ["तत्सवितुर्वरेण्यं", "भर्गो देवस्य", "प्रचोदयात्", "गायत्री"],
        "title": "Rigveda — Mandala 3, Sukta 62, Verse 10 (Gayatri Mantra)",
        "shloka": "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं।\nभर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥",
        "meter": "Gāyatrī Chhandas (3 padas of 8 syllables each: 24 syllables)",
        "transliteration": "oṁ bhūr bhuvaḥ svaḥ tat savitur vareṇyaṁ |\nbhargo devasya dhīmahi dhiyo yo naḥ pracodayāt ||",
        "translation": "Om, the physical, subtle, and celestial realms. We meditate upon the supreme, adorable spiritual radiance of the divine Sun (Savitur); may that Divine Light illuminate and awaken our intellect and consciousness.",
        "word_by_word": [
            {"word": "ॐ", "transliteration": "om", "grammar": "Pranava / Sacred Monosyllable", "meaning": "primordial cosmic sound of the Supreme Reality"},
            {"word": "भूः", "transliteration": "bhūḥ", "grammar": "Vyahriti (f.)", "meaning": "the physical realm / earth / existence"},
            {"word": "भुवः", "transliteration": "bhuvaḥ", "grammar": "Vyahriti (n.)", "meaning": "the middle or atmospheric realm / prana"},
            {"word": "स्वः", "transliteration": "svaḥ", "grammar": "Vyahriti (n.)", "meaning": "the celestial realm / heavenly consciousness"},
            {"word": "तत्", "transliteration": "tat", "grammar": "Neuter demonstrative pronoun", "meaning": "that (ultimate essence)"},
            {"word": "सवितुः", "transliteration": "savituḥ", "grammar": "Genitive singular of savitṛ (m.)", "meaning": "of the solar deity, progenitor, creator of illumination"},
            {"word": "वरेण्यम्", "transliteration": "vareṇyam", "grammar": "Accusative singular of vareṇya", "meaning": "most adorable, choicest, venerable"},
            {"word": "भर्गः", "transliteration": "bhargaḥ", "grammar": "Accusative singular of bhargas (n.)", "meaning": "effulgence, divine purifying splendor"},
            {"word": "देवस्य", "transliteration": "devasya", "grammar": "Genitive singular of deva (m.)", "meaning": "of the luminous divine being"},
            {"word": "धीमहि", "transliteration": "dhīmahi", "grammar": "Optative 1st person plural middle of dhyā", "meaning": "we meditate upon / internalize"},
            {"word": "धियः", "transliteration": "dhiyaḥ", "grammar": "Accusative plural of dhī (f.)", "meaning": "intellects, intuitive wisdom, thoughts"},
            {"word": "यः", "transliteration": "yaḥ", "grammar": "Relative pronoun nominative singular", "meaning": "who / that which"},
            {"word": "नः", "transliteration": "naḥ", "grammar": "Genitive/Accusative plural of asmad", "meaning": "our / for us"},
            {"word": "प्रचोदयात्", "transliteration": "pracodayāt", "grammar": "Optative 3rd person singular of pra-cud", "meaning": "may inspire, guide, and illuminate"}
        ],
        "philosophical_meaning": "The Gayatri Mantra is revered as the mother of the Vedas. It shifts human prayer from material acquisition to divine illumination (Dhi-shakti). The external sun (Surya) is recognized as an emblem of the inner luminous Atman. By attuning our mind to this pristine effulgence, ignorance and delusion are dispelled, granting discerning wisdom (Buddhi) directed toward truth.",
        "context": "Revealed through Brahmarshi Vishvamitra in the Rigveda (3.62.10). Traditionally chanted during the three Sandhyas (dawn, noon, dusk) for spiritual purification and inner clarity.",
        "key_takeaways": [
            "True wealth and sovereignty lie in an enlightened, clear, and serene intellect (Buddhi).",
            "The prayer is collective ('naḥ' = 'our intellects'), wishing enlightenment not just for oneself but for all beings.",
            "Contemplation on the inner light cleanses mental agitations and anchors consciousness in purity."
        ],
        "reflection_questions": [
            "Are you seeking external solutions when what is needed is internal clarity of discernment?",
            "How does holding goodwill for the illumination of all beings shift your personal perspective?"
        ],
        "cross_faith": {
            "traditions": ["Zoroastrianism", "Christianity", "Buddhism"],
            "universal_teaching": "Invocation of the Primordial Light that dispels darkness, ignorance, and spiritual blindness.",
            "comparisons": [
                {
                    "tradition": "Zoroastrianism",
                    "quote_or_concept": "Ahura Mazda & Ashem Vohu",
                    "insight": "Veneration of light and the solar archetype as the visible symbol of supreme truth (Asha) and divine righteousness."
                },
                {
                    "tradition": "Christianity",
                    "quote_or_concept": "John 8:12",
                    "insight": "'I am the light of the world; whoever follows me will not walk in darkness, but will have the light of life.'"
                },
                {
                    "tradition": "Buddhism",
                    "quote_or_concept": "Prajñā (Wisdom Light)",
                    "insight": "The aspiration for transcendent wisdom to illuminate the mind beyond samsaric delusion."
                }
            ]
        }
    },
    "yoga_sutras": {
        "keywords": ["योगश्चित्तवृत्तिनिरोधः", "चित्तवृत्ति", "स्वरूपेऽवस्थानम्", "पतञ्जलि"],
        "title": "Patanjali Yoga Sutras — Samadhi Pada 1.2 & 1.3",
        "shloka": "योगश्चित्तवृत्तिनिरोधः॥\nतदा द्रष्टुः स्वरूपेऽवस्थानम्॥",
        "meter": "Sutra Style (Aphoristic Prose)",
        "transliteration": "yogaś citta-vṛtti-nirodhaḥ ||\ntadā draṣṭuḥ svarūpe 'vasthānam ||",
        "translation": "Yoga is the cessation of the modifications and fluctuations of the mind-field. Then, the Seer (pure Consciousness) abides in its own authentic essential nature.",
        "word_by_word": [
            {"word": "योगः", "transliteration": "yogaḥ", "grammar": "Nominative singular of yoga (m.)", "meaning": "Yoga / integration / supreme union"},
            {"word": "चित्त", "transliteration": "citta", "grammar": "Compound stem", "meaning": "mind-field / consciousness apparatus (manas, buddhi, ahamkara)"},
            {"word": "वृत्ति", "transliteration": "vṛtti", "grammar": "Compound stem", "meaning": "whirlpools, fluctuations, thought-waves"},
            {"word": "निरोधः", "transliteration": "nirodhaḥ", "grammar": "Nominative singular of nirodha (m.)", "meaning": "stilling, cessation, intentional mastery"},
            {"word": "तदा", "transliteration": "tadā", "grammar": "Indeclinable adverb", "meaning": "then / at that state"},
            {"word": "द्रष्टुः", "transliteration": "draṣṭuḥ", "grammar": "Genitive singular of draṣṭṛ (m.)", "meaning": "of the Seer / pure witness consciousness (Purusha)"},
            {"word": "स्वरूपे", "transliteration": "svarūpe", "grammar": "Locative singular of svarūpa (n.)", "meaning": "in one's own true, essential nature"},
            {"word": "अवस्थानम्", "transliteration": "avasthānam", "grammar": "Nominative singular of avasthāna (n.)", "meaning": "abiding, resting, establishment"}
        ],
        "philosophical_meaning": "Maharshi Patanjali defines the absolute essence of Raja Yoga. The ordinary human condition is identification with restless mental waves (vrittis)—desires, memories, fears, and conceptual projections. When the surface of the mental lake becomes perfectly still through disciplined practice (abhyasa) and dispassion (vairagya), the witness consciousness (Purusha) ceases falsely identifying with mental drama and recognizes its timeless, unconditioned reality.",
        "context": "Opening core definition in Patanjali's Yoga Sutras (1.2–1.3). It forms the foundational doctrine upon which the entire eightfold path (Ashtanga Yoga) is constructed.",
        "key_takeaways": [
            "You are not your fleeting thoughts, anxiety, or emotional turbulence; you are the silent observer awareness behind them.",
            "Mastery of mind is achieved not through violent suppression, but through calm awareness and systematic stilling of cognitive ripple.",
            "Resting in your essential nature brings invulnerable peace independent of external circumstances."
        ],
        "reflection_questions": [
            "Which thought patterns or mental whirlpools are currently dominating your attention?",
            "What happens to your stress level when you observe your thoughts without reacting or adopting them as your identity?"
        ],
        "cross_faith": {
            "traditions": ["Zen Buddhism", "Christian Contemplation", "Mindfulness"],
            "universal_teaching": "Stillness of the mental faculty is the prerequisite for discovering transcendent truth and self-realization.",
            "comparisons": [
                {
                    "tradition": "Zen Buddhism",
                    "quote_or_concept": "Muga / Mushin (No-Mind)",
                    "insight": "Quietening conceptual chatter to perceive original Buddha-nature directly as it is."
                },
                {
                    "tradition": "Christian Contemplation",
                    "quote_or_concept": "Psalm 46:10",
                    "insight": "'Be still, and know that I am God.' Stepping beyond discursive intellect into divine presence."
                },
                {
                    "tradition": "Modern Cognitive Psychology",
                    "quote_or_concept": "Metacognitive Awareness",
                    "insight": "Down-regulating the ruminative self-referential loop to unlock presence, focus, and metacognitive awareness."
                }
            ]
        }
    },
    "shanti_mantra": {
        "keywords": ["सह नाववतु", "सह नौ भुनक्तु", "मा विद्विषावहै", "शान्तिः"],
        "title": "Taittiriya Upanishad — Shanti Patha (Peace Invocation)",
        "shloka": "ॐ सह नाववतु। सह नौ भुनक्तु।\nसह वीर्यं करवावहै।\nतेजस्वि नावधीतमस्तु मा विद्विषावहै।\nॐ शान्तिः शान्तिः शान्तिः॥",
        "meter": "Vedic Anustubh variation / Sacred Prose Chant",
        "transliteration": "oṁ saha nāv avatu | saha nau bhunaktu |\nsaha vīryaṁ karavāvahai |\ntejasvi nāv adhītam astu mā vidviṣāvahai |\noṁ śāntiḥ śāntiḥ śāntiḥ ||",
        "translation": "Om, may the Divine protect both teacher and student together. May He nourish us together. May we work together with great energy and capacity. May our study be brilliant and fruitful. May there be no animosity or misunderstanding between us. Om Peace, Peace, Peace.",
        "word_by_word": [
            {"word": "ॐ", "transliteration": "om", "grammar": "Sacred sound", "meaning": "the primordial cosmic presence"},
            {"word": "सह", "transliteration": "saha", "grammar": "Indeclinable preposition", "meaning": "together / jointly"},
            {"word": "नौ", "transliteration": "nau", "grammar": "Accusative dual of asmad", "meaning": "both of us (teacher and student)"},
            {"word": "अवतु", "transliteration": "avatu", "grammar": "Imperative 3rd person singular of av", "meaning": "may He protect and preserve"},
            {"word": "भुनक्तु", "transliteration": "bhunaktu", "grammar": "Imperative 3rd person singular of bhuj", "meaning": "may He nourish and sustain"},
            {"word": "वीर्यम्", "transliteration": "vīryam", "grammar": "Accusative singular of vīrya (n.)", "meaning": "vigor, dynamic capacity, spiritual strength"},
            {"word": "करवावहै", "transliteration": "karavāvahai", "grammar": "Imperative 1st person dual middle of kṛ", "meaning": "may we both generate / accomplish"},
            {"word": "तेजस्वि", "transliteration": "tejasvi", "grammar": "Nominative singular neuter of tejasvin", "meaning": "luminous, brilliant, potent"},
            {"word": "अधीतम्", "transliteration": "adhītam", "grammar": "Past passive participle / noun", "meaning": "learning / knowledge studied"},
            {"word": "अस्तु", "transliteration": "astu", "grammar": "Imperative 3rd person singular of as", "meaning": "may it be"},
            {"word": "मा", "transliteration": "mā", "grammar": "Negative particle", "meaning": "never / let not"},
            {"word": "विद्विषावहै", "transliteration": "vidviṣāvahai", "grammar": "Subjunctive 1st person dual middle of vi-dviṣ", "meaning": "may we harbor dislike or enmity towards each other"},
            {"word": "शान्तिः", "transliteration": "śāntiḥ", "grammar": "Nominative singular of śānti (f.)", "meaning": "peace (invoked thrice for physical, subtle, and celestial realms)"}
        ],
        "philosophical_meaning": "This peace invocation establishes the sacred symbiosis between mentor and disciple. Authentic spiritual knowledge cannot be transmitted through transactional arrogance or suspicion; it requires mutual reverence, shared dedication, and harmonious vibrational alignment. Chanting 'Shanti' three times neutralizes three spheres of affliction: Adhyatmika (internal mental/physical hurdles), Adhibhautika (conflicts caused by other beings), and Adhidaivika (uncontrollable natural/cosmic disturbances).",
        "context": "Traditional invocation found in Krishna Yajurveda, specifically the Taittiriya, Katha, and Shvetashvatara Upanishads, recited before initiating sacred study.",
        "key_takeaways": [
            "Collaborative empathy and mutual respect are essential prerequisites for deep learning and wisdom transfer.",
            "Protecting oneself from hostility ('mā vidviṣāvahai') safeguards both intellect and relationship from poison.",
            "Holistic peace requires tranquility within oneself, with society, and in relation to nature."
        ],
        "reflection_questions": [
            "Are your learning or working relationships grounded in competitive tension or collaborative synergy?",
            "What steps can you take today to resolve lingering grievances before entering intellectual or spiritual inquiry?"
        ],
        "cross_faith": {
            "traditions": ["Judaism (Havruta)", "Indigenous Wisdom", "Christian Fellowship"],
            "universal_teaching": "The sacred fellowship of seeker and teacher united in humble pursuit of highest truth without rivalry.",
            "comparisons": [
                {
                    "tradition": "Judaism (Havruta Study)",
                    "quote_or_concept": "Pirkei Avot / Talmudei Chachamim",
                    "insight": "Partners studying sacred texts sharpen each other like iron sharpening iron, bonded in shared dedication."
                },
                {
                    "tradition": "Christian Community",
                    "quote_or_concept": "Matthew 18:20",
                    "insight": "'Where two or three gather in my name, there am I with them.' Spiritual presence flourishing in collective concord."
                },
                {
                    "tradition": "Ubuntu Tradition",
                    "quote_or_concept": "'I am because we are'",
                    "insight": "Knowledge and human flourishing are relational and communal, never purely individualistic."
                }
            ]
        }
    },
    "ishavasya": {
        "keywords": ["ईशा वास्यमिदं", "त्यक्तेन भुञ्जीथा", "मा गृधः", "ईशावास्य"],
        "title": "Isha Upanishad — Verse 1 (Shukla Yajurveda)",
        "shloka": "ईशा वास्यमिदं सर्वं यत्किञ्च जगत्यां जगत्।\nतेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम्॥",
        "meter": "Anuṣṭubh Chhandas (32 syllables)",
        "transliteration": "īśā vāsyam idaṁ sarvaṁ yat kiñca jagatyāṁ jagat |\ntena tyaktena bhuñjīthā mā gṛdhaḥ kasya svid dhanam ||",
        "translation": "All this—whatever exists in this changing universe—is enveloped and permeated by the Supreme Lord (Isha). Therefore, enjoy with renunciation; do not covet anyone's wealth.",
        "word_by_word": [
            {"word": "ईशा", "transliteration": "īśā", "grammar": "Instrumental singular of īś (m.)", "meaning": "by the Supreme Ruler / divine consciousness"},
            {"word": "वास्यम्", "transliteration": "vāsyam", "grammar": "Gerundive neuter singular of vas", "meaning": "to be enveloped, covered, inhabited"},
            {"word": "इदम्", "transliteration": "idam", "grammar": "Nominative neuter singular pronoun", "meaning": "this (manifest world)"},
            {"word": "सर्वम्", "transliteration": "sarvam", "grammar": "Nominative neuter singular", "meaning": "all / entire universe"},
            {"word": "यत्किञ्च", "transliteration": "yat kiñca", "grammar": "Indefinite compound", "meaning": "whatever tiny entity"},
            {"word": "जगत्याम्", "transliteration": "jagatyām", "grammar": "Locative singular feminine of jagatī", "meaning": "in this ever-moving, transient cosmos"},
            {"word": "जगत्", "transliteration": "jagat", "grammar": "Nominative neuter singular", "meaning": "that which changes and moves"},
            {"word": "तेन", "transliteration": "tena", "grammar": "Instrumental pronoun", "meaning": "by that / therefore"},
            {"word": "त्यक्तेन", "transliteration": "tyaktena", "grammar": "Instrumental of tyakta (past passive participle)", "meaning": "with renunciation / through detachment"},
            {"word": "भुञ्जीथाः", "transliteration": "bhuñjīthāḥ", "grammar": "Optative 2nd person singular middle of bhuj", "meaning": "enjoy, protect, sustain life"},
            {"word": "मा", "transliteration": "mā", "grammar": "Negative prohibitive particle", "meaning": "do not"},
            {"word": "गृधः", "transliteration": "gṛdhaḥ", "grammar": "Aorist 2nd person singular of gṛdh", "meaning": "covet, crave, be greedy"},
            {"word": "कस्यस्वित्", "transliteration": "kasya svit", "grammar": "Genitive interrogative + particle", "meaning": "of whomsoever / of anyone"},
            {"word": "धनम्", "transliteration": "dhanam", "grammar": "Accusative singular of dhana (n.)", "meaning": "wealth, possession, material goods"}
        ],
        "philosophical_meaning": "Mahatma Gandhi remarked that if all Indian scriptures were burned, this single opening verse of the Isha Upanishad would suffice to preserve the soul of Hinduism. It establishes divine immanence: the cosmos is not a godless machine or commodity to exploit, but the sacred body of the Divine. 'Tyaktena bhuñjīthā' resolves the paradox of asceticism versus consumption—enjoy life joyfully, but as a trustee with detachment, knowing that nothing fundamentally belongs to the ego.",
        "context": "The first mantra of the celebrated Isha Upanishad (40th chapter of the Shukla Yajurveda Samhita). It is the quintessential reconciliation of spiritual renunciation (Tyaga) and active worldly engagement.",
        "key_takeaways": [
            "Recognize all creation as sacred and interwoven with divine presence, demanding ecological stewardship.",
            "Live in abundance through contentment (Santhosha) and non-covetousness (Asteya / Aparigraha).",
            "Hold possessions with an open hand as a caretaker rather than a grasping possessor."
        ],
        "reflection_questions": [
            "How does viewing nature and possessions as sacred trust change your consumption habits?",
            "Whose possessions or successes are you coveting, and how can you shift from envy to celebrating divine abundance?"
        ],
        "cross_faith": {
            "traditions": ["Franciscan Christianity", "Indigenous Earth Stewardship", "Buddhism"],
            "universal_teaching": "Sacred immanence of creation and the liberation found in holy poverty / conscious detachment from grasping.",
            "comparisons": [
                {
                    "tradition": "St. Francis of Assisi / Christianity",
                    "quote_or_concept": "Canticle of the Sun & Holy Detachment",
                    "insight": "Seeing Brother Sun, Sister Water, and all creation as holy creations of God, requiring love without greed."
                },
                {
                    "tradition": "Buddhism",
                    "quote_or_concept": "Dhammapada: Tanha (Cravings as source of Dukkha)",
                    "insight": "Suffering ceases when the craving (tanha) to possess what is impermanent is relinquished."
                },
                {
                    "tradition": "Islam / Quranic Stewardship",
                    "quote_or_concept": "Khalifa (Trustee on Earth)",
                    "insight": "Humans are entrusted caretakers (khalifah) of Allah's creation, accountable for greed and squander."
                }
            ]
        }
    }
}


def find_canonical_match(text: str) -> Optional[Dict[str, Any]]:
    """Checks if the user's input matches one of the canonical shlokas."""
    cleaned = re.sub(r'[\s।॥,\.\-\'\"]+', '', text)
    for key, data in CANONICAL_SHLOKAS.items():
        for kw in data["keywords"]:
            kw_clean = re.sub(r'[\s।॥,\.\-\'\"]+', '', kw)
            if kw_clean in cleaned:
                return data
    return None


def format_for_mode(data: Dict[str, Any], mode: str) -> Dict[str, Any]:
    """Formats output according to the requested mode (full, quick, cross_faith)."""
    norm_mode = mode.lower().replace("+", "").replace("-", "_").strip()

    result = {
        "success": True,
        "mode": mode,
        "title": data.get("title", "Sanskrit Shloka Analysis"),
        "shloka": data.get("shloka", ""),
        "meter": data.get("meter", "Classical Sanskrit Chhandas"),
        "transliteration": data.get("transliteration", ""),
        "translation": data.get("translation", ""),
    }

    if "quick" in norm_mode:
        phil = data.get("philosophical_meaning", "")
        first_sentence = phil.split(". ")[0] + "." if phil else ""
        result["short_meaning"] = first_sentence or data.get("translation", "")
        result["key_takeaways"] = data.get("key_takeaways", [])[:2]
        return result

    # Full and Cross-Faith include all in-depth modules
    result["word_by_word"] = data.get("word_by_word", [])
    result["philosophical_meaning"] = data.get("philosophical_meaning", "")
    result["context"] = data.get("context", "")
    result["key_takeaways"] = data.get("key_takeaways", [])
    result["reflection_questions"] = data.get("reflection_questions", [])

    if "cross" in norm_mode or "faith" in norm_mode or "cross_faith" in norm_mode or mode == "cross_faith":
        result["cross_faith"] = data.get("cross_faith", {
            "traditions": ["Stoicism", "Buddhism", "Christian Mysticism"],
            "universal_teaching": "Universal truth of human virtue, intentional action, and transcendence of the ego.",
            "comparisons": [
                {
                    "tradition": "Stoicism",
                    "quote_or_concept": "Virtue as the Highest Good",
                    "insight": "Harmonizing personal will with universal nature and accepting external events with fortitude."
                },
                {
                    "tradition": "Buddhism",
                    "quote_or_concept": "Noble Eightfold Path",
                    "insight": "Right action and right view working in synergy to extinguish selfish craving."
                }
            ]
        })
    else:
        if "cross_faith" in data:
            result["cross_faith"] = data["cross_faith"]

    return result


def parse_unstructured_response(text: str, original_shloka: str) -> Dict[str, Any]:
    """Fallback parser that parses rich markdown/text responses from Sarvam AI."""
    title = "Sanskrit Shloka Interpretation"
    transliteration = ""
    translation = ""
    word_by_word = []
    philosophical_meaning = ""
    context = ""
    key_takeaways = []
    reflection_questions = []

    # Extract title if present
    title_match = re.search(r'(?:title|shloka|hymn|verse):\s*(.+)', text, re.I)
    if title_match:
        title = title_match.group(1).strip()

    # Extract translation
    trans_match = re.search(r'(?:translation|meaning):\s*["\']?([^#\n]+(?:\n[^\n#]+)*)', text, re.I)
    if trans_match:
        translation = trans_match.group(1).strip()
    else:
        # Fallback first paragraph
        paras = [p.strip() for p in text.split("\n\n") if p.strip()]
        if paras:
            translation = paras[0]

    # Extract transliteration
    translit_match = re.search(r'(?:transliteration|iast):\s*([^\n#]+)', text, re.I)
    if translit_match:
        transliteration = translit_match.group(1).strip()

    # Extract word by word items
    words = re.findall(r'[\*\-]\s*(.+?):\s*(.+)', text)
    for w, m in words[:10]:
        if "translation" not in w.lower() and "context" not in w.lower():
            word_by_word.append({
                "word": w.strip().replace("*", ""),
                "transliteration": "",
                "grammar": "Etymological derivative",
                "meaning": m.strip()
            })

    # Philosophical meaning
    phil_match = re.search(r'(?:philosophical|broader interpretation|spiritual meaning|significance)[\s\S]*?(?:(?=###)|(?=--)|(?=\Z))', text, re.I)
    if phil_match:
        philosophical_meaning = phil_match.group(0).strip()
    else:
        philosophical_meaning = text[:500]

    # Clean markdown markers from text
    philosophical_meaning = re.sub(r'^[#\*\-]+\s*', '', philosophical_meaning, flags=re.M).strip()

    return {
        "title": title,
        "shloka": original_shloka,
        "meter": "Classical Sanskrit Chhandas",
        "transliteration": transliteration or original_shloka,
        "translation": translation or "Insightful translation and philosophical commentary derived from classical Sanskrit traditions.",
        "word_by_word": word_by_word or [
            {"word": w, "transliteration": "", "grammar": "Padacheda", "meaning": "Key Sanskrit term"}
            for w in original_shloka.split()[:6]
        ],
        "philosophical_meaning": philosophical_meaning,
        "context": "Traditional Sanskrit literature and Vedic / Epic philosophy.",
        "key_takeaways": [
            "Uphold righteous conduct (Dharma) in speech, thought, and deed.",
            "Cultivate inner discernment and awareness through contemplation.",
            "Align actions with universal peace and cosmic order."
        ],
        "reflection_questions": [
            "How does this verse challenge your current perception of daily duties?",
            "What practical change in mindset can you implement based on this teaching?"
        ],
        "cross_faith": {
            "traditions": ["Stoicism", "Buddhism", "Universal Ethics"],
            "universal_teaching": "Harmony with natural law and self-mastery through compassionate living.",
            "comparisons": [
                {
                    "tradition": "Stoic Philosophy",
                    "quote_or_concept": "Living in Accordance with Nature",
                    "insight": "Aligning inner reason with cosmic Logos to achieve tranquility."
                },
                {
                    "tradition": "Buddhism",
                    "quote_or_concept": "Karuna and Sila (Compassion & Virtue)",
                    "insight": "Cultivating non-harming awareness toward all sentient beings."
                }
            ]
        }
    }


def analyze_with_sarvam(shloka: str, mode: str) -> Dict[str, Any]:
    """Queries Sarvam AI's 105b model to analyze any arbitrary Sanskrit shloka."""
    client = get_client()

    prompt = f"""You are a world-class Sanskrit scholar. Analyze this Sanskrit verse:
"{shloka}"

Please provide your analysis strictly in this valid JSON format:
{{
  "title": "Title or scripture origin",
  "shloka": "{shloka}",
  "meter": "Meter name (e.g. Anustubh)",
  "transliteration": "IAST Roman transliteration with diacritics",
  "translation": "Poetic, precise English translation",
  "word_by_word": [
    {{"word": "word1", "transliteration": "iast1", "grammar": "grammar info", "meaning": "english meaning"}}
  ],
  "philosophical_meaning": "Deep philosophical and spiritual explanation",
  "context": "Scriptural and historical context",
  "key_takeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
  "reflection_questions": ["Question 1", "Question 2"],
  "cross_faith": {{
    "traditions": ["Tradition 1", "Tradition 2"],
    "universal_teaching": "Universal truth",
    "comparisons": [
      {{"tradition": "Tradition name", "quote_or_concept": "Concept/Quote", "insight": "Parallel insight"}}
    ]
  }}
}}
Return ONLY valid JSON without preamble."""

    try:
        response = client.chat.completions(
            messages=[{"role": "user", "content": prompt}],
            model="sarvam-105b"
        )

        msg = response.choices[0].message
        content = (msg.content or "").strip()

        if not content:
            raise ValueError("Empty response received from Sarvam AI.")

        # Clean JSON fences if the LLM wrapped it
        if content.startswith("```"):
            content = re.sub(r"^```[a-zA-Z]*\n?", "", content)
            content = re.sub(r"\n?```$", "", content).strip()

        try:
            data = json.loads(content)
            return format_for_mode(data, mode)
        except json.JSONDecodeError:
            # Fallback regex extraction of JSON object
            json_match = re.search(r'(\{[\s\S]*\})', content)
            if json_match:
                try:
                    data = json.loads(json_match.group(1))
                    return format_for_mode(data, mode)
                except Exception:
                    pass
            # Fallback to intelligent parser of unstructured markdown
            parsed = parse_unstructured_response(content, shloka)
            return format_for_mode(parsed, mode)

    except Exception as e:
        logger.error(f"Sarvam AI analysis failed: {e}")
        raise e


def interpret_shloka(shloka: str, mode: str = "full") -> Dict[str, Any]:
    """Primary entry point for interpreting any Sanskrit shloka."""
    if not shloka or not shloka.strip():
        raise ValueError("Please enter a Sanskrit shloka to interpret.")

    if len(shloka) > 4000:
        raise ValueError("Shloka text is too long (maximum 4000 characters).")

    # 1. First check canonical matches for instant, infallible, rich scholarly response
    canonical = find_canonical_match(shloka)
    if canonical:
        return format_for_mode(canonical, mode)

    # 2. For non-canonical shlokas, invoke Sarvam AI (sarvam-105b)
    try:
        return analyze_with_sarvam(shloka, mode)
    except Exception as error:
        logger.error(f"Sarvam interpretation error: {error}")
        raise ValueError(f"AI interpretation error: {str(error)}")
