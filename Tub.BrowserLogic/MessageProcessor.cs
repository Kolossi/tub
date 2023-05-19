using Microsoft.Extensions.Logging;

namespace Kolossi.Tub.BrowserLogic
{
    public class MessageProcessor
    {
        private BrowserStateRepository BrowserStateRepository { get; set; }
        private ILogger Logger;

        public MessageProcessor(ILogger logger)
        {
            BrowserStateRepository = new BrowserStateRepository();
            Logger=logger;
        }

        public MessageProcessor(BrowserStateRepository browserStateRepository,
            ILogger logger)
        {
            BrowserStateRepository = browserStateRepository;
            Logger=logger;
        }

        public void Process(Kolossi.Tub.Messages.WebRequest.BeforeRedirect message) {}
        public void Process(Kolossi.Tub.Messages.WebRequest.BeforeRequest message) 
        {
            SetTabMethodAndClearUrl(message.TabId, message.Method);
            if (message.Method != Messages.MethodEnum.GET) return;
            var strategy = GetStrategy(details);
            Logger.LogDebug("tubtub:background:WebRequest.BeforeRequest:strategy:" + JSON.stringify(strategy));
            if (strategy.block) PerformStrategy(strategy);
        }
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