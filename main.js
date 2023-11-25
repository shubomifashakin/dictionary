import { findWord } from "./helpers/helperFunctions";
import { viewElements } from "./views/_view";

class Form {
  app = document.querySelector("#app");
  formError = document.querySelector(".form-error");
  formIcon = document.querySelector("#mode-icon");
  searchBar = document.querySelector(".search-bar");
  searchForm = document.querySelector("form");

  constructor() {
    //when the user submits the form search
    this.searchForm.addEventListener("submit", this.searchBarCb.bind(this));

    //when the user types anything in the search bar begin searching
    this.searchBar.addEventListener("keyup", this.searchBarCb.bind(this));

    //when the user clicks the icon change the mode
    this.formIcon.addEventListener("click", this.changeMode.bind(this));

    //when the site loads do this
    window.addEventListener("load", this.onLoadSearch.bind(this));
  }

  //when the site loads, it checks if there is a word after the hash, if there is, it searches for the word, if there isnt it does nothing
  onLoadSearch() {
    let currentUrl = new URL(window.location.href);
    const searchParams = currentUrl.searchParams.get("word");
    //if there is no word after the hash, dont do anything
    //insert the word in the url
    if (!searchParams) return;

    //if there is a word after the hash, search for the word
    if (searchParams) {
      this.searchBar.value = searchParams;
      this.handleSearch(searchParams);
    }
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
      let word = this.searchBar.value;
      this.handleSearch(word);
    }
  }

  //handle search data
  handleSearch(word) {
    //searches for the word
    findWord(word)
      .then((data) => {
        //clear the form error
        this.formError.textContent = "";

        //show the content && change the text content of the words
        viewElements.contentContainer.classList.add("content-active");
        viewElements.wordEl.textContent = data.word;
        viewElements.wordTranscription.textContent = data.phonetic;

        //find the object that contains an audio src
        viewElements.audioEl.src = data.phonetics.filter(
          (c) => c.audio
        )[0]?.audio;

        //clear the meanings container of old results
        viewElements.wordDetailsContainer.innerHTML = "";

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
    Antonyms - <span class="antonyms">${meaning.antonyms.join(", ")}</span>
  </p>`
         : ""
     }

     ${
       //if there are synonyms show synonyms
       meaning?.synonyms.length > 0
         ? ` <p class="word-synonyms sub-text">
   Synonyms - <span class="synonyms">${meaning.synonyms.join(", ")}</span>
 </p>`
         : ""
     }
    `;

          //insert the html mark up into the eord details container
          viewElements.wordDetailsContainer.insertAdjacentHTML(
            "beforeend",
            html
          );
        });
      })
      .catch((err) => {
        //show the error on the input
        this.formError.textContent = err;
      });
  }

  //changes the mode of the app
  changeMode(e) {
    if (this.app.classList.contains("dark")) {
      this.toggleColor(
        e,
        "#F3F9E3",
        "#000",
        "light",
        "dark",
        "fa-sun",
        "fa-moon"
      );
    } else {
      this.toggleColor(e, "#000", "#fff", "dark", "light", "fa-moon", "fa-sun");
    }
  }

  toggleColor(e, c1, c2, amode, rmode, aicon, ricon) {
    this.app.classList.remove(rmode);
    this.app.classList.add(amode);
    document.documentElement.style.setProperty("--primary-bg-color", c1);
    document.documentElement.style.setProperty("--primary-text-color", c2);
    document.documentElement.style.setProperty("--search-btn-color", c2);
    e.target.classList.remove(ricon);
    e.target.classList.add(aicon);
  }
}

const app = new Form();
