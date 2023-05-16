namespace Kolossi.Tub.Messages.WebRequest
{
    public class BeforeRedirect
    {
        public int TabId { get; set; }
        public MethodEnum Method { get; set; }
        public string NewUrl { get; set; }
        public int PreviousUrl { get; set; }
    }
}