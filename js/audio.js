const audioPlayer = new Audio();

function playAudio(path) {
  audioPlayer.src = path;
  audioPlayer.play();
}

function stopAudio() {
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
}