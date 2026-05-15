0
/* =========================
   DARK MODE
========================= */

function toggleDarkMode() {

  document.body.classList.toggle(
    'dark-mode'
  );

  localStorage.setItem(
    'darkMode',
    document.body.classList.contains(
      'dark-mode'
    )
  );
}

/* =========================
   LOAD DARK MODE
========================= */

window.addEventListener(
  'load',
  () => {

    const darkMode =
      localStorage.getItem(
        'darkMode'
      );

    if (darkMode === 'true') {

      document.body.classList.add(
        'dark-mode'
      );
    }
  }
);

/* =========================
   AUDIO PLAYER
========================= */

function playAudio(file) {

  const audio = new Audio(file);

  audio.play();
}

function playLetter(src) {

  const audio = new Audio(src);

  audio.play();
}

/* =========================
   KEYBOARD SOURETH
========================= */

function insertLetter(letter) {

  const editor =
    document.getElementById(
      'editor'
    );

  if (!editor) return;

  editor.value += letter;

  editor.focus();
}

/* =========================
   AUTO RTL
========================= */

const editor =
  document.getElementById(
    'editor'
  );

if (editor) {

  editor.setAttribute(
    'dir',
    'rtl'
  );
}

/* =========================
   TRANSLATION SYSTEM
========================= */

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
      'frInput'
    );

  const result =
    document.getElementById(
      'result'
    );

  if (!input || !result) return;

  const word =
    input.value.toLowerCase().trim();

  result.innerText =
    dictionary[word]
    || "Mot non trouvé";
}

/* =========================
   QUIZ SYSTEM
========================= */

let score = 0;

function checkAnswer(correct) {

  if (correct) {

    score++;

    alert(
      "✅ Bonne réponse !"
    );

  } else {

    alert(
      "❌ Mauvaise réponse"
    );
  }

  localStorage.setItem(
    'quizScore',
    score
  );
}

let score = 0;

function checkAnswer(answer) {

  const result =
    document.getElementById("quiz-result");

  if(answer === 'ܐ') {

    score += 10;

    result.innerHTML =
      "✅ Bonne réponse ! +10 XP";

    saveXP();

  } else {

    result.innerHTML =
      "❌ Mauvaise réponse";
  }
}

/* =========================
   USER PROGRESSION
========================= */

function updateProgress(value) {

  const progress =
    document.querySelector(
      '.progress'
    );

  if (!progress) return;

  progress.style.width =
    value + '%';

  localStorage.setItem(
    'progress',
    value
  );
}

/* =========================
   LOAD PROGRESSION
========================= */

window.addEventListener(
  'load',
  () => {

    const savedProgress =
      localStorage.getItem(
        'progress'
      );

    if (savedProgress) {

      updateProgress(
        savedProgress
      );
    }
  }
);

/* =========================
   FADE-IN ANIMATION
========================= */

const cards =
  document.querySelectorAll(
    '.card'
  );

const observer =
  new IntersectionObserver(

    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add(
            'fade-in'
          );
        }
      });
    },

    {
      threshold: 0.2
    }
  );

cards.forEach(card => {

  observer.observe(card);
});

/* =========================
   TYPING EFFECT
========================= */

const typingText =
  document.querySelector(
    '.typing-effect'
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

/* =========================
   SMOOTH SCROLL
========================= */

document.querySelectorAll(
  'a[href^="#"]'
).forEach(anchor => {

  anchor.addEventListener(
    'click',
    function (e) {

      e.preventDefault();

      document.querySelector(
        this.getAttribute('href')
      ).scrollIntoView({

        behavior: 'smooth'
      });
    }
  );
});

/* =========================
   SOUNDS BUTTON EFFECT
========================= */

const buttons =
  document.querySelectorAll(
    'button'
  );

buttons.forEach(button => {

  button.addEventListener(
    'mouseenter',
    () => {

      button.style.transform =
        'scale(1.05)';
    }
  );

  button.addEventListener(
    'mouseleave',
    () => {

      button.style.transform =
        'scale(1)';
    }
  );
});

/* =========================
   MOBILE MENU
========================= */

function toggleMenu() {

  const nav =
    document.querySelector('nav');

  nav.classList.toggle(
    'active'
  );
}

/* =========================
   INSTALL PWA
========================= */

let deferredPrompt;

window.addEventListener(
  'beforeinstallprompt',
  (e) => {

    e.preventDefault();

    deferredPrompt = e;

    console.log(
      'PWA installable'
    );
  }
);

/* =========================
   SERVICE WORKER
========================= */

if ('serviceWorker' in navigator) {

  navigator.serviceWorker.register(
    '/service-worker.js'
  )

  .then(() => {

    console.log(
      'Service Worker enregistré'
    );
  });
}

const fadeElements =
document.querySelectorAll(".card, .progress-card");

const observer =
new IntersectionObserver(entries => {

  entries.forEach(entry => {

    if(entry.isIntersecting) {

      entry.target.classList.add("visible");
    }
  });

}, {
  threshold: 0.15
});

fadeElements.forEach(el => {

  el.classList.add("fade-scroll");

  observer.observe(el);
});