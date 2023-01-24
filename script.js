let array = [
    "Touch typing is all about the idea that each finger has its own area on the keyboard. Thanks to that fact you can type without looking at the keys. Practice regularly and your fingers will learn their location on the keyboard through muscle memory.",
    "A debit card that deducts money directly from a consumer's checking account when it is used. Also called check cards or bank cards,they can be used to buy goods or services. Endurance and joy described in books enable us to have a closer look at human life.",
    "Studying is the main source of knowledge. Books are indeed never failing friends of man. For a mature mind, reading is the greatest source of pleasure and solace to distressed minds. The study of good books ennobles us and broadens our outlook.",
    "The various sufferings, endurance and joy described in books enable us to have a closer look at human life. They also inspire us to face the hardships of life courageously. Nowadays there are innumerable books and time is scarce. "
]
let i = 0, wpm = 0, error = 0, t = 0, j = array.length, k = 0, Wpm = 0, acc = 0;
let s = array[k];
function timecalc() {
    if (i == s.length - 1) {
        return;
    }
    t++;
    setTimeout(timecalc, 1000);
}
function myFunction(event) {
    if (event.key.toUpperCase() === "SHIFT")
        return;
    window.onkeydown = function (e) {
        return event.key !== " ";
    }
    let x = "ch" + event.key.toUpperCase();
    x = x.trim();
    let ch = event.key;
    if (i == 0) {
        setTimeout(timecalc, 1000);
    }
    if (ch == s.charAt(i)) {
        let value = "<span style='color:green;'>" + s.slice(0, i + 1) + "</span>" + s.slice(i + 1);
        console.log(i + "is i, t is " + t);
        let Wpm = ((i / 5) / (t / 60)).toFixed(0);
        let acc = ((i - error) * 100 / i).toFixed(2);
        document.getElementById("wpm").innerHTML = "Words Per Minute is " + Wpm;
        document.getElementById("acc").innerHTML = "Accuracy with respect to Typing speed is " + acc + " %";
        document.getElementById("text").innerHTML = value;
        document.getElementById("typos").innerHTML = "Typos: " + error;
        document.getElementById(x).style.backgroundColor = 'white';
        document.getElementById(x).style.color = 'black';
        setTimeout(function () {
            document.getElementById(x).style.backgroundColor = 'black';
            document.getElementById(x).style.color = 'white';
            document.getElementById(x).style.borderColor = 'black';
        }, 500);
        ++i;
        if (i === s.length) {
            createAlert();
            i = 0;
            t = 0;
            if (k == j - 1) {
                k = 0;
            }
            else {
                k++;
            }
            setTimeout(() => {
                s = array[k];
                text.innerText = array[k];
                error = 0;
                document.getElementById("typos").innerHTML = "Typos: " + error;
            }, 1500);
        }
    }
    else {
        ++error;
        document.getElementById("typos").innerHTML = "Typos: " + error;
        document.getElementById(x).style.backgroundColor = 'red';
        document.getElementById(x).style.color = 'white';
        setTimeout(function () {
            document.getElementById(x).style.backgroundColor = 'black';
            document.getElementById(x).style.color = 'white';
            document.getElementById(x).style.borderColor = 'black';
        }, 500);
    }
}
let customAlert;

function createAlert() {
    customAlert = document.createElement("div");
    customAlert.innerHTML = `
  <div class="custom-alert ">
  <h3>Typing Results</h3>
  <p><b>WPM</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${Wpm}</p>
  <p><b>Accuracy</b>&nbsp;&nbsp;: ${acc}%</p>
  <p><b>Typos</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${error}</p>
  <button onclick="removeAlert()">Close</button>
  </div>`;
    customAlert.style.position = "absolute";
    customAlert.style.top = "50%";
    customAlert.style.left = "50%";
    customAlert.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(customAlert);
}

function removeAlert() {
    customAlert.parentNode.removeChild(customAlert);
}