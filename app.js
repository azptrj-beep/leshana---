/* =========================================
   LESHANA-ED-SOURETH
   CLEAN APP.JS
========================================= */
/* =========================
   THEME TOGGLE CLEAN
========================= */

function toggleTheme() {

  document.body.classList.toggle("light-mode");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("light-mode")
  );
}

window.addEventListener("DOMContentLoaded", () => {

  const saved = localStorage.getItem("theme");

  if (saved === "true") {

    document.body.classList.add("light-mode");
  }
});

/* =========================================
   DARK MODE
========================================= */

 {

  
  );
}

window.addEventListener("DOMContentLoaded", () => {

  const savedDarkMode =
    

  if (savedDarkMode === "true") {

    document.body.classList.add(
      "dark-mode"
    );
  }

  loadProgress();

  initAnimations();
});

/* =========================================
   MOBILE MENU
=========================================  

 {

  
  );

  
    
    );

  localStorage.setItem(
    "lightMode",
    isLight
  );
}

window.addEventListener(
  "DOMContentLoaded",

  () => {

    const saved =
      

    if (saved === "true") {

      document.body.classList.add(
        
      );
    }
  }
);

=========================================
   AUDIO
========================================= */

function playAudio(file) {

  const audio = new Audio(file);

  audio.play();
}

function playLetter(src) {

  const audio = new Audio(src);

  audio.play();
}

/* =========================================
   SOURETH KEYBOARD
========================================= */

function insertLetter(letter) {

  const editor =
    document.getElementById("editor");

  if (!editor) return;

  editor.value += letter;

  editor.focus();
}

/* AUTO RTL */

const editor =
  document.getElementById("editor");

if (editor) {

  editor.setAttribute(
    "dir",
    "rtl"
  );
}

/* =========================================
   TRANSLATION SYSTEM
========================================= */

const dictionary = {

  "bonjour": "ܫܠܡܐ",
  "paix": "ܫܠܡܐ",
  "maison": "ܒܝܬܐ",
  "roi": "ܡܠܟܐ",
  "eau": "ܡܝܐ",
  "mère": "ܐܡܐ",
  "père": "ܐܒܐ",
  "soleil": "ܫܡܫܐ",
  "lune": "ܣܗܪܐ"
};

function translate() {

  const input =
    document.getElementById(
      "frInput"
    );

  const result =
    document.getElementById(
      "result"
    );

  if (!input || !result) return;

  const word =
    input.value
      .toLowerCase()
      .trim();

  result.innerText =
    dictionary[word]
    || "Mot non trouvé";
}

/* =========================================
   QUIZ SYSTEM
========================================= */

let score = 0;

function checkAnswer(answer) {

  const result =
    document.getElementById(
      "quiz-result"
    );

  if (!result) return;

  if (answer === "ܐ") {

    score += 10;

    result.innerHTML =
      "✅ Bonne réponse ! +10 XP";

    updateProgress(score);

  } else {

    result.innerHTML =
      "❌ Mauvaise réponse";
  }

  localStorage.setItem(
    "quizScore",
    score
  );
}

/* =========================================
   USER PROGRESSION
========================================= */

function updateProgress(value) {

  const progress =
    document.querySelector(
      ".progress"
    );

  if (!progress) return;

  let finalValue =
    Math.min(value, 100);

  progress.style.width =
    finalValue + "%";

  localStorage.setItem(
    "progress",
    finalValue
  );
}

function loadProgress() {

  const savedProgress =
    localStorage.getItem(
      "progress"
    );

  if (savedProgress) {

    updateProgress(
      parseInt(savedProgress)
    );
  }
}

/* =========================================
   FADE-IN ANIMATION
========================================= */

function initAnimations() {

  const elements =
    document.querySelectorAll(
      ".card, .progress-card, .letter-card"
    );

  const observer =
    new IntersectionObserver(

      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "fade-in"
            );
          }
        });

      },

      {
        threshold: 0.15
      }
    );

  elements.forEach(el => {

    observer.observe(el);
  });
}

/* =========================================
   TYPING EFFECT
========================================= */

const typingText =
  document.querySelector(
    ".typing-effect"
  );

if (typingText) {

  const text =
    "ܫܠܡܐ - Bienvenue sur Leshana-Ed-Soureth";

  let index = 0;

  function type() {

    if (index < text.length) {

      typingText.innerHTML +=
        text.charAt(index);

      index++;

      setTimeout(type, 70);
    }
  }

  type();
}

/* =========================================
   SMOOTH SCROLL
========================================= */

document.querySelectorAll(
  'a[href^="#"]'
).forEach(anchor => {

  anchor.addEventListener(
    "click",

    function(e) {

      const target =
        document.querySelector(
          this.getAttribute("href")
        );

      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({

        behavior: "smooth"
      });
    }
  );
});

/* =========================================
   BUTTON HOVER EFFECT
========================================= */

const buttons =
  document.querySelectorAll(
    "button"
  );

buttons.forEach(button => {

  button.addEventListener(
    "mouseenter",
    () => {

      button.style.transform =
        "scale(1.05)";
    }
  );

  button.addEventListener(
    "mouseleave",
    () => {

      button.style.transform =
        "scale(1)";
    }
  );
});

/* =========================================
   PWA INSTALL
========================================= */

let deferredPrompt;

window.addEventListener(
  "beforeinstallprompt",

  (e) => {

    e.preventDefault();

    deferredPrompt = e;

    console.log(
      "PWA installable"
    );
  }
);

/* =========================================
   SERVICE WORKER
========================================= */

if ("serviceWorker" in navigator) {

  window.addEventListener(
    "load",

    () => {

      navigator.serviceWorker
        .register(
          "/service-worker.js"
        )

        .then(() => {

          console.log(
            "Service Worker enregistré"
          );
        })

        .catch(error => {

          console.log(
            "Erreur Service Worker",
            error
          );
        });
    }
  );
}