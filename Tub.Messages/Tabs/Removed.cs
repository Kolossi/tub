namespace Kolossi.Tub.Messages.Tabs
{
    public class Removed
    {
        public int TabId { get; set; }
        public bool IsWindowClosing { get; set; }
        public int WindowId { get; set; }
    }
}