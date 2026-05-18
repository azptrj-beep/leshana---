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
  femme: "ܐܢܬܬܐ"
};

/* =========================
   CLEAN SAFE
========================= */

function clean(t) {
  return t
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s\u0700-\u074F]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* =========================
   TRANSLATE ENGINE
========================= */

function translate(t) {

  const map =
    direction === "fr-syr"
      ? dict
      : Object.fromEntries(
          Object.entries(dict).map(([k, v]) => [v, k])
        );

  return clean(t)
    .split(" ")
    .map(w => map[w] || w)
    .join(" ");

}

/* =========================
   SAVE HISTORY
========================= */

function save(o, r) {

  let h = JSON.parse(localStorage.getItem("h") || "[]");

  h.unshift({ o, r });

  localStorage.setItem("h", JSON.stringify(h.slice(0, 20)));

}

/* =========================
   RENDER HISTORY
========================= */

function render() {

  const box = document.getElementById("history");

  const h = JSON.parse(localStorage.getItem("h") || "[]");

  box.innerHTML = "";

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

  function run() {

    const text = input.value.trim();

    if (!text) return;

    const r = translate(text);

    result.innerText = r;

    save(text, r);

    render();

  }

  document.getElementById("translateBtn").onclick = run;

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") run();
  });

  /* ===== SWAP ===== */

  document.getElementById("swapBtn").onclick = () => {

    direction =
      direction === "fr-syr"
        ? "syr-fr"
        : "fr-syr";

    input.value = "";
    result.innerText = "";

  };

  /* ===== MIC ===== */

  const SR =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (SR) {

    const rec = new SR();
    rec.lang = "fr-FR";

    document.getElementById("micBtn").onclick = () => rec.start();

    rec.onresult = e => {
      input.value = e.results[0][0].transcript;
    };

  }

  /* ===== AUDIO ===== */

  document.getElementById("speakBtn").onclick = () => {

    const text = result.innerText;

    if (!text) return;

    speechSynthesis.cancel();

    speechSynthesis.speak(
      new SpeechSynthesisUtterance(text)
    );

  };

  document.getElementById("stopBtn").onclick = () => {
    speechSynthesis.cancel();
  };

  render();

});