"use strict";

/* ============================================================
   ELEMENTS & INIT
============================================================ */
let input, result, statusBox, historyBox;
let words = {};
let phrases = {};
let synth;
let recognition = null;

document.addEventListener("DOMContentLoaded", () => {
  input = document.getElementById("translateInput");
  result = document.getElementById("translateResult");
  statusBox = document.getElementById("status");
  historyBox = document.getElementById("history");

  synth = window.speechSynthesis || null;

  initSpeechRecognition();
  loadDictionaries(); // sécurisé, ne bloque jamais
});

/* ============================================================
   STATUS
============================================================ */
function setStatus(text) {
  if (!statusBox) return;
  statusBox.textContent = text;
}

/* ============================================================
   DICTIONNAIRES — VERSION 100% SÉCURISÉE
============================================================ */
async function loadDictionaries() {
  setStatus("Chargement des dictionnaires…");

  try {
    const w = await fetch("data/words.json", { cache: "no-store" });
    const p = await fetch("data/phrases.json", { cache: "no-store" });

    if (!w.ok || !p.ok) {
      throw new Error("Fichiers dictionnaires introuvables");
    }

    words = await w.json().catch(() => ({}));
    phrases = await p.json().catch(() => ({}));

    setStatus("Dictionnaires chargés ✔️");
  } catch (e) {
    console.warn("Erreur dictionnaires :", e);
    words = {};
    phrases = {};
    setStatus("Dictionnaires non chargés (mode réduit) ⚠️");
  }

  // Quoi qu’il arrive, l’UI est utilisable
  enableTranslatorUI();
}

function enableTranslatorUI() {
  document.querySelectorAll("button").forEach(btn => {
    btn.disabled = false;
  });
}

/* ============================================================
   DÉTECTION LANGUE
============================================================ */
function detectLanguage(text) {
  const syriac = /[\u0700-\u074F]/;
  return syriac.test(text) ? "syr" : "fr";
}

/* ============================================================
   TRADUCTION
============================================================ */
function translateWord(word, lang) {
  if (!word) return word;

  // Phrases d’abord (si jamais on veut les utiliser plus tard)
  if (lang === "syr") {
    if (phrases[word]) return phrases[word];
    if (words[word]) return words[word];
    return word;
  } else {
    // FR → SYR : recherche inverse
    const phraseKey = Object.keys(phrases).find(k => phrases[k] === word);
    if (phraseKey) return phraseKey;

    const wordKey = Object.keys(words).find(k => words[k] === word);
    if (wordKey) return wordKey;

    return word;
  }
}

function translateSentence(sentence, lang) {
  if (!sentence) return "";

  const parts = sentence.split(/(\s+|[.,!?;:])/g);

  return parts
    .map(part => {
      if (/^\s+$/.test(part) || /^[.,!?;:]$/.test(part)) return part;
      return translateWord(part, lang);
    })
    .join("");
}

function translateText() {
  if (!input || !result) return;

  const text = input.value.trim();
  if (!text) {
    result.value = "";
    setStatus("Aucun texte à traduire");
    return;
  }

  const lang = detectLanguage(text);
  const sentences = text.split(/(?<=[.!?])/g);

  const translated = sentences
    .map(s => translateSentence(s.trim(), lang))
    .join(" ");

  // Si aucun dictionnaire → on renvoie au moins le texte original
  result.value = translated || text;

  addToHistory(text, result.value);
  setStatus("Traduction effectuée ✔️");
}

window.translateText = translateText;

/* ============================================================
   HISTORIQUE
============================================================ */
function addToHistory(src, out) {
  if (!historyBox) return;

  const div = document.createElement("div");
  div.className = "history-item";
  div.innerHTML = `
    <p><strong>Entrée :</strong> ${src}</p>
    <p><strong>Sortie :</strong> ${out}</p>
    <hr>
  `;
  historyBox.prepend(div);
}

window.addToHistory = addToHistory;

/* ============================================================
   BOUTONS : EFFACER / SWAP
============================================================ */
function clearAll() {
  if (!input || !result) return;
  input.value = "";
  result.value = "";
  setStatus("Effacé ✔️");
}

window.clearAll = clearAll;

function swapText() {
  if (!input || !result) return;
  const temp = input.value;
  input.value = result.value;
  result.value = temp;
  setStatus("Texte inversé ↔️");
}

window.swapText = swapText;

/* ============================================================
   CLAVIER SOURETH
============================================================ */
function insertLetter(letter) {
  if (!input) return;

  const start = input.selectionStart || 0;
  const end = input.selectionEnd || 0;

  input.value =
    input.value.substring(0, start) +
    letter +
    input.value.substring(end);

  input.focus();
  input.selectionStart = input.selectionEnd = start + letter.length;
}

window.insertLetter = insertLetter;

function deleteLetter() {
  if (!input) return;

  const start = input.selectionStart || 0;
  const end = input.selectionEnd || 0;

  if (start === end && start > 0) {
    input.value =
      input.value.substring(0, start - 1) +
      input.value.substring(end);
    input.selectionStart = input.selectionEnd = start - 1;
  } else {
    input.value =
      input.value.substring(0, start) +
      input.value.substring(end);
    input.selectionStart = input.selectionEnd = start;
  }
}

window.deleteLetter = deleteLetter;

/* ============================================================
   AUDIO : LECTURE
============================================================ */
function speakText() {
  if (!synth || !result) return;

  const text = result.value.trim();
  if (!text) {
    setStatus("Rien à lire");
    return;
  }

  const lang = detectLanguage(text) === "syr" ? "ar-IQ" : "fr-FR";

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  synth.cancel();
  synth.speak(utter);
  setStatus("Lecture en cours 🔊");
}

window.speakText = speakText;

function stopSpeak() {
  if (!synth) return;
  synth.cancel();
  setStatus("Lecture arrêtée ⏹");
}

window.stopSpeak = stopSpeak;

/* ============================================================
   MICRO : RECONNAISSANCE VOCALE
============================================================ */
function initSpeechRecognition() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    recognition = null;
    return;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "fr-FR";

  recognition.onresult = (event) => {
    if (!input) return;
    input.value = event.results[0][0].transcript;
    translateText();
  };

  recognition.onerror = () => {
    setStatus("Erreur micro ❌");
  };

  recognition.onend = () => {
    setStatus("Micro arrêté 🎤");
  };
}

function startMic() {
  if (!recognition) {
    setStatus("Micro non supporté sur ce navigateur ❌");
    return;
  }
  recognition.start();
  setStatus("Écoute… 🎤");
}

window.startMic = startMic;