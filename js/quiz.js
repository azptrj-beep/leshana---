import { addXP } from "./state.js";

const questions = [
  { q: "ܐ", a: "A" },
  { q: "ܒ", a: "B" }
];

let index = 0;

export function initQuiz() {
  render();
}

function render() {
  const q = document.getElementById("question");
  const options = document.getElementById("options");

  if (!q || !options) return;

  q.textContent = questions[index].q;

  options.innerHTML = "";

  ["A", "B", "C", "D"].forEach(opt => {
    const btn = document.createElement("button");

    btn.textContent = opt;

    btn.onclick = () => check(opt);

    options.appendChild(btn);
  });
}

function check(answer) {
  if (answer === questions[index].a) {
    addXP(10);
  }

  index = (index + 1) % questions.length;
  render();
}