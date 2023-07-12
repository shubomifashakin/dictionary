import { findWord } from "../helpers/helperFunctions.js";

class View {
  app = document.querySelector("#app");
  formError = document.querySelector(".form-error");
  formIcon = document.querySelector("#mode-icon");
  searchBar = document.querySelector(".search-bar");
  searchForm = document.querySelector("form");

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

    //when the user submits the form search
    this.searchForm.addEventListener("submit", this.searchBarCb.bind(this));

    //when the user types anything in the search bar begin searching
    this.searchBar.addEventListener("keyup", this.searchBarCb.bind(this));

    this.formIcon.addEventListener("click", this.changeMode.bind(this));
  }

  //play the audio
  playAudio() {
    this.audioEl.play();
  }

  searchBarCb(e) {
    e.preventDefault();
    //if the user clicked a non-letter and the searchbar is empty
    if (
      !/[a-z]/gi.test(e.key) &&
      e.key.length != 1 &&
      !e.target.classList.contains("input-search-bar") &&
      !this.searchBar.value
    )
      return;

    //if the user entered a letter and there is a value entered in the search bar
    if (
      (/[a-z]/gi.test(e?.key) && e?.key?.length === 1) ||
      this.searchBar.value
    ) {
      this.handleSearch();
    }
  }

  //handle search data
  handleSearch() {
    const word = this.searchBar.value;
    findWord(word)
      .then((data) => {
        //clear the form error
        this.formError.textContent = "";

        //show the content change the text content of the words
        this.contentContainer.classList.add("content-active");
        this.wordEl.textContent = data.word;
        this.wordTranscription.textContent = data.phonetic;

        //find the object that contains an audio src
        this.audioEl.src = data.phonetics.filter((c) => c.audio)[0]?.audio;

        //clear the meanings container
        this.wordDetailsContainer.innerHTML = "";

        //render the meanings
        data.meanings.forEach((meaning) => {
          const html = `
        <!--- display the part of speech-->
    <div class="word-meaning">
      <p class="word-part-of-speech">${meaning.partOfSpeech}</p>

    <!--render definitions-->

      ${meaning.definitions
        .map((def, i) => {
          //for each definition found create this div element with the definition
          return ` <div class="word-definition">
        <p class="definition">
        <span class="definition-no">${i + 1}.</span>
        ${def.definition}
      </p>
    
      ${
        //if there is an example render the example
        def?.example
          ? ` <p class="word-example-sentence sub-text">
      example sentence - <span class="sentence-text">${def.example}</span>
    </p>`
          : ""
      }

      </div>`;
        })
        .join("")}

     ${
       //if there are antonyms, show the antonyms
       meaning?.antonyms.length > 0
         ? ` <p class="word-antonyms sub-text">
    Antonyms - <span class="antonyms">${meaning.antonyms.join(",")}</span>
  </p>`
         : ""
     }

     ${
       meaning?.synonyms.length > 0
         ? ` <p class="word-synonyms sub-text">
   Synonyms - <span class="synonyms">${meaning.synonyms.join(", ")}</span>
 </p>`
         : ""
     }
    `;

          this.wordDetailsContainer.insertAdjacentHTML("beforeend", html);
        });
      })
      .catch((err) => {
        //show the error on the input
        this.formError.textContent = err;
      });
  }

  changeMode(e) {
    if (e.target.classList.contains("fa-moon")) {
      e.target.classList.remove("fa-moon");
      e.target.classList.add("fa-sun");
    } else {
      e.target.classList.remove("fa-sun");
      e.target.classList.add("fa-moon");
    }

    if (this.app.classList.contains("dark")) {
      //change the bg color to white
      this.toggleColor("#F3F9E3", "#000", "light", "dark");
    } else {
      this.toggleColor("#000", "#fff", "dark", "light");
    }
  }

  toggleColor(c1, c2, amode, rmode) {
    this.app.classList.remove(rmode);
    this.app.classList.add(amode);
    document.documentElement.style.setProperty("--primary-bg-color", c1);
    document.documentElement.style.setProperty("--primary-text-color", c2);
    document.documentElement.style.setProperty("--search-btn-color", c2);
  }
}

const view = new View();
