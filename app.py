from flask import render_template, request, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from init import app

@app.route('/')
def index():
    return render_template('index.html')

@app.post('/api/signup')
def signup():
    data = request.get_json()
    username = data['username'].strip()
    password = data['password']
    # validate, hash, insert account + default profile, set session
    ...

@app.post('/api/login')
def login():
    ...

@app.post('/api/logout')
def logout():
    session.clear()
    return jsonify(ok=True)


if __name__ == '__main__':
    app.run(debug=True)