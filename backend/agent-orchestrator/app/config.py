import os 
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMEINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL","gemini-2.0-flash")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set. Add it to your .env file.")