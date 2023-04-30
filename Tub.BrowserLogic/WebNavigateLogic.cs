using System;
using Kolossi.Tub.Messages;

namespace Tub.BrowserLogic
{
    //%%% see https://www.c-sharpcorner.com/article/blazor-wasm-calling-javascript-from-c-sharp-vice-versa/
    public class WebNavigateLogic
    {
        public BeforeWebNavigateResponse GetResponse(BeforeWebNavigateRequest request)
        {
            if (request.FrameId != 0 || request.Type != "main_frame" || request.Method.ToUpper() != "GET")
            {
                return new BeforeWebNavigateResponse() { Cancel = false };
            }
            return new BeforeWebNavigateResponse() { Cancel = false };
        }
    }

    // public static class JSTest
    // {
    //     [JSInvokable(TestMethod)]
    //     public static string TestMethod(string foo)
    //     {
    //         return string.Format("Foo: {0}", foo);
    //     }
    // }
}
