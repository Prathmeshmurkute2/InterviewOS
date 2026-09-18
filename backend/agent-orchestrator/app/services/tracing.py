import json
import uuid
from app.db import get_conn


def log_trace(agent_name: str, input_payload: dict, output_payload: dict, latency_ms: int, session_id: str = None):
    """Log an agent call to Postgres. Never lets a logging failure break the actual response."""
    try:
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO agent_traces (id, session_id, agent_name, input_payload, output_payload, latency_ms, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, now())
                    """,
                    (
                        str(uuid.uuid4()),
                        session_id,
                        agent_name,
                        json.dumps(input_payload),
                        json.dumps(output_payload),
                        latency_ms,
                    ),
                )
                conn.commit()
    except Exception as e:
        print(f"[trace-log-error] {e}")