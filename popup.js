gsap.fromTo(["#title", "#intro"], 1, { opacity: 0 }, { opacity: 1 });

altButton.addEventListener("click", () => {
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

generateButton.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { greeting: "hello" },
      async function (response) {
        altTextGroup = await response.farewell;
        makeHaiku(altTextGroup);
      }
    );
  });
});

function displayList(altTextGroup) {
  altList.classList.remove("haiku");
  altList.innerHTML = "";
  altTextGroup.forEach((altText) => {
    let altP = document.createElement("li");
    altP.innerText = altText;
    altList.appendChild(altP);
  });
}

function makeHaiku(altTextGroup) {
  altList.classList.add("haiku");
  altList.innerHTML = "";

  let altP = document.createElement("p");
  altP.innerText = "Hello Hello \n Hello Hello Hello \n Hello Hello";
  altList.appendChild(altP);
}
