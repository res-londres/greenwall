import os
import psycopg2
from dotenv import load_dotenv
from psycopg2.extras import RealDictCursor

load_dotenv()

def get_db_connection():
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        raise ValueError('[DB] DATABASE_URL not found in .env')
    return psycopg2.connect(database_url)

def get_conn_cur(cursor=psycopg2.extensions.cursor):
    conn = get_db_connection()
    return conn, conn.cursor(cursor_factory=cursor)

def close_conn_cur(conn, cur, commit=False):
    if commit:
        conn.commit()
    cur.close()
    conn.close()

