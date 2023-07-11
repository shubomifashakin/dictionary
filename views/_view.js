import { findWord } from "../helpers/helperFunctions.js";

const formError = document.querySelector(".form-error");
const searchBar = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search-btn");
const searchForm = document.querySelector("form");

//display element
const contentContainer = document.querySelector(".content");
const wordEl = document.querySelector(".word");
const wordTranscription = document.querySelector(".word-transcription");
const audioIcon = document.querySelector(".audio-icon");
const audioEl = document.querySelector(".audio-el");
const wordDetailsContainer = document.querySelector(".word-details");

audioIcon.addEventListener("click", function () {
  audioEl.play();
});

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!searchBar.value) return;
  if (searchBar.value) {
    const word = searchBar.value;
    findWord(word)
      .then((data) => {
        formError.textContent = "";
        console.log(data);
        //change the text content of the words
        contentContainer.classList.add("content-active");
        wordEl.textContent = data.word;
        wordTranscription.textContent = data.phonetic;

        //find the object that contains an audio src
        audioEl.src = data.phonetics.filter((c) => c.audio)[0]?.audio;

        //clear the meanings container
        wordDetailsContainer.innerHTML = "";

        data.meanings.forEach((meaning) => {
          const html = `
      <div class="word-meaning">
        <p class="word-part-of-speech">${meaning.partOfSpeech}</p>

      <!--render definitions-->

        ${meaning.definitions
          .map((def, i) => {
            return ` <div class="word-definition">
          <p class="definition">
          <span class="definition-no">${i + 1}.</span>
          ${def.definition}
        </p>

        ${
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

          wordDetailsContainer.insertAdjacentHTML("beforeend", html);
        });
      })
      .catch((err) => {
        formError.textContent = err;
        console.log(err);
      });
  }
});
