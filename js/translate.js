"use strict";

/* =========================
   GLOBAL STATE
========================= */

let direction = "auto";

/* =========================
   DICTIONARIES
========================= */

let words = {};
let phrases = {};

let reverseWords = {};
let reversePhrases = {};

let wordList = [];

/* =========================
   LOAD DICTIONARIES
========================= */

async function loadDictionaries() {
  try {
    const [wRes, pRes] = await Promise.all([
      fetch("data/words.json"),
      fetch("data/phrases.json")
    ]);

    words = await wRes.json();
    phrases = await pRes.json();

    buildReverse();
    buildIndex();

    console.log("✔ Dictionnaires chargés");
  } catch (e) {
    console.error("Erreur chargement dictionnaires", e);
  }
}

/* =========================
   INDEX + REVERSE
========================= */

function buildReverse() {
  reverseWords = {};
  reversePhrases = {};

  for (const k in words) {
    reverseWords[words[k]] = k;
  }

  for (const k in phrases) {
    reversePhrases[phrases[k]] = k;
  }
}

function buildIndex() {
  wordList = Object.keys(words);
}

/* =========================
   CLEAN TEXT
========================= */

function clean(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s\u0700-\u074F]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* =========================
   LANGUAGE DETECTION
========================= */

function detect(text) {
  return /[\u0700-\u074F]/.test(text) ? "syr" : "fr";
}

/* =========================
   LEVENSHTEIN (ERROR FIX)
========================= */

function levenshtein(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/* =========================
   FIND CLOSEST WORD
========================= */

function findClosest(word) {
  let best = null;
  let bestScore = 2;

  for (const w of wordList) {
    const score = levenshtein(word, w);

    if (score < bestScore) {
      bestScore = score;
      best = w;
    }
  }

  return best;
}

/* =========================
   SUGGESTIONS
========================= */

function getSuggestions(input) {
  const cleanInput = input.toLowerCase();
  if (!cleanInput) return [];

  return wordList
    .filter(w => w.startsWith(cleanInput))
    .slice(0, 5);
}

/* =========================
   TRANSLATION ENGINE
========================= */

function translate(text) {
  const input = clean(text);
  const lang = detect(input);

  /* PHRASES PRIORITY */
  if (phrases[input]) {
    return phrases[input];
  }

  const map = lang === "fr" ? words : reverseWords;

  return input
    .split(" ")
    .map(word => {
      if (map[word]) return map[word];

      const closest = findClosest(word);
      if (closest && map[closest]) {
        return map[closest];
      }

      return `[${word}]`;
    })
    .join(" ");
}

/* =========================
   STATUS
========================= */

function setStatus(msg) {
  const el = document.getElementById("status");
  if (el) el.innerText = msg;
}

/* =========================
   HISTORY
========================= */

function saveHistory(original, translated) {
  let history =
    JSON.parse(localStorage.getItem("history")) || [];

  history.unshift({ original, translated });

  history = history.slice(0, 20);

  localStorage.setItem("history", JSON.stringify(history));
}

function renderHistory() {
  const box = document.getElementById("history");

  const history =
    JSON.parse(localStorage.getItem("history")) || [];

  box.innerHTML = "";

  history.forEach(item => {
    box.innerHTML += `
      <div class="history-item">
        ${item.original} → ${item.translated}
      </div>
    `;
  });
}

/* =========================
   VOICE
========================= */

function speak(text) {
  if (!text || text === "...") return;

  if (!("speechSynthesis" in window)) {
    setStatus("❌ Audio non supporté");
    return;
  }

  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  let voices = speechSynthesis.getVoices();

  if (!voices.length) {
    speechSynthesis.onvoiceschanged = () => {
      voices = speechSynthesis.getVoices();
      startSpeech(utterance, voices);
    };
  } else {
    startSpeech(utterance, voices);
  }
}

function startSpeech(utterance, voices) {
  const frVoice = voices.find(v => v.lang.includes("fr"));

  if (frVoice) utterance.voice = frVoice;

  utterance.lang = "fr-FR";

  utterance.onstart = () => setStatus("🔊 Lecture...");
  utterance.onend = () => setStatus("✅ Terminé");
  utterance.onerror = e => {
    console.log(e);
    setStatus("❌ Erreur audio");
  };

  speechSynthesis.speak(utterance);
}

/* =========================
   MICROPHONE
========================= */

function setupMicrophone(input) {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  const micBtn = document.getElementById("micBtn");

  if (!SpeechRecognition) {
    if (micBtn) micBtn.disabled = true;
    setStatus("🎤 Micro non supporté");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "fr-FR";

  recognition.onstart = () => setStatus("🎤 Écoute...");

  recognition.onresult = e => {
    input.value = e.results[0][0].transcript;
    setStatus("✅ Reçu");
  };

  recognition.onerror = e => {
    setStatus("❌ Micro: " + e.error);
  };

  if (micBtn) {
    micBtn.addEventListener("click", () => {
      try {
        recognition.start();
      } catch (e) {
        console.log(e);
      }
    });
  }
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", async () => {
  const input = document.getElementById("input");
  const result = document.getElementById("result");

  await loadDictionaries();

  function runTranslation() {
    const text = input.value.trim();

    if (!text) {
      result.innerText = "⚠️ vide";
      return;
    }

    const translated = translate(text);

    result.innerText = translated;

    saveHistory(text, translated);
    renderHistory();

    setStatus("✅ OK");
  }

  document.getElementById("translateBtn")
    .addEventListener("click", runTranslation);

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      runTranslation();
    }
  });

  input.addEventListener("input", () => {
    const suggestions = getSuggestions(input.value);
    console.log("Suggestions:", suggestions);
  });

  document.getElementById("clearBtn")
    .addEventListener("click", () => {
      input.value = "";
      result.innerText = "...";
    });

  document.getElementById("swapBtn")
    .addEventListener("click", () => {
      input.value = "";
      result.innerText = "...";
      setStatus("⇄ swap");
    });

  document.getElementById("speakBtn")
    .addEventListener("click", () => {
      speak(result.innerText);
    });

  document.getElementById("stopBtn")
    .addEventListener("click", () => {
      speechSynthesis.cancel();
    });

  setupMicrophone(input);

  renderHistory();

  setStatus("✅ App prête");
});

/* =========================
   FIREFOX CHECK
========================= */

const isFirefox =
  navigator.userAgent.toLowerCase().includes("firefox");

if (isFirefox) {
  const micBtn = document.getElementById("micBtn");
  if (micBtn) micBtn.disabled = true;

  setStatus("⚠️ Firefox micro limité");
}