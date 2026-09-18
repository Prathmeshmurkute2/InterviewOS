import os
import psycopg2
from contextlib import contextmanager

DB_URL = os.getenv("DATABASE_URL", "postgresql://interviewos:devpass@localhost:5432/interviewos")


@contextmanager
def get_conn():
    conn = psycopg2.connect(DB_URL)
    try:
        yield conn
    finally:
        conn.close()