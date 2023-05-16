namespace Kolossi.Tub.Messages.WebNavigation
{
    public class HistoryStateUpdated
    {
        public int TabId { get; set; }
        public TransitionQualifierEnum TransitionQualifier { get; set; }
        public TransitionTypeEnum TransitionType { get; set; }        
        public string Url { get; set; }
    }
}