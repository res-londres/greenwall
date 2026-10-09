from flask import Blueprint, request, session
import database.db_user as db_user
import database.db_post as db_post
from .helpers import success, fail

post_bp = Blueprint('post', __name__, url_prefix='/api/post')

@post_bp.post('/create')
def create_post():
    if 'account_id' not in session:
        return fail('Not logged in', status=401)

    data = request.get_json()
    subject = (data.get('subject') or '').strip()
    content = data.get('content') or ''

    if not subject:
        return fail('Subject is required')
    if len(subject) > 150:
        return fail('Subject must be 150 characters or fewer')
    if len(content) > 2000:
        return fail('Content must be 2000 characters or fewer')

    account = db_user.get_account_by_name(session.get('account_name'))
    if not account:
        session.clear()
        return fail('Session expired', status=401)

    profile = next((p for p in account['profiles'] if p['profile_id'] == session['profile_id']), None)
    if not profile:
        return fail('Profile not found', status=403)

    post = db_post.create_post(profile['profile_id'], subject, content)
    post['profile_name'] = profile['profile_name']
    post['likes'] = 0

    return success({'post': post}, 201)

@post_bp.post('/list')
def list_posts():
    if 'account_id' not in session:
        return fail('Not logged in', status=401)

    data = request.get_json() or {}

    after_id = data.get('after_id')
    before_id = data.get('before_id')
    profile_id = data.get('profile_id')

    if after_id is not None and before_id is not None:
        return fail('Cannot provide both after_id and before_id')

    if after_id is not None:
        try:
            after_id = int(after_id)
        except (ValueError, TypeError):
            return fail('after_id must be an integer')

    if before_id is not None:
        try:
            before_id = int(before_id)
        except (ValueError, TypeError):
            return fail('before_id must be an integer')

    if profile_id is not None and not isinstance(profile_id, str):
        return fail('profile_id must be a string')

    limit = data.get('limit', 30)
    try:
        limit = int(limit)
    except (ValueError, TypeError):
        return fail('limit must be an integer')

    limit = max(1, min(limit, 100))

    posts = db_post.list_posts(after_id=after_id, before_id=before_id, profile_id=profile_id, limit=limit)

    return success({'posts': posts})
