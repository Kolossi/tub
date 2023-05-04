// https://developer.chrome.com/docs/extensions/reference/webNavigation
// https://developer.chrome.com/docs/extensions/reference/webRequest/#event-onBeforeRequest

var tubPort = chrome.runtime.connectNative('uk.co.kolossi.tub');

chrome.webRequest.onBeforeRequest.addListener((details) => {
    if (!tubPort) return;
    if (details.tabId<=0) return;
    if (details.frameId != 0) return;
    var tab = chrome.tabs.get(details.tabId, (tab) => {
        
        var windowId = tab.windowId;
        tubPort.postMessage({
            type: "Kolossi.Tub.Messsages.BeforeNavigation", 
            windowId: windowId, 
            tabId: details.tabId, 
            url: details.url
        });
        console.debug("tubtub:background:onBeforeRequest: windowId: " + windowId + ", tabId: " + details.tabId + ", url: " + details.url);
        console.debug("    tubtub:details:" + JSON.stringify(details));
        console.debug("    tubtub:tab:" + JSON.stringify(tab));

        // can then use:
        // chrome.tabs.highlight({tabs:12,windowId:275})
        // chrome.windows.update(275, {focused:true})
    });
    if (ShouldBlock(details))
    {
        CreateBlockTabRule(details.tabId);
    }
},
//{ urls: ["<all_urls>"], types: ["main_frame"] }
{ urls: ["<all_urls>"]}
);

chrome.webNavigation.onCompleted.addListener((details) => {
    console.debug("tubtub:background:NavigationCompleted frameId: " + details.frameId);
    if (details.frameId != 0) return;
    var tab = chrome.tabs.get(details.tabId, (tab) => {
        var windowId = tab.windowId;
        tubPort.postMessage({
            type: "Kolossi.Tub.Messsages.NavigationCompleted", 
            windowId: windowId, 
            tabId: details.tabId, 
            url: details.url
        });
        ClearTabRule(details.tabId);
        console.debug("tubtub:background:NavigationCompleted: windowId: " + windowId + ", tabId: " + details.tabId + ", url: " + details.url);
        console.debug("    tubtub:details:" + JSON.stringify(details));
        console.debug("    tubtub:tab:" + JSON.stringify(tab));
    });
});

function ShouldBlock(details)
{
    var shouldBlock=(details.url=="https://news.bbc.co.uk/" || details.url=="https://www.bbc.co.uk/news");
    console.debug("tubtub:ShouldBlock url: " + details.url + " shouldBlock: " + shouldBlock);
    return shouldBlock;
}

function ClearTabRule(tabId) {
    // might need to use chrome.runtime.sendmessage() and receive with a chrome.runtime.onmessage listener?
    chrome.declarativeNetRequest.updateSessionRules({
        removeRuleIds:[tabId],
        addRules: []
    }).then( () => {console.debug("tubtub:CLEARED for tabID: "+tabId+" @"+(new Date()).toISOString())});
}

function CreateBlockTabRule(tabId) {
    chrome.declarativeNetRequest.updateSessionRules({
        addRules: [{
            id: tabId,
            action: {
                type: "block"
            },
            condition: {
                tabIds: [tabId]
            }
        }],
        removeRuleIds:[]
    }).then( () => {console.debug("tubtub:BLOCKED for tabID: "+tabId+" @"+(new Date()).toISOString())});
}