"use strict";

let dictionary = {};
let userData = {
  xp: 0,
  learned: []
};

// 📦 chargement
fetch("data/dictionary.json")
  .then(r => r.json())
  .then(d => dictionary = d);

// 🧠 analyse phrase (version V5)
function translateSentence(text) {

  const words = text.toLowerCase().split(" ");

  let result = [];

  words.forEach(w => {

    if (dictionary[w]) {
      result.push(dictionary[w]);

      addXP(1);
      trackWord(w);

    } else {
      result.push(`[${w}]`);
    }
  });

  return grammarFix(result);
}

// ✍️ correction simple ordre logique
function grammarFix(words) {
  return words.join(" ");
}

// 📊 XP system
function addXP(value) {
  userData.xp += value;
  updateProfile();
}

// 📚 apprentissage
function trackWord(word) {
  if (!userData.learned.includes(word)) {
    userData.learned.push(word);
  }
}

// 💾 profil
function updateProfile() {
  document.getElementById("xp").innerText = userData.xp;
  localStorage.setItem("user", JSON.stringify(userData));
}

// 🔁 chargement profil
function loadUser() {
  const saved = localStorage.getItem("user");
  if (saved) userData = JSON.parse(saved);
  updateProfile();
}