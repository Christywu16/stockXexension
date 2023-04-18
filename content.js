// // Identify the item's name and whether it has one size or multiple sizes
// const itemName = document.querySelector('title').innerText;
// let oneSize = false;
// let sizes = [];
// if (document.querySelector('.chakra-text.css-cptlwn')) {
//   oneSize = true;
// } else {
//   const sizeElements = document.querySelectorAll('.chakra-stat__label.css-1i4uumw');
//   for (let i = 0; i < sizeElements.length; i++) {
//     sizes.push(sizeElements[i].innerText);
//   }
// }

// // Scrape the item's price and size information and store it in an object
// let price = 0;
// if (oneSize) {
//   price = parseFloat(document.querySelector('.chakra-text.css-cptlwn').innerText.slice(1));
// } else {
//   const priceElements = document.querySelectorAll('.chakra-stat__number.css-kqs993');
//   for (let i = 0; i < priceElements.length; i++) {
//     const size = sizes[i];
//     const sizePrice = parseFloat(priceElements[i].innerText.slice(1));
//     price[size] = sizePrice;
//   }
// }
// const item = {
//   name: itemName,
//   oneSize: oneSize,
 
// }

// This code is executed in the context of the page

// Wait for the window to load completely
window.addEventListener("load", function() {
  // Get the item name from the <title> tag
  var itemName = document.title;

  // Check if the item has multiple sizes or just one size
  var itemSizes = document.querySelectorAll(".chakra-stat__label.css-1i4uumw");
  var itemPrices = document.querySelectorAll(".chakra-stat__number.css-kqs993");

  // If there are no sizes, it means it's a one-size item
  if (itemSizes.length === 0) {
    itemSizes = ["One Size"];
    itemPrices = [document.querySelector(".chakra-text.css-cptlwn").textContent.trim()];
  } else {
    // Get the item sizes and prices
    var tempSizes = [];
    var tempPrices = [];
    for (var i = 0; i < itemSizes.length; i++) {
      tempSizes.push(itemSizes[i].textContent.trim());
      tempPrices.push(itemPrices[i].textContent.trim());
    }
    itemSizes = tempSizes;
    itemPrices = tempPrices;
  }

  // Send a message to the background script with the item name, sizes, and prices
  chrome.runtime.sendMessage({
    action: "getItemInfo",
    itemName: itemName,
    itemSizes: itemSizes,
    itemPrices: itemPrices
  });

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "updatePopup") {
      // Populate the popup.html file with the item information
      document.querySelector("#itemName").textContent = request.itemName;
      var tableBody = document.querySelector("#itemTable tbody");
      tableBody.innerHTML = "";
      for (var i = 0; i < request.itemSizes.length; i++) {
        var newRow = tableBody.insertRow();
        var sizeCell = newRow.insertCell();
        sizeCell.textContent = request.itemSizes[i];
        var payoutCell = newRow.insertCell();
        payoutCell.textContent = request.itemPayouts[i];
        var priceCell = newRow.insertCell();
        priceCell.textContent = request.itemPrices[i];
      }
    }
  });
});
