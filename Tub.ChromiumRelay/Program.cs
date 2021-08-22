using System;
using System.Linq;
using NativeMessaging;

namespace Kolossi.Tub
{
    // thanks: https://icon-library.com/icon/bathroom-icon-4.html
    // thanks: https://github.com/acandylevey/NativeMessaging
    // https://developer.chrome.com/docs/apps/nativeMessaging/#native-messaging-debugging
    class Program
    {
         static ChromiumMessagingHost Host;

        static void Main(string[] args)
        {
            Host = new ChromiumMessagingHost();
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
