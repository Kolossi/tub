using Kolossi.Tub.Messages;
using System.Collections.Generic;

namespace Kolossi.Tub.BrowserLogic
{
    public class BrowserStateRepository
    {
        private List<BrowserTab> Tabs = new List<BrowserTab>();

        private Dictionary<int,BrowserTab> IdTabs = new Dictionary<int, BrowserTab>();

        private Dictionary<string,BrowserTab> UrlTabs = new Dictionary<string, BrowserTab>();

        public BrowserStateRepository()
        {            
        }
    }
}