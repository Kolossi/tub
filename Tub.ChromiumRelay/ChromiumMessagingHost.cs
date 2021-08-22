using System;
using System.IO;
using System.Reflection;
using NativeMessaging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Kolossi.Tub
{

    public class ChromiumMessagingHost : Host
    {
        static string[] AllowedOrigins = new string[] { "chrome-extension://ljoejfleopffmmhcdnaiobcbeafhbdca/" };
        static string Description = "Tub - The Ultimate Bookmarker";

        static public string AssemblyLoadDirectory
        {
            get
            {
                string codeBase = Assembly.GetEntryAssembly().Location;
                UriBuilder uri = new UriBuilder(codeBase);
                string path = Uri.UnescapeDataString(uri.Path);
                return Path.GetDirectoryName(path);
            }
        }
        static public string AssemblyExecuteablePath
        {
            get
            {
                string codeBase = Assembly.GetEntryAssembly().Location;
                UriBuilder uri = new UriBuilder(codeBase);
                return Uri.UnescapeDataString(uri.Path);
            }
        }
        private const bool SendConfirmationReceipt = false;

        private readonly string ManifestPath;

        public override string Hostname
        {
            get { return "uk.co.kolossi.tub"; }
        }

        public ChromiumMessagingHost() : base(SendConfirmationReceipt)
        {
            ManifestPath = Path.Combine(AssemblyLoadDirectory, Hostname + "-manifest.json");
        }

        protected override void ProcessReceivedMessage(JObject data)
        {
            DumpText($"{DateTime.Now:s} : {JsonConvert.SerializeObject( data, Formatting.Indented )}");
        }

        private void DumpText(string text)
        {
            string path=@"C:\Temp\tub.log";
            using (var sw=File.AppendText(path))
            {
                sw.WriteLine(text);
            }
        }

        public void Hookup()
        {
                GenerateManifest(Description, AllowedOrigins, overwrite: true);
                FixupManifest();
                Register();
        }

        private void FixupManifest()
        {
            var manifestExePath = AssemblyExecuteablePath;
            if (manifestExePath.EndsWith(".exe")) return;
            var exePath = Path.Join(Path.GetDirectoryName(manifestExePath), Path.GetFileNameWithoutExtension(manifestExePath)) + ".exe";
            var uri = new UriBuilder(exePath);
            exePath = Uri.UnescapeDataString(uri.Path);
            var manifestContent = File.ReadAllText(ManifestPath);
            manifestContent = manifestContent.Replace(manifestExePath,exePath);
            File.WriteAllText(ManifestPath,manifestContent);
        }


    }
}