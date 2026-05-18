
"use strict";
"use strict";

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

// 🔁 inversion auto
const syrToFr = Object.fromEntries(
  Object.entries(frToSyr)
    .map(([k, v]) => [v, k])
);

// 🌍 direction actuelle
let currentDirection = "fr-syr";
};

/* =========================
   CLEAN TEXT
========================= */

function cleanText(text) {

  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, " ")
    .trim();

}

/* =========================
   SMART PHRASE
========================= */

function smartSentence(words) {

  return words;

}

/* =========================
   TRADUCTION
========================= */

function translateText(text) {

  const words = smartSentence(
    cleanText(text).split(" ")
  );

  // 🌍 dictionnaire actif
  const activeDictionary =
    currentDirection === "fr-syr"
      ? frToSyr
      : syrToFr;

  return words
    .map(word =>
      activeDictionary[word] || `[${word}]`
    )
    .join(" ");

}

/* =========================
   HISTORIQUE
========================= */

function saveHistory(original, translated) {

  let history =
    JSON.parse(
      localStorage.getItem("history")
    ) || [];

  history.unshift({
    original,
    translated,
    time: Date.now()
  });

  history = history.slice(0, 15);

  localStorage.setItem(
    "history",
    JSON.stringify(history)
  );

  renderHistory();

}

function renderHistory() {

  const container =
    document.getElementById("history");

  const history =
    JSON.parse(
      localStorage.getItem("history")
    ) || [];

  container.innerHTML =
    "<h3>📜 Historique</h3>";

  history.forEach(item => {

    container.innerHTML += `
      <div class="history-item">
        ${item.original} → ${item.translated}
      </div>
    `;

  });

}

/* =========================
   SUGGESTIONS
========================= */

let debounceTimer;

function showSuggestions(value) {

  const box =
    document.getElementById("suggestions");

  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {

    if (!value) {

      box.innerHTML = "";
      return;

    }

    const matches = Object.keys(dictionary)

      .filter(word =>
        word.startsWith(
          value.toLowerCase()
        )
      )

      .sort((a, b) =>
        a.length - b.length
      )

      .slice(0, 6);

    box.innerHTML = matches.map(word => `
      <div class="suggestion"
           data-word="${word}">
        ${word}
      </div>
    `).join("");

  }, 120);

}

/* =========================
   AUDIO
========================= */

function speak(text) {

  if (!text) return;

  speechSynthesis.cancel();

  const utterance =
    new SpeechSynthesisUtterance(text);

  utterance.lang = "fr-FR";

  speechSynthesis.speak(utterance);

}

/* =========================
   THEME
========================= */

function setTheme(mode) {

  if (mode === "dark") {

    document.body.classList.add("dark");

  } else {

    document.body.classList.remove("dark");

  }

  localStorage.setItem("theme", mode);

}

/* =========================
   SPEECH RECOGNITION
========================= */

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

let recognition = null;

if (SpeechRecognition) {

  recognition = new SpeechRecognition();

  recognition.lang = "fr-FR";

}

/* =========================
   INIT
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const input =
      document.getElementById("frInput");

    const result =
      document.getElementById("result");

    /* ===== LOAD THEME ===== */

    const savedTheme =
      localStorage.getItem("theme")
      || "light";

    setTheme(savedTheme);

    /* ===== TRADUCTION ===== */

    function doTranslate() {

      const text =
        input.value.trim();

      if (!text) {

        result.innerText =
          "⚠️ Champ vide";

        return;

      }

      const translated =
        translateText(text);

      result.innerText =
        translated;

      saveHistory(text, translated);

    }

    /* ===== BUTTON ===== */

    document
      .getElementById("translateBtn")
      .addEventListener(
        "click",
        doTranslate
      );

    /* ===== ENTER ===== */

    input.addEventListener(
      "keydown",
      e => {

        if (e.key === "Enter") {
          doTranslate();
        }

      }
    );

    /* ===== LIVE SUGGESTIONS ===== */

    input.addEventListener(
      "input",
      e => {
        showSuggestions(e.target.value);
      }
    );

    /* ===== CLICK SUGGESTION ===== */

    document
      .getElementById("suggestions")
      .addEventListener(
        "click",
        e => {

          const el =
            e.target.closest(".suggestion");

          if (!el) return;

          const word =
            el.dataset.word;

          input.value = word;

          const translated =
            translateText(word);

          result.innerText =
            translated;

          saveHistory(word, translated);

        }
      );

    /* ===== AUDIO ===== */

    document
      .getElementById("speakBtn")
      .addEventListener(
        "click",
        () => {
          speak(result.innerText);
        }
      );

    /* ===== STOP AUDIO ===== */

    document
      .getElementById("stopBtn")
      .addEventListener(
        "click",
        () => {
          speechSynthesis.cancel();
        }
      );

    /* ===== MIC ===== */

    if (recognition) {

      document
        .getElementById("micBtn")
        .addEventListener(
          "click",
          () => {
            recognition.start();
          }
        );

      recognition.onresult =
        event => {

          const text =
            event.results[0][0].transcript;

          input.value = text;

        };

    }

    /* ===== THEME ===== */

    document
      .getElementById("themeBtn")
      .addEventListener(
        "click",
        () => {

          const dark =
            document.body.classList.contains("dark");

          setTheme(
            dark ? "light" : "dark"
          );

        }
      );

    /* ===== HISTORY ===== */

    renderHistory();

  }
);