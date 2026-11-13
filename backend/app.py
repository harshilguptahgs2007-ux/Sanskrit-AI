from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

try:
    from backend.translator import translate_to_sanskrit
except ModuleNotFoundError:
    from translator import translate_to_sanskrit

app = FastAPI(title="Sanskrit AI Translator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)

class TranslationRequest(BaseModel):
    text: str = Field(min_length=1, max_length=2000)
    source_language_code: str = "en-IN"

@app.get("/")
def home():
    return {
        "message": "Sanskrit AI Translator Backend is Running"
    }

@app.post("/translate")
def translate(request: TranslationRequest):
    try:
        translated_text = translate_to_sanskrit(
            request.text,
            request.source_language_code
        )

        return {
            "success": True,
            "sanskrit_text": translated_text
        }

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

    except Exception as error:
        print("Translation error:", str(error))
        raise HTTPException(
            status_code=502,
            detail="Translation service failed. Please try again."
        )
