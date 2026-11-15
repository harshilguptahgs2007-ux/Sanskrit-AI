# Shlokawise (संस्कृत AI) — Sanskrit AI Shloka Translator & Analyzer

> **BY SANATANA360**  
> An elegant, spiritual, and AI-powered Sanskrit shloka translator and analyzer that decodes ancient Vedic, Upanishadic, and Gita verses with word-by-word grammatical breakdowns, philosophical interpretations, meter identification, reflection prompts, and cross-faith comparative wisdom.

---

## 🎨 Design & Aesthetic Identity

- **Background:** Warm Ivory (`#FBF7EF`)
- **Primary Orange:** Vibrant Spiritual Ochre (`#C96A16`)
- **Text:** Dark Brown (`#493323`) & Muted Terracotta (`#7A583E`)
- **Surface / Cards:** Light Cream (`#F8EFE2`)
- **Borders:** Warm Peach (`#E8C9A9`)
- **Typography:**
  - Headings: *Cormorant Garamond* (Serif, Italic)
  - Sanskrit Verses: *Noto Serif Devanagari*
  - Navigation & Body: *Inter*

---

## 📁 Project Structure

```
Sanskrit-AI-Translator/
├── backend/
│   ├── .env.example
│   ├── app.py           # FastAPI entrypoint (POST /interpret and POST /translate)
│   ├── analyzer.py      # Sanskrit scholarship engine & Sarvam 105B AI integration
│   ├── translator.py    # Sarvam AI translation client
│   └── requirements.txt
├── frontend/
│   ├── index.html       # Semantic HTML5 Shlokawise interface
│   ├── style.css        # Pure CSS3 responsive spiritual design system
│   └── script.js        # Vanilla JavaScript logic, API integration, and interactions
├── index.html           # Mirror copy for root static serving
├── style.css
├── script.js
├── main.py              # Application runner
└── README.md
```

---

## 🚀 How to Run Locally

### ⚡ Quickest Way on Windows:
Simply double-click **`run_backend.bat`** (or `start.bat`) in the root folder!
It will:
1. Detect Python and activate your virtual environment.
2. Launch the FastAPI backend on `http://127.0.0.1:8000`.
3. Automatically open `http://127.0.0.1:8000` in your default browser.

---

### Option 1: Full-Stack with FastAPI (Manual)

1. Open your terminal in the project root:
   ```bash
   cd Sanskrit-AI-Translator
   ```

2. Activate the virtual environment:
   - **Windows:**
     ```powershell
     .\backend\venv\Scripts\Activate.ps1
     ```
   - **Linux / macOS:**
     ```bash
     source backend/venv/bin/activate
     ```

3. Ensure dependencies are installed:
   ```bash
   pip install -r backend/requirements.txt
   ```

4. Make sure your `.env` file in `backend/.env` contains your Sarvam AI API Key:
   ```env
   SARVAM_API_KEY=your_sarvam_api_key_here
   ```

5. Start the FastAPI server:
   ```bash
   uvicorn backend.app:app --reload --port 8000
   ```

6. Open your web browser and navigate to:
   ```
   http://127.0.0.1:8000
   ```
   The FastAPI server automatically serves the frontend interface (`index.html`, `style.css`, `script.js`) and powers the `/interpret` and `/translate` APIs!

---

## ⌨️ Typing & Converting English to Sanskrit (No Hindi Keyboard Needed)

For users who do not have a physical or software Hindi/Devanagari keyboard installed, Shlokawise provides 4 built-in solutions:

1. **Live English ➔ Sanskrit Typing:**
   - Toggle the switch above the input box: `[x] English ➔ Sanskrit Live Typing`.
   - Simply type phonetically in English (e.g. `harshil`, `namaste`, `dharma`, `karma`, `shanti`, `om`) and press **Space** — it instantly converts to Sanskrit Devanagari (`हर्षिल`, `नमस्ते`, `धर्म`, `कर्म`, `शान्ति`, `ॐ`)!
2. **AI English to Sanskrit Translation:**
   - Type any English word, sentence, or query (e.g. *"harshil"*, *"knowledge is power"*, *"truth alone triumphs"*).
   - Click **`Translate English ➔ Sanskrit ॐ`** to obtain authentic Sanskrit translation via Sarvam AI.
3. **On-Screen Sanskrit / Hindi Virtual Keyboard:**
   - Click **`⌨ Sanskrit Keyboard`** to open the on-screen palette with all Sanskrit Swar (Vowels), Matras, Marks (Anusvara, Visarga, Halant, Avagraha), and Vyanjan (Consonants). Click any character to insert at the cursor.
4. **Auto-Detection on Interpret:**
   - If you paste or type English text and click **`Interpret ✦`**, the AI automatically translates your English input into Sanskrit, renders the verse, and produces the complete scholarly analysis!

---

---

### Option 2: Running the Frontend Separately (Static Server or Live Server)

1. Start the backend as described above on `http://127.0.0.1:8000`.
2. Open `frontend/index.html` directly in your browser, or launch it with any local static web server (such as VS Code Live Server or Python):
   ```bash
   cd frontend
   python -m http.server 3000
   ```
3. Visit `http://localhost:3000`. `script.js` automatically connects to `http://127.0.0.1:8000/interpret` via CORS!

---

## 🌟 Core Features

1. **Top Navigation Bar:**
   - Circular Om (ॐ) logo with orange background.
   - Brand title `Shlokawise` with `BY SANATANA360`.
   - Links: *Interpret*, *Learn*, *Community*, *Daily*.
   - User profile dropdown menu (Seeker Account, Saved Shlokas, Reading History).
   - Mobile responsive hamburger navigation drawer.

2. **Hero Section & Live Statistics:**
   - Heading: *"Translate, Interpret & Understand"* in Cormorant Garamond italic.
   - Statistics: `5000+ SHLOKAS`, `6 TRADITIONS`, `177 DAILY VERSES`, `∞ WISDOM`.

3. **Sanskrit Shloka Input Card:**
   - Devanagari Unicode multiline textarea with character counter.
   - Authentic 1-click example verses:
     - **BG 2.47** (*Karmanye Vadhikaraste...*)
     - **Gayatri** (*Om Bhur Bhuvah Svah...*)
     - **Yoga Sutras** (*Yogas Chitta Vritti Nirodhah...*)
     - **Shanti Mantra** (*Om Saha Navavatu...*)
     - **Ishavasya** (*Isha Vasyam Idam Sarvam...*)

4. **Three Interpretation Modes:**
   - **Full Mode:** Complete report with Sanskrit text, transliteration, word-by-word grammatical breakdown, translation, philosophical exposition, scriptural context, takeaways, and contemplation prompts.
   - **Quick Mode:** Concise summary, core translation, and primary teaching.
   - **+ Cross-Faith Mode:** Comparative analysis contrasting the verse with Stoicism, Buddhism, Taoism, Christianity, and universal human ethics.

5. **AI Results Presentation:**
   - Prominent Devanagari calligraphy card with meter badge.
   - IAST Roman transliteration with diacritical marks.
   - English poetic translation.
   - Word-by-word analysis table (Sanskrit Word, Transliteration, Grammar/Sandhi, Meaning).
   - Philosophical Meaning (Darshana & Tattva).
   - Historical & Spiritual Context.
   - Key Takeaways & Reflection Questions.
   - Cross-Faith Wisdom Grid.
   - One-click copy buttons for Sanskrit verse, English translation, and complete Markdown export.

6. **Additional Knowledge Modules:**
   - **Learn Section:** Introduction to Sanskrit phonetics, Bhagavad Gita paths, Paninian grammar basics (Vibhaktis, Dhatus, Sandhi), and interactive glossary pills (*Dharma*, *Satya*, *Moksha*, *Brahman*, *Atman*, *Ahimsa*).
   - **Community Section:** Forum discussion cards with reflections from seekers and scholars.
   - **Daily Wisdom Section:** Handpicked contemplation verse (*Katha Upanishad 1.3.14*) with an instant "Explore Complete Interpretation ✦" action.

---

## 🔒 Security Note
The frontend code contains **no secret API keys**. All AI generation requests are handled securely by the backend (`backend/app.py` & `backend/analyzer.py`) through server-side environment variables (`SARVAM_API_KEY`).
