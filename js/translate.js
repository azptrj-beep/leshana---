"use strict";

/* =========================
   GLOBAL STATE
========================= */

let direction = "auto";

/* =========================
   DICTIONARY (LOADED)
========================= */

let dictionary = {
  words: {},
  phrases: {}
};

/* =========================
   LOAD DICTIONARY
========================= */

async function loadDictionary() {
  try {
    const response =
      await fetch("data/dictionary.json");

    const data =
      await response.json();

    dictionary.words =
      data.words || {};

    dictionary.phrases =
      data.phrases || {};

    buildReverseDictionary();

    console.log(
      "Dictionnaire chargé",
      Object.keys(dictionary.words).length,
      "mots",
      Object.keys(dictionary.phrases).length,
      "phrases"
    );

  } catch (error) {
    console.error(
      "Erreur chargement dictionnaire",
      error
    );
  }
}

/* =========================
   REVERSE DICTIONARY
========================= */

const reverseDictionary = {
  words: {},
  phrases: {}
};

function buildReverseDictionary() {

  reverseDictionary.words = {};
  reverseDictionary.phrases = {};

  for (const key in dictionary.words) {
    const value = dictionary.words[key];

    if (!reverseDictionary.words[value]) {
      reverseDictionary.words[value] = key;
    }
  }

  for (const key in dictionary.phrases) {
    const value = dictionary.phrases[key];

    if (!reverseDictionary.phrases[value]) {
      reverseDictionary.phrases[value] = key;
    }
  }
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
   DETECT LANGUAGE
========================= */

function detectLanguage(text) {
  const syrRegex = /[\u0700-\u074F]/;

  return syrRegex.test(text)
    ? "syr"
    : "fr";
}

/* =========================
   TRANSLATION ENGINE
========================= */

function translate(text) {

  const lang = detectLanguage(text);

  const input = clean(text);

  const isPhrase =
    input.includes(" ") &&
    dictionary.phrases[input];

  // PHRASES PRIORITY
  if (isPhrase) {

    return dictionary.phrases[input];

  }

  const map =
    lang === "fr"
      ? dictionary.words
      : reverseDictionary.words;

  return input
    .split(" ")
    .map(word => map[word] || `[${word}]`)
    .join(" ");
}

/* =========================
   STATUS
========================= */

function setStatus(message) {
  document.getElementById("status").innerText =
    message;
}

/* =========================
   HISTORY
========================= */

function saveHistory(original, translated) {
  let history =
    JSON.parse(localStorage.getItem("history")) || [];

  history.unshift({
    original,
    translated
  });

  history = history.slice(0, 20);

  localStorage.setItem(
    "history",
    JSON.stringify(history)
  );
}

function renderHistory() {
  const box =
    document.getElementById("history");

  const history =
    JSON.parse(localStorage.getItem("history")) || [];

  box.innerHTML = "";

  history.forEach(item => {
    box.innerHTML += `
      <div class="history-item">
        ${item.original}
        →
        ${item.translated}
      </div>
    `;
  });
}

/* =========================
   VOICE
========================= */

function speak(text) {

  if (!text || text === "...") {
    setStatus("⚠️ Aucun texte");
    return;
  }

  if (!("speechSynthesis" in window)) {
    setStatus("❌ Audio non supporté");
    return;
  }

  speechSynthesis.cancel();

  const utterance =
    new SpeechSynthesisUtterance(text);

  let voices =
    speechSynthesis.getVoices();

  if (!voices.length) {
    speechSynthesis.onvoiceschanged = () => {
      voices =
        speechSynthesis.getVoices();

      startSpeech(utterance, voices);
    };
  } else {
    startSpeech(utterance, voices);
  }
}

/* =========================
   START SPEECH
========================= */

function startSpeech(utterance, voices) {

  const frenchVoice =
    voices.find(v => v.lang.includes("fr"));

  if (frenchVoice) {
    utterance.voice = frenchVoice;
  }

  utterance.lang = "fr-FR";

  utterance.onstart = () => setStatus("🔊 Lecture...");
  utterance.onend = () => setStatus("✅ Lecture terminée");
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

  const micBtn =
    document.getElementById("micBtn");

  if (!SpeechRecognition) {
    micBtn.disabled = true;
    setStatus("🎤 Micro non supporté ici");
    return;
  }

  const recognition =
    new SpeechRecognition();

  recognition.lang = "fr-FR";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => setStatus("🎤 Écoute...");

  recognition.onresult = e => {
    input.value =
      e.results[0][0].transcript;

    setStatus("✅ Texte détecté");
  };

  recognition.onerror = e => {
    setStatus("❌ Micro : " + e.error);
  };

  micBtn.addEventListener("click", () => {
    try {
      recognition.start();
    } catch (err) {
      console.log(err);
    }
  });
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const input =
    document.getElementById("input");

  const result =
    document.getElementById("result");

  function runTranslation() {

    const text =
      input.value.trim();

    if (!text) {
      result.innerText = "⚠️ Champ vide";
      return;
    }

    const translated =
      translate(text);

    result.innerText = translated;

    saveHistory(text, translated);
    renderHistory();

    setStatus("✅ Traduction OK");
  }

  document.getElementById("translateBtn")
    .addEventListener("click", runTranslation);

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      runTranslation();
    }
  });

  document.getElementById("swapBtn")
    .addEventListener("click", () => {
      direction =
        direction === "fr" ? "syr" : "fr";

      input.value = "";
      result.innerText = "...";

      setStatus("⇄ Inversion");
    });

  document.getElementById("clearBtn")
    .addEventListener("click", () => {
      input.value = "";
      result.innerText = "...";
    });

  document.getElementById("speakBtn")
    .addEventListener("click", () => {
      const text =
        document.getElementById("result").innerText;

      speak(text);
    });

  document.getElementById("stopBtn")
    .addEventListener("click", () => {
      speechSynthesis.cancel();
      setStatus("⏹ Audio stoppé");
    });

  setupMicrophone(input);

  renderHistory();

  loadDictionary().then(() => {
    setStatus("✅ Dictionnaire chargé");
  });

});

/* =========================
   FIREFOX CHECK
========================= */

const isFirefox =
  navigator.userAgent.toLowerCase().includes("firefox");

if (isFirefox) {
  document.getElementById("micBtn").disabled = true;
  setStatus("🎤 Firefox ne supporte pas correctement le micro");
}