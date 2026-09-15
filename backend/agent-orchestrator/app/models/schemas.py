from pydantic import BaseModel
from typing import Optional

class GenerateQuestionRequest(BaseModel):
    jd_text: str
    topic_hint: Optional[str] = None
    difficulty: Optional[str]="medium"


class GenerateQuestionResponse(BaseModel):
    question: str
    topic: Optional[str] =None
    difficulty: str


class EvaluateAnswerRequest(BaseModel):
    question: str
    answer: str


class EvaluateAnswerResponse(BaseModel):
    score: int
    feedback: str
    strengths: list[str]
    improvements: list[str]


class HintRequest(BaseModel):
    question: str
    partial_answer:Optional[str] = None
    hints_given_so_far: int=0


class HintResponse(BaseModel):
    hint: str
 
 
class MatchRequest(BaseModel):
    resume_text: str
    jd_text: str
 
 
class MatchResponse(BaseModel):
    match_score: int  # 0-100
    matching_skills: list[str]
    missing_skills: list[str]
    summary: str