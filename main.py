import math
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

@app.route('/profile')
def profile():
    # Placeholders only - no sample data. Fill these from the account record.
    record = {'wins': 0, 'draws': 0, 'losses': 0}
    total = sum(record.values())

    player = {
        'display_name': 'Username',
        'handle': 'username',
        'joined': '\u2014',
        'title': '\u2014',
        'favourite': '\u2014',
        'streak': 0,
        'best_streak': 0,
    }

    # Donut geometry: stroke-dash segments on a circle of radius R.
    R, GAP_DEG = 54, 3
    circ = 2 * math.pi * R
    gap = circ * GAP_DEG / 360

    colours = {'wins': '#ad9418', 'draws': '#3576e4', 'losses': '#d9403a'}
    donut, offset = [], 0.0
    for key in ('wins', 'draws', 'losses'):
        value = record[key]
        share = value / total if total else 0
        length = max(circ * share - gap, 0)
        donut.append({
            'label': key.capitalize(),
            'value': value,
            'pct': round(share * 100, 1),
            'colour': colours[key],
            'dash': f'{length:.2f} {circ - length:.2f}',
            'offset': f'{-offset:.2f}',
        })
        offset += circ * share

    # Stacked bars: results per month. Labels stay so the axis still reads.
    months = [{'month': m, 'wins': 0, 'draws': 0, 'losses': 0}
              for m in ('Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep')]
    tallest = max((m['wins'] + m['draws'] + m['losses'] for m in months),
                  default=0) or 1
    for m in months:
        played = m['wins'] + m['draws'] + m['losses']
        m['played'] = played
        m['scale'] = round(played / tallest * 100, 1)
        for key in ('wins', 'draws', 'losses'):
            m[key + '_h'] = round(m[key] / played * 100, 1) if played else 0

    return render_template(
        'profile.html',
        player=player,
        record=record,
        total=total,
        win_rate=round(record['wins'] / total * 100, 1) if total else 0,
        donut=donut,
        circ=round(circ, 2),
        months=months,
        recent=[],
        matches=[],
    )


if __name__ == '__main__':
    app.run(debug=True, port=5001) #run the web app
