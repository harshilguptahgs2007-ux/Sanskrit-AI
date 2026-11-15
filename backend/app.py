import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from typing import Optional
import re

try:
    from backend.translator import translate_to_sanskrit
    from backend.analyzer import interpret_shloka
except ModuleNotFoundError:
    from translator import translate_to_sanskrit
    from analyzer import interpret_shloka

app = FastAPI(title="Sanskrit AI Translator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)

class TranslationRequest(BaseModel):
    text: Optional[str] = None
    shloka: Optional[str] = None
    source_language_code: str = "en-IN"

class InterpretRequest(BaseModel):
    shloka: Optional[str] = None
    text: Optional[str] = None
    mode: str = "full"

@app.get("/health")
@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "message": "Sanskrit AI Translator Backend is Running"
    }

@app.post("/translate")
@app.post("/api/translate")
def translate(request: TranslationRequest):
    input_text = (request.text or request.shloka or "").strip()
    if not input_text:
        raise HTTPException(status_code=400, detail="Please enter English or source text to translate to Sanskrit.")

    try:
        translated_text = translate_to_sanskrit(
            input_text,
            request.source_language_code
        )

        return {
            "success": True,
            "original_text": input_text,
            "sanskrit_text": translated_text
        }

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

    except Exception as error:
        print("Translation error:", str(error))
        raise HTTPException(
            status_code=502,
            detail=f"Translation service failed: {str(error)}"
        )

@app.post("/interpret")
@app.post("/api/interpret")
def interpret(request: InterpretRequest):
    input_shloka = (request.shloka or request.text or "").strip()
    if not input_shloka:
        raise HTTPException(status_code=400, detail="Please enter a Sanskrit shloka to interpret.")

    # Check if user passed English / Romanized text (e.g. without Hindi keyboard)
    has_latin = bool(re.search(r'[a-zA-Z]', input_shloka))
    has_devanagari = bool(re.search(r'[\u0900-\u097F]', input_shloka))

    translated_sanskrit = None
    if has_latin and not has_devanagari:
        # User typed English or transliteration without Hindi keyboard!
        try:
            translated_sanskrit = translate_to_sanskrit(input_shloka, "en-IN")
            if translated_sanskrit:
                target_shloka = translated_sanskrit
            else:
                target_shloka = input_shloka
        except Exception as e:
            print("Auto English-to-Sanskrit translation notice:", e)
            target_shloka = input_shloka
    else:
        target_shloka = input_shloka

    try:
        result = interpret_shloka(target_shloka, request.mode)
        if translated_sanskrit:
            result["original_input"] = input_shloka
            result["translated_sanskrit"] = translated_sanskrit
            result["converted_from_english"] = True
        return result

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

    except Exception as error:
        print("Interpretation error:", str(error))
        raise HTTPException(
            status_code=502,
            detail=f"Interpretation service failed: {str(error)}"
        )

# Frontend static files mounting
BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"
if not FRONTEND_DIR.exists():
    FRONTEND_DIR = Path(__file__).resolve().parent / "frontend"

if FRONTEND_DIR.exists() and (FRONTEND_DIR / "index.html").exists():
    @app.get("/")
    def serve_index():
        return FileResponse(FRONTEND_DIR / "index.html")

    app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")
else:
    @app.get("/")
    def home():
        return {
            "message": "Sanskrit AI Translator Backend is Running"
        }
