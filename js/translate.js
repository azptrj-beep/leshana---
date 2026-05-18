let autoMode = false;

"use strict";

/* =========================
   DICTIONNAIRES
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

// 🔁 dictionnaire inversé
const syrToFr = Object.fromEntries(
  Object.entries(frToSyr)
    .map(([k, v]) => [v, k])
);

// 🌍 direction
let currentDirection = "fr-syr";

/* =========================
   CLEAN TEXT
========================= */

function cleanText(text) {

  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s\u0700-\u074F]/gu, "")
    .replace(/\s+/g, " ")
    .trim();


/* =========================
   TRADUCTION
========================= */

function translateText(text) {

  const lang = detectLanguage(text);

  const words = cleanText(text).split(" ");

  const activeDictionary =
    lang === "fr"
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
    translated
  });

  history = history.slice(0, 10);

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

function showSuggestions(value) {

  const box =
    document.getElementById("suggestions");

  if (!value) {

    box.innerHTML = "";
    return;

  }

  const activeDictionary =
    currentDirection === "fr-syr"
      ? frToSyr
      : syrToFr;

  const matches =
    Object.keys(activeDictionary)

      .filter(word =>
        word.startsWith(
          value.toLowerCase()
        )
      )

      .slice(0, 5);

  box.innerHTML = matches.map(word => `
    <div class="suggestion"
         data-word="${word}">
      ${word}
    </div>
  `).join("");

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

  recognition =
    new SpeechRecognition();

  recognition.lang = "fr-FR";

}

/* =========================
   INIT
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

const autoBtn = document.getElementById("autoBtn");

  if (autoBtn) {

    autoBtn.addEventListener("click", () => {

      autoMode = !autoMode;

      autoBtn.innerText =
        autoMode ? "⚡ Auto ON" : "⚡ Auto OFF";

    });

  }

});

    const input =
      document.getElementById("frInput");

    const result =
      document.getElementById("result");

    /* ===== THEME ===== */

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

    /* ===== SUGGESTIONS ===== */

    input.addEventListener(
      "input",
      e => {

        showSuggestions(
          e.target.value
        );

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

          input.value =
            el.dataset.word;

          doTranslate();

        }
      );

    /* ===== AUDIO ===== */

    document
      .getElementById("speakBtn")
      .addEventListener(
        "click",
        () => {

          speak(
            result.innerText
          );

        }
      );

    /* ===== STOP ===== */

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

    /* ===== THEME BTN ===== */

    document
      .getElementById("themeBtn")
      .addEventListener(
        "click",
        () => {

          const dark =
            document.body.classList.contains("dark");

          setTheme(
            dark
              ? "light"
              : "dark"
          );

        }
      );

    /* ===== SWAP ===== */

    document
      .getElementById("swapBtn")
      .addEventListener(
        "click",
        () => {

          currentDirection =
            currentDirection === "fr-syr"
              ? "syr-fr"
              : "fr-syr";

          input.placeholder =
            currentDirection === "fr-syr"
              ? "Entrer un mot français"
              : "Entrer un mot soureth";

          result.innerText = "";

          document
            .getElementById("suggestions")
            .innerHTML = "";

        }
      );

    /* ===== HISTORY ===== */

    renderHistory();

  }
);

function detectLanguage(text) {

  const syrRegex = /[\u0700-\u074F]/;

  if (syrRegex.test(text)) {
    return "syr";
  }

  return "fr";
}