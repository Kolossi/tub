namespace Kolossi.Tub.BrowserLogic
{
    private List<BrowserTab> Tabs = new List<BrowserTab>();

    private Dictionary<int,BrowserTab> IdTabs = new Dictionary<int, BrowserTab>();

    private Dictionary<string,BrowserTab> UrlTabs = new Dictionary<string, BrowserTab>();

    public class BrowserStateRepository
    {
        public BrowserStateRepository()
        {            
        }
    }
}