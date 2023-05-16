namespace Kolossi.Tub.Messages.WebRequest
{
    public class Completed
    {
        public int TabId { get; set; }
        public MethodEnum Method { get; set; }
        public string Url { get; set; }
    }
}