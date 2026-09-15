from fastapi import FastAPI
from app.routers import interview, match

app = FastAPI(title="InterviewOS Agent Orchestrator", version="0.1.0")

app.include_router(interview.router)
app.include_router(match.router)

@app.get("/health")
def health():
    return {"status":"ok"}