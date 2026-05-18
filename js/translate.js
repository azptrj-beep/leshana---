"use strict";

/* =========================
   STATE GLOBAL (IMPORTANT)
========================= */

let direction = "fr-syr";
let autoMode = false;

/* =========================
   DICTIONNAIRE
========================= */

const frToSyr = {
  bonjour: "ܫܠܡܐ",
  maison: "ܒܝܬܐ",
  eau: "ܡܝܐ",
  roi: "ܡܠܟܐ",
  paix: "ܫܠܡܐ",
  homme: "ܒܪܢܫܐ",
  femme: "ܐܢܬܬܐ",
  comment: "ܐܝܟ",
  tu: "ܐܢܬ",
  vas: "ܐܙܠ"
};

const syrToFr = Object.fromEntries(
  Object.entries(frToSyr).map(([k, v]) => [v, k])
);

/* =========================
   CLEAN
========================= */

function cleanText(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s\u0700-\u074F]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* =========================
   TRANSLATE
========================= */

function translateText(text) {

  const dict =
    direction === "fr-syr"
      ? frToSyr
      : syrToFr;

  return cleanText(text)
    .split(" ")
    .map(w => dict[w] || `[${w}]`)
    .join(" ");

}

/* =========================
   HISTORY
========================= */

function saveHistory(o, t) {

  let h = JSON.parse(localStorage.getItem("history")) || [];

  h.unshift({ o, t });

  h = h.slice(0, 10);

  localStorage.setItem("history", JSON.stringify(h));

  renderHistory();

}

function renderHistory() {

  const box = document.getElementById("history");

  const h = JSON.parse(localStorage.getItem("history")) || [];

  box.innerHTML = "<h3>📜 Historique</h3>";

  h.forEach(x => {
    box.innerHTML += `<div>${x.o} → ${x.t}</div>`;
  });

}

/* =========================
   SUGGESTIONS
========================= */

function showSuggestions(value) {

  const box = document.getElementById("suggestions");

  if (!value) {
    box.innerHTML = "";
    return;
  }

  const dict = direction === "fr-syr" ? frToSyr : syrToFr;

  const matches = Object.keys(dict)
    .filter(k => k.startsWith(value.toLowerCase()))
    .slice(0, 5);

  box.innerHTML = matches.map(m =>
    `<div class="suggestion" data-w="${m}">${m}</div>`
  ).join("");

}

/* =========================
   AUDIO
========================= */

function speak(text) {

  if (!text) return;

  speechSynthesis.cancel();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = "fr-FR";

  speechSynthesis.speak(u);

}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("frInput");
  const result = document.getElementById("result");

  function run() {

    const t = input.value.trim();

    if (!t) {
      result.innerText = "⚠️ vide";
      return;
    }

    const r = translateText(t);

    result.innerText = r;

    saveHistory(t, r);

  }

  /* ===== TRANSLATE ===== */
  document.getElementById("translateBtn").onclick = run;

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") run();
  });

  input.addEventListener("input", e => {

    showSuggestions(e.target.value);

    if (autoMode && e.target.value.length > 2) {
      result.innerText = translateText(e.target.value);
    }

  });

  /* ===== CLICK SUGGEST ===== */
  document.getElementById("suggestions").onclick = e => {

    const el = e.target.closest(".suggestion");

    if (!el) return;

    input.value = el.dataset.w;

    run();

  };

  /* ===== SWAP ===== */
  document.getElementById("swapBtn").onclick = () => {

    direction =
      direction === "fr-syr"
        ? "syr-fr"
        : "fr-syr";

    input.value = "";
    result.innerText = "";
    document.getElementById("suggestions").innerHTML = "";

  };

  /* ===== AUTO MODE ===== */
  const autoBtn = document.getElementById("autoBtn");

  autoBtn.onclick = () => {

    autoMode = !autoMode;

    autoBtn.innerText =
      autoMode ? "⚡ Auto ON" : "⚡ Auto OFF";

  };

  /* ===== AUDIO ===== */
  document.getElementById("speakBtn").onclick = () =>
    speak(result.innerText);

  document.getElementById("stopBtn").onclick = () =>
    speechSynthesis.cancel();

  /* ===== MIC ===== */
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (SpeechRecognition) {

    const rec = new SpeechRecognition();

    rec.lang = "fr-FR";

    document.getElementById("micBtn").onclick = () =>
      rec.start();

    rec.onresult = e => {
      input.value = e.results[0][0].transcript;
    };

  }

  renderHistory();

});

if ("serviceWorker" in navigator) {

  navigator.serviceWorker.register("/sw.js")
    .then(() => console.log("SW actif"));

}