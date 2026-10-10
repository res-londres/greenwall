from .db_helper import db_cursor


def create_comment(post_id, profile_id, content):
    with db_cursor(commit=True) as cur:
        cur.execute('''
            INSERT INTO comments (post_id, profile_id, content)
            VALUES (%s, %s, %s)
            RETURNING comment_id, post_id, profile_id, content, created_at
        ''', (post_id, profile_id, content))
        comment = cur.fetchone()
        comment['created_at'] = comment['created_at'].isoformat()
        return comment


def list_comments_mine(post_id, profile_id, before_id, limit):
    with db_cursor() as cur:
        cur.execute('''
            SELECT
                c.comment_id,
                c.post_id,
                c.profile_id,
                c.content,
                c.created_at,
                CASE WHEN pr.deleted_at IS NULL THEN pr.profile_name ELSE NULL END AS profile_name
            FROM comments c
            LEFT JOIN profiles pr ON c.profile_id = pr.profile_id
            WHERE c.post_id = %s
              AND c.profile_id = %s
              AND c.deleted_at IS NULL
              AND (%s IS NULL OR c.comment_id < %s)
            ORDER BY c.comment_id DESC
            LIMIT %s
        ''', (post_id, profile_id, before_id, before_id, limit))
        comments = cur.fetchall()
        for c in comments:
            c['created_at'] = c['created_at'].isoformat()
        return comments


def list_comments_other(post_id, profile_id, before_id, limit):
    with db_cursor() as cur:
        cur.execute('''
            SELECT
                c.comment_id,
                c.post_id,
                c.profile_id,
                c.content,
                c.created_at,
                CASE WHEN pr.deleted_at IS NULL THEN pr.profile_name ELSE NULL END AS profile_name
            FROM comments c
            LEFT JOIN profiles pr ON c.profile_id = pr.profile_id
            WHERE c.post_id = %s
              AND c.profile_id != %s
              AND c.deleted_at IS NULL
              AND (%s IS NULL OR c.comment_id < %s)
            ORDER BY c.comment_id DESC
            LIMIT %s
        ''', (post_id, profile_id, before_id, before_id, limit))
        comments = cur.fetchall()
        for c in comments:
            c['created_at'] = c['created_at'].isoformat()
        return comments
