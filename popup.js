altButton.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { greeting: "hello" },
      async function (response) {
        altTextGroup = await response.farewell;
        let alt = [];
        // console.log(altTextGroup);
        altTextGroup.forEach((altGroup) => {
          alt.push(altGroup.alt);
        });
        displayList(alt);
      }
    );
  });
});

rawButton.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { greeting: "hello" },
      async function (response) {
        altTextGroup = await response.farewell;

        altList.classList.remove("haiku");
        altList.innerHTML = "";
        altTextGroup.forEach((altText) => {
          let altP = document.createElement("span");
          let srcP = document.createElement("span");

          altP.innerText = `{alt:"${altText.alt.replace(/[^a-zA-Z]+$/g, "")}",`;
          srcP.innerText = `src:"${altText.src}"},`;
          altList.appendChild(altP);
          altList.appendChild(srcP);
        });
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
        let altTextArr = [];
        altTextGroup.forEach((altText) => {
          // console.log(altText.alt);
          altTextArr.push(altText.alt.toLowerCase());
        });
        haiku(altTextArr.join(" "));
      }
    );
  });
});

function displayList(altTextGroup) {
  altList.classList.remove("haiku");
  altList.innerHTML = "";
  altTextGroup.forEach((altText) => {
    let altP = document.createElement("li");
    altP.innerText = altText.replace(/[^a-zA-Z]+$/g, "");
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
