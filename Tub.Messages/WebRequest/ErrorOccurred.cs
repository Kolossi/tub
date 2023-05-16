namespace Kolossi.Tub.Messages.WebRequest
{
    public class ErrorOccurred
    {
        public int TabId { get; set; }
        public MethodEnum Method { get; set; }
        public string Url { get; set; }
        public string Error { get; set; }

    }
}