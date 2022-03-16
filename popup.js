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
  // chrome.tabs
  //   .query({ active: true, currentWindow: true })
  //   .then((tabs) => {
  //     new Promise((resolve, reject) => {
  //       try {
  //         console.log(tabs[0]);
  //         return chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" });
  //       } catch (e) {
  //         reject(e);
  //       }
  //     });

  //     //   return chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" });
  //   })

  //   .then((response) => {
  //     console.log(response);
  //     displayList(response.farewell);
  //   });

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { greeting: "hello" },
      async function (response) {
        altTextGroup = await response.farewell;
        displayList(altTextGroup);
      }
    );
  });
});

function displayList(altTextGroup) {
  altTextGroup.forEach((altText) => {
    let altP = document.createElement("li");
    altP.innerText = altText;
    altList.appendChild(altP);
  });
  altList.classList.add("active");
}
