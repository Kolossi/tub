using System;
using System.Diagnostics;
using System.Linq;
// using System.Windows.Automation;
using FlaUI.UIA3;
using FlaUI.Core.Definitions;
using FlaUI.Core.AutomationElements;
using System.Collections.Generic;

namespace tub
{
    class Program
    {
        static void Main(string[] args)
        {
            //WindowsAutomation();
            FlaUIUIA3();

        }

        class PaulThing
        {
            public AutomationElement Thing;
            public int Depth = 0;
        }
        private static void FlaUIUIA3()
        {
            // var app = FlaUI.Core.Application.Attach("chrome.exe");
            using (var automation = new UIA3Automation())
            {
                var procs = Process.GetProcessesByName("chrome");
                foreach (var proc in procs)
                {
                    var app = FlaUI.Core.Application.Attach(proc);

                    var window = app.GetMainWindow(automation, new TimeSpan(0, 0, 1)); // https://www.csharpcodi.com/vs2/?source=4474/FlaUI/src/FlaUI.Core/AutomationElements/Window.cs

                    if (window == null) continue;
                    
                    var titlebar = window.TitleBar;
                    var titlebarName = titlebar?.Name;
                    //var tab = window.FindFirstChild(cf => cf.ByControlType(ControlType.Tab));
                    Console.WriteLine($"WINDOW:{window.Title} : {titlebarName}");
                    Console.WriteLine();

                    var workQueue = new Stack<PaulThing>();
                    workQueue.Push(new PaulThing() { Thing = window.Parent, Depth = 0 });

                    var maxDepth = 1;

                    while (workQueue.Any())
                    {
                        var carrier = workQueue.Pop();
                        var name = carrier.Thing?.Name;
                        ControlType controlType = ControlType.Unknown;
                        controlType= carrier.Thing.ControlType;
                        // try { controlType= carrier.Thing.ControlType; } catch {}
                        Console.WriteLine($"{new String('+', carrier.Depth)}{name}:::{controlType}");
                        var newDepth = carrier.Depth + 1;
                        if (newDepth > maxDepth) continue;
                        foreach (var subthing in carrier.Thing.FindAllChildren())
                        {
                            workQueue.Push(new PaulThing() { Thing = subthing, Depth = newDepth });
                        }
                    }

                }
            }
        }

        // private static void WindowsAutomation()
        // {
        //     Process[] procsChrome = Process.GetProcessesByName("chrome");
        //     if (!procsChrome.Any())
        //     {
        //         Console.WriteLine("Chrome is not running");
        //     }
        //     else
        //     {
        //         var chromeWindowProcs = procsChrome.Where(procsChrome => procsChrome.MainWindowHandle != IntPtr.Zero);
        //         foreach (Process proc in chromeWindowProcs)
        //         {
        //             Console.WriteLine($"{proc.Id}");
        //             // to find the tabs we first need to locate something reliable - the 'New Tab' button 
        //             AutomationElement root = AutomationElement.FromHandle(proc.MainWindowHandle);
        //             // Condition condNewTab = new PropertyCondition(AutomationElement.NameProperty, "New Tab");
        //             // AutomationElement elmNewTab = root.FindFirst(TreeScope.Descendants, condNewTab);
        //             // // get the tabstrip by getting the parent of the 'new tab' button 
        //             // TreeWalker treewalker = TreeWalker.ControlViewWalker;
        //             // AutomationElement elmTabStrip = treewalker.GetParent(elmNewTab);
        //             // // loop through all the tabs and get the names which is the page title 
        //             // Condition condTabItem = new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.TabItem);
        //             // foreach (AutomationElement tabitem in elmTabStrip.FindAll(TreeScope.Children, condTabItem))
        //             // {
        //             //     Console.WriteLine(tabitem.Current.Name);
        //             // }
        //             Condition condTab = new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.TabItem);
        //             var atab = root.FindFirst(TreeScope.Descendants, condTab);
        //             var treeWalker = TreeWalker.ControlViewWalker;
        //             var parent = treeWalker.GetParent(atab);
        //             Console.WriteLine($"{parent.Current.Name} : {parent.Current.ControlType.ProgrammaticName}");
        //             // Console.WriteLine(parent.Current.Name);
        //             // var tabs = treeWalker.GetNextSibling()
        //             // var tabs = root.FindAll(TreeScope.Descendants, condition);
        //             // foreach (AutomationElement tabitem in tabs)
        //             // {
        //             //     Console.WriteLine(tabitem.Current.Name);
        //             // }

        //             // maybe see https://docs.microsoft.com/en-us/windows/win32/winauto/uiauto-clientsoverview
        //         }
        //     }
        // }
    }
}
