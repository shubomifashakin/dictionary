export async function findWord(word) {
  try {
    //if the fetch takes too long the search times out
    const response = await Promise.race([
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`),
      timeOut(),
    ]);

    //if the response failed, the word was not found
    if (!response.ok) {
      throw new Error("word not found");
    }

    //insert the word in the url

    //get the url
    let currentUrl = new URL(window.location.href);
    // Add a word to the search parameter
    currentUrl.searchParams.set("word", word);
    // Replace the current URL with the modified one
    window.history.replaceState({}, "", currentUrl.href);

    //extract the data
    const data = await response.json();

    return data[0];
  } catch (err) {
    throw err;
  }
}

function timeOut() {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      return reject(new Error("Request Took too long"));
    }, 10000);
  });
}
