from fastapi import APIRouter
from app.models.schemas import MatchRequest, MatchResponse
from app.services.matcher_agent import match_resume_to_jd

router = APIRouter(prefix="/agents/match", tags=["match"])


@router.post("/resume-jd", response_model=MatchResponse)
def match_endpoint(req: MatchRequest):
    return match_resume_to_jd(req)