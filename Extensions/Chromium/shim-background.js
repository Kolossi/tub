// https://developer.chrome.com/docs/extensions/reference/webNavigation
// https://developer.chrome.com/docs/extensions/reference/webRequest/#event-onBeforeRequest

var tubPort = chrome.runtime.connectNative('uk.co.kolossi.tub');

function consoledebug(message)
{
    console.debug(message);
}

function BroadcastMessage(message)
{
  if (tubPort) {
    tubPort.postMessage(message);
  } else {
    ReceiveMessage(message);
  }
}

function ReceiveMessage(message)
{
    switch (message.type) {
        case "Kolossi.Tub.Messsages.WebRequest.BeforeRequest":
            break;
    }
}

///////////////////////////////
/// stop new tab creation if tab already exists

chrome.webRequest.onBeforeRedirect.addListener((details) => {
    if (details.tabId <= 0 || details.frameId != 0) return;
    consoledebug("tubtub:background:webRequest.onBeforeRedirect:details:" + JSON.stringify(details));
    BroadcastMessage({
                type: "Kolossi.Tub.Messsages.WebRequest.BeforeRedirect",
                tabId: details.tabId, 
                method: details.method,
                newUrl: details.redirectUrl,
                previousUrl: details.url
        });
},
{ urls: ["<all_urls>"], types: ["main_frame"] }
);

chrome.webRequest.onBeforeRequest.addListener((details) => {
    if (details.tabId <= 0 || details.frameId != 0) return;
    consoledebug("tubtub:background:webRequest.onBeforeRequest:details:" + JSON.stringify(details));
    BroadcastMessage({
                type: "Kolossi.Tub.Messsages.WebRequest.BeforeRequest",
                tabId: details.tabId, 
                method: details.method,
                url: details.url
        });
    // SetTabMethodAndClearUrl(details.tabId, details.method);    
    // if (details.method!="GET") return;
    // var strategy=GetStrategy(details);
    // consoledebug("      tubtub:background:webRequest.onBeforeRequest:strategy:" + JSON.stringify(strategy));
    // if (strategy.block) PerformStrategy(strategy);
},
{ urls: ["<all_urls>"], types: ["main_frame"] }
);

chrome.webRequest.onCompleted.addListener((details) => {
    if (details.tabId <= 0 || details.frameId != 0) return;
    consoledebug("tubtub:background:webRequest.onCompleted:details:" + JSON.stringify(details));
    BroadcastMessage({
                type: "Kolossi.Tub.Messsages.WebRequest.Completed",
                tabId: details.tabId, 
                method: details.method,
                url: details.url
        });
    // SetTabMethodAndUrl(details.tabId, details.method, details.url);
},
{ urls: ["<all_urls>"], types: ["main_frame"] }
);

chrome.webRequest.onErrorOccurred.addListener((details) => {
    if (details.tabId <= 0 || details.frameId != 0) return;
    consoledebug("tubtub:background:webRequest.onErrorOccurred:details:" + JSON.stringify(details));
    BroadcastMessage({
                type: "Kolossi.Tub.Messsages.WebRequest.ErrorOccurred",
                tabId: details.tabId, 
                method: details.method,
                error: details.error,
                url: details.url
                
        });
},
{ urls: ["<all_urls>"], types: ["main_frame"] }
);

///////////////////////////////////////////////////////////////////

chrome.webNavigation.onCompleted.addListener((details) => {
    if (details.tabId <= 0 || details.frameId != 0) return;
    consoledebug("tubtub:background:webNavigation.onCompleted:details:" + JSON.stringify(details));
    BroadcastMessage({
        type: "Kolossi.Tub.Messsages.WebNavigation.Completed",
        tabId: details.tabId, 
        url: details.url
    });
    // var strategy=GetStrategy(details);
    // consoledebug("      tubtub:background:webNavigation.onCompleted:strategy:" + JSON.stringify(strategy));
    // SetTabUrl(details.tabId, details.url)
    // if (strategy.block) PerformStrategy(strategy);
    // SetCreatingTabFlag(details.tabId, false)
});

chrome.webNavigation.onCreatedNavigationTarget.addListener((details) => {
    if (details.tabId <= 0 || details.frameId != 0) return;
    consoledebug("tubtub:background:webNavigation.onCreatedNavigationTarget:details:" + JSON.stringify(details));
    BroadcastMessage({
        type: "Kolossi.Tub.Messsages.WebNavigation.CreatedNavigationTarget",
        tabId: details.tabId, 
        sourceTabId: details.sourceTabId,
        url: details.url
    });
    // SetCreatingTabFlag(details.tabId, true);
    // var strategy=GetStrategy(details);
    // consoledebug("      tubtub:background:webNavigation.onCreatedNavigationTarget:strategy:" + JSON.stringify(strategy));
    // if (strategy.block) PerformStrategy(strategy);
});

chrome.webNavigation.onErrorOccurred.addListener((details) => {
    if (details.tabId <= 0 || details.frameId != 0) return;
    consoledebug("tubtub:background:webNavigation.onErrorOccurred:details:" + JSON.stringify(details));
    BroadcastMessage({
        type: "Kolossi.Tub.Messsages.WebNavigation.ErrorOccurred",
        tabId: details.tabId, 
        error: details.error,
        url: details.url
    });
    // var strategy=GetStrategy(details);
    // consoledebug("      tubtub:background:webNavigation.onCompleted:strategy:" + JSON.stringify(strategy));
    // SetTabUrl(details.tabId, details.url)
    // if (strategy.block) PerformStrategy(strategy);
    // SetCreatingTabFlag(details.tabId, false)
});

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    if (details.tabId <= 0 || details.frameId != 0) return;
    consoledebug("tubtub:background:webNavigation.onHistoryStateUpdated:details:" + JSON.stringify(details));
    BroadcastMessage({
        type: "Kolossi.Tub.Messsages.WebNavigation.HistoryStateUpdated",
        tabId: details.tabId, 
        transitionQualifiers: details.transitionQualifiers,
        transitionType: details.transitionType,
        url: details.url
    });
    // var strategy=GetStrategy(details);
    // consoledebug("      tubtub:background:webNavigation.onHistoryStateUpdated:strategy:" + JSON.stringify(strategy));
    // if (strategy.block) PerformStrategy(strategy);
});

chrome.webNavigation.onReferenceFragmentUpdated.addListener((details) => {
    if (details.tabId <= 0 || details.frameId != 0) return;
    consoledebug("tubtub:background:webNavigation.onReferenceFragmentUpdated:details:" + JSON.stringify(details));
    BroadcastMessage({
        type: "Kolossi.Tub.Messsages.WebNavigation.ReferenceFragmentUpdated",
        tabId: details.tabId, 
        transitionQualifiers: details.transitionQualifiers,
        transitionType: details.transitionType,
        url: details.url
    });
});

//////////////////////////////////

chrome.tabs.onAttached.addListener((tabId,attachInfo) => {
    consoledebug("tubtub:background:tabs.onAttached:tabId: "+tabId+" attachInfo:" + JSON.stringify(attachInfo));
    BroadcastMessage({
        type: "Kolossi.Tub.Messsages.Tabs.Attached",
        tabId: details.tabId, 
        windowId: attachInfo.newWindowId
    });
});

chrome.tabs.onDetached.addListener((tabId,detachInfo) => {
    consoledebug("tubtub:background:tabs.onDetached:tabId: "+tabId+" detachInfo:" + JSON.stringify(detachInfo));
    BroadcastMessage({
        type: "Kolossi.Tub.Messsages.Tabs.Detached",
        tabId: details.tabId, 
        windowId: detachInfo.oldWindowId
    });
});

chrome.tabs.onRemoved.addListener((tabId,removeInfo) => {
    consoledebug("tubtub:background:tabs.onRemoved:tabId: "+tabId+" removeInfo:" + JSON.stringify(removeInfo));
    BroadcastMessage({
        type: "Kolossi.Tub.Messsages.Tabs.Removed",
        tabId: tabId, 
        isWindowClosing: removeInfo.isWindowClosing,
        windowId: removeInfo.windowId
    });
    // RemoveTabState(tabId);
});

chrome.tabs.onReplaced.addListener((addedTabId,removedTabId) => {
    consoledebug("tubtub:background:tabs.onReplaced:addedTabId: "+addedTabId+" removedTabId:" + removedTabId);
    BroadcastMessage({
        type: "Kolossi.Tub.Messsages.Tabs.Replaced",
        addedTabId: addedTabId, 
        removedTabId: removedTabId
    });
    // RemoveTabState(removedTabId);
});

chrome.tabs.onUpdated.addListener((tabId,changeInfo,tab) => {
    if (changeInfo.url === undefined) return;
    consoledebug("tubtub:background:tabs.onUpdated:tabId: "+tabId+" changeInfo:" + JSON.stringify(changeInfo) + " tab: " + JSON.stringify(tab));
    BroadcastMessage({
        type: "Kolossi.Tub.Messsages.Tabs.Updated",
        tabId: tabId, 
        url: changeInfo.url,
        windowId: tab.windowId
    });
});


///
////////////////////////////////

// function ClearTabUrl(tabId)
// {
//     var tabState=tabStates[tabId];
//     if (tabState===undefined || !tabState.url) return;
//     var urlTab=urlTabs[tabState.url];
//     if (urlTab!==undefined && urlTab.id==tabId) delete urlTabs[tabState.url];
//     tabState.url=null;
// }

// function SetTabMethodAndClearUrl(tabId, method)
// {
//     var tabState=GetOrCreateTabState(tabId);
//     tabState.method=method;
//     ClearTabUrl(tabId);
// }

// function SetCreatingTabFlag(tabId, flagState)
// {
//     var tabState=GetOrCreateTabState(tabId);
//     tabState.creatingTab=flagState;
// }

// function GetOrCreateTabState(tabId)
// {
//     var tabState=tabStates[tabId];
//     if (tabState===undefined) tabState=CreateTabState(tabId);
//     return tabState;
// }
// function SetTabMethodAndUrl(tabId, method, url)
// {
//     var tabState=GetOrCreateTabState(tabId);
//     tabState.method=method;
//     if (tabState.method != "GET") {
//         ClearTabUrl(tabId);
//     } else {
//         SetTabUrl(tabId, url);
//     }
// }

// function CreateTabState(tabId)
// {
//     var tabState={
//         id: tabId,
//         method: "GET"
//     };
//     tabStates[tabId]=tabState;
//     return tabState;
// }

// function TidyUrl(url)
// {
//     return url.replace(/\/+$/,"");
// }

// function SetTabUrl(tabId, url)
// {
//     var tabState=GetOrCreateTabState(tabId);
//     if (!url || tabState.method != "GET") {
//         ClearTabUrl(tabId);
//     } else {
//         url=TidyUrl(url);
//         tabState.url=url;
//         urlTabs[url]=tabState;
//     }
// }

// function RemoveTabState(tabId)
// {
//     var tabState=tabStates[tabId];
//     if (tabState===undefined) return;
//     delete tabStates[tabState.id];
//     var url=tabState.url;
//     if (!urlTabs[url]) return;
//     for (var tabId in tabStates) 
//     {
//         var otherState=tabStates[tabId];
//         if (otherState.url==url)
//         {
//             urlTabs[url]=otherState;
//         }
//     }
// }

// function CloseTab(tabId)
// {
//     consoledebug("tubtub:background:CloseTab:tabid: "+tabId+" tabStates:" + JSON.stringify(tabStates));
//     chrome.tabs.remove(tabId);
//     RemoveTabState(tabId);
//     consoledebug("   tubtub:background:CloseTab end:tabid: "+tabId+" tabStates:" + JSON.stringify(tabStates));
// }

// function ActivateTab(tabId)
// {
//     consoledebug("tubtub:background:ActivateTab:tabid: "+tabId+" tabStates:" + JSON.stringify(tabStates));
//     chrome.tabs.update(tabId,{active: true});
// }

// function GoBackTab(tabId)
// {
//     consoledebug("tubtub:background:GoBackTab:tabid: "+tabId+" tabStates:" + JSON.stringify(tabStates));
//     chrome.tabs.goBack(tabId);
// }

// function GetStrategy(details)
// {
//     consoledebug("tubtub:background:GetStrategy");
//     var tabState=tabStates[details.tabId];
//     consoledebug("  tubtub:background:GetStrategy:tabState:"+JSON.stringify(tabState))
//     if (tabState!==undefined && tabState.method && tabState.method != "GET") return;
//     var strategy={ block: false };
//     var url=TidyUrl(details.url);
//     var targetTab=urlTabs[url];
    
//     if (targetTab !== undefined && details.tabId != targetTab.id)
//     {
//         var chromeTab = chrome.tabs.get(targetTab.id);
//         consoledebug("  tubtub:background:GetStrategy:chromeTab:"+JSON.stringify(chromeTab))
//         if (chromeTab===undefined) RemoveTabState(targetTab.id);
//         strategy.block=true;
//         strategy.activateTabId = targetTab.id;
//         consoledebug("  tubtub:background:GetStrategy:tabState:"+JSON.stringify(tabState))
//         if (tabState.creatingTab) {
//             strategy.closeTabId=details.tabId;
//         } else {
//             strategy.backTabId = details.tabId;
//         }
//     }
//     return strategy;    
// }


// function PerformStrategy(strategy)
// {
//     if (strategy.activateTabId) ActivateTab(strategy.activateTabId);
//     if (strategy.closeTabId) CloseTab(strategy.closeTabId);
//     if (strategy.backTabId) GoBackTab(strategy.backTabId);
// }

