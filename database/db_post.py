from .db_helper import db_cursor

def create_post(profile_id, subject, content):
    with db_cursor(commit=True) as cur:
        cur.execute('''
            INSERT INTO posts (profile_id, subject, content)
            VALUES (%s, %s, %s)
            RETURNING post_id, profile_id, subject, content, created_at
        ''', (profile_id, subject, content))
        return cur.fetchone()
