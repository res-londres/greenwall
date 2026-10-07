from flask import Flask, render_template
from api import register_blueprints

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

@app.route('/')
def index():
    return render_template('index.html')

register_blueprints(app)

if __name__ == '__main__':
    app.run(debug=True)