namespace Kolossi.Tub.Messages.WebRequest
{
    public class BeforeRequest
    {
        public int TabId { get; set; }
        public MethodEnum Method { get; set; }
        public string Url { get; set; }
    }
}