from flask import render_template, request, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import random
from init import app
import database.db_user as db_user

@app.route('/')
def index():
    return render_template('index.html')

@app.post('/api/check_session')
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

@app.post('/api/signup')
def signup():
    data = request.get_json()
    account_name = (data.get('account_name') or '').strip()
    profile_name = (data.get('profile_name') or '').strip()
    password = data.get('password') or ''

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

@app.post('/api/login')
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

@app.post('/api/logout')
def logout():
    session.clear()
    return success()

@app.post('/api/set_active_profile')
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

@app.post('/api/create_profile')
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

@app.post('/api/delete_profile')
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

@app.post('/api/delete_account')
def delete_account():
    if 'account_id' not in session:
        return fail('Not logged in', status=401)

    account = db_user.get_account_by_name(session.get('account_name'))
    if not account:
        session.clear()
        return fail('Session expired', status=401)

    db_user.soft_delete_account(account['account_id'])
    session.clear()

    return success()

def success(data=None, status=200):
    payload = {'ok': True}
    if data is not None:
        payload['data'] = data
    return jsonify(payload), status

def fail(message, status=400):
    return jsonify(ok=False, error=message), status

def random_suffix(length=4):
    return ''.join(random.choices('0123456789', k=length))

def set_session(account_id, profile_id, account_name):
    session['account_id'] = account_id
    session['profile_id'] = profile_id
    session['account_name'] = account_name

def validate_account_credentials(account_name, password):
    if not account_name or not password:
        return fail('Account name and password are required')
    if len(account_name) < 3 or len(account_name) > 20:
        return fail('Account name must be between 3 and 20 characters')
    if len(password) < 6:
        return fail('Password must be at least 6 characters long')
    if not account_name.isalnum() or not password.isalnum():
        return fail('Credentials must be alphanumeric') 

def validate_profile_name(profile_name):
    if not profile_name:
        return fail('Profile name is required')
    if len(profile_name) < 3 or len(profile_name) > 20:
        return fail('Profile name must be between 3 and 20 characters')
    if not profile_name.isalnum():
        return fail('Profile name must be alphanumeric')

if __name__ == '__main__':
    app.run(debug=True)