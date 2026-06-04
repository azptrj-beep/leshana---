"use strict";

const vowels = [
  { char: "ܵ", sound: "Zqapa, A long" },
  { char: "ܲ", sound: "Ptakha, A court" },
  { char: "ܸ", sound: "Zlama Psheeqa (Kirya) E court" },
  { char: "ܹ", sound: "Zlama Qashya(Yarikha) , É long" },
  { char: "ܘܿ", sound: "Rwakha, O" },
  { char: "ܘܼ", sound: "Rwasa, OU" },
  { char: "ܝܼ", sound: "Khwasa, EE" },
  { char: "ܐ", sound: "support vocalique" }
];

// --------------------
// AFFICHAGE CARTES
// --------------------

const grid = document.getElementById("vowelGrid");

vowels.forEach(v => {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <div class="syriac">${v.char}</div>
    <div class="sound">${v.sound}</div>
    <button onclick="playSound('${v.sound}')">🔊 écouter</button>
  `;

  grid.appendChild(card);
});

// --------------------
// AUDIO (placeholder)
// --------------------

function playSound(sound) {
  alert("Lecture son : " + sound + " (audio à intégrer plus tard)");
}

// --------------------
// QUIZ
// --------------------

let current = {};

function newQuestion() {
  current = vowels[Math.floor(Math.random() * vowels.length)];
  document.getElementById("quizLetter").textContent = current.char;
  document.getElementById("result").textContent = "";
}

function answer(choice) {
  const result = document.getElementById("result");

  if (choice === current.sound) {
    result.textContent = "✅ Correct !";
    result.style.color = "lightgreen";
  } else {
    result.textContent = "❌ Faux, réponse : " + current.sound;
    result.style.color = "red";
  }

  setTimeout(newQuestion, 1200);
}

// init
newQuestion();