using Kolossi.Tub.BrowserLogic;

namespace Kolossi.Tub.Tests
{
    public class BrowserStateRepostioryTests
    {
        ILogger logger = loggerFactory.CreateLogger<BrowserStateRepostioryTests>();

        [Fact]
        public void NewTabCreated()
        {
            var browserStateRepository = new BrowserStateRepostiory(logger);
            browserStateRepository.

        }
    }
}