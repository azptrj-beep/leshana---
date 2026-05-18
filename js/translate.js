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
   TRANSLATE ENGINE
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
   HISTORY
========================= */

function saveHistory(o, r) {

  let h = JSON.parse(localStorage.getItem("history") || "[]");

  h.unshift({ o, r });

  localStorage.setItem("history", JSON.stringify(h.slice(0, 15)));

}

function renderHistory() {

  const box = document.getElementById("history");

  const h = JSON.parse(localStorage.getItem("history") || "[]");

  box.innerHTML = "<h3>Historique</h3>";

  h.forEach(x => {
    box.innerHTML += `<div>${x.o} → ${x.r}</div>`;
  });

}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("input");
  const result = document.getElementById("result");

  /* ===== TRANSLATE ===== */

  function run() {

    const text = input.value.trim();

    if (!text) {
      result.innerText = "⚠️ champ vide";
      return;
    }

    const r = translate(text);

    result.innerText = r;

    saveHistory(text, r);

    renderHistory();

  }

  document.getElementById("translateBtn").addEventListener("click", run);

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") run();
  });

  /* =========================
     SWAP LANGUAGE
  ========================= */

  document.getElementById("swapBtn").addEventListener("click", () => {

    direction =
      direction === "fr-syr"
        ? "syr-fr"
        : "fr-syr";

    input.value = "";
    result.innerText = "";

  });

  /* =========================
     MICRO FIX (IMPORTANT)
  ========================= */

  const SR =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (SR) {

    const rec = new SR();
    rec.lang = "fr-FR";

    rec.onresult = (e) => {
      input.value = e.results[0][0].transcript;
    };

    rec.onerror = (e) => {
      console.log("MIC ERROR:", e.error);
    };

    const micBtn = document.getElementById("micBtn");

    if (micBtn) {
      micBtn.addEventListener("click", () => {
        try {
          rec.start();
        } catch (e) {
          console.log("MIC BLOCKED:", e);
        }
      });
    }

  }

  /* =========================
     VOICE FIX (IMPORTANT)
  ========================= */

  document.getElementById("speakBtn").addEventListener("click", () => {

    const text = result.innerText;

    if (!text || text === "⚠️ champ vide") return;

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "fr-FR";
    utterance.rate = 1;

    utterance.onerror = (e) => {
      console.log("VOICE ERROR:", e.error);
    };

    speechSynthesis.speak(utterance);

  });

  document.getElementById("stopBtn").addEventListener("click", () => {
    speechSynthesis.cancel();
  });

  /* =========================
     INIT HISTORY
  ========================= */

  renderHistory();

});