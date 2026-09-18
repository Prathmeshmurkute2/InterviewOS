from fastapi import APIRouter
from app.db import get_conn

router = APIRouter(prefix="/traces", tags=["traces"])


@router.get("")
def list_traces(limit: int = 50):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, session_id, agent_name, input_payload, output_payload, latency_ms, created_at
                FROM agent_traces ORDER BY created_at DESC LIMIT %s
                """,
                (limit,),
            )
            rows = cur.fetchall()
    return [
        {
            "id": str(r[0]),
            "sessionId": str(r[1]) if r[1] else None,
            "agentName": r[2],
            "inputPayload": r[3],
            "outputPayload": r[4],
            "latencyMs": r[5],
            "createdAt": r[6].isoformat(),
        }
        for r in rows
    ]