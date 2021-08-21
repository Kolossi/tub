// https://developer.chrome.com/docs/extensions/reference/webNavigation
var tubtubOnCompletedFilterMainFrame = {frameId: 0};
chrome.webNavigation.onCompleted.addListener((details) => {
    var tab = chrome.tabs.get(details.tabId, (tab) => {
        var windowId = tab.windowId;
        console.debug("tubtub:background: windowId: " + windowId + ", tabId: " + details.tabId + ", url: "+ details.url);
        console.debug("    tubtub:details:" + JSON.stringify(details));
        console.debug("    tubtub:tab:" + JSON.stringify(tab));
        // can then use:
        // chrome.tabs.highlight({tabs:12,windowId:275})
        // chrome.windows.update(275, {focused:true})
    });
},tubtubOnCompletedFilterMainFrame);