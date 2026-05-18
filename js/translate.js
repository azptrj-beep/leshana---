let dictionary = {};

// 📚 charger dictionnaire JSON
fetch("data/dictionary.json")
  .then(res => res.json())
  .then(data => {
    dictionary = data;
  });

// 🧠 traduction
function translateText(text) {

  return text
    .toLowerCase()
    .trim()
    .split(" ")
    .map(word => dictionary[word] || `[${word}]`)
    .join(" ");
}

// 💡 suggestions
function showSuggestions(value) {

  const box = document.getElementById("suggestions");

  if (!value) {
    box.innerHTML = "";
    return;
  }

  const matches = Object.keys(dictionary)
    .filter(word =>
      word.startsWith(value.toLowerCase())
    )
    .slice(0, 5);

  box.innerHTML = matches
    .map(word =>
      `<div class="suggestion">${word}</div>`
    )
    .join("");

  document.querySelectorAll(".suggestion")
    .forEach(el => {

      el.addEventListener("click", () => {
        document.getElementById("input").value =
          el.innerText;

        box.innerHTML = "";
      });

    });
}

// 🔊 audio
function speak(text) {

  const utterance =
    new SpeechSynthesisUtterance(text);

  utterance.lang = "fr-FR";

  speechSynthesis.speak(utterance);
}

// 🚀 app
document.addEventListener("DOMContentLoaded", () => {

  const input =
    document.getElementById("input");

  const result =
    document.getElementById("result");

  // traduction
  document.getElementById("translateBtn")
    .addEventListener("click", () => {

      const text = input.value;

      if (!text) {
        result.innerText = "⚠️ Champ vide";
        return;
      }

      const translated =
        translateText(text);

      result.innerText = translated;
    });

  // ENTER
  input.addEventListener("keydown", e => {

    if (e.key === "Enter") {
      document
        .getElementById("translateBtn")
        .click();
    }

  });

  // suggestions
  input.addEventListener("input", e => {
    showSuggestions(e.target.value);
  });

  // audio
  document.getElementById("voiceBtn")
    .addEventListener("click", () => {

      speak(result.innerText);

    });

});