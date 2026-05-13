
const dictionary = {

  "bonjour": "ܫܠܡܐ",
  "maison": "ܒܝܬܐ",
  "eau": "ܡܝܐ",
  "roi": "ܡܠܟܐ",
  "paix": "ܫܠܡܐ"

};

function translate() {

  const input = document
    .getElementById('frInput')
    .value
    .toLowerCase();

  const result = dictionary[input]
    || 'Mot non trouvé';

  document.getElementById('result')
    .innerText = result;
}
