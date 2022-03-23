chrome.runtime.sendMessage({
  from: "content",
  subject: "showPageAction",
});

async function getAltTags() {
  var imgElms = document.querySelectorAll("img");
  var imgGroup = [];
  imgElms.forEach((el) => {
    if (el.alt.length > 0 && el.attributes.src != null) {
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
  return imgGroup;
}

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  // console.log(
  //   sender.tab
  //     ? "from a content script:" + sender.tab.url
  //     : "from the extension: " + request.greeting
  // );

  let tags = await getAltTags();
  if (request.greeting === "hello") sendResponse({ farewell: tags });
});
