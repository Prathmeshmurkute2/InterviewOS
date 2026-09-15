from fastapi import APIRouter
from app.models.schemas import (
    GenerateQuestionRequest, GenerateQuestionResponse,
    EvaluateAnswerRequest, EvaluateAnswerResponse,
    HintRequest, HintResponse,
)
from app.services.interviewer_agent import generate_question
from app.services.evaluator_agent import evaluate_answer
from app.services.hint_agent import get_hint

router = APIRouter(prefix="/agents/interview", tags=["interview"])


@router.post("/generate-question", response_model=GenerateQuestionResponse)
def generate_question_endpoint(req: GenerateQuestionRequest):
    return generate_question(req)


@router.post("/evaluate", response_model=EvaluateAnswerResponse)
def evaluate_endpoint(req: EvaluateAnswerRequest):
    return evaluate_answer(req)


@router.post("/hint", response_model=HintResponse)
def hint_endpoint(req: HintRequest):
    return get_hint(req)