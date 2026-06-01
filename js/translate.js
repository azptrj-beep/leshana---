"use strict";

/* =========================
   GLOBAL STATE
========================= */

let direction = "auto";

/* =========================
   DICTIONARIES
========================= */

let words = {};
let phrases = {};

let reverseWords = {};
let reversePhrases = {};

/* =========================
   LOAD ALL DICTIONARIES
========================= */

async function loadDictionaries() {
  try {
    const [wRes, pRes] = await Promise.all([
      fetch("data/words.json"),
      fetch("data/phrases.json")
    ]);

    words = await wRes.json();
    phrases = await pRes.json();

    buildReverse();

    console.log("✔ Dictionnaires chargés");
  } catch (e) {
    console.error("Erreur chargement dictionnaires", e);
  }
}

/* =========================
   REVERSE ENGINE
========================= */

function buildReverse() {
  reverseWords = {};
  reversePhrases = {};

  for (const k in words) {
    reverseWords[words[k]] = k;
  }

  for (const k in phrases) {
    reversePhrases[phrases[k]] = k;
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
   LANGUAGE DETECTION
========================= */

function detect(text) {
  return /[\u0700-\u074F]/.test(text) ? "syr" : "fr";
}

/* =========================
   TRANSLATE ENGINE
========================= */

function translate(text) {
  const input = clean(text);
  const lang = detect(input);

  /* 1. PHRASES PRIORITY */
  if (phrases[input]) {
    return phrases[input];
  }

  /* 2. WORD MODE */
  const map = lang === "fr" ? words : reverseWords;

  return input
    .split(" ")
    .map(w => map[w] || `[${w}]`)
    .join(" ");
}

/* =========================
   STATUS
========================= */

function setStatus(msg) {
  const el = document.getElementById("status");
  if (el) el.innerText = msg;
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", async () => {
  await loadDictionaries();

  setStatus("✅ Moteur prêt");
});