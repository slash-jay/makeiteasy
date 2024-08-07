chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "captureScreenshot") {
      chrome.tabs.captureVisibleTab(null, {}, (dataUrl) => {
          sendResponse({ screenshotUrl: dataUrl });
      });
      return true; // Indicates we want to send a response asynchronously
  }
});
