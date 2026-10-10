from flask import Flask, render_template

app = Flask(__name__) #Creates one empty web application

@app.route('/')
def index():
    return render_template('index.html') #when user come to this page, the server sends index.html to the user

@app.route('/login')
def login():
    return render_template('login.html')

if __name__ == '__main__':
    app.run(debug=True) #run the web app
