// Background score: staves stacked down the page, each one playing a longer
// stretch of a famous piece. Every few seconds they all move on to the next.
// Notes are letter + optional accidental (# or b) + octave. No rhythm, just pitch.

const MOTIFS = [
    // Beethoven - Symphony No. 5
    'G4 G4 G4 Eb4 F4 F4 F4 D4 G4 G4 G4 Eb4 Ab4 Ab4 Ab4 G4 Eb5 Eb5 Eb5 C5 G4 G4 G4 D4',
    // Beethoven - Fur Elise
    'E5 D#5 E5 D#5 E5 B4 D5 C5 A4 C4 E4 A4 B4 E4 G#4 B4 C5 E4 E5 D#5 E5 D#5 E5 B4 D5 C5 A4',
    // Beethoven - Ode to Joy
    'E5 E5 F5 G5 G5 F5 E5 D5 C5 C5 D5 E5 E5 D5 D5 E5 E5 F5 G5 G5 F5 E5 D5 C5 C5 D5 E5 D5 C5 C5',
    // Mozart - Eine kleine Nachtmusik
    'G4 D4 G4 D4 G4 D4 G4 B4 D5 C5 A4 C5 A4 C5 A4 F#4 A4 D4 G4 G4 B4 A4 G4 G4 F#4 F#4',
    // Mozart - Rondo alla Turca
    'B4 A4 G#4 A4 C5 D5 C5 B4 C5 E5 F5 E5 D#5 E5 B5 A5 G#5 A5 B5 A5 G#5 A5 C6 A5 C6',
    // Grieg - In the Hall of the Mountain King
    'A4 B4 C5 D5 E5 C5 E5 D#5 B4 D#5 D5 Bb4 D5 A4 B4 C5 D5 E5 C5 E5 A5 G5 E5 C5 E5 G5',
    // Bach - Toccata and Fugue in D minor
    'A5 G5 A5 G5 F5 E5 D5 C#5 D5 A4 G4 A4 E4 F4 C#4 D4 A4 G4 A4 G4 F4 E4 D4',
    // Bach - Minuet in G
    'D5 G4 A4 B4 C5 D5 G4 G4 E5 C5 D5 E5 F#5 G5 G4 G4 C5 D5 C5 B4 A4 B4 C5 B4 A4 G4 F#4 G4 A4 B4 G4 A4',
    // Pachelbel - Canon in D
    'F#5 E5 D5 C#5 B4 A4 B4 C#5 D5 C#5 B4 A4 G4 F#4 G4 E4 D4 F#4 A4 G4 F#4 D4 F#4 E4',
].map(m => m.split(' '));

const SVG_NS = 'http://www.w3.org/2000/svg';
const GAP = 12;          // space between staff lines
const SYSTEM = 120;      // vertical space each staff takes
const NOTE_START = 70;   // room for the clef
const MIN_SPACE = 34;    // closest two notes can be
const STEPS = { C: -2, D: -1, E: 0, F: 1, G: 2, A: 3, B: 4 };

function step(note) {
    return STEPS[note[0]] + (Number(note[note.length - 1]) - 4) * 7;
}

function el(tag, attrs, text) {
    const e = document.createElementNS(SVG_NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (text) e.textContent = text;
    return e;
}

function line(svg, x1, x2, y) {
    svg.appendChild(el('line', { x1, x2, y1: y, y2: y, class: 'staff-line' }));
}

// one staff with its clef and notes; bottom = y of the bottom line
function drawStaff(svg, notes, bottom, width) {
    for (let i = 0; i < 5; i++) line(svg, 0, width, bottom - i * GAP);
    svg.appendChild(el('text', { x: 6, y: bottom + 7, class: 'clef' }, '\u{1D11E}'));

    const room = width - NOTE_START - 20;
    const fit = Math.min(notes.length, Math.floor(room / MIN_SPACE));
    const space = room / fit;

    notes.slice(0, fit).forEach((n, i) => {
        const s = step(n);
        const x = NOTE_START + space * (i + 0.5);
        const y = bottom - s * GAP / 2;

        for (let l = -2; l >= s; l -= 2) line(svg, x - 11, x + 11, bottom - l * GAP / 2);
        for (let l = 10; l <= s; l += 2) line(svg, x - 11, x + 11, bottom - l * GAP / 2);

        if (n.length === 3) {
            svg.appendChild(el('text', { x: x - 19, y: y + 5, class: 'acc' },
                n[1] === '#' ? '♯' : '♭'));
        }

        svg.appendChild(el('ellipse', {
            cx: x, cy: y, rx: 6.8, ry: 4.9,
            transform: `rotate(-20 ${x} ${y})`, class: 'head',
        }));

        const sx = s >= 4 ? x - 6.2 : x + 6.2;
        const sy = s >= 4 ? y + 38 : y - 38;
        svg.appendChild(el('line', { x1: sx, x2: sx, y1: y, y2: sy, class: 'stem' }));
    });
}

const svg = document.getElementById('score');
let first = Math.floor(Math.random() * MOTIFS.length);

function draw() {
    const w = svg.clientWidth, h = svg.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.innerHTML = '';
    const count = Math.max(1, Math.floor(h / SYSTEM));
    const top = (h - count * SYSTEM) / 2;
    for (let i = 0; i < count; i++) {
        drawStaff(svg, MOTIFS[(first + i) % MOTIFS.length], top + i * SYSTEM + 75, w);
    }
}

draw();
window.addEventListener('resize', draw);

setInterval(() => {
    svg.classList.add('out');
    setTimeout(() => {
        first = (first + 1) % MOTIFS.length;
        draw();
        svg.classList.remove('out');
    }, 600);
}, 9000);
