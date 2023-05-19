using Kolossi.Tub.BrowserLogic;
using Microsoft.Extensions.Logging;
using NativeMessaging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Reflection;

namespace Kolossi.Tub.ChromiumRelay
{

    public class ChromiumMessagingHost : Host
    {
        private ILogger Logger;
        
        static string[] AllowedOrigins = new string[] { "chrome-extension://kbahcfhlnligomppankjnnljjoghnnkf/" };
        static string Description = "Tub - The Ultimate Browser";

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
        
        private MessageProcessor MessageProcessor;

        public ChromiumMessagingHost(ILogger logger) : base(SendConfirmationReceipt)
        {
            Logger=logger;
            MessageProcessor=new MessageProcessor(logger);
            ManifestPath = Path.Combine(AssemblyLoadDirectory, Hostname + "-manifest.json");
        }

        protected override void ProcessReceivedMessage(JObject data)
        {
            DumpText($"{DateTime.Now:s} : {JsonConvert.SerializeObject( data, Formatting.Indented )}");

            var dataType = data["type"].ToString();

            switch (dataType)
            {
                case "Kolossi.Tub.Messsages.WebRequest.BeforeRedirect":
                    MessageProcessor.Process(data.ToObject<Kolossi.Tub.Messages.WebRequest.BeforeRedirect>());
                    break;
                case "Kolossi.Tub.Messsages.WebRequest.BeforeRequest":
                    MessageProcessor.Process(data.ToObject<Kolossi.Tub.Messages.WebRequest.BeforeRequest>());
                    break;
                case "Kolossi.Tub.Messsages.WebRequest.Completed":
                    MessageProcessor.Process(data.ToObject<Kolossi.Tub.Messages.WebRequest.Completed>());
                    break;
                case "Kolossi.Tub.Messsages.WebRequest.ErrorOccurred":
                    MessageProcessor.Process(data.ToObject<Kolossi.Tub.Messages.WebRequest.ErrorOccurred>());
                    break;
                case "Kolossi.Tub.Messsages.WebNavigation.Completed":
                    MessageProcessor.Process(data.ToObject<Kolossi.Tub.Messages.WebNavigation.Completed>());
                    break;
                case "Kolossi.Tub.Messsages.WebNavigation.CreatedNavigationTarget":
                    MessageProcessor.Process(data.ToObject<Kolossi.Tub.Messages.WebNavigation.CreatedNavigationTarget>());
                    break;
                case "Kolossi.Tub.Messsages.WebNavigation.ErrorOccurred":
                    MessageProcessor.Process(data.ToObject<Kolossi.Tub.Messages.WebNavigation.ErrorOccurred>());
                    break;
                case "Kolossi.Tub.Messsages.WebNavigation.HistoryStateUpdated":
                    MessageProcessor.Process(data.ToObject<Kolossi.Tub.Messages.WebNavigation.HistoryStateUpdated>());
                    break;
                case "Kolossi.Tub.Messsages.WebNavigation.ReferenceFragmentUpdated":
                    MessageProcessor.Process(data.ToObject<Kolossi.Tub.Messages.WebNavigation.ReferenceFragmentUpdated>());
                    break;
                case "Kolossi.Tub.Messsages.Tabs.Attached":
                    MessageProcessor.Process(data.ToObject<Kolossi.Tub.Messages.Tabs.Attached>());
                    break;
                case "Kolossi.Tub.Messsages.Tabs.Detached":
                    MessageProcessor.Process(data.ToObject<Kolossi.Tub.Messages.Tabs.Detached>());
                    break;
                case "Kolossi.Tub.Messsages.Tabs.Removed":
                    MessageProcessor.Process(data.ToObject<Kolossi.Tub.Messages.Tabs.Removed>());
                    break;
                case "Kolossi.Tub.Messsages.Tabs.Replaced":
                    MessageProcessor.Process(data.ToObject<Kolossi.Tub.Messages.Tabs.Replaced>());
                    break;
                case "Kolossi.Tub.Messsages.Tabs.Updated":
                    MessageProcessor.Process(data.ToObject<Kolossi.Tub.Messages.Tabs.Updated>());
                    break;
                default:
                    throw new InvalidDataException($"Unrecognised message type {dataType}");
            }


            // %%% see https://docs.microsoft.com/en-us/dotnet/standard/io/how-to-use-named-pipes-for-network-interprocess-communication
            // %%% see  https://docs.microsoft.com/en-us/aspnet/core/grpc/basics?view=aspnetcore-5.0

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