namespace Kolossi.Tub.Messages.WebNavigation
{
    public class ErrorOccurred
    {
        public int TabId { get; set; }
        public string Url { get; set; }
        public string Error { get; set; }
    }
}