function generateSmartAnswers(question) {

  // toutes les réponses possibles
  const pool = quizData.map(q => q.answer);

  // retire la bonne réponse
  const fakePool = pool.filter(a => a !== question.answer);

  // mélange
  shuffle(fakePool);

  // prend 3 fausses réponses
  const selected = fakePool.slice(0, 3);

  // ajoute vraie réponse
  selected.push(question.answer);

  // mélange final
  shuffle(selected);

  return selected;
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}