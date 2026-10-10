from flask import Blueprint, request, session
from werkzeug.security import generate_password_hash, check_password_hash
import database.db_user as db_user
from .helpers import *

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.post('/session')
def check_session():
    if 'account_id' in session:
        account = db_user.get_account_by_name(session.get('account_name'))
        if not account:
            session.clear()
            return fail('Session expired', status=401)
        return success({
            'account_id': session['account_id'],
            'profile_id': session['profile_id'],
            'account_name': session['account_name'],
            'profiles': account['profiles'],
        })
    return fail('Not logged in', status=401)

@auth_bp.post('/signup')
def signup():
    data = request.get_json()
    account_name = (data.get('account_name') or '').strip()
    profile_name = (data.get('profile_name') or '').strip()
    password = data.get('password') or ''
    password_retype = data.get('password_retype') or ''

    if password != password_retype:
        return fail('Password mismatch')

    account_validation = validate_account_credentials(account_name, password)
    if account_validation is not None:
        return account_validation

    profile_validation = validate_profile_name(profile_name)
    if profile_validation is not None:
        return profile_validation

    if db_user.get_account_by_name(account_name):
        return fail('Username is already taken', status=409)

    account_id = f'{account_name}#{random_suffix()}'
    profile_id = f'{profile_name}#{random_suffix()}' 

    password_hash = generate_password_hash(password)

    profile = db_user.create_account_with_profile(
        account_id, account_name, password_hash, profile_id, profile_name
    )

    set_session(account_id, profile_id, account_name)

    return success({
        'account_id': account_id,
        'account_name': account_name,
        'profile_id': session['profile_id'],
        'profiles': [profile],
    }, 201)

@auth_bp.post('/login')
def login():
    data = request.get_json()
    account_name = (data.get('account_name') or '').strip()
    password = data.get('password') or ''

    account_validation = validate_account_credentials(account_name, password)
    if account_validation is not None:
        return account_validation

    account = db_user.get_account_by_name(account_name)
    if not account:
        return fail('Account not found', 404)

    if not check_password_hash(account['password_hash'], password):
        return fail('Incorrect password', 401)

    set_session(
        account['account_id'],
        account['profiles'][0]['profile_id'] if account['profiles'] else None,
        account['account_name']
    )

    return success({
        'account_id': account['account_id'],
        'account_name': account['account_name'],
        'profile_id': session['profile_id'],
        'profiles': account['profiles'],
    })

@auth_bp.post('/logout')
def logout():
    session.clear()
    return success()

# -------------------- HELPERS -------------------- #
def set_session(account_id, profile_id, account_name):
    session['account_id'] = account_id
    session['profile_id'] = profile_id
    session['account_name'] = account_name

