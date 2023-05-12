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
    }
}