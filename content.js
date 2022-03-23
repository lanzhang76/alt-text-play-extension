console.log("hello the extension is on!");

chrome.runtime.sendMessage({
  from: "content",
  subject: "showPageAction",
});

async function getAltTags() {
  var imgElms = document.querySelectorAll("img");
  var imgGroup = [];
  console.log(imgElms);
  imgElms.forEach((el) => {
    if (el.alt.length > 0 && el.attributes.src != null) {
      console.log(el.attributes.src);
      let item = {
        alt: el.attributes.alt.value,
        src:
          el.attributes.src.value[0] == "/"
            ? `${window.location.origin}${el.attributes.src.value}`
            : el.attributes.src.value,
      };
      imgGroup.push(item);
    }
  });
  console.log(imgGroup);
  return imgGroup;
}

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension: " + request.greeting
  );

  let tags = await getAltTags();
  if (request.greeting === "hello") sendResponse({ farewell: tags });
});
