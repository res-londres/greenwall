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
    post['created_at'] = post['created_at'].isoformat()

    return success({'post': post}, 201)
