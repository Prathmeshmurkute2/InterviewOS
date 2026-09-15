import google.generativeai as genai
from app.config import GEMINI_API_KEY, GEMINI_MODEL

genai.configure(api_key=GEMINI_API_KEY)

_model = genai.GenerativeModel(GEMINI_MODEL)

def generate(prompt: str) -> str:
    """Send a prompt to Gemini and return the raw test response"""

    response = _model.generate_content(prompt)
    return response.text.strip()