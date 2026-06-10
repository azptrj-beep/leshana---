"use strict";

/* ============================================================
   STATE
============================================================ */

let words = {};
let phrases = {};
let reverseWords = {};
let reversePhrases = {};
let wordList = [];
let realtimeTimer = null;

/* ============================================================
   LOAD DICTIONARIES
============================================================ */

async function loadDictionaries() {
  try {
    const [wRes, pRes] = await Promise.all([
      fetch("data/words.json"),
      fetch("data/phrases.json")
    ]);

    words = await wRes.json();
    phrases = await pRes.json();

    buildReverse();
    buildIndex();

    setStatus("📚 Dictionnaires chargés");
  } catch (e) {
    console.error("Erreur dictionnaires :", e);
    setStatus("❌ Erreur chargement dictionnaires");
  }
}

/* ============================================================
   BUILD REVERSE + INDEX
============================================================ */

function buildReverse() {
  reverseWords = {};
  reversePhrases = {};

  for (const k in words) reverseWords[words[k]] = k;
  for (const k in phrases) reversePhrases[phrases[k]] = k;
}

function buildIndex() {
  wordList = Object.keys(words);
}

/* ============================================================
   CLEAN + DETECT
============================================================ */

function clean(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s\u0700-\u074F]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function detect(text) {
  return /[\u0700-\u074F]/.test(text) ? "syr" : "fr";
}

/* ============================================================
   LEVENSHTEIN (CORRECTION)
============================================================ */

function levenshtein(a, b) {
  const m = [];

  for (let i = 0; i <= b.length; i++) m[i] = [i];
  for (let j = 0; j <= a.length; j++) m[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      m[i][j] =
        b[i - 1] === a[j - 1]
          ? m[i - 1][j - 1]
          : Math.min(m[i - 1][j - 1] + 1, m[i][j - 1] + 1, m[i - 1][j] + 1);
    }
  }

  return m[b.length][a.length];
}

/* ============================================================
   FIND CLOSEST WORD
============================================================ */

function findClosest(word) {
  let best = null;
  let bestScore = 2;

  for (const w of wordList) {
    const score = levenshtein(word, w);
    if (score < bestScore) {
      bestScore = score;
      best = w;
    }
  }

  return best;
}

/* ============================================================
   TRANSLATION ENGINE (AUTO-DETECT)
============================================================ */

function translate(text) {
  const input = clean(text);
  if (!input) return "⚠️ vide";

  const lang = detect(input);

  // Phrases prioritaires
  if (lang === "fr" && phrases[input]) return phrases[input];
  if (lang === "syr" && reversePhrases[input]) return reversePhrases[input];

  const map = lang === "fr" ? words : reverseWords;

  return input
    .split(" ")
    .map(word => {
      if (map[word]) return map[word];

      const closest = findClosest(word);
      if (closest && map