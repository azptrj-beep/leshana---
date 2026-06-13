"use strict";

/* ============================================================
   ELEMENTS
============================================================ */
const input = document.getElementById("translateInput");
const result = document.getElementById("translateResult");
const statusBox = document.getElementById("status");
const historyBox = document.getElementById("history");

/* ============================================================
   DICTIONNAIRES
============================================================ */
let words = {};
let phrases = {};

async function loadDictionaries() {
  try {
    const w = await fetch("data/words.json");
    const p = await fetch("data/phrases.json");

    words = await w.json();
    phrases = await p.json();

    setStatus("Dictionnaires chargés ✔️");
  } catch (e) {
    setStatus("Erreur de chargement ❌");
  }
}

loadDictionaries();

/* ============================================================
   STATUS
============================================================ */
function setStatus(text) {
  if (!statusBox) return;
  statusBox.textContent = text;
}

/* ============================================================
   TRADUCTION
============================================================ */
function detectLanguage(text) {
  const syriac = /[\u0700-\u074F]/;
  return syriac.test(text) ? "syr" : "fr";
}

function translateWord(word, lang) {
  if (lang === "syr") {
    return words[word] || word;
  } else {
    return Object.keys(words).find(k => words[k] === word) || word;
  }
}

function translateSentence(sentence, lang) {
  const parts = sentence.split(/(\s+|[.,!?;])/g);
  return parts
    .map(part => {
      if (/^\s+$/.test(part) || /^[.,!?;]$/.test(part)) return part;
      return translateWord(part, lang);
    })
    .join("");
}

function translateText() {
  const text = input.value.trim();
  if (!text) {
    result.value = "";
    return;
  }

  const lang = detectLanguage(text);
  const sentences = text.split(/(?<=[.!?])/g);

  const translated = sentences
    .map(s => translateSentence(s.trim(), lang))
    .join(" ");

  result.value = translated;
  addToHistory(text, translated);
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
  input.value = "";
  result.value = "";
  setStatus("Effacé ✔️");
}

window.clearAll = clearAll;

function swapText() {
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
  const start = input.selectionStart;
  const end = input.selectionEnd;

  input.value =
    input.value.substring(0, start) +
    letter +
    input.value.substring(end);

  input.focus();
  input.selectionStart = input.selectionEnd = start + 1;
}

window.insertLetter = insertLetter;

function deleteLetter() {
  const start = input.selectionStart;
  const end = input.selectionEnd;

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
let synth = window.speechSynthesis;

function speakText() {
  const text = result.value.trim();
  if (!text) return;

  const lang = detectLanguage(text) === "syr" ? "ar-IQ" : "fr-FR";

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  synth.speak(utter);
}

window.speakText = speakText;

function stopSpeak() {
  synth.cancel();
}

window.stopSpeak = stopSpeak;

/* ============================================================
   MICRO : RECONNAISSANCE VOCALE
============================================================ */
let recognition;

if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "fr-FR";

  recognition.onresult = (event) => {
    input.value = event.results[0][0].transcript;
    translateText();
  };

  recognition.onerror = () => setStatus("Erreur micro ❌");
}

function startMic() {
  if (!recognition) {
    setStatus("Micro non supporté ❌");
    return;
  }
  recognition.start();
  setStatus("Écoute… 🎤");
}

window.startMic = startMic;