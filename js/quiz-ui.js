function playSound(type) {

  let src = "";

  if (type === "correct") {
    src = "assets/audio/correct.mp3";
  }

  if (type === "wrong") {
    src = "assets/audio/wrong.mp3";
  }

  if (type === "click") {
    src = "assets/audio/click.mp3";
  }

  const audio = new Audio(src);
  audio.volume = 0.7;
  audio.play();
}/* =========================
   QUIZ UI SOURETH ENGINE
   (AFFICHAGE UNIQUEMENT)
========================= */

/* =========================
   RENDER QUESTION
========================= */

function renderQuestion() {

  const q = getCurrentQuestion();

  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");

  optionsEl.innerHTML = "";

  // reset feedback
  const resultEl = document.getElementById("quiz-result");
  if (resultEl) resultEl.textContent = "";

  /* =========================
     TYPES DISPLAY
  ========================= */

  if (q.type === "letter") {

    questionEl.innerHTML =
      `<div class="quiz-letter">${q.question}</div>`;
  }

  else if (q.type === "image") {

    questionEl.innerHTML =
      `<img src="${q.src}" class="quiz-image">`;
  }

  else if (q.type === "audio") {

    questionEl.innerHTML =
      `<button class="audio-btn" onclick="playAudio('${q.src}')">
        🔊 Écouter
      </button>`;
  }

  /* =========================
     ANSWERS UI
  ========================= */

  generateSmartAnswersUI(q);
}

/* =========================
   GENERATE ANSWERS UI
========================= */

function generateSmartAnswersUI(q) {

  const optionsEl = document.getElementById("options");

  const answers = generateSmartAnswers(q);

  answers.forEach(answer => {

    const btn = document.createElement("button");

    btn.className = "quiz-answer";
    btn.textContent = answer;

    btn.onclick = () => handleAnswer(btn, answer, q);

    optionsEl.appendChild(btn);
  });
}

/* =========================
   HANDLE CLICK (VISUAL FEEDBACK)
========================= */

function handleAnswer(btn, answer, q) {

  const correct = answer === q.answer;

  // reset old styles (optional safety)
  document.querySelectorAll(".quiz-answer")
    .forEach(b => b.disabled = true);

  if (correct) {

    btn.classList.add("correct");

  } else {

    btn.classList.add("wrong");
  }

  setTimeout(() => {

    checkAnswer(answer);

  }, 450);
}

/* =========================
   UPDATE XP UI
========================= */

function updateXPUI() {

  const levelEl = document.getElementById("level");
  const xpEl = document.getElementById("xp");
  const streakEl = document.getElementById("streak");
  const scoreEl = document.getElementById("score");

  if (levelEl) levelEl.textContent = level;
  if (xpEl) xpEl.textContent = xp;
  if (streakEl) streakEl.textContent = streak;
  if (scoreEl) scoreEl.textContent = score;
}

/* =========================
   DUOLINGO UI (LIVES + PROGRESS)
========================= */

function updateDuoUI() {

  const livesEl = document.getElementById("lives");
  const progressBar = document.getElementById("progress-bar");

  if (livesEl) livesEl.textContent = lives;

  if (progressBar) {
    progressBar.style.width = progress + "%";
  }

  saveProgress();
}

/* =========================
   OPTIONAL AUDIO WRAPPER
========================= */

function playAudio(src) {

  const audio = new Audio(src);
  audio.play();
}