let dictionary =
  JSON.parse(localStorage.getItem("dict")) || {};

function save() {
  localStorage.setItem(
    "dict",
    JSON.stringify(dictionary)
  );
}

function addWord() {
  const fr = document.getElementById("fr").value.trim();
  const syr = document.getElementById("syr").value.trim();

  if (!fr || !syr) return;

  dictionary[fr] = syr;

  save();
  render();

  document.getElementById("fr").value = "";
  document.getElementById("syr").value = "";
}

function deleteWord(key) {
  delete dictionary[key];
  save();
  render();
}

function render() {
  const list = document.getElementById("list");

  list.innerHTML = "";

  for (const key in dictionary) {
    list.innerHTML += `
      <div class="item">
        <div>${key} → ${dictionary[key]}</div>
        <div class="actions">
          <button onclick="deleteWord('${key}')">X</button>
        </div>
      </div>
    `;
  }
}

function exportJSON() {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(
      JSON.stringify(dictionary, null, 2)
    );

  const a = document.createElement("a");
  a.href = dataStr;
  a.download = "dictionary.json";
  a.click();
}

render();