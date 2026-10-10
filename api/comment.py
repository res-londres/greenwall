from flask import Blueprint, request, session
import database.db_user as db_user
import database.db_post as db_post
import database.db_comment as db_comment
from .helpers import success, fail

comment_bp = Blueprint('comment', __name__, url_prefix='/api/comment')


@comment_bp.post('/create')
def create_comment():
    if 'account_id' not in session:
        return fail('Not logged in', status=401)

    data = request.get_json() or {}
    post_id = data.get('post_id')
    content = (data.get('content') or '').strip()

    if post_id is None:
        return fail('post_id is required')
    try:
        post_id = int(post_id)
    except (ValueError, TypeError):
        return fail('post_id must be an integer')

    if not content:
        return fail('Comment is required')
    if len(content) > 1000:
        return fail('Comment must be 1000 characters or fewer')

    account = db_user.get_account_by_name(session.get('account_name'))
    if not account:
        session.clear()
        return fail('Session expired', status=401)

    profile = next((p for p in account['profiles'] if p['profile_id'] == session['profile_id']), None)
    if not profile:
        return fail('Profile not found', status=403)

    post = db_post.get_post_by_id(post_id)
    if not post:
        return fail('Post not found', status=404)

    comment = db_comment.create_comment(post_id, profile['profile_id'], content)
    comment['profile_name'] = profile['profile_name']

    return success({'comment': comment}, 201)


@comment_bp.post('/list')
def list_comments():
    if 'account_id' not in session:
        return fail('Not logged in', status=401)

    data = request.get_json() or {}
    post_id = data.get('post_id')
    before_mine_id = data.get('before_mine_id')
    before_other_id = data.get('before_other_id')
    has_more_mine = data.get('has_more_mine', True)
    has_more_other = data.get('has_more_other', True)

    if post_id is None:
        return fail('post_id is required')
    try:
        post_id = int(post_id)
    except (ValueError, TypeError):
        return fail('post_id must be an integer')

    if before_mine_id is not None:
        try:
            before_mine_id = int(before_mine_id)
        except (ValueError, TypeError):
            return fail('before_mine_id must be an integer')

    if before_other_id is not None:
        try:
            before_other_id = int(before_other_id)
        except (ValueError, TypeError):
            return fail('before_other_id must be an integer')

    if not isinstance(has_more_mine, bool):
        return fail('has_more_mine must be a boolean')
    if not isinstance(has_more_other, bool):
        return fail('has_more_other must be a boolean')

    limit = data.get('limit', 30)
    try:
        limit = int(limit)
    except (ValueError, TypeError):
        return fail('limit must be an integer')
    limit = max(1, min(limit, 100))

    profile_id = session['profile_id']

    comments = []
    mine_count = 0

    if has_more_mine:
        mine = db_comment.list_comments_mine(post_id, profile_id, before_mine_id, limit)
        mine_count = len(mine)
        comments.extend(mine)

        if mine_count == limit:
            return success({
                'comments': comments,
                'has_more_mine': True,
                'has_more_other': has_more_other
            })

    remaining = limit - mine_count

    if has_more_other and remaining > 0:
        other = db_comment.list_comments_other(post_id, profile_id, before_other_id, remaining)
        comments.extend(other)
        other_count = len(other)
        has_more_other_out = (other_count == remaining)
    else:
        has_more_other_out = False

    return success({
        'comments': comments,
        'has_more_mine': False,
        'has_more_other': has_more_other_out
    })
