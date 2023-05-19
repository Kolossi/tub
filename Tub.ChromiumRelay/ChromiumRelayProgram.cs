using System;
using System.Linq;
using Microsoft.Extensions.Logging;
using NativeMessaging;

namespace Kolossi.Tub.ChromiumRelay
{
    // thanks: https://icon-library.com/icon/bathroom-icon-4.html
    // thanks: https://github.com/acandylevey/NativeMessaging
    // https://developer.chrome.com/docs/apps/nativeMessaging/#native-messaging-debugging
    class ChromiumRelayProgram
    {
        static ChromiumMessagingHost Host;
        
        static ILogger Logger;

        static void Main(string[] args)
        {
            using var loggerFactory = LoggerFactory.Create(builder =>
            {
                builder
                    .AddFilter("Microsoft", LogLevel.Warning)
                    .AddFilter("System", LogLevel.Warning)
                    .AddFilter("Kolossi.Tub.ChromiumRelay.ChromiumRelayProgram", LogLevel.Debug)
                    .AddConsole();
            });

            ILogger logger = loggerFactory.CreateLogger<ChromiumRelayProgram>();
            
            Host = new ChromiumMessagingHost(logger);
            Host.SupportedBrowsers.Add(ChromiumBrowser.GoogleChrome);
            Host.SupportedBrowsers.Add(ChromiumBrowser.MicrosoftEdge);

            if (args.Contains("--register"))
            {
                Host.Hookup();
            }
            else if (args.Contains("--unregister"))
            {
                Host.Unregister();
            }
            else
            {
                Host.Listen();
            }
        }
    }
}
