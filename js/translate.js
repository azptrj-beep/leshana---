
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

// 🧠 traduction mot ou phrase
function translateText(text) {

  const words = text.toLowerCase().split(" ");

  const translated = words.map(w => {
    return dictionary[w] || `[${w}]`;
  });

  return translated.join(" ");
}

// 💾 historique
function saveHistory(original, translated) {

  let history = JSON.parse(localStorage.getItem("history")) || [];

  history.unshift({ original, translated });

  history = history.slice(0, 10); // max 10

  localStorage.setItem("history", JSON.stringify(history));

  renderHistory();
}

// 📜 afficher historique
function renderHistory() {

  const container = document.getElementById("history");

  const history = JSON.parse(localStorage.getItem("history")) || [];

  container.innerHTML = "<h3>Historique</h3>" +
    history.map(h =>
      `<p>${h.original} → ${h.translated}</p>`
    ).join("");
}

// 💡 suggestions simples
function showSuggestions(value) {

  const box = document.getElementById("suggestions");

  if (!value) {
    box.innerHTML = "";
    return;
  }

  const matches = Object.keys(dictionary)
    .filter(k => k.startsWith(value.toLowerCase()))
    .slice(0, 5);

  box.innerHTML = matches.map(m => `<p>${m}</p>`).join("");
}

// 🚀 init
document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("frInput");
  const result = document.getElementById("result");

  document.getElementById("translateBtn").addEventListener("click", () => {

    const text = input.value.trim();

    if (!text) {
      result.innerText = "⚠️ Champ vide";
      return;
    }

    const translated = translateText(text);

    result.innerText = translated;

    saveHistory(text, translated);
  });

  // ENTER
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      document.getElementById("translateBtn").click();
    }
  });

  // suggestions live
  input.addEventListener("input", (e) => {
    showSuggestions(e.target.value);
  });

  renderHistory();
});