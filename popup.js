let library = {
  nouns: [],
  prepositions: [],
  verbs: [],
  adjectives: [],
  determiners: [],
  adverbs: [],
  pronoun: [],
  conjunction: [],
  nextLine: ["\n"],
  pause: [","],
};

let INDEX = 1;

let formats = {
  0: [
    "determiners",
    "nouns",
    "prepositions",
    "nouns",
    "nextLine",
    "verbs",
    "determiners",
    "nouns",
    "nextLine",
    "determiners",
    "nouns",
    "pause",
    "adjectives",
    "nouns",
    "pause",
    "prepositions",
    "pronoun",
    "nextLine",
    "verbs",
    "nouns",
  ],
  1: [
    "determiners",
    "adjectives",
    "nouns",
    "verbs",
    "adverbs",
    "prepositions",
    "determiners",
    "nouns",
  ],
  2: [
    // the men of earth chase crazily the rising sun
    "determiners",
    "nouns",
    "prepositions",
    "nouns",
    "verbs",
    "adverbs",
    "determiners",
    "adjectives",
    "nouns",
  ],
  3: [
    // hapiness is a used book store,
    // hot coffee and dusty old records
    "nouns",
    "verbs",
    "determiners",
    "adjectives",
    "nouns",
    "nextLine",
    "adjectives",
    "nouns",
    "conjunction",
    "adjectives",
    "nouns",
  ],
};

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });
});

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}

altButton.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { greeting: "hello" },
      async function (response) {
        altTextGroup = await response.farewell;
        // displayList(altTextGroup);
        console.log("hello");
        processText(altTextGroup);
        generateSentences(5, INDEX);
      }
    );
  });
});
