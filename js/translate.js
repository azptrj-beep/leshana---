
"use strict";
let direction = "fr-syr";
let dictionary = {};
let reverseDictionary = {};

// 📦 chargement dictionnaire
fetch("data/dictionary.json")
  .then(res => res.json())
  .then(data => {
    dictionary = data;

    // inversion automatique
    reverseDictionary = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [v, k])
    );
  });

// 🧠 traduction intelligente
function translate(text) {

  const dict = direction === "fr-syr" ? dictionary : reverseDictionary;

  return text
    .toLowerCase()
    .split(" ")
    .map(w => dict[w] || `[${w}]`)
    .join(" ");
}

// 🔁 switch langue
document.getElementById("swapLang").addEventListener("click", () => {
  direction = direction === "fr-syr" ? "syr-fr" : "fr-syr";
});

// 🎤 reconnaissance vocale
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {

  const recognition = new SpeechRecognition();
  recognition.lang = "fr-FR";

  document.getElementById("btnMic").addEventListener("click", () => {
    recognition.start();
  });

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    document.getElementById("input").value = text;
  };
}

// 🔥 traduction bouton
document.getElementById("btnTranslate").addEventListener("click", () => {

  const input = document.getElementById("input").value.trim();

  if (!input) return;

  const result = translate(input);

  document.getElementById("result").innerText = result;
});