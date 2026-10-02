from .db_helper import db_cursor

def create_account_with_profile(account_id, account_name, password_hash, profile_id, profile_name):
    with db_cursor(commit=True) as cur:
        cur.execute('''
            INSERT INTO accounts (account_id, account_name, password_hash)
            VALUES (%s, %s, %s)
        ''', (account_id, account_name, password_hash))
        cur.execute('''
            INSERT INTO profiles (profile_id, account_id, profile_name)
            VALUES (%s, %s, %s)
            RETURNING profile_id, account_id, profile_name, bio, created_at
        ''', (profile_id, account_id, profile_name))
        return cur.fetchone()

def create_profile(profile_id, account_id, profile_name):
    with db_cursor(commit=True) as cur:
        cur.execute('''
            INSERT INTO profiles (profile_id, account_id, profile_name)
            VALUES (%s, %s, %s)
            RETURNING profile_id, account_id, profile_name, bio, created_at
        ''', (profile_id, account_id, profile_name))
        return cur.fetchone()