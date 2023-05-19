using Kolossi.Tub.Messages;

namespace Kolossi.Tub.BrowserLogic
{
    public class TabState
    {
        public int WindowId { get; set; }
        public int Id { get; set; }
        public string Url { get; set; }
        public string InitialUrl { get; set; }
        public MethodEnum Method { get; set; }
        public bool NavigationInProgress { get; set; }
        public bool CreationInProgress { get; set; }

        public TabState(int Id)
        {
            this.Id=Id;
        }
    }
}