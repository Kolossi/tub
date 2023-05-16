namespace Kolossi.Tub.Messages.WebNavigation
{
    public class CreatedNavigationTarget
    {
        public int TabId { get; set; }
        public int SourceTabId { get; set; }        
        public string Url { get; set; }
    }
}