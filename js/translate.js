

"use strict";

const dictionary = {
  bonjour: "ܫܠܡܐ",
  maison: "ܒܝܬܐ",
  eau: "ܡܝܐ",
  roi: "ܡܠܟܐ",
  paix: "ܫܠܡܐ",
  comment: "ܐܝܟ",
  tu: "ܐܢܬ",
  vas: "ܐܙܠ",
  homme: "ܒܪܢܫܐ",
  femme: "ܐܢܬܬܐ"
};

// 🧼 nettoyage robuste
function cleanText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .trim()
    .replace(/\s+/g, " ");
}

// 🤖 mini IA (reformulation simple)
function smartRewrite(words) {
  // petite logique type “phrase naturelle”
  // (version légère IA sans backend)
  return words;
}

// 🧠 traduction
function translateText(text) {

  const words = smartRewrite(
    cleanText(text).split(" ")
  );

  return words
    .map(w => dictionary[w] || `[${w}]`)
    .join(" ");
}

// 💾 historique global (sync toutes pages)
function saveHistory(original, translated) {

  let history = JSON.parse(localStorage.getItem("history")) || [];

  history.unshift({
    original,
    translated,
    time: Date.now()
  });

  history = history.slice(0, 15);

  localStorage.setItem("history", JSON.stringify(history));

  renderHistory();
}

// 📜 affichage propre
function renderHistory() {

  const container = document.getElementById("history");

  const history = JSON.parse(localStorage.getItem("history")) || [];

  container.innerHTML = "<h3>📜 Historique</h3>";

  history.forEach(item => {

    container.innerHTML += `
      <div class="history-item">
        <span>${item.original} → ${item.translated}</span>
      </div>
    `;
  });
}

// 💡 suggestions intelligentes (triées)
function showSuggestions(value) {

  const box = document.getElementById("suggestions");

  if (!value) {
    box.innerHTML = "";
    return;
  }

  const v = value.toLowerCase();

  const matches = Object.keys(dictionary)
    .filter(k => k.startsWith(v))
    .sort((a, b) => a.length - b.length)
    .slice(0, 6);

  box.innerHTML = matches.map(m =>
    `<div class="suggestion" data-word="${m}">${m}</div>`
  ).join("");
}

// 🔊 audio propre (reset avant lecture)
function speak(text) {

  if (!text) return;

  speechSynthesis.cancel(); // IMPORTANT V2.4

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";

  speechSynthesis.speak(utterance);
}

// 🚀 INIT SAFE
document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("frInput");
  const result = document.getElementById("result");

  function doTranslate() {

    const text = input.value.trim();

    if (!text) {
      result.innerText = "⚠️ Champ vide";
      return;
    }

    const translated = translateText(text);

    result.innerText = translated;

    saveHistory(text, translated);
  }

  document.getElementById("translateBtn").addEventListener("click", doTranslate);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doTranslate();
  });

  input.addEventListener("input", (e) => {
    showSuggestions(e.target.value);
  });

  // 🖱️ suggestions (event delegation propre)
  document.getElementById("suggestions").addEventListener("click", (e) => {

    const el = e.target.closest(".suggestion");

    if (!el) return;

    const word = el.dataset.word;

    input.value = word;

    const translated = translateText(word);

    result.innerText = translated;

    saveHistory(word, translated);
  });

  // 🔊 audio bouton
  document.getElementById("speakBtn").addEventListener("click", () => {
    speak(result.innerText);
  });

  renderHistory();
});