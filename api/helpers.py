import random
from flask import jsonify

def success(data=None, status=200):
    payload = {'ok': True}
    if data is not None:
        payload['data'] = data
    return jsonify(payload), status

def fail(message, status=400):
    return jsonify(ok=False, error=message), status

def random_suffix(length=4):
    return ''.join(random.choices('0123456789', k=length))

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