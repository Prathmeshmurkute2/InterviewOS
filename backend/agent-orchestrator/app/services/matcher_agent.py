import json
import re
from app.services.gemini_client import generate
from app.models.schemas import MatchRequest, MatchResponse

PROMPT_TEMPLATE = """Compare this resume against this job description and identify the skill gap.

Resume:
{resume_text}

Job description:
{jd_text}

Respond with ONLY a JSON object (no markdown fences, no preamble) in exactly this shape:

{{
  "match_score": <integer 0-100>,
  "matching_skills": ["<skill present in both>", ...],
  "missing_skills": ["<skill in JD but not clearly in resume>", ...],
  "summary": "<2-3 sentence overall assessment of fit>"
}}
"""


def _extract_json(raw_text: str) -> dict:
    cleaned = re.sub(r"^```(json)?|```$", "", raw_text.strip(), flags=re.MULTILINE).strip()
    return json.loads(cleaned)


def match_resume_to_jd(req: MatchRequest) -> MatchResponse:
    prompt = PROMPT_TEMPLATE.format(resume_text=req.resume_text, jd_text=req.jd_text)
    raw = generate(prompt)
    try:
        data = _extract_json(raw)
    except (json.JSONDecodeError, ValueError):
        data = {
            "match_score": 50,
            "matching_skills": [],
            "missing_skills": [],
            "summary": "Could not parse structured match result. Raw response: " + raw[:200],
        }
    return MatchResponse(**data)