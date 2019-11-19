using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace PdfOnTheFly
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args)
        {
            string envi = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build()
                .GetSection("GeneralOptions")
                .GetValue<string>("EnvironmentName");

            return WebHost.CreateDefaultBuilder(args)
                .UseEnvironment(envi)
                .ConfigureAppConfiguration((builderContext, config) => { })
                .ConfigureLogging((hostingContext, logging) => { logging.AddEventLog(); })
                .UseStartup<Startup>()
                .Build();
        }
    }
}
