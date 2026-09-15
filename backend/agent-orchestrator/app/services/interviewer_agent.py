from app.services.gemini_client import generate
from app.models.schemas import GenerateQuestionRequest, GenerateQuestionResponse

PROMPT_TEMPLATE = """You are a technical interviewer generating ONE interview question
for a candidate applying to the role described below.

Job description:
{jd_text}

{topic_line}
Difficulty: {difficulty}

Rules:
- Ask exactly ONE question, relevant to the job description above.
- Do not include the answer.
- Do not add any preamble like "Sure, here's a question" - output ONLY the question text.
- Keep it realistic, the kind a real interviewer would ask.
"""


def generate_question(req: GenerateQuestionRequest) -> GenerateQuestionResponse:
    topic_line = f"Focus topic: {req.topic_hint}" if req.topic_hint else ""
    prompt = PROMPT_TEMPLATE.format(
        jd_text=req.jd_text,
        topic_line=topic_line,
        difficulty=req.difficulty,
    )
    question_text = generate(prompt)
    return GenerateQuestionResponse(
        question=question_text,
        topic=req.topic_hint,
        difficulty=req.difficulty,
    )