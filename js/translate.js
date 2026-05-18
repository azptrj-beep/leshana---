
"use strict";
const dictionary = {
  bonjour: "ܫܠܡܐ",
  maison: "ܒܝܬܐ",
  eau: "ܡܝܐ",
  roi: "ܡܠܟܐ",
  paix: "ܫܠܡܐ",
  comment: "ܐܝܟ",
  tu: "ܐܢܬ",
  vas: "ܐܙܠ"
};

// 🧼 nettoyage intelligent
function cleanText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .trim();
}

// 🧠 traduction améliorée
function translateText(text) {
  const words = cleanText(text).split(" ");

  return words.map(w => dictionary[w] || `(${w})`).join(" ");
}

// 💾 historique
function saveHistory(original, translated) {
  let history = JSON.parse(localStorage.getItem("history")) || [];

  history.unshift({ original, translated });
  history = history.slice(0, 15);

  localStorage.setItem("history", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const box = document.getElementById("history");
  const history = JSON.parse(localStorage.getItem("history")) || [];

  box.innerHTML = "<h3>📜 Historique</h3>";

  history.forEach((h, i) => {
    box.innerHTML += `
      <div class="history-item">
        ${h.original} → ${h.translated}
        <button onclick="deleteHistory(${i})">❌</button>
      </div>
    `;
  });
}

function deleteHistory(index) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.splice(index, 1);
  localStorage.setItem("history", JSON.stringify(history));
  renderHistory();
}

// 💡 suggestions cliquables
function showSuggestions(value) {
  const box = document.getElementById("suggestions");

  if (!value) {
    box.innerHTML = "";
    return;
  }

  const matches = Object.keys(dictionary)
    .filter(k => k.startsWith(value.toLowerCase()))
    .slice(0, 6);

  box.innerHTML = matches
    .map(m => `<div class="suggestion">${m}</div>`)
    .join("");

  document.querySelectorAll(".suggestion").forEach(el => {
    el.addEventListener("click", () => {
      document.getElementById("frInput").value = el.innerText;
      box.innerHTML = "";
    });
  });
}

// 🔊 lecture audio
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";
  speechSynthesis.speak(utterance);
}

// 🌙 mode sombre
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

// 🚀 init app
document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("frInput");
  const result = document.getElementById("result");

  document.getElementById("translateBtn").addEventListener("click", () => {

    const text = input.value;

    if (!text) {
      result.innerText = "⚠️ Champ vide";
      return;
    }

    const translated = translateText(text);

    result.innerText = translated;

    saveHistory(text, translated);
  });

  input.addEventListener("input", e => {
    showSuggestions(e.target.value);
  });

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      document.getElementById("translateBtn").click();
    }
  });

  document.getElementById("speakBtn").addEventListener("click", () => {
    speak(result.innerText);
  });

  document.getElementById("themeToggle").addEventListener("click", toggleTheme);

  // load theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  renderHistory();
});