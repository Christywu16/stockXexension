// // // Get the current tab's URL
// // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
// //   var tabURL = tabs[0].url;

// //   // Check if the current tab is on stockx.com
// //   if (tabURL.startsWith("https://stockx.com/")) {
// //     // Enable the calculate payout button
// //     document.getElementById("calculate-button").disabled = false;

// //     // When the calculate payout button is clicked
// //     document.getElementById("calculate-button").addEventListener("click", function () {
// //       // Get the seller level from the dropdown menu
// //       var sellerLevel = document.getElementById("seller-level").value;

// //       // Send a message to the content script to scrape the item information
// //       chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
// //         chrome.tabs.sendMessage(tabs[0].id, { message: "scrapeItemInfo" }, function (response) {
// //           // Display the item name
// //           document.getElementById("item-name").innerHTML = "<h2>" + response.itemName + "</h2>";

// //           // Display the payout table
// //           var payoutTable = document.getElementById("payout-table");
// //           payoutTable.style.display = "block";

// //           // Clear any existing rows from the payout table
// //           var rowCount = payoutTable.rows.length;
// //           for (var i = rowCount - 1; i > 0; i--) {
// //             payoutTable.deleteRow(i);
// //           }

// //           // Calculate and display the payout for each size
// //           if (response.sizes.length > 1) {
// //             for (var i = 0; i < response.sizes.length; i++) {
// //               var size = response.sizes[i];
// //               var price = response.prices[i];
// //               var originalPrice = response.originalPrices[i];
// //               var payout = calculatePayout(price, sellerLevel);
// //               var originalPayout = calculatePayout(originalPrice, sellerLevel);

// //               // Create a new row in the payout table for the size
// //               var newRow = payoutTable.insertRow(-1);
// //               var sizeCell = newRow.insertCell(0);
// //               sizeCell.innerHTML = size;

// //               // Add the payout and original payout cells to the row
// //               newRow.insertCell(1).innerHTML = "$" + payout.toFixed(2);
// //               newRow.insertCell(2).innerHTML = "$" + originalPayout.toFixed(2);
// //             }
// //           }
// //           // Calculate and display the payout for one size item
// //           else {
// //             var size = "One size";
// //             var price = response.prices[0];
// //             var originalPrice = response.originalPrices[0];
// //             var payout = calculatePayout(price, sellerLevel);
// //             var originalPayout = calculatePayout(originalPrice, sellerLevel);

// //             // Create a new row in the payout table for the item
// //             var newRow = payoutTable.insertRow(-1);
// //             var sizeCell = newRow.insertCell(0);
// //             sizeCell.innerHTML = size;

// //             // Add the payout and original payout cells to the row
// //             newRow.insertCell(1).innerHTML = "$" + payout.toFixed(2);
// //             newRow.insertCell(2).innerHTML = "$" + originalPayout.toFixed(2);
// //           }
// //         });
// //       });
// //     });
// //   }
// //   // If the current tab is not on stockx.com
// //   else {
// //     // Disable the calculate payout button
// //     document.getElementById("calculate-button").disabled = true;
// //   }
// // });

// // // Calculates the payout based on the price and seller level
// // function calculatePayout(price, sellerLevel) {
// //   var transactionFee;
// //   switch (sellerLevel) {
// //     case "1":
// //       transactionFee = 0.1;
// //       break;
// //     case "2":
// //       transactionFee = 0.095;
// //       break;
// //     case "3":
// //       transactionFee = 0.09;
// //       break;
// //     case "4":
// //       transactionFee = 0.085;
// //       break;
// //     case "5":
// //       transactionFee = 0.08;
// //       break;
// //     default:
// //       transactionFee = 0.1;
// //   }

// //   var payout = price - price * transactionFee - 4 - price * 0.03;
// //   return payout.toFixed(2);
// // }



// $(document).ready(function () {
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     var tabURL = tabs[0].url;
//     if (tabURL.startsWith("https://stockx.com/")) {
//       $("#calculate-payout").attr("disabled", false);

//       $("#calculate-payout").click(function () {
//         chrome.tabs.query({ active: true, currentWindow: true }, function (
//           tabs
//         ) {
//           chrome.tabs.sendMessage(tabs[0].id, { action: "calculate" });
//         });
//       });

//       $("#seller-level").change(function () {
//         var sellerLevel = $(this).val();
//         chrome.storage.local.set({ sellerLevel: sellerLevel }, function () {
//           console.log("Seller level set to: " + sellerLevel);
//         });
//       });

//       chrome.storage.local.get("sellerLevel", function (data) {
//         if (data.sellerLevel) {
//           $("#seller-level").val(data.sellerLevel);
//         }
//       });

//       chrome.runtime.onMessage.addListener(function (
//         request,
//         sender,
//         sendResponse
//       ) {
//         if (request.action == "displayPayout") {
//           $("#item-name").text(request.itemName);
//           $("#item-table tbody").html(request.tableRows);
//           $("#total-payout").text(request.totalPayout);
//         }
//       });
//     }
//   });
// });

// // Calculates the payout based on the price and seller level
// function calculatePayout(price, sellerLevel) {
//   var transactionFee;
//   switch (sellerLevel) {
//     case "1":
//       transactionFee = 0.1;
//       break;
//     case "2":
//       transactionFee = 0.095;
//       break;
//     case "3":
//       transactionFee = 0.09;
//       break;
//     case "4":
//       transactionFee = 0.085;
//       break;
//     case "5":
//       transactionFee = 0.08;
//       break;
//     default:
//       transactionFee = 0.1;
//   }

//   var payout = price - price * transactionFee - 4 - price * 0.03;
//   return payout.toFixed(2);
// }


$(document).ready(function () {
  // Get the seller level from local storage or default to level 1
  var sellerLevel = localStorage.getItem("sellerLevel") || "1";
  $("#seller-level").val(sellerLevel);

  // Save the seller level to local storage when the dropdown is changed
  $("#seller-level").change(function () {
    localStorage.setItem("sellerLevel", $(this).val());
  });

  // Disable the calculate payout button until we confirm we are on a valid page
  $("#calculate-payout").prop("disabled", true);

  // Check if we are on a valid page and enable/disable the calculate payout button accordingly
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tabURL = tabs[0].url;
    if (tabURL.startsWith("https://stockx.com/")) {
      $("#calculate-payout").prop("disabled", false);
    } else {
      $("#calculate-payout").prop("disabled", true);
    }
  });

  // Calculate the payout when the button is clicked
  $("#calculate-payout").click(function () {
    // Get the item information
    chrome.tabs.executeScript(
      {
        code:
          "var itemName = document.title.split('|')[0].trim(); var itemSizes = Array.from(document.querySelectorAll('.chakra-text.css-16wgmyl')).map(e => e.innerText); var itemPrices = Array.from(document.querySelectorAll('.chakra-stat__number.css-kqs993')).map(e => e.innerText); var itemOriginalPrice = document.querySelector('.chakra-text.css-cptlwn')?.innerText;",
      },
      function (results) {
        // Extract the information from the results array
        var itemName = results[0].itemName;
        var itemSizes = results[0].itemSizes;
        var itemPrices = results[0].itemPrices;
        var itemOriginalPrice = results[0].itemOriginalPrice;

        // Calculate the payout for each size
        var payouts = [];
        for (var i = 0; i < itemSizes.length; i++) {
          var size = itemSizes[i];
          var price = itemPrices[i];

          // Calculate the payout for this size
          var payout = calculatePayout(price, sellerLevel);

          // Add the payout to the payouts array
          payouts.push({
            size: size,
            price: price,
            payout: payout,
          });
        }

        // Display the results in the table
        var tableHTML =
          "<tr><th>Size</th><th>Payout Price</th><th>Original Price</th></tr>";
        for (var i = 0; i < payouts.length; i++) {
          var size = payouts[i].size;
          var price = payouts[i].price;
          var payout = payouts[i].payout;

          tableHTML +=
            "<tr><td>" +
            size +
            "</td><td>" +
            payout.toFixed(2) +
            "</td><td>" +
            price +
            "</td></tr>";
        }
        $("#results-table").html(tableHTML);

        // Display the item name and original price
        $("#item-name").text(itemName);
        if (itemOriginalPrice) {
          $("#original-price").text(itemOriginalPrice);
        } else {
          $("#original-price").text("One Size");
        }
      }
    );
  });
});

// Calculates the payout based on the price and seller level
function calculatePayout(price, sellerLevel) {
  var transactionFee;
  switch (sellerLevel) {
    case "1":
      transactionFee = 0.1;
      break;
    case "2":
      transactionFee = 0.095;
      break;
    case "3":
      transactionFee = 0.09;
      break;
    case "4":
      transactionFee = 0.085;
      break;
    case "5":
      transactionFee = 0.08;
      break;
    default:
      transactionFee = 0.1;
  }
  var processFee = 0.03 * price;
  var shippingCost = 4.0;
  var payout = (1 - transactionFee) * (price - processFee - shippingCost);
  return payout.toFixed(2);
}

// Handle the button click event
document.getElementById("calculate-payout").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tabURL = tabs[0].url;
    if (tabURL.startsWith("https://stockx.com/")) {
      chrome.tabs.executeScript(
        tabs[0].id,
        { file: "contentScript.js" },
        function (results) {
          // Retrieve the item information from the content script
          var itemName = results[0].itemName;
          var itemSizes = results[0].itemSizes;
          var itemPrices = results[0].itemPrices;

          // Get the seller level from the dropdown menu
          var sellerLevel = document.getElementById("seller-level").value;

          // Calculate the payout for each size/one size and display in a table
          var payoutTable = document.getElementById("payout-table");
          payoutTable.innerHTML = "";
          var headerRow = document.createElement("tr");
          var sizeHeader = document.createElement("th");
          var payoutHeader = document.createElement("th");
          var priceHeader = document.createElement("th");
          sizeHeader.textContent = "Size";
          payoutHeader.textContent = "Payout";
          priceHeader.textContent = "Price";
          headerRow.appendChild(sizeHeader);
          headerRow.appendChild(payoutHeader);
          headerRow.appendChild(priceHeader);
          payoutTable.appendChild(headerRow);

          if (itemSizes.length === 1 && itemSizes[0] === "one size") {
            var size = "one size";
            var price = itemPrices[0];
            var payout = calculatePayout(price, sellerLevel);
            var row = document.createElement("tr");
            var sizeCell = document.createElement("td");
            var payoutCell = document.createElement("td");
            var priceCell = document.createElement("td");
            sizeCell.textContent = size;
            payoutCell.textContent = "$" + payout;
            priceCell.textContent = "$" + price;
            row.appendChild(sizeCell);
            row.appendChild(payoutCell);
            row.appendChild(priceCell);
            payoutTable.appendChild(row);
          } else {
            for (var i = 0; i < itemSizes.length; i++) {
              var size = itemSizes[i];
              var price = itemPrices[i];
              var payout = calculatePayout(price, sellerLevel);
              var row = document.createElement("tr");
              var sizeCell = document.createElement("td");
              var payoutCell = document.createElement("td");
              var priceCell = document.createElement("td");
              sizeCell.textContent = size;
              payoutCell.textContent = "$" + payout;
              priceCell.textContent = "$" + price;
              row.appendChild(sizeCell);
              row.appendChild(payoutCell);
              row.appendChild(priceCell);
              payoutTable.appendChild(row);
            }
          }
        }
      );
    }
  });
});
