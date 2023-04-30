using System;

namespace Kolossi.Tub.Messages
{
    // https://developer.chrome.com/docs/extensions/reference/webRequest/#type-BlockingResponse
    public class BeforeWebNavigateResponse
    {
        public bool Cancel { get; set; }
        
        public string RedirectUrl { get; set; }
    }
}
