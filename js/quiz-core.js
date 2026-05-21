let currentIndex = 0;
let score = 0;

function getCurrentQuestion() {
  return quizData[currentIndex];
}

function checkAnswer(userAnswer) {
  const q = getCurrentQuestion();

  if (userAnswer === q.answer) {
    score++;
    nextQuestion(true);
  } else {
    nextQuestion(false);
  }
}

function nextQuestion(correct) {
  currentIndex++;

  if (currentIndex >= quizData.length) {
    endQuiz();
  } else {
    renderQuestion(correct);
  }
}

function endQuiz() {
  document.getElementById("question").innerHTML =
    `🎉 Fin du quiz<br>Score: ${score}/${quizData.length}`;
}

let currentIndex = 0;

let xp = 0;
let level = 1;
let streak = 0;

function getCurrentQuestion() {
  return quizData[currentIndex];
}

function checkAnswer(answer) {

  const q = getCurrentQuestion();

  const correct = answer === q.answer;

  if (correct) {

    xp += 10;
    streak++;

    // bonus streak
    if (streak >= 5) {
      xp += 5;
    }

    // level up
    if (xp >= level * 50) {
      level++;
    }

  } else {

    streak = 0;
  }

  updateXPUI();

  nextQuestion();
}

function nextQuestion() {

  currentIndex++;

  if (currentIndex >= quizData.length) {

    endQuiz();

  } else {

    renderQuestion();
  }
}

function endQuiz() {

  document.getElementById("question").innerHTML = `
    <div class="end-screen">
      🎉 Quiz terminé
      <br><br>
      ⭐ Niveau : ${level}
      <br>
      ⚡ XP : ${xp}
    </div>
  `;

  document.getElementById("options").innerHTML = "";
}