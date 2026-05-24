let state = {
  xp: 0,
  level: 1
};

export function initState() {
  const saved = localStorage.getItem("state");

  if (saved) {
    state = JSON.parse(saved);
  }

  updateUI();
}

export function addXP(amount) {
  state.xp += amount;

  if (state.xp >= state.level * 50) {
    state.xp = 0;
    state.level++;
    alert("🔥 LEVEL UP !");
  }

  save();
  updateUI();
}

function save() {
  localStorage.setItem("state", JSON.stringify(state));
}

function updateUI() {
  const xp = document.getElementById("xp");
  const level = document.getElementById("level");

  if (xp) xp.textContent = state.xp;
  if (level) level.textContent = state.level;
}