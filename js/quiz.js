/* ============================================
   QUIZ.JS — Logique du quiz
============================================ */

const quizBox = document.querySelector(".quiz-box");
const options = document.querySelectorAll(".quiz-options button");

if (quizBox && options.length > 0) {

    options.forEach(btn => {
        btn.addEventListener("click", () => {
            const correct = btn.dataset.correct === "true";

            btn.style.background = correct
                ? "linear-gradient(135deg, #00ff88, #00cc66)"
                : "linear-gradient(135deg, #ff4444, #cc0000)";

            setTimeout(() => {
                location.reload();
            }, 900);
        });
    });
}