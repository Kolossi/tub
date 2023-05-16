namespace Kolossi.Tub.BrowserLogic
{
    public class MessageProcessor
    {
        private BrowserStateRepository BrowserStateRepository { get; set; }

        public MessageProcessor()
        {
            BrowserStateRepository = new BrowserStateRepository();
        }

        public MessageProcessor(BrowserStateRepository browserStateRepository)
        {
            BrowserStateRepository = browserStateRepository;
        }

        public void Process(Kolossi.Tub.Messages.WebRequest.BeforeRedirect message) {}
        public void Process(Kolossi.Tub.Messages.WebRequest.BeforeRequest message) {}
        public void Process(Kolossi.Tub.Messages.WebRequest.Completed message) {}
        public void Process(Kolossi.Tub.Messages.WebRequest.ErrorOccurred message) {}
        public void Process(Kolossi.Tub.Messages.WebNavigation.Completed message) {}
        public void Process(Kolossi.Tub.Messages.WebNavigation.CreatedNavigationTarget message) {}
        public void Process(Kolossi.Tub.Messages.WebNavigation.ErrorOccurred message) {}
        public void Process(Kolossi.Tub.Messages.WebNavigation.HistoryStateUpdated message) {}
        public void Process(Kolossi.Tub.Messages.WebNavigation.ReferenceFragmentUpdated message) {}
        public void Process(Kolossi.Tub.Messages.Tabs.Attached message) {}
        public void Process(Kolossi.Tub.Messages.Tabs.Detached message) {}
        public void Process(Kolossi.Tub.Messages.Tabs.Removed message) {}
        public void Process(Kolossi.Tub.Messages.Tabs.Replaced message) {}
        public void Process(Kolossi.Tub.Messages.Tabs.Updated message) {}
   }
}