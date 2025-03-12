let morseCode = "";
let volume = 50;
const volumeLevels = {
    ".-": 10, "-...": 20, "-.-.": 30, "-..": 40, ".": 50,
    "..-.": 60, "--.": 70, "....": 80, "..": 90, ".---": 100
};

const speaker = document.getElementById("speaker");
const volumeDisplay = document.getElementById("volume");
const morseDisplay = document.getElementById("morse");
const backgroundAudio = document.getElementById("backgroundAudio");
const audioToggle = document.getElementById("audioToggle");

let pressStart = null;
let audioContext = null;

function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
}

function beep(duration = 100, frequency = 600) {
    initAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.value = volume / 100;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    setTimeout(() => {
        oscillator.stop();
    }, duration);
}

function updateVolume() {
    if (volumeLevels[morseCode]) {
        volume = volumeLevels[morseCode];
        volumeDisplay.textContent = `Volume: ${volume}%`;
        backgroundAudio.volume = volume / 100;

        volumeDisplay.style.boxShadow = "0 0 15px rgba(245, 230, 200, 0.5), inset 0 0 10px rgba(0, 0, 0, 0.6)";
        setTimeout(() => {
            volumeDisplay.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.4), inset 0 0 10px rgba(0, 0, 0, 0.6)";
        }, 300);

        beep(120, 700);
    } else {
        volumeDisplay.style.boxShadow = "0 0 15px rgba(255, 100, 100, 0.5), inset 0 0 10px rgba(0, 0, 0, 0.6)";
        setTimeout(() => {
            volumeDisplay.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.4), inset 0 0 10px rgba(0, 0, 0, 0.6)";
        }, 300);

        alert("Invalid Morse Code!");
    }
    morseCode = "";
    morseDisplay.textContent = "";
}

document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && pressStart === null) {
        initAudioContext();
        pressStart = Date.now();
        speaker.classList.add("active");
    }
});

document.addEventListener("keyup", (event) => {
    if (event.code === "Space" && pressStart !== null) {
        const duration = Date.now() - pressStart;
        pressStart = null;
        speaker.classList.remove("active");

        if (duration < 200) {
            morseCode += ".";
            beep(100, 800);
        } else {
            morseCode += "-";
            beep(300, 600);
        }

        morseDisplay.textContent = morseCode;
    } else if (event.code === "Enter") {
        updateVolume();
    }
});

speaker.addEventListener("mousedown", () => {
    initAudioContext();
    pressStart = Date.now();
    speaker.classList.add("active");
});

speaker.addEventListener("mouseup", () => {
    if (pressStart !== null) {
        const duration = Date.now() - pressStart;
        pressStart = null;
        speaker.classList.remove("active");

        if (duration < 200) {
            morseCode += ".";
            beep(100, 800);
        } else {
            morseCode += "-";
            beep(300, 600);
        }

        morseDisplay.textContent = morseCode;
    }
});

document.addEventListener("click", initAudioContext);

audioToggle.addEventListener("click", () => {
    if (backgroundAudio.paused) {
        backgroundAudio.play().catch(error => console.log("Autoplay blocked:", error));
        audioToggle.classList.add("active");
    } else {
        backgroundAudio.pause();
        audioToggle.classList.remove("active");
    }
});

document.addEventListener("click", () => {
    if (backgroundAudio.paused) {
        backgroundAudio.play().catch(() => {});
    }
}, { once: true });