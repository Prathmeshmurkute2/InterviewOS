import time
from app.services.gemini_client import generate
from app.services.tracing import log_trace
from app.models.schemas import HintRequest, HintResponse

PROMPT_TEMPLATE = """You are a supportive technical interviewer. The candidate is stuck on this question:

Question: {question}

{partial_line}

This is hint number {hint_number} you are giving for this question.

Give ONE short hint (1-2 sentences) that nudges them toward the answer WITHOUT revealing it.
Do not solve the problem for them. Do not repeat a hint you'd likely have already given
at an earlier hint number - make each hint progressively more specific than the last.
Output ONLY the hint text, no preamble.
"""


def get_hint(req: HintRequest) -> HintResponse:
    start = time.time()
    partial_line = (
        f"Their attempt so far: {req.partial_answer}" if req.partial_answer else "They haven't attempted an answer yet."
    )
    prompt = PROMPT_TEMPLATE.format(
        question=req.question,
        partial_line=partial_line,
        hint_number=req.hints_given_so_far + 1,
    )
    hint_text = generate(prompt)
    result = HintResponse(hint=hint_text)
    latency_ms = int((time.time() - start) * 1000)
    log_trace("hint", req.model_dump(), result.model_dump(), latency_ms)
    return result