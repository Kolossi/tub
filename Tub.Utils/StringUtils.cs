using System.Text.RegularExpressions;

namespace Kolossi.Tub.Utils
{

    public static class StringUtils
    {
        
        
        public static bool IsNullOrEmpty(this string value)
        {
            return (string.IsNullOrEmpty(value));
        }

        public static bool IsNullOrWhiteSpace(this string value)
        {
            return (string.IsNullOrWhiteSpace(value));
        }

        public static string TidyUrl(this string url)
        {
            return Regex.Replace(url,"[\\/]+$",string.Empty,RegexOptions.Compiled);
        }

    }
}
