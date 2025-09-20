let array = [
    "Touch typing is all about the idea that each finger has its own area on the keyboard. Thanks to that fact you can type without looking at the keys. Practice regularly and your fingers will learn their location on the keyboard through muscle memory.",
    "A debit card that deducts money directly from a consumer's checking account when it is used. Also called check cards or bank cards,they can be used to buy goods or services. Endurance and joy described in books enable us to have a closer look at human life.",
    "Studying is the main source of knowledge. Books are indeed never failing friends of man. For a mature mind, reading is the greatest source of pleasure and solace to distressed minds. The study of good books ennobles us and broadens our outlook.",
    "The various sufferings, endurance and joy described in books enable us to have a closer look at human life. They also inspire us to face the hardships of life courageously. Nowadays there are innumerable books and time is scarce. "
]
let i = 0, wpm = 0, error = 0, t = 0, j = array.length, k = 0, Wpm = 0, acc = 0;
let s = array[k];
let testFinished = false;
let overlayRef = null;

// Helper functions to avoid NaN / Infinity
function computeWpm(chars, seconds) {
    if (chars === 0 || seconds === 0) return 0;
    return Math.round((chars / 5) / (seconds / 60));
}
function computeAccuracy(correctChars, totalErrors) {
    if (correctChars === 0) return 100; // before typing starts
    let value = ((correctChars - totalErrors) * 100 / correctChars);
    if (value < 0) value = 0;
    return +value.toFixed(2);
}
function computeNetWpm(chars, totalErrors, seconds) {
    if (seconds === 0) return 0;
    const minutes = seconds / 60;
    // Net WPM = (Gross chars/5 - errors) / minutes
    const grossWords = chars / 5;
    const net = (grossWords - totalErrors) / minutes;
    return Math.max(0, Math.round(net));
}
function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const sRem = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(sRem).padStart(2, '0')}`;
}

function timecalc() {
    if (testFinished) return;
    t++;
    setTimeout(timecalc, 1000);
}

function updateLiveMetrics() {
    Wpm = computeWpm(i, t);
    acc = computeAccuracy(i, error);
    const wpmEl = document.getElementById("wpm");
    const accEl = document.getElementById("acc");
    const typosEl = document.getElementById("typos");
    if (!wpmEl || !accEl || !typosEl) return;
    wpmEl.innerHTML = `WPM: <span class="metric-val">${Wpm}</span>`;
    accEl.innerHTML = `Accuracy: <span class="metric-val">${acc}%</span>`;
    typosEl.innerHTML = `Typos: <span class="metric-val">${error}</span>`;
    // Pulse animation hook
    [wpmEl, accEl].forEach(el => {
        el.classList.remove('pulse');
        void el.offsetWidth; // reflow to restart animation
        el.classList.add('pulse');
    });
}

function myFunction(event) {
    if (testFinished) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const skipKeys = ["Shift","Backspace","Tab","CapsLock","Enter","Escape","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End","PageUp","PageDown","Insert","Delete"]; 
    if (skipKeys.includes(event.key)) return;

    const expectedChar = s.charAt(i);
    const inputChar = event.key; // preserves case
    if (inputChar.length !== 1) return; // ignore non-printables

    if (i === 0 && t === 0) setTimeout(timecalc, 1000);

    let keyId = (inputChar === ' ') ? 'ch' : 'ch' + inputChar.toUpperCase();

    if (inputChar === expectedChar) {
        let value = "<span style='color:green;'>" + s.slice(0, i + 1) + "</span>" + s.slice(i + 1);
        i++;
        updateLiveMetrics();
        document.getElementById("text").innerHTML = value;
        const keyEl = document.getElementById(keyId);
        if (keyEl) {
            keyEl.style.backgroundColor = 'white';
            keyEl.style.color = 'black';
            setTimeout(()=>{
                keyEl.style.backgroundColor = 'black';
                keyEl.style.color = 'white';
                keyEl.style.borderColor = 'black';
            },220);
        }
        if (i === s.length) finalizeAndShowResults();
    } else {
        error++;
        updateLiveMetrics();
        const typosEl = document.getElementById("typos");
        if (typosEl) typosEl.innerHTML = `Typos: <span class="metric-val">${error}</span>`;
        const keyEl = document.getElementById(keyId);
        if (keyEl) {
            keyEl.style.backgroundColor = 'red';
            keyEl.style.color = 'white';
            setTimeout(()=>{
                keyEl.style.backgroundColor = 'black';
                keyEl.style.color = 'white';
                keyEl.style.borderColor = 'black';
            },320);
        }
    }
}

function finalizeAndShowResults() {
    testFinished = true;
    updateLiveMetrics(); // ensure latest values stored
    const gross = Wpm;
    const net = computeNetWpm(i, error, t);
    const timeTaken = formatTime(t);
    const chars = i;

    createAlert({
        grossWpm: gross,
        netWpm: net,
        accuracy: acc,
        typos: error,
        chars: chars,
        time: timeTaken
    });

    // Queue next paragraph after closing or restart; keep state until restart.
}

let customAlert;

function createAlert(stats) {
    // Overlay
    overlayRef = document.createElement('div');
    overlayRef.className = 'overlay';

    customAlert = document.createElement("div");
    customAlert.className = 'custom-alert';

    customAlert.innerHTML = `
        <button class="close-btn" aria-label="Close" onclick="removeAlert()">×</button>
        <h3>Results</h3>
        <div class="results-grid">
            <div><label>Gross WPM</label><span>${stats.grossWpm}</span></div>
            <div><label>Net WPM</label><span>${stats.netWpm}</span></div>
            <div><label>Accuracy</label><span>${stats.accuracy}%</span></div>
            <div><label>Typos</label><span>${stats.typos}</span></div>
            <div><label>Chars</label><span>${stats.chars}</span></div>
            <div><label>Time</label><span>${stats.time}</span></div>
        </div>
        <div class="alert-actions">
            <button onclick="restartTest()" class="primary">Restart</button>
            <button onclick="nextParagraph()">Next Paragraph</button>
        </div>
    `;

    overlayRef.appendChild(customAlert);
    document.body.appendChild(overlayRef);
}

function removeAlert() {
    if (overlayRef) {
        overlayRef.parentNode.removeChild(overlayRef);
        overlayRef = null;
    }
}

function resetStateToCurrentParagraph() {
    i = 0; error = 0; t = 0; testFinished = false; Wpm = 0; acc = 0;
    document.getElementById("text").innerText = s;
    document.getElementById("wpm").innerHTML = "WPM: <span class='metric-val'>0</span>";
    document.getElementById("acc").innerHTML = "Accuracy: <span class='metric-val'>100%</span>";
    document.getElementById("typos").innerHTML = "Typos: <span class='metric-val'>0</span>";
}

function restartTest() {
    removeAlert();
    resetStateToCurrentParagraph();
}

function nextParagraph() {
    removeAlert();
    // advance paragraph index
    if (k === j - 1) { k = 0; } else { k++; }
    s = array[k];
    resetStateToCurrentParagraph();
}

// Initialize default metric text (avoid NaN / Infinity on load)
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("wpm").innerHTML = "WPM: <span class='metric-val'>0</span>";
    document.getElementById("acc").innerHTML = "Accuracy: <span class='metric-val'>100%</span>";
    document.getElementById("typos").innerHTML = "Typos: <span class='metric-val'>0</span>";

    const typingArea = document.querySelector('.textarea');
    function ensureFocus() {
        if (customAlert || testFinished) return; // avoid stealing focus during popup
        if (document.activeElement !== typingArea) typingArea.focus();
    }
    // Global keydown listener replaces inline prevention
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') e.preventDefault(); // prevent page scroll
        myFunction(e);
    });
    // Click anywhere on base layout to refocus for continued typing
    ['#text','body','header','.keyboardstruct','#calc'].forEach(sel => {
        const el = sel === 'body' ? document.body : document.querySelector(sel);
        if (el) el.addEventListener('click', ensureFocus);
    });
    ensureFocus();
});