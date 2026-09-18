# InterviewOS

**A multi-agent AI interview and career copilot.** Paste a job description, get realistic interview questions generated from it, answer them, and get scored by an LLM-as-judge — with Socratic hints when you're stuck and a resume-vs-JD gap analysis before you even start.

Built to close a specific gap: generic practice-question banks don't adapt to the role you're actually applying for, and they give little to no useful feedback on *why* an answer was weak.

---

## Live demo

**[interview-os-5iqq.vercel.app](https://interview-os-5iqq.vercel.app/login)**

> Backend services are hosted on Render's free tier, which spins down after periods of inactivity — the first request after idle time can take 30-60 seconds to wake up. Subsequent requests are fast.

## Screenshots

<img width="920" height="937" alt="image" src="https://github.com/user-attachments/assets/59a735d4-22a6-4ff6-b140-a7f12ad87ba6" />


---

## The problem

Interview prep tools today fall short in three specific ways:

1. **Feedback is vague or absent.** Practicing alone or with peers gives no structured sense of what was actually wrong with an answer — content, structure, or confidence.
2. **Questions aren't tailored to the actual role.** Generic question banks don't adapt to a specific job description.
3. **No adaptive support when you're stuck.** Static banks show you the full solution or nothing at all — a real interviewer nudges you with hints instead.

InterviewOS addresses each of these with a dedicated agent rather than one generic prompt wrapped around an LLM call.

---

## Architecture

```mermaid
flowchart TD
    A[React frontend] -->|REST + JWT| B[Spring Boot services]
    subgraph B [Spring Boot services]
        B1[Auth service]
        B2[Session service]
    end
    B -->|REST| C[Agent Orchestrator - FastAPI / Python]
    subgraph C [Agent Orchestrator]
        C1[Interviewer Agent]
        C2[Evaluator Agent]
        C3[Hint Agent]
        C4[Matcher Agent]
    end
    C -->|LLM calls| D[Gemini API]
    B --> E[(Postgres + pgvector)]
```

**Why this shape:**
- **Java handles core business logic** (auth, sessions, persistence) — the boring, testable, transactional part of the system.
- **A separate Python service owns all AI orchestration**, mirroring how production systems typically split transactional backends from ML/LLM tooling. This keeps the AI layer swappable without touching auth or session logic.
- **Four separate agents, not one mega-prompt.** Each agent has a narrow job (generate a question, judge an answer, give a hint, compare a resume to a JD), which makes each independently testable and debuggable — you can tell exactly which agent produced a bad result instead of guessing.
- **Postgres + pgvector** instead of a separate vector database — one datastore to operate, sufficient for this scale.

---

## Features

- **JWT authentication** — register/login, BCrypt password hashing, stateless sessions
- **JD-driven question generation** — the Interviewer Agent writes questions grounded in the actual job description pasted in
- **LLM-as-judge evaluation** — every answer gets a 0–10 score with specific feedback, strengths, and improvements
- **Socratic hints** — progressive, non-answer-revealing hints when you're stuck, agent-generated
- **Resume-JD fit check** — a match score plus a breakdown of matching vs. missing skills before you even start a session
- **Multi-question sessions with a proper state machine** — sessions can't be extended after completion, can't be double-completed; overall score is the average across all answered questions

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React (Vite), Tailwind CSS, Zustand, Axios, React Router |
| Auth service | Spring Boot 4, Spring Security, JWT (jjwt), BCrypt |
| Session service | Spring Boot 4, Spring Data JPA, `RestClient` |
| Agent Orchestrator | Python, FastAPI, Pydantic |
| LLM | Google Gemini (`google-genai` SDK) |
| Database | PostgreSQL + pgvector extension (Neon, serverless) |
| Infra (local) | Docker Compose (Postgres, Redis) |
| Infra (deployed) | Render (auth-service, session-service, agent-orchestrator — each Dockerized), Vercel (frontend) |

---

## Project structure

```
interview-os/
├── backend/
│   ├── auth-service/          # Spring Boot — JWT auth, user management
│   ├── session-service/       # Spring Boot — sessions, JD storage, orchestrator client
│   └── agent-orchestrator/    # FastAPI — Interviewer, Evaluator, Hint, Matcher agents
├── frontend/
│   └── interview-os-ui/       # React + Vite + Tailwind
├── infra/
│   └── docker-compose.yml     # Postgres (pgvector) + Redis
└── docs/
    └── architecture.md
```

---

## Getting started

### Prerequisites
- Java 21 (JDK)
- Maven
- Python 3.11+
- Node.js 18+
- Docker Desktop
- A Gemini API key ([ai.google.dev](https://ai.google.dev))

### 1. Start the database and cache
```bash
cd infra
docker compose up -d
```

### 2. Auth service
```bash
cd backend/auth-service
mvn spring-boot:run
```
Runs on `http://localhost:8081`

### 3. Session service
```bash
cd backend/session-service
mvn spring-boot:run
```
Runs on `http://localhost:8082`

### 4. Agent Orchestrator
```bash
cd backend/agent-orchestrator
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
```
Create a `.env` file in `agent-orchestrator/`:
```
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.0-flash
```
Then:
```bash
uvicorn app.main:app --reload --port 8000
```
Runs on `http://localhost:8000`

### 5. Frontend
```bash
cd frontend/interview-os-ui
npm install
npm run dev
```
Open `http://localhost:5173`

---

## API overview

**Auth service** (`:8081`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account, returns JWT |
| POST | `/api/auth/login` | Log in, returns JWT |

**Session service** (`:8082`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/sessions/jd` | Upload a job description |
| POST | `/api/sessions/start/{jdId}` | Start a session, generates question #1 |
| POST | `/api/sessions/answer/{questionId}` | Submit an answer, triggers evaluation |
| POST | `/api/sessions/hint/{questionId}` | Get a hint for the current question |
| POST | `/api/sessions/{sessionId}/next` | Generate the next question |
| POST | `/api/sessions/{sessionId}/complete` | Complete the session, computes average score |
| POST | `/api/sessions/match` | Compare a resume against a JD |

**Agent Orchestrator** (`:8000`)
| Method | Endpoint | Agent |
|---|---|---|
| POST | `/agents/interview/generate-question` | Interviewer Agent |
| POST | `/agents/interview/evaluate` | Evaluator Agent |
| POST | `/agents/interview/hint` | Hint Agent |
| POST | `/agents/match/resume-jd` | Matcher Agent |

---

## Notable engineering decisions and problems solved

- **Cross-language HTTP protocol mismatch:** Java's default `HttpClient` attempts an HTTP/2 cleartext upgrade even on plain HTTP requests, which `uvicorn`'s HTTP/1.1-only server rejected outright. Fixed by explicitly pinning `RestClient` to `HttpClient.Version.HTTP_1_1`.
- **LLM API resilience:** Gemini occasionally returns transient `503 UNAVAILABLE` errors under load. The orchestrator wraps every LLM call with exponential-backoff retry logic rather than failing the request outright.
- **JPA `@GeneratedValue` misuse:** an early bug manually set a `@GeneratedValue` primary key instead of a foreign-key-style reference field, which broke Hibernate's insert/update detection — a good reminder to never hand-assign a generated ID.
- **State machine correctness:** session completion and question-limit checks are enforced server-side (`409 Conflict` on invalid transitions), not just left to the frontend to "behave nicely."
- **JDBC vs. native Postgres connection strings:** Neon (like most managed Postgres providers) issues connection strings in `postgresql://user:pass@host/db` format. JDBC doesn't accept embedded credentials — the URL, username, and password have to be split into separate config values before Spring Boot's `DataSource` will accept them.
- **Multi-stage Docker builds for both Spring Boot services:** a Maven+JDK image compiles the JAR in one stage, then only the built JAR is copied into a lightweight JRE-only final image — keeps the deployed image small and avoids shipping build tooling to production.

---

## Roadmap

- [ ] Session history / past-attempts view
- [ ] `agent_traces` observability panel — log every agent call's input, output, and latency for debugging multi-agent behavior
- [ ] Fine-tuned classifier for answer confidence/structure scoring, layered alongside the LLM-as-judge
- [ ] Streaming evaluator feedback via SSE
- [ ] Custom domain + CI/CD pipeline (currently manual redeploys on Render/Vercel)

---

## License

MIT
