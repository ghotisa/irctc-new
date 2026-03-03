let scriptActivated = false;
let tabDetails;
let status_updates = {};

function getMsg(msg_type, msg_body) {
  return {
    msg: {
      type: msg_type,
      data: msg_body,
    },
    sender: "background_script",
    id: "irctc",
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.id !== "irctc") {
    sendResponse("Invalid Id");
    return;
  }
  const type = message.msg.type;
  const data = message.msg.data;
  if (type === "activate_script") {
    chrome.tabs.create(
      {
        url: "https://www.irctc.co.in/nget/train-search",
      },
      (tab) => {
        tabDetails = tab;
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["./content_script.js"],
        });
      },
    );
    sendResponse("Script activated");
  } else if (type === "status_update") {
    //for first time status update create
    if (!status_updates[sender.id]) status_updates[sender.id] = [];
    // else save in
    status_updates[sender.id].push({
      sender: sender,
      data,
    });
    console.log(`status at ${message?.sender}`, data.status, data.time);
  } else {
    sendResponse("Something went wrong");
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === tabDetails?.id && changeInfo?.status === "complete") {
    if (tab.url.includes("booking/train-list")) {
      chrome.tabs.sendMessage(tabDetails.id, getMsg("selectJourney"));
    }
    if (tab.url.includes("booking/psgninput")) {
      console.log("at the psgninput");
      chrome.tabs.sendMessage(tabDetails.id, getMsg("fillPassengerDetails"));
    }
    if (tab.url.includes("booking/reviewBooking")) {
      console.log("at the reviewBookingDetails");
      chrome.tabs.sendMessage(tabDetails.id, getMsg("reviewBookingDetails"));
    }
    if (tab.url.includes("payment/bkgPaymentOptions")) {
      console.log("at the bkgPaymentOptions");
      chrome.tabs.sendMessage(tabDetails.id, getMsg("bkgPaymentOptions"));
    }
  }
});
chrome.runtime.onInstalled.addListener((t) => {
  t === chrome.runtime.OnInstalledReason.INSTALL && confirm("Welcome");
});
