import time
from google import genai
from google.genai import errors
from app.config import GEMINI_API_KEY, GEMINI_MODEL

_client = genai.Client(api_key=GEMINI_API_KEY)

MAX_RETRIES = 3
BASE_DELAY_SECONDS = 2


def generate(prompt: str) -> str:
    """Send a prompt to Gemini and return the raw text response.

    Retries on transient server errors (e.g. 503 UNAVAILABLE due to high demand)
    with exponential backoff, since LLM APIs are prone to brief availability blips.
    """
    last_error = None
    for attempt in range(MAX_RETRIES):
        try:
            response = _client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt,
            )
            return response.text.strip()
        except errors.ServerError as e:
            last_error = e
            if attempt < MAX_RETRIES - 1:
                delay = BASE_DELAY_SECONDS * (2 ** attempt)
                time.sleep(delay)
    raise last_error