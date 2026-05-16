
/* =========================================
   LESHANA-ED-SOURETH - CLEAN APP JS
========================================= */

console.log("JS chargé ✔");

/* =========================================
   THEME (LIGHT / DARK SIMPLE)
========================================= */

function toggleTheme() {

  document.body.classList.toggle("light-mode");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("light-mode")
  );
}

window.addEventListener("DOMContentLoaded", () => {

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "true") {
    document.body.classList.add("light-mode");
  }

  loadProgress();
});

/* =========================================
   MOBILE MENU
========================================= */

function toggleMenu() {

  const nav = document.querySelector("nav");

  if (nav) {
    nav.classList.toggle("active");
  }
}

/* =========================================
   KEYBOARD SOURETH
========================================= */

function insertLetter(letter) {

  const editor = document.getElementById("editor");

  if (!editor) return;

  editor.value += letter;
  editor.focus();
}

/* =========================================
   AUDIO (OPTIONNEL)
========================================= */

function playAudio(src) {

  const audio = new Audio(src);
  audio.play();
}

/* =========================================
   QUIZ SYSTEM
========================================= */

let score = 0;

function checkAnswer(answer) {

  const result = document.getElementById("quiz-result");

  if (!result) return;

  if (answer === "ܐ") {

    score += 10;

    result.innerHTML = "✅ Bonne réponse ! +10 XP";

    updateProgress(score);

  } else {

    result.innerHTML = "❌ Mauvaise réponse";
  }

  localStorage.setItem("quizScore", score);
}

/* =========================================
   PROGRESSION BAR
========================================= */

function updateProgress(value) {

  const progress = document.querySelector(".progress");

  if (!progress) return;

  const finalValue = Math.min(value, 100);

  progress.style.width = finalValue + "%";

  localStorage.setItem("progress", finalValue);
}

function loadProgress() {

  const saved = localStorage.getItem("progress");

  if (saved) {
    updateProgress(parseInt(saved));
  }
}

/* =========================================
   FADE IN ANIMATION
========================================= */

window.addEventListener("DOMContentLoaded", () => {

  const elements = document.querySelectorAll(".card, .progress-card");

  const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      }

    });

  }, { threshold: 0.15 });

  elements.forEach((el) => observer.observe(el));
});

/* =========================================
   SMOOTH SCROLL
========================================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

  anchor.addEventListener("click", function (e) {

    const target = document.querySelector(this.getAttribute("href"));

    if (!target) return;

    e.preventDefault();

    target.scrollIntoView({
      behavior: "smooth"
    });

  });

});

/* =========================================
   BUTTON EFFECTS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const buttons = document.querySelectorAll("button");

  buttons.forEach(btn => {

    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "scale(1.05)";
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "scale(1)";
    });

  });

});


function updateUI() {

  const xpEl = document.getElementById("xp-value");
  const levelEl = document.getElementById("level-value");

  if (xpEl) xpEl.textContent = xp;
  if (levelEl) levelEl.textContent = level;
}