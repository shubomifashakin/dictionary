class View {
  //display element
  contentContainer = document.querySelector(".content");
  wordEl = document.querySelector(".word");
  wordTranscription = document.querySelector(".word-transcription");
  audioIcon = document.querySelector(".audio-icon");
  audioEl = document.querySelector(".audio-el");
  wordDetailsContainer = document.querySelector(".word-details");

  constructor() {
    //when the user clicks the audio icon
    this.audioIcon.addEventListener("click", this.playAudio.bind(this));
  }

  //play the audio
  playAudio() {
    this.audioEl.play();
  }
}

export const viewElements = new View();
