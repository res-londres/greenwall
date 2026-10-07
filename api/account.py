from flask import Blueprint, session
import database.db_user as db_user
from .helpers import *

account_bp = Blueprint('account', __name__, url_prefix='/api/account')

@account_bp.post('/delete')
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