from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import interview, match, traces

app = FastAPI(title="InterviewOS Agent Orchestrator", version="0.1.0")

allow_origins=["http://localhost:5173", "https://YOUR-VERCEL-DOMAIN.vercel.app"],

app.include_router(interview.router)
app.include_router(match.router)
app.include_router(traces.router)


@app.get("/health")
def health():
    return {"status": "ok"}