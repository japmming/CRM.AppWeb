using System.Configuration;

namespace GS1Peru.Core.Helpers
{
    public class AppSettings
    {
        public static string Get(string name)
        {
            if (ConfigurationManager.AppSettings[name] != null)
                return ConfigurationManager.AppSettings[name].ToString();
            else
                return "";
        }
    }
}