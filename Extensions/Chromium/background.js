// https://developer.chrome.com/docs/extensions/reference/webNavigation
// https://developer.chrome.com/docs/extensions/reference/webRequest/#event-onBeforeRequest

var tubPort = chrome.runtime.connectNative('uk.co.kolossi.tub');

chrome.webRequest.onBeforeRequest.addListener((details) => {
    console.debug("tubtub:background:BeforeNavigation:Begin");
    if (!tubPort) return { cancel: false };
    var tab = chrome.tabs.get(details.tabId, (tab) => {
        if (details.frameId != 0) return;
        var windowId = tab.windowId;
        tubPort.postMessage({
            type: "Kolossi.Tub.Messsages.BeforeNavigation", 
            windowId: windowId, 
            tabId: details.tabId, 
            url: details.url
        });
        console.debug("tubtub:background:BeforeNavigation: windowId: " + windowId + ", tabId: " + details.tabId + ", url: " + details.url);
        console.debug("    tubtub:details:" + JSON.stringify(details));
        console.debug("    tubtub:tab:" + JSON.stringify(tab));
        // can then use:
        // chrome.tabs.highlight({tabs:12,windowId:275})
        // chrome.windows.update(275, {focused:true})
    });
},
{ urls: ["<all_urls>"], types: ["main_frame"] }
);

chrome.webNavigation.onCompleted.addListener((details) => {
    var tab = chrome.tabs.get(details.tabId, (tab) => {
        if (details.frameId != 0) return;
        var windowId = tab.windowId;
        tubPort.postMessage({
            type: "Kolossi.Tub.Messsages.NavigationCompleted", 
            windowId: windowId, 
            tabId: details.tabId, 
            url: details.url
        });
        console.debug("tubtub:background:NavigationCompleted: windowId: " + windowId + ", tabId: " + details.tabId + ", url: " + details.url);
        console.debug("    tubtub:details:" + JSON.stringify(details));
        console.debug("    tubtub:tab:" + JSON.stringify(tab));
        // can then use:
        // chrome.tabs.highlight({tabs:12,windowId:275})
        // chrome.windows.update(275, {focused:true})
    });
});