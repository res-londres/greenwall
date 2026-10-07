from flask import Blueprint, request, session
import database.db_user as db_user
from .helpers import *

profile_bp = Blueprint('profile', __name__, url_prefix='/api/profile')

@profile_bp.post('/set_active')
def set_active_profile():
    if 'account_id' not in session:
        return fail('Not logged in', status=401)

    data = request.get_json()
    profile_id = data.get('profile_id')

    if not profile_id:
        return fail('profile_id is required')

    account = db_user.get_account_by_name(session.get('account_name'))
    if not account:
        session.clear()
        return fail('Session expired', status=401)

    if not any(p['profile_id'] == profile_id for p in account['profiles']):
        return fail('Profile not found', status=404)

    session['profile_id'] = profile_id
    return success()

@profile_bp.post('/create')
def create_profile():
    if 'account_id' not in session:
        return fail('Not logged in', status=401)

    data = request.get_json()
    profile_name = (data.get('profile_name') or '').strip()

    profile_validation = validate_profile_name(profile_name)
    if profile_validation is not None:
        return profile_validation

    account = db_user.get_account_by_name(session.get('account_name'))
    if not account:
        session.clear()
        return fail('Session expired', status=401)

    if len(account['profiles']) >= 3:
        return fail('Maximum number of profiles reached', status=403)

    profile_id = f'{profile_name}#{random_suffix()}'
    new_profile = db_user.create_profile(profile_id, account['account_id'], profile_name)

    session['profile_id'] = profile_id

    return success({'profile': new_profile}, 201)

@profile_bp.post('/delete')
def delete_profile():
    if 'account_id' not in session:
        return fail('Not logged in', status=401)

    data = request.get_json()
    profile_id = data.get('profile_id')

    if not profile_id:
        return fail('profile_id is required')

    account = db_user.get_account_by_name(session.get('account_name'))
    if not account:
        session.clear()
        return fail('Session expired', status=401)

    if not any(p['profile_id'] == profile_id for p in account['profiles']):
        return fail('Profile not found', status=404)

    if len(account['profiles']) <= 1:
        return fail('Cannot delete your only profile', status=403)

    db_user.soft_delete_profile(profile_id)

    remaining_profiles = [p for p in account['profiles'] if p['profile_id'] != profile_id]
    session['profile_id'] = remaining_profiles[0]['profile_id']

    return success({'profiles': remaining_profiles})
