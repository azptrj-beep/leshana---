function renderQuestion(lastCorrect = null) {
  const q = getCurrentQuestion();

  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");

  optionsEl.innerHTML = "";

  // FEEDBACK
  if (lastCorrect === true) {
    questionEl.style.color = "lightgreen";
  } else if (lastCorrect === false) {
    questionEl.style.color = "red";
  } else {
    questionEl.style.color = "white";
  }

  // TYPES
  if (q.type === "letter") {
    questionEl.textContent = q.question;
  }

  if (q.type === "image") {
    questionEl.innerHTML = `<img src="${q.src}" width="180">`;
  }

  if (q.type === "audio") {
    questionEl.innerHTML = `
      <button onclick="playAudio('${q.src}')">
        🔊 Écouter
      </button>
    `;
  }

  // EXEMPLES de réponses (simple version)
  generateFakeAnswers(q);
}

function generateFakeAnswers(q) {
  const options = document.getElementById("options");

  const fake = ["apple", "word", "Alap", "dog", "car"];
  const answers = [...fake.slice(0, 3), q.answer];

  shuffle(answers);

  answers.forEach(a => {
    const btn = document.createElement("button");
    btn.textContent = a;
    btn.onclick = () => checkAnswer(a);
    options.appendChild(btn);
  });
}

function shuffle(arr) {
  arr.sort(() => Math.random() - 0.5);
}