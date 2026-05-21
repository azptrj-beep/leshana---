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