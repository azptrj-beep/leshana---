"use strict";

const dictionary = require("../database/dictionary.json");

// 🧠 mini IA contextuelle
function translateAI(sentence) {

  const words = sentence
    .toLowerCase()
    .trim()
    .split(" ");

  let translated = [];

  for (const word of words) {

    // dictionnaire
    if (dictionary[word]) {
      translated.push(dictionary[word]);
    }

    // mot inconnu
    else {
      translated.push(`(${word})`);
    }
  }

  return applyGrammarRules(translated);
}

// ✍️ logique grammaticale simplifiée
function applyGrammarRules(words) {

  // futur emplacement :
  // sujet / verbe / complément
  // conjugaison
  // pluriel
  // accords

  return words.join(" ");
}

module.exports = {
  translateAI
};