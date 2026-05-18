"use strict";

/* =========================
   STATE
========================= */

let direction = "fr-syr";

/* =========================
   DICTIONNAIRE
========================= */

const dict = {

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

/* =========================
   CLEAN SAFE
========================= */

function clean(text) {

  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s\u0700-\u074F]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

}

/* =========================
   TRANSLATE
========================= */

function translate(text) {

  const map =
    direction === "fr-syr"
      ? dict
      : Object.fromEntries(
          Object.entries(dict).map(([k, v]) => [v, k])
        );

  return clean(text)
    .split(" ")
    .map(w => map[w] || w)
    .join(" ");

}

/* =========================
   UI HELPERS
========================= */

function show(text) {
  document.getElementById("result").innerText = text;
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("frInput");

  const btn = document.getElementById("translateBtn");

  /* ===== TRANSLATE ===== */

  function run() {

    const text = input.value.trim();

    if (!text) {
      show("⚠️ champ vide");
      return;
    }

    const result = translate(text);

    show(result);

    save(text, result);

  }

  btn.addEventListener("click", run);

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") run();
  });

  /* ===== SWAP ===== */

  document.getElementById("swapBtn").addEventListener("click", () => {

    direction =
      direction === "fr-syr"
        ? "syr-fr"
        : "fr-syr";

    input.value = "";
    show("");

    document.getElementById("suggestions").innerHTML = "";

  });

  /* ===== MIC ===== */

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (SpeechRecognition) {

    const rec = new SpeechRecognition();
    rec.lang = "fr-FR";

    document.getElementById("micBtn").addEventListener("click", () => {
      rec.start();
    });

    rec.onresult = e => {
      input.value = e.results[0][0].transcript;
    };

  }

  /* ===== AUDIO ===== */

  document.getElementById("speakBtn").addEventListener("click", () => {

    const t = document.getElementById("result").innerText;

    if (!t) return;

    speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(t);

    speechSynthesis.speak(u);

  });

  document.getElementById("stopBtn").addEventListener("click", () => {
    speechSynthesis.cancel();
  });

  /* ===== HISTORY ===== */

  function save(o, t) {

    let h = JSON.parse(localStorage.getItem("history") || "[]");

    h.unshift({ o, t });

    localStorage.setItem("history", JSON.stringify(h.slice(0, 15)));

    render();

  }

  function render() {

    const box = document.getElementById("history");

    const h = JSON.parse(localStorage.getItem("history") || "[]");

    box.innerHTML = "<h3>Historique</h3>";

    h.forEach(x => {
      box.innerHTML += `<div>${x.o} → ${x.t}</div>`;
    });

  }

  render();

});