"use strict";

/* ============================================================
   ELEMENTS & INIT
============================================================ */
let box, statusBox, historyBox;
let words = {};
let phrases = {};
let synth;
let recognition = null;

document.addEventListener("DOMContentLoaded", () => {
  box = document.getElementById("translateBox");   // 🔥 un seul champ
  statusBox = document.getElementById("status");
  historyBox = document.getElementById("history");

  synth = window.speechSynthesis || null;

  initSpeechRecognition();
  loadDictionaries();
});

/* ============================================================
   STATUS
============================================================ */
function setStatus(text) {
  if (statusBox) statusBox.textContent = text;
}

/* ============================================================
   DICTIONNAIRES
============================================================ */
async function loadDictionaries() {
  setStatus("Chargement des dictionnaires…");

  try {
    const w = await fetch("data/words.json", { cache: "no-store" });
    const p = await fetch("data/phrases.json", { cache: "no-store" });

    if (!w.ok || !p.ok) throw new Error("Fichiers dictionnaires introuvables");

    words = await w.json();
    phrases = await p.json();

    setStatus("Dictionnaires chargés ✔️");
  } catch (e) {
    console.warn("Erreur dictionnaires :", e);
    words = {};
    phrases = {};
    setStatus("Dictionnaires non chargés ⚠️");
  }
}

/* ============================================================
   DÉTECTION LANGUE
============================================================ */
function detectLanguage(text) {
  return /[\u0700-\u074F]/.test(text) ? "syr" : "fr";
}

/* ============================================================
   RTL / LTR AUTOMATIQUE
============================================================ */
function applyDirection(lang) {
  if (!box) return;

  if (lang === "syr") {
    box.className = "rtl soureth";
  } else {
    box.className = "ltr french";
  }
}

/* ============================================================
   TRADUCTION
============================================================ */
function translateWord(word, lang) {
  if (!word) return word;

  if (lang === "syr") {
    return phrases[word] || words[word] || word;
  } else {
    const p = Object.keys(phrases).find(k => phrases[k] === word);
    if (p) return p;

    const w = Object.keys(words).find(k => words[k] === word);
    if (w) return w;

    return word;
  }
}

function translateSentence(sentence, lang) {
  const parts = sentence.split(/(\s+|[.,!?;:])/g);

  return parts
    .map(part => {
      if (/^\s+$/.test(part) || /^[.,!?;:]$/.test(part)) return part;
      return translateWord(part, lang);
    })
    .join("");
}

function translate() {
  if (!box) return;

  const text = box.value.trim();
  if (!text) {
    setStatus("Aucun texte à traduire");
    return;
  }

  const lang = detectLanguage(text);
  applyDirection(lang);

  const sentences = text.split(/(?<=[.!?])/g);
  const translated = sentences
    .map(s => translateSentence(s.trim(), lang))
    .join(" ");

  addToHistory(text, translated);

  box.value = translated;
  setStatus("Traduction effectuée ✔️");
}

window.translate = translate;

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

/* ============================================================
   EFFACER
============================================================ */
function clearAll() {
  if (!box) return;
  box.value = "";
  setStatus("Effacé ✔️");
}

window.clearAll = clearAll;

/* ============================================================
   CLAVIER SOURETH
============================================================ */
function insertLetter(letter) {
  if (!box) return;

  const start = box.selectionStart || 0;
  const end = box.selectionEnd || 0;

  box.value =
    box.value.substring(0, start) +
    letter +
    box.value.substring(end);

  box.focus();
  box.selectionStart = box.selectionEnd = start + letter.length;
}

window.insertLetter = insertLetter;

function deleteLetter() {
  if (!box) return;

  const start = box.selectionStart || 0;
  const end = box.selectionEnd || 0;

  if (start === end && start > 0) {
    box.value =
      box.value.substring(0, start - 1) +
      box.value.substring(end);
    box.selectionStart = box.selectionEnd = start - 1;
  } else {
    box.value =
      box.value.substring(0, start) +
      box.value.substring(end);
    box.selectionStart = box.selectionEnd = start;
  }
}

window.deleteLetter = deleteLetter;

/* ============================================================
   AUDIO
============================================================ */
function speakText() {
  if (!synth || !box) return;

  const text = box.value.trim();
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
   MICRO
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
    if (!box) return;
    box.value = event.results[0][0].transcript;
    translate();
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
    setStatus("Micro non supporté ❌");
    return;
  }
  recognition.start();
  setStatus("Écoute… 🎤");
}

window.startMic = startMic;