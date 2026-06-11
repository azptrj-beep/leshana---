"use strict";

/* ============================================================
   STATE
============================================================ */

let words = {};
let phrases = {};
let reverseWords = {};
let reversePhrases = {};
let wordList = [];
let realtimeTimer = null;

/* ============================================================
   LOAD DICTIONARIES
============================================================ */

async function loadDictionaries() {
  try {
    const [wRes, pRes] = await Promise.all([
      fetch("/data/words.json")
      fetch("/data/phrases.json")
    ]);

    words = await wRes.json();
    phrases = await pRes.json();

    buildReverse();
    buildIndex();

    setStatus("📚 Dictionnaires chargés");
  } catch (e) {
    console.error("Erreur dictionnaires :", e);
    setStatus("❌ Erreur chargement dictionnaires");
  }
}

/* ============================================================
   BUILD REVERSE + INDEX
============================================================ */

function buildReverse() {
  reverseWords = {};
  reversePhrases = {};

  for (const k in words) reverseWords[words[k]] = k;
  for (const k in phrases) reversePhrases[phrases[k]] = k;
}

function buildIndex() {
  wordList = Object.keys(words);
}

/* ============================================================
   CLEAN + DETECT
============================================================ */

function clean(text) {
  return text
    .toLowerCase()
    // garde lettres latines, chiffres, syriaque, espaces et . ! ?
    .replace(/[^A-Za-z0-9\u0700-\u074F\s\.\!\?]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function detect(text) {
  return /[\u0700-\u074F]/.test(text) ? "syr" : "fr";
}

/* ============================================================
   LEVENSHTEIN (CORRECTION)
============================================================ */

function levenshtein(a, b) {
  const m = [];

  for (let i = 0; i <= b.length; i++) m[i] = [i];
  for (let j = 0; j <= a.length; j++) m[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      m[i][j] =
        b[i - 1] === a[j - 1]
          ? m[i - 1][j - 1]
          : Math.min(m[i - 1][j - 1] + 1, m[i][j - 1] + 1, m[i - 1][j] + 1);
    }
  }

  return m[b.length][a.length];
}

/* ============================================================
   FIND CLOSEST WORD
============================================================ */

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

/* ============================================================
   TRANSLATE ONE SENTENCE
============================================================ */

function translateSentence(sentence) {
  const input = clean(sentence);
  if (!input) return "";

  const lang = detect(input);

  // Phrases prioritaires
  if (lang === "fr" && phrases[input]) return phrases[input];
  if (lang === "syr" && reversePhrases[input]) return reversePhrases[input];

  const map = lang === "fr" ? words : reverseWords;

  return input
    .split(" ")
    .map(word => {
      if (map[word]) return map[word];

      const closest = findClosest(word);
      if (closest && map[closest]) return map[closest];

      return `[${word}]`;
    })
    .join(" ");
}

/* ============================================================
   TRANSLATE MULTIPLE SENTENCES
============================================================ */

function translateText(text) {
  // Découpe en phrases : ., !, ?
  const parts = text
    .split(/([\.!\?])/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  let result = "";
  for (let i = 0; i < parts.length; i += 2) {
    const sentence = parts[i];
    const punctuation = parts[i + 1] || "";

    const translated = translateSentence(sentence);
    result += translated + punctuation + " ";
  }

  return result.trim();
}

/* ============================================================
   STATUS
============================================================ */

function setStatus(msg) {
  const el = document.getElementById("status");
  if (el) el.innerText = msg;
}

/* ============================================================
   HISTORY
============================================================ */

function saveHistory(original, translated) {
  let history = JSON.parse(localStorage.getItem("history")) || [];

  history.unshift({ original, translated });
  history = history.slice(0, 20);

  localStorage.setItem("history", JSON.stringify(history));
}

function renderHistory() {
  const box = document.getElementById("history");
  const history = JSON.parse(localStorage.getItem("history")) || [];

  box.innerHTML = history
    .map(item => `<div class="history-item">${item.original} → ${item.translated}</div>`)
    .join("");
}

/* ============================================================
   AUDIO
============================================================ */

function speak(text) {
  if (!text || text === "...") return;

  if (!("speechSynthesis" in window)) {
    setStatus("❌ Audio non supporté");
    return;
  }

  speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "fr-FR";

  utter.onstart = () => setStatus("🔊 Lecture...");
  utter.onend = () => setStatus("✅ Terminé");
  utter.onerror = () => setStatus("❌ Erreur audio");

  speechSynthesis.speak(utter);
}

/* ============================================================
   MICROPHONE
============================================================ */

function setupMicrophone(input) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

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
    runRealtimeTranslation();
    setStatus("✅ Reçu");
  };
  recognition.onerror = e => setStatus("❌ Micro : " + e.error);

  micBtn.addEventListener("click", () => {
    try {
      recognition.start();
    } catch {}
  });
}

/* ============================================================
   REALTIME TRANSLATION
============================================================ */

function runRealtimeTranslation() {
  clearTimeout(realtimeTimer);

  realtimeTimer = setTimeout(() => {
    const input = document.getElementById("input");
    const result = document.getElementById("result");

    const text = input.value.trim();
    const translated = translateText(text);

    result.innerText = translated;

    if (text.length > 0) {
      saveHistory(text, translated);
      renderHistory();
    }

    setStatus("⚡ Phrase par phrase");
  }, 150);
}

/* ============================================================
   INIT
============================================================ */

document.addEventListener("DOMContentLoaded", async () => {
  const input = document.getElementById("input");
  const result = document.getElementById("result");

  await loadDictionaries();

  /* Traduction en temps réel */
  input.addEventListener("input", runRealtimeTranslation);

  /* Bouton Traduire */
  document.getElementById("translateBtn").addEventListener("click", runRealtimeTranslation);

  /* Effacer */
  document.getElementById("clearBtn").addEventListener("click", () => {
    input.value = "";
    result.innerText = "...";
    setStatus("🧹 Effacé");
  });

  /* Swap */
  document.getElementById("swapBtn").addEventListener("click", () => {
    input.value = "";
    result.innerText = "...";
    setStatus("⇄ Langues inversées");
  });

  /* Audio */
  document.getElementById("speakBtn").addEventListener("click", () => {
    speak(result.innerText);
  });

  document.getElementById("stopBtn").addEventListener("click", () => {
    speechSynthesis.cancel();
    setStatus("⏹ Arrêt");
  });

  setupMicrophone(input);
  renderHistory();

  setStatus("✅ App prête (phrase par phrase)");
});

/* ============================================================
   FIREFOX WARNING
============================================================ */

if (navigator.userAgent.toLowerCase().includes("firefox")) {
  const micBtn = document.getElementById("micBtn");
  if (micBtn) micBtn.disabled = true;
  setStatus("⚠️ Firefox : micro limité");
}