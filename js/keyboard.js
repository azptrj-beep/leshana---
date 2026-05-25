"use strict";

function pressKey(letter){

  const input =
    document.getElementById("frInput");

  if(!input) return;

  const start = input.selectionStart;
  const end = input.selectionEnd;

  input.value =
    input.value.substring(0,start)
    + letter
    + input.value.substring(end);

  input.selectionStart =
    input.selectionEnd =
    start + letter.length;

  input.focus();
}

window.pressKey = pressKey;