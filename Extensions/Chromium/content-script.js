console.debug("tubtub:content-script: "+ window.location.href);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === 'closeTab') {
        console.debug("tubtub:content-script: closing tab");
        window.close();
    }
  });