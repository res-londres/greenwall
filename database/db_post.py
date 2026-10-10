from .db_helper import db_cursor

def create_post(profile_id, subject, content):
    with db_cursor(commit=True) as cur:
        cur.execute('''
            INSERT INTO posts (profile_id, subject, content)
            VALUES (%s, %s, %s)
            RETURNING post_id, profile_id, subject, content, created_at, 0 AS comment_count
        ''', (profile_id, subject, content))
        post = cur.fetchone()
        post['created_at'] = post['created_at'].isoformat()
        return post

def get_post_by_id(post_id):
    with db_cursor() as cur:
        cur.execute('''
            SELECT post_id, profile_id, subject, content, created_at, 0 AS comment_count
            FROM posts
            WHERE post_id = %s AND deleted_at IS NULL
        ''', (post_id,))
        post = cur.fetchone()
        if post:
            post['created_at'] = post['created_at'].isoformat()
        return post


def list_posts(after_id=None, before_id=None, profile_id=None, limit=30):
    with db_cursor() as cur:
        conditions = ['p.deleted_at IS NULL']
        params = []

        if after_id is not None:
            conditions.append('p.post_id > %s')
            params.append(after_id)
        if before_id is not None:
            conditions.append('p.post_id < %s')
            params.append(before_id)
        if profile_id is not None:
            conditions.append('p.profile_id = %s')
            params.append(profile_id)

        params.append(limit)

        query = f'''
            SELECT
                p.post_id,
                p.profile_id,
                p.subject,
                p.content,
                p.created_at,
                CASE WHEN pr.deleted_at IS NULL THEN pr.profile_name ELSE NULL END AS profile_name,
                (SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = p.post_id) AS likes,
                (SELECT COUNT(*) FROM comments c
                 WHERE c.post_id = p.post_id AND c.deleted_at IS NULL) AS comment_count
            FROM posts p
            LEFT JOIN profiles pr ON p.profile_id = pr.profile_id
            WHERE {' AND '.join(conditions)}
            ORDER BY p.post_id DESC
            LIMIT %s
        '''

        cur.execute(query, params)
        posts = cur.fetchall()

        for post in posts:
            post['created_at'] = post['created_at'].isoformat()

        return posts
