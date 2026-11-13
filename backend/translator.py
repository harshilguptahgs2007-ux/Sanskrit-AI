
import os
from pathlib import Path
from dotenv import load_dotenv
from sarvamai import SarvamAI

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(env_path)

api_key = os.getenv("SARVAM_API_KEY")

if not api_key:
    raise ValueError("SARVAM_API_KEY is missing from backend/.env")

client = SarvamAI(
    api_subscription_key=api_key
)

def translate_to_sanskrit(text, source_language_code="en-IN"):

    if not text.strip():
        raise ValueError("Please enter some text.")

    if len(text) > 2000:
        raise ValueError("Text cannot exceed 2000 characters.")

    response = client.text.translate(
        input=text,
        source_language_code=source_language_code,
        target_language_code="sa-IN",
        model="sarvam-translate:v1"
    )

    return response.translated_text
