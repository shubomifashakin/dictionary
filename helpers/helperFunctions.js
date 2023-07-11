export async function findWord(word) {
  try {
    const response = await Promise.race([
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`),
      timeOut(),
    ]);

    //if the response failed, the word was not found
    if (!response.ok) {
      throw new Error("word not found");
    }

    //extract the data
    const data = await response.json();

    return data[0];
  } catch (err) {
    console.log(err);

    throw new Error(err);
  }
}

function timeOut() {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      return reject(new Error("Request Took too long"));
    }, 10000);
  });
}
