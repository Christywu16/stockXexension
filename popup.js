
// VERSION 2.0.0
// When the popup HTML has loaded
// Send a message to the content script to calculate the payout
// const el = document.getElementById('calculate-payout');
// console.log(el);


function calculatePayout() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    chrome.tabs.sendMessage(tab.id, { action: "calculatePayout" });
  });
}

// Add a click event listener to the "Calculate Payout" button
document.getElementById("calculate-payout").addEventListener("click", calculatePayout);

