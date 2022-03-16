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
    console.log(el.alt != null);
    if (el.alt.length > 0) imgGroup.push(el.attributes.alt.value);
  });

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
