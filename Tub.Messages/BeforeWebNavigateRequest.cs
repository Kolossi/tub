using System;

namespace Kolossi.Tub.Messages
{
    public class BeforeWebNavigateRequest
    {
        public int FrameId { get; set; }
        
        public string Method { get; set; }
        
        public int TabId { get; set; }
        
        //msecs since epoch
        public long TimeStamp { get; set; }
        
        // https://developer.chrome.com/docs/extensions/reference/webRequest/#type-ResourceType
        public string Type { get; set; }
        public string Url { get; set; }
    }
}
