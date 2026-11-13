# Sanskrit AI Translator (संस्कृत AI)

A multilingual AI-powered translation web application that translates text from multiple Indian languages and English into Sanskrit using the Sarvam AI API and FastAPI.

---

## 📁 Project Structure

```
Sanskrit-AI/
├── backend/
│   ├── .env.example
│   ├── app.py
│   ├── requirements.txt
│   └── translator.py
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Sarvam AI API Key ([sarvam.ai](https://www.sarvam.ai/))

---

### Backend Setup

1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   - **Windows:**
     ```bash
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **Linux / macOS:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and add your Sarvam AI API key:
     ```env
     SARVAM_API_KEY=your_sarvam_api_key_here
     ```

5. Start the backend server:
   ```bash
   uvicorn app:app --reload --port 8000
   ```
   The backend API will be available at `http://127.0.0.1:8000`.

---

### Frontend Setup

1. Open the `frontend` folder.
2. Launch `index.html` in your browser or run a local static server (e.g. using VS Code Live Server or Python):
   ```bash
   cd frontend
   python -m http.server 3000
   ```
3. Open `http://localhost:3000` (or `http://127.0.0.1:5500`) in your web browser.

---

### Vercel Deployment

1. Import the repository `https://github.com/harshilguptahgs2007-ux/Sanskrit-AI` into your Vercel dashboard.
2. In the Vercel project configuration, go to **Settings > Environment Variables**.
3. Add the variable:
   - **Key:** `SARVAM_API_KEY`
   - **Value:** `your_sarvam_api_key_here`
4. Click **Deploy**. Vercel will automatically build the FastAPI backend using `pyproject.toml` and serve both the frontend UI and the backend API!

---

## ✨ Features

- **Multi-language Support:** Translate from English, Hindi, Bengali, Gujarati, Kannada, Malayalam, Marathi, Odia, Punjabi, Tamil, and Telugu into Sanskrit.
- **Character Counter:** Real-time limit tracker (up to 2000 characters).
- **One-click Copy & Download:** Copy translation to clipboard or download as a text file.
- **Responsive UI:** Dark theme styled with modern typography and golden accents.
