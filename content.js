// VERSION 2.0.0
// Listen for navigation to the StockX website
// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "calculatePayout") {
      // Get the name and size of the item
      let name = document.querySelector(".title").textContent.trim();
      let size = "";
      if (document.querySelector("#menu-button-pdp-size-selector")) {
        size = document.querySelector("#menu-button-pdp-size-selector > span").textContent.trim();
      }
      // Get the price of the item
      let priceString = document.querySelector(".stats > .title").textContent.trim();
      let price = Number(priceString.replace(/[^0-9.-]+/g, ""));
      // Calculate the payout
      let level = document.querySelector(".seller-level-number").textContent.trim();
      let fee = 0;
      switch (level) {
        case "1":
          fee = 0.1;
          break;
        case "2":
          fee = 0.095;
          break;
        case "3":
          fee = 0.09;
          break;
        case "4":
          fee = 0.085;
          break;
        case "5":
          fee = 0.08;
          break;
      }
      let payout = price - price * fee - 0.03 * price - 4;
      // Send the payout information back to the popup
      sendResponse({
        name: name,
        size: size,
        price: price,
        payout: payout
      });
    }
  });
  

// VERSION 1.0.0
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.type === "GET_ITEM_DATA") {
//       const itemData = {};
  
//       // Get the item name
//       itemData.name = document.querySelector("h1").innerText.trim();
  
//       // Get the item price
//       itemData.price = parseFloat(document.querySelector("#product-details > div:nth-child(1) > div > div.product-header__details-right > div.product-header__price > span").innerText.replace(/[^0-9.]/g, ""));
  
//       // Check if the item has multiple size options
//       const sizeSelector = document.querySelector("#menu-button-pdp-size-selector");
//       if (sizeSelector) {
//         // Get the selected size
//         itemData.size = document.querySelector("#menu-button-pdp-size-selector > div > div").innerText.trim();
//       }
  
//       sendResponse({ success: true, data: itemData });
//     }
  
//     return true;
//   });
  
// // Step 1: Check if the user is on the StockX website

// if (window.location.href.startsWith("https://stockx.com/")) {
//   // Step 2: Checking if the user is on a product page

//   if (window.location.href.startsWith("https://stockx.com/products/")) {
//     // The user is on a product page
//     // Call your function to capture item information and calculate the payout
//     const payout = calculatePayout();
//     // Display the payout in a pop-up
//     showPayout(payout);
//   }
// }

// // Step 3: Capturing item information and calculating the payout

// function calculatePayout() {
//   // Get the item name and size
//   const itemName = document.querySelector("h1").innerText.trim();
//   const itemSize = document.querySelector("#product-details > div:nth-child(1) > div > div.product-header__details-right > span").innerText.trim();

//   // Calculate the payout
//   const fixedFee = 0.03;
//   const shippingCost = 4;
//   const level1Fee = 0.1;
//   const level2Fee = 0.095;
//   const level3Fee = 0.09;
//   const level4Fee = 0.085;
//   const level5Fee = 0.08;

//   let baseFee;
//   // Determine the appropriate base fee based on the item price
//   // Replace this code with your own logic for determining the base fee
//   const itemPrice = parseFloat(document.querySelector("#product-details > div:nth-child(1) > div > div.product-header__details-right > div.product-header__price > span").innerText.replace(/[^0-9.]/g, ""));
//   if (itemPrice < 500) {
//     baseFee = level1Fee;
//   } else if (itemPrice < 1000) {
//     baseFee = level2Fee;
//   } else if (itemPrice < 5000) {
//     baseFee = level3Fee;
//   } else if (itemPrice < 10000) {
//     baseFee = level4Fee;
//   } else {
//     baseFee = level5Fee;
//   }

//   const payout = itemPrice * (1 - (fixedFee + baseFee)) - shippingCost;
//   return { itemName, itemSize, payout };
// }

// // Step 4: Displaying the payout in a pop-up or notification

// function showPayout(payout) {
//   const popup = document.createElement("div");
//   popup.style.position = "fixed";
//   popup.style.bottom = "10px";
//   popup.style.right = "10px";
//   popup.style.padding = "10px";
//   popup.style.backgroundColor = "#fff";
//   popup.style.border = "1px solid #ccc";
//   popup.style.boxShadow = "2px 2px 6px rgba(0, 0



// // Define a function that extracts the item name and size from the StockX.com page.
// function getItemDetails() {
//     var itemTitle = document.querySelector('.title').innerText;
//     var sizeOption = document.querySelector('#menu-button-pdp-size-selector');
//     console.log(itemTitle)
//     console.log(sizeOption)
//     if (!sizeOption) {
//       // If the item has only one size option, return the title only.
//       console.log(itemTitle)
//       return { title: itemTitle };
      

//     }
//     // If the item has multiple size options, get the selected size from the dropdown menu.
//     var itemSize = sizeOption.innerText.trim();
//     return { title: itemTitle, size: itemSize };
//   }
  
//   // Define a function that calculates the payout based on the sale price and seller level.
//   function calculatePayout(salePrice, sellerLevel) {
//     var feePercentage = 0;
//     if (sellerLevel == 1) {
//       feePercentage = 0.1;
//     } else if (sellerLevel == 2) {
//       feePercentage = 0.095;
//     } else if (sellerLevel == 3) {
//       feePercentage = 0.09;
//     } else if (sellerLevel == 4) {
//       feePercentage = 0.085;
//     } else if (sellerLevel == 5) {
//       feePercentage = 0.08;
//     }
//     var processFee = salePrice * 0.03;
//     var transactionFee = salePrice * feePercentage;
//     var payout = salePrice - processFee - transactionFee - 4;
//     return payout.toFixed(2);
//   }
  
//   // Define a function that displays the payout to the user.
//   function displayPayout(payout) {
//     var payoutElement = document.createElement('div');
//     payoutElement.innerHTML = 'Payout: $' + payout;
//     payoutElement.style.position = 'fixed';
//     payoutElement.style.bottom = '10px';
//     payoutElement.style.left = '10px';
//     payoutElement.style.padding = '10px';
//     payoutElement.style.backgroundColor = '#FFC107';
//     document.body.appendChild(payoutElement);
//     setTimeout(function() {
//       payoutElement.remove();
//     }, 3000);
//   }
  
//   // Attach a click event listener to the StockX.com page, so that when the user clicks on an item, the extension will capture the item details and calculate the payout.
//   document.addEventListener('click', function(event) {
//     var clickedElement = event.target;
//     var isProductLink = clickedElement.classList.contains('product-link');
//     if (isProductLink) {
//       var itemDetails = getItemDetails();
//       var salePriceElement = document.querySelector('.chakra-text.css-cptlwn') || document.querySelector('.chakra-stat__number.css-kqs993');
//       var salePrice = parseFloat(salePriceElement.innerText.replace('$', ''));
//       var sellerLevel = parseInt(document.querySelector('.seller-level').innerText.replace('Seller Level ', ''));
//       var payout = calculatePayout(salePrice, sellerLevel);
//       displayPayout(payout);
//     }
//   });




// // Define the seller fee levels
// const sellerFees = [
//     0.1, // Level 1
//     0.095, // Level 2
//     0.09, // Level 3
//     0.085, // Level 4
//     0.08 // Level 5
//   ];
  
//   // Find the item name element
//   const itemNameElem = document.querySelector(".title");
  
//   // Find the item size elements
//   const itemSizeElems = document.querySelectorAll(".size-dropdown .select-item");
  
//   // Find the item price element
//   let itemPriceElem = document.querySelector(".chakra-text.css-cptlwn");
//   if (!itemPriceElem) {
//     itemPriceElem = document.querySelector(".chakra-stat__number.css-kqs993");
//   }
  
//   // Get the item name and size
//   const itemName = itemNameElem ? itemNameElem.innerText : "";
//   const itemSizes = Array.from(itemSizeElems).map(elem => elem.innerText);
  
//   // Calculate the payout for each size
//   const payouts = itemSizes.map(itemSize => {
//     const sellerFee = sellerFees[4]; // Default to level 5 fee
//     if (itemPriceElem) {
//       const itemPrice = parseFloat(itemPriceElem.innerText.replace("$", ""));
//       const processingFee = itemPrice * 0.03; // 3% processing fee
//       const shippingCost = 4; // Fixed shipping cost
//       const subtotal = itemPrice + processingFee + shippingCost;
//       if (subtotal >= 2500) {
//         sellerFee = sellerFees[0];
//       } else if (subtotal >= 1000) {
//         sellerFee = sellerFees[1];
//       } else if (subtotal >= 500) {
//         sellerFee = sellerFees[2];
//       } else if (subtotal >= 250) {
//         sellerFee = sellerFees[3];
//       }
//     }
//     const payout = itemPrice ? (itemPrice * (1 - sellerFee) - 4).toFixed(2) : "";
//     return {
//       size: itemSize || "one size",
//       payout: payout
//     };
//   });
  
//   // Send the payout data to the background script
//   chrome.runtime.sendMessage({
//     itemName: itemName,
//     payouts: payouts
//   });