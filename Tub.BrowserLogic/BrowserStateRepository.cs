using Kolossi.Tub.Messages;
using Kolossi.Tub.Utils;
using System.Collections.Generic;

namespace Kolossi.Tub.BrowserLogic
{
    public class BrowserStateRepository
    {
        private List<TabState> Tabs = new List<TabState>();

        private Dictionary<int,TabState> IdTabs = new Dictionary<int, TabState>();

        private Dictionary<string,TabState> UrlTabs = new Dictionary<string, TabState>();

        public BrowserStateRepository()
        {            
        }

        void ClearTabUrl(int tabId)
        {
            var tabState = IdTabs[tabId];
            if (tabState == null || tabState.Url.IsNullOrEmpty()) return;
            var urlTab = UrlTabs[tabState.Url];
            if (urlTab != null && urlTab.Id == tabId)
            {
                //delete urlTabs[tabState.url];
            }
            tabState.Url = null;
        }

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
    }
}