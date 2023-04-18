// // Listen for messages from the content script
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     // Create the popup HTML
//     const popupHTML = `
//       <div>
//         <h3>${request.itemName}</h3>
//         <table>
//           <thead>
//             <tr>
//               <th>Size</th>
//               <th>Payout</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${request.payouts.map(payout => `
//               <tr>
//                 <td>${payout.size}</td>
//                 <td>$${payout.payout}</td>
//               </tr>
//             `).join("")}
//           </tbody>
//         </table>
//       </div>
//     `;
    
//     // Create the popup window
//     chrome.windows.create({
//       type: "popup",
//       width: 400,
//       height: 600,
//       url: chrome.runtime.getURL("popup.html")
//     }, (popupWindow) => {
//       // Send the popup HTML to the popup window
//       chrome.runtime.onConnect.addListener((port) => {
//         if (port.name === "popup") {
//           port.postMessage({
//             action: "displayPayout",
//             html: popupHTML
//           });
//         }
//       });
//     });
//   });

// let itemData = {};

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.type === 'ITEM_DATA') {
//     itemData = message.data;
//   }
// });

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'complete' && tab.url.includes('stockx.com')) {
//     chrome.tabs.sendMessage(tabId, {type: 'CHECK_PERMISSIONS'}, response => {
//       if (response && response.permissions && response.permissions.includes('activeTab')) {
//         chrome.pageAction.show(tabId);
//       }
//     });
//   }
// });

// chrome.pageAction.onClicked.addListener(tab => {
//   chrome.tabs.sendMessage(tab.id, {type: 'GET_ITEM_DATA'}, response => {
//     if (response && response.success) {
//       itemData = response.data;
//       chrome.tabs.create({url: 'popup.html'});
//     }
//   });
// });

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.type === 'GET_ITEM_DATA') {
//     sendResponse({success: true, data: itemData});
//   }


// });


// let itemData = {};

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.type === 'ITEM_DATA') {
//     itemData = message.data;
//   }
// });

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'complete' && tab.url.includes('stockx.com')) {
//     chrome.tabs.sendMessage(tabId, {type: 'CHECK_PERMISSIONS'}, response => {
//       if (response && response.permissions && response.permissions.includes('activeTab')) {
//         chrome.pageAction.show(tabId);
//       }
//     });
//   }
// });

// chrome.pageAction.onClicked.addListener(tab => {
//   chrome.tabs.sendMessage(tab.id, {type: 'GET_ITEM_DATA'}, response => {
//     if (response && response.success) {
//       itemData = response.data;
//       chrome.tabs.create({url: 'popup.html'});
//     }
//   });
// });

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.type === 'GET_ITEM_DATA') {
//     sendResponse({success: true, data: itemData});
//   }
  
//   if (message.type === 'CALCULATE_PAYOUT') {
//     const payout = calculatePayout(message.price, message.sellerLevel);
//     sendResponse({success: true, data: payout});
//   }
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
//       break;
//   }
  
//   const shippingCost = 4;
//   const processingFee = 0.03;
//   const totalFee = processingFee + transactionFee;
//   const payout = (price * (1 - totalFee)) - shippingCost;
  
//   return payout.toFixed(2);
// }



let itemData = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ITEM_DATA') {
    itemData = message.data;
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('stockx.com')) {
    chrome.tabs.sendMessage(tabId, {type: 'CHECK_PERMISSIONS'}, response => {
      if (response && response.permissions && Array.isArray(response.permissions) && response.permissions.includes('activeTab')) {
        chrome.pageAction.show(tabId);
      }
    });
  }
});


chrome.pageAction.onClicked.addListener(tab => {
  chrome.tabs.sendMessage(tab.id, {type: 'GET_ITEM_DATA'}, response => {
    if (response && response.success) {
      itemData = response.data;
      chrome.tabs.create({url: 'popup.html'}, tab => {
        const popupTabId = tab.id;
        chrome.runtime.onConnect.addListener(port => {
          if (port.name === 'popup' && port.sender.tab.id === popupTabId) {
            port.postMessage({type: 'ITEM_DATA', data: itemData});
          }
        });
      });
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_ITEM_DATA') {
    sendResponse({success: true, data: itemData});
    return true;
  }
});
