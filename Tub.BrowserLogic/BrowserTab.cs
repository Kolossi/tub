namespace Kolossi.Tub.BrowserLogic
{
    public class BrowserTab
    {
        public int WindowId { get; set; }
        public int Id { get; set; }
        public string Url { get; set; }
        public string InitialUrl { get; set; }
        public MethodEnum Method { get; set; }
        public bool NavigationInProgress { get; set; }
        public bool CreationInProgress { get; set; }

        public BrowserTab(int Id)
        {
            Id=Id;
        }
    }
}