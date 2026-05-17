document.addEventListener("DOMContentLoaded", () => {

  console.log("🟢 Quiz JS chargé");

  const letters = [
    { letter: "ܐ", answer: "Alap" },
    { letter: "ܒ", answer: "Beith" },
    { letter: "ܓ", answer: "Gamal" },
    { letter: "ܕ", answer: "Dalath" }
  ];

  const quizLetter = document.getElementById("quiz-letter");
  const quizAnswers = document.getElementById("quiz-answers");
  const scoreEl = document.getElementById("score");
  const xpEl = document.getElementById("xp");

  let score = 0;
  let xp = 0;

  function loadQuestion() {

    const current =
      letters[Math.floor(Math.random() * letters.length)];

    quizLetter.textContent = current.letter;

    quizAnswers.innerHTML = "";

    const shuffled =
      [...letters].sort(() => Math.random() - 0.5);

    shuffled.forEach(item => {

      const btn = document.createElement("button");
btn.type = "button"; // 👈 IMPORTANT

    
      btn.textContent = item.answer;
      btn.className = "quiz-btn";

      btn.style.display = "block";
      btn.style.margin = "10px auto";
      btn.style.padding = "12px 20px";
      btn.style.borderRadius = "10px";
      btn.style.border = "none";
      btn.style.cursor = "pointer";

      btn.onclick = () => {

        if (item.answer === current.answer) {

          score++;
          xp += 10;

          scoreEl.textContent = score;
          xpEl.textContent = xp;

          alert("✅ Bonne réponse");

        } else {

          alert("❌ Mauvaise réponse");

        }

        loadQuestion();

      };

      quizAnswers.appendChild(btn);
    });
  }

  loadQuestion();

});