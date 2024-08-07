chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'takeScreenshot') {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (image) => {
      sendResponse({ screenshotUrl: image });
    });
    return true; // Required to use sendResponse asynchronously
  }
});
