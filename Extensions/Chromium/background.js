// https://developer.chrome.com/docs/extensions/reference/webNavigation
// https://developer.chrome.com/docs/extensions/reference/webRequest/#event-onBeforeRequest

var tubPort = chrome.runtime.connectNative('uk.co.kolossi.tub');
var urlTabs={};
var tabStates={};
var showConsoleDebug = true;

function consoledebug(message)
{
    if (showConsoleDebug) console.debug(message);

}
///////////////////////////////
/// stop new tab creation if tab already exists

chrome.webNavigation.onCreatedNavigationTarget.addListener((details) => {
    consoledebug("tubtub:background:webNavigation.onCreatedNavigationTarget:details:" + JSON.stringify(details));
    //if (!tubPort) return;
    if (details.tabId<=0) return;
    var strategy=GetStrategy(details);
    consoledebug("      tubtub:background:webNavigation.onCreatedNavigationTarget:strategy:" + JSON.stringify(strategy));
    PerformStrategy(strategy);
});

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    consoledebug("tubtub:background:webNavigation.onHistoryStateUpdated:details:" + JSON.stringify(details));
    //if (!tubPort) return;
    if (details.tabId<=0) return;
    var strategy=GetStrategy(details);
    consoledebug("      tubtub:background:webNavigation.onHistoryStateUpdated:strategy:" + JSON.stringify(strategy));
    PerformStrategy(strategy);
});

chrome.webRequest.onBeforeRequest.addListener((details) => {
    consoledebug("tubtub:background:webRequest.onBeforeRequest:details:" + JSON.stringify(details));
    if (details.tabId<=0 || details.method!="GET") return;
    var strategy=GetStrategy(details);
    consoledebug("      tubtub:background:webRequest.onBeforeRequest:strategy:" + JSON.stringify(strategy));
    PerformStrategy(strategy);
},
{ urls: ["<all_urls>"], types: ["main_frame"] }
);

///
////////////////////////////////////

/////////////////////////////////
/// tab state tracking
chrome.webRequest.onBeforeRequest.addListener((details) => {
    consoledebug("tubtub:background:webRequest.onBeforeRequest:details:" + JSON.stringify(details));
    if (details.tabId<=0) return;
    SetTabMethodAndClearUrl(details.tabId, details.method);
},
{ urls: ["<all_urls>"], types: ["main_frame"] }
);

chrome.webNavigation.onCreatedNavigationTarget.addListener((details) => {
    consoledebug("tubtub:background:webNavigation.onCreatedNavigationTarget:details:" + JSON.stringify(details));
    SetCreatingTabFlag(details.tabId, true);
});

chrome.webRequest.onCompleted.addListener((details) => {
    consoledebug("tubtub:background:webRequest.onCompleted:details:" + JSON.stringify(details));
    if (details.tabId<=0) return;
    SetTabMethodAndUrl(details.tabId, details.method, details.url);
},
{ urls: ["<all_urls>"], types: ["main_frame"] }
);

chrome.webNavigation.onCompleted.addListener((details) => {
    if (details.frameId != 0) return;
    consoledebug("tubtub:background:webNavigation.onCompleted:details:" + JSON.stringify(details));
    if (details.tabId<=0) return;
    var strategy=GetStrategy(details);
    consoledebug("      tubtub:background:webNavigation.onCompleted:strategy:" + JSON.stringify(strategy));
    SetTabUrl(details.tabId, details.url)
    PerformStrategy(strategy);
    SetCreatingTabFlag(details.tabId, false)
});

chrome.tabs.onRemoved.addListener((tabId,removeInfo) => {
    consoledebug("tubtub:background:tabs.onRemoved:tabid: "+tabId+" removeInfo:" + JSON.stringify(removeInfo));
    RemoveTabState(tabId);
});

chrome.tabs.onReplaced.addListener((addedTabId,removedTabId) => {
    consoledebug("tubtub:background:tabs.onReplaced:addedTabId: "+addedTabId+" removedTabId:" + removedTabId);
    RemoveTabState(removedTabId);
});
///
////////////////////////////////

function ClearTabUrl(tabId)
{
    var tabState=tabStates[tabId];
    if (tabState===undefined || !tabState.url) return;
    var urlTab=urlTabs[tabState.url];
    if (urlTab!==undefined && urlTab.id==tabId) delete urlTabs[tabState.url];
    tabState.url=null;
}

function SetTabMethodAndClearUrl(tabId, method)
{
    var tabState=GetOrCreateTabState(tabId);
    tabState.method=method;
    ClearTabUrl(tabId);
}

function SetCreatingTabFlag(tabId, flagState)
{
    var tabState=GetOrCreateTabState(tabId);
    tabState.creatingTab=flagState;
}

function GetOrCreateTabState(tabId)
{
    var tabState=tabStates[tabId];
    if (tabState===undefined) tabState=CreateTabState(tabId);
    return tabState;
}
function SetTabMethodAndUrl(tabId, method, url)
{
    var tabState=GetOrCreateTabState(tabId);
    tabState.method=method;
    if (tabState.method != "GET") {
        ClearTabUrl(tabId);
    } else {
        SetTabUrl(tabId, url);
    }
}

function CreateTabState(tabId)
{
    var tabState={
        id: tabId,
        method: "GET"
    };
    tabStates[tabId]=tabState;
    return tabState;
}

function TidyUrl(url)
{
    return url.replace(/\/+$/,"");
}

function SetTabUrl(tabId, url)
{
    var tabState=GetOrCreateTabState(tabId);
    if (!url || tabState.method != "GET") {
        ClearTabUrl(tabId);
    } else {
        url=TidyUrl(url);
        tabState.url=url;
        urlTabs[url]=tabState;
    }
}

function RemoveTabState(tabId)
{
    var tabState=tabStates[tabId];
    if (tabState===undefined) return;
    delete tabStates[tabState.id];
    var url=tabState.url;
    if (!urlTabs[url]) return;
    for (var tabId in tabStates) 
    {
        var otherState=tabStates[tabId];
        if (otherState.url==url)
        {
            urlTabs[url]=otherState;
        }
    }
}

function CloseTab(tabId)
{
    consoledebug("tubtub:background:CloseTab:tabid: "+tabId+" tabStates:" + JSON.stringify(tabStates));
    chrome.tabs.remove(tabId);
    RemoveTabState(tabId);
    consoledebug("   tubtub:background:CloseTab end:tabid: "+tabId+" tabStates:" + JSON.stringify(tabStates));
}

function ActivateTab(tabId)
{
    consoledebug("tubtub:background:ActivateTab:tabid: "+tabId+" tabStates:" + JSON.stringify(tabStates));
    chrome.tabs.update(tabId,{active: true});
}

function GoBackTab(tabId)
{
    consoledebug("tubtub:background:GoBackTab:tabid: "+tabId+" tabStates:" + JSON.stringify(tabStates));
    chrome.tabs.goBack(tabId);
}

function GetStrategy(details)
{
    var tabState=tabStates[details.tabId];
    if (tabState!==undefined && tabState.method && tabState.method != "GET") return;
    var strategy={ block: false };
    var url=TidyUrl(details.url);
    var targetTab=urlTabs[url];
    
    if (targetTab !== undefined && details.tabId != targetTab.id)
    {
        strategy.activateTabId = targetTab.id;
        if (tabState.creatingTab) {
            strategy.closeTabId=details.tabId;
        } else {
            strategy.backTabId = details.tabId;
        }
    }
    return strategy;    
}


function PerformStrategy(strategy)
{
    if (strategy.activateTabId) ActivateTab(strategy.activateTabId);
    if (strategy.closeTabId) CloseTab(strategy.closeTabId);
    if (strategy.backTabId) GoBackTab(str.backTabId);
}

// chrome.webRequest.onBeforeRequest.addListener((details) => {
//     //if (!tubPort) return;
//     if (details.tabId<=0) return;
//     if (details.frameId != 0) return;

//     var tab = chrome.tabs.get(details.tabId, (tab) => {
        
//         var windowId = tab.windowId;
//         tubPort.postMessage({
//             type: "Kolossi.Tub.Messsages.BeforeNavigation", 
//             windowId: windowId, 
//             tabId: details.tabId, 
//             url: details.url
//         });
//         console.debug("tubtub:background:onBeforeRequest: windowId: " + windowId + ", tabId: " + details.tabId + ", url: " + details.url);
//         console.debug("    tubtub:details:" + JSON.stringify(details));
//         console.debug("    tubtub:tab:" + JSON.stringify(tab));

//         var strategy=GetStrategy(details);
//         if (strategy.block)
//         {
//             StopTab(details.tabId);
//         }
//         if (strategy.tabId !== undefined)
//         {
//             ActivateTab(strategy.tabId);
//         }
//         // can then use:
//         // chrome.tabs.highlight({tabs:12,windowId:275})
//         // chrome.windows.update(275, {focused:true})
//     });
//     // if (ShouldBlock(details))
//     // {
//     //     CreateBlockTabRule(details.tabId);
//     // }
// },
// { urls: ["<all_urls>"], types: ["main_frame"] }
// //{ urls: ["<all_urls>"]}
// );

// chrome.tabs.onCreated.addListener(function(tab) {
//     // Check if the new tab was created by the extension
//     console.debug("tubtub:onTabCreated:tab="+JSON.stringify(tab));
//     // if (tab.openerTabId == null) {
//     //   // Close the new tab
//     //   chrome.tabs.remove(tab.id);
//     // }
//   });

// chrome.webNavigation.onCompleted.addListener((details) => {
//     console.debug("tubtub:background:NavigationCompleted frameId: " + details.frameId);
//     if (details.frameId != 0) return;

//     chrome.webNavigation.getFrame
//     SetTabUrl(details.tabId,details.url);
//     var tab = chrome.tabs.get(details.tabId, (tab) => {
//         var windowId = tab.windowId;
//         tubPort.postMessage({
//             type: "Kolossi.Tub.Messsages.NavigationCompleted", 
//             windowId: windowId, 
//             tabId: details.tabId, 
//             url: details.url
//         });
//         ClearTabRule(details.tabId);
//         console.debug("tubtub:background:NavigationCompleted: windowId: " + windowId + ", tabId: " + details.tabId + ", url: " + details.url);
//         console.debug("    tubtub:details:" + JSON.stringify(details));
//         console.debug("    tubtub:tab:" + JSON.stringify(tab));
//     });
// });

// function StopTab(tab)
// {
//     //chrome.tabs.update(tabId, { 'url': 'about:blank' });
//     chrome.scripting.executeScript({
//         target: {
//             tabId: tab.id
//         },
//         func: () => {
//             return window.history.length;
//         }
//     }).then((injectionResult) => 
//         {
//             console.debug("tubtub:StopTab:injectionResult"+JSON.stringify(injectionResult));
//             if (injectionResult != null 
//                     && injectionResult[0] != null 
//                     && injectionResult[0].result != null 
//                     && injectionResult[0].result > 1) {
//                 chrome.tabs.goBack(tab.id);
//             } else {
//                 chrome.tabs.remove(tab.id);
//             }
//         });
// }

// function ClearTabRule(tabId) {
//     // might need to use chrome.runtime.sendmessage() and receive with a chrome.runtime.onmessage listener?
//     chrome.declarativeNetRequest.updateSessionRules({
//         removeRuleIds:[tabId],
//         addRules: []
//     }).then( () => {console.debug("tubtub:CLEARED for tabID: "+tabId+" @"+(new Date()).toISOString())});
// }

// function CreateBlockTabRule(tabId) {
//     chrome.declarativeNetRequest.updateSessionRules({
//         removeRuleIds:[tabId],
//         addRules: [{
//             id: tabId,
//             action: {
//                 type: "block"
//             },
//             condition: {
//                 tabIds: [tabId]
//             }
//         }]
//     }).then( () => {console.debug("tubtub:BLOCKED for tabID: "+tabId+" @"+(new Date()).toISOString())});
// }