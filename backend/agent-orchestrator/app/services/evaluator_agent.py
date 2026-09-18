import json
import re
import time
from app.services.gemini_client import generate
from app.services.tracing import log_trace
from app.models.schemas import EvaluateAnswerRequest, EvaluateAnswerResponse

PROMPT_TEMPLATE = """You are an expert technical interviewer evaluating a candidate's answer.

Question: {question}

Candidate's answer: {answer}

Evaluate this answer and respond with ONLY a JSON object (no markdown fences, no preamble)
in exactly this shape:

{{
  "score": <integer 0-10>,
  "feedback": "<2-3 sentence overall assessment>",
  "strengths": ["<short point>", "<short point>"],
  "improvements": ["<short point>", "<short point>"]
}}

Score guide: 0-3 = incorrect/very weak, 4-6 = partially correct, 7-8 = solid, 9-10 = excellent.
"""


def _extract_json(raw_text: str) -> dict:
    cleaned = re.sub(r"^```(json)?|```$", "", raw_text.strip(), flags=re.MULTILINE).strip()
    return json.loads(cleaned)


def evaluate_answer(req: EvaluateAnswerRequest) -> EvaluateAnswerResponse:
    start = time.time()
    prompt = PROMPT_TEMPLATE.format(question=req.question, answer=req.answer)
    raw = generate(prompt)
    try:
        data = _extract_json(raw)
    except (json.JSONDecodeError, ValueError):
        data = {
            "score": 5,
            "feedback": "Could not parse structured evaluation. Raw response: " + raw[:200],
            "strengths": [],
            "improvements": [],
        }
    result = EvaluateAnswerResponse(**data)
    latency_ms = int((time.time() - start) * 1000)
    log_trace("evaluator", req.model_dump(), result.model_dump(), latency_ms)
    return result