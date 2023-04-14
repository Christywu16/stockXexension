
// VERSION 2.0.0
// Listen for messages from the content script
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   // If the message is to open the popup
//   if (request.message === "open_popup") {
//     // Create a new window to open the popup
//     chrome.windows.create({
//       url: chrome.runtime.getURL("popup.html"),
//       type: "popup",
//       width: 400,
//       height: 600,
//     });
//   }
// });
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed!");
});

chrome.browserAction.onClicked.addListener(() => {
  console.log("Extension created!");
  chrome.tabs.create({ url: "https://stockx.com/" });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "calculatePayout") {
    console.log("Calculating payout...");
    // Your code for calculating payout here
  }
});
