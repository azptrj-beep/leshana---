"use strict";

let activeInput = null;

/* capture input même en mobile */
document.addEventListener("focusin", (e) => {
  if (e.target.matches("input, textarea")) {
    activeInput = e.target;
  }
});

/* fallback mobile (TRÈS IMPORTANT) */
document.addEventListener("click", (e) => {
  if (e.target.matches("input, textarea")) {
    activeInput = e.target;
  }
});

/* insert letter */
function pressKey(letter) {
  const input = activeInput || document.activeElement;

  if (!input || !(input.tagName === "INPUT" || input.tagName === "TEXTAREA")) {
    return;
  }

  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;

  input.value =
    input.value.slice(0, start) +
    letter +
    input.value.slice(end);

  const pos = start + letter.length;

  input.setSelectionRange(pos, pos);
  input.focus();
}

function deleteKey() {
  const input = activeInput || document.activeElement;

  if (!input || !(input.tagName === "INPUT" || input.tagName === "TEXTAREA")) {
    return;
  }

  const start = input.selectionStart;
  const end = input.selectionEnd;

  if (start === end && start > 0) {
    input.value =
      input.value.slice(0, start - 1) +
      input.value.slice(end);
    input.setSelectionRange(start - 1, start - 1);
  } else {
    input.value =
      input.value.slice(0, start) +
      input.value.slice(end);
    input.setSelectionRange(start, start);
  }

  input.focus();
}

window.pressKey = pressKey;
window.deleteKey = deleteKey;