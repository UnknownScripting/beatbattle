from flask import Flask, render_template

app = Flask(__name__) #Creates one empty web application

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/')
def main_page():
    return render_template('main.html') #when user come to this page, the server sends index.html to the user

@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/settings')
def settings():
    return render_template('settings.html')

@app.route('/waiting')
def waiting():
    return render_template('waiting_room.html')

@app.route('/game_room')
def game_room():
    return render_template('game_room.html')

@app.route('/stage')
def stage():
    return render_template('stage.html')

if __name__ == '__main__':
    app.run(debug=True) #run the web app
