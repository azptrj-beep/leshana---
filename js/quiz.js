/* =========================
   QUIZ SOURETH ENGINE PRO
========================= */

/* ===== STATE ===== */

let currentIndex = 0;

let score = 0;
let xp = 0;
let level = 1;
let streak = 0;

let lives = 3;
let progress = 0;

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {

  if (document.getElementById("question")) {

    renderQuestion();
    updateXPUI();
    updateDuoUI();
  }
});

/* =========================
   GET QUESTION
========================= */

function getCurrentQuestion() {
  return quizData[currentIndex];
}

/* =========================
   RENDER QUESTION
========================= */

function renderQuestion() {

  const q = getCurrentQuestion();

  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");

  optionsEl.innerHTML = "";

  // RESET RESULT
  const result = document.getElementById("quiz-result");
  if (result) result.textContent = "";

  /* ===== TYPES ===== */

  if (q.type === "letter") {
    questionEl.innerHTML =
      `<div class="quiz-letter">${q.question}</div>`;
  }

  if (q.type === "image") {
    questionEl.innerHTML =
      `<img src="${q.src}" class="quiz-image">`;
  }

  if (q.type === "audio") {
    questionEl.innerHTML =
      `<button class="audio-btn" onclick="playAudio('${q.src}')">
        🔊 Écouter
      </button>`;
  }

  /* ===== ANSWERS ===== */

  generateSmartAnswersUI(q);
}

/* =========================
   IA ANSWERS
========================= */

function generateSmartAnswers(q) {

  const pool = quizData.map(q => q.answer);

  const fakePool = pool.filter(a => a !== q.answer);

  shuffle(fakePool);

  const answers = fakePool.slice(0, 3);

  answers.push(q.answer);

  return shuffle(answers);
}

/* =========================
   UI ANSWERS
========================= */

function generateSmartAnswersUI(q) {

  const optionsEl = document.getElementById("options");

  const answers = generateSmartAnswers(q);

  answers.forEach(answer => {

    const btn = document.createElement("button");

    btn.className = "quiz-answer";
    btn.textContent = answer;

    btn.onclick = () => handleAnswer(btn, answer);

    optionsEl.appendChild(btn);
  });
}

/* =========================
   HANDLE CLICK
========================= */

function handleAnswer(btn, answer) {

  const q = getCurrentQuestion();

  const correct = answer === q.answer;

  if (correct) {

    btn.classList.add("correct");

  } else {

    btn.classList.add("wrong");
  }

  setTimeout(() => {

    checkAnswer(answer);

  }, 400);
}

/* =========================
   CHECK ANSWER (DUOLINGO MODE)
========================= */

function checkAnswer(answer) {

  const q = getCurrentQuestion();

  const correct = answer === q.answer;

  const result = document.getElementById("quiz-result");

  if (correct) {

    score++;
    xp += 10;
    streak++;

    progress += 20;
    if (progress > 100) progress = 100;

    playSound("assets/audio/correct.mp3");

    if (result) result.textContent = "✅ Bonne réponse";

  } else {

    streak = 0;
    lives--;

    playSound("assets/audio/wrong.mp3");

    if (result) result.textContent = "❌ Mauvaise réponse";

    if (lives <= 0) {
      endQuiz();
      return;
    }
  }

  if (xp >= level * 50) {
    level++;
  }

  updateXPUI();
  updateDuoUI();

  setTimeout(nextQuestion, 600);
}

/* =========================
   NEXT QUESTION
========================= */

function nextQuestion() {

  currentIndex++;

  if (currentIndex >= quizData.length) {
    endQuiz();
  } else {
    renderQuestion();
  }
}

/* =========================
   END QUIZ
========================= */

function endQuiz() {

  document.getElementById("question").innerHTML = `
    🎉 Quiz terminé<br><br>
    🏆 Score : ${score}<br>
    ⭐ Niveau : ${level}<br>
    ⚡ XP : ${xp}
  `;

  document.getElementById("options").innerHTML = "";
}

/* =========================
   UI UPDATE XP
========================= */

function updateXPUI() {

  if (document.getElementById("score"))
    document.getElementById("score").textContent = score;

  if (document.getElementById("xp"))
    document.getElementById("xp").textContent = xp;

  if (document.getElementById("streak"))
    document.getElementById("streak").textContent = streak;

  if (document.getElementById("level"))
    document.getElementById("level").textContent = level;
}

/* =========================
   DUOLINGO UI
========================= */

function updateDuoUI() {

  if (document.getElementById("lives"))
    document.getElementById("lives").textContent = lives;

  if (document.getElementById("progress-bar"))
    document.getElementById("progress-bar").style.width = progress + "%";

  saveProgress();
}

/* =========================
   SOUND
========================= */

function playSound(src) {

  const audio = new Audio(src);
  audio.play();
}

/* =========================
   SHUFFLE
========================= */

function shuffle(arr) {

  return arr.sort(() => Math.random() - 0.5);
}

/* =========================
   SAVE SYSTEM
========================= */

function saveProgress() {

  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);
  localStorage.setItem("lives", lives);
  localStorage.setItem("score", score);
}

let xp =
  parseInt(localStorage.getItem("xp")) || 0;

function addXP(amount){

  xp += amount;

  localStorage.setItem("xp", xp);

  document.getElementById("xp-value").textContent = xp;

}