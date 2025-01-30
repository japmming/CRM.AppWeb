using System.DirectoryServices;

namespace GS1Peru.Core.Helpers
{
    public class ActiveDirectoryValidator
    {
        public SearchResult IsAuthenticated(string serverPath, string domainName, string userName, string password)
        {

            string domainAndUsername = domainName + "\\" + userName;
            DirectoryEntry entry = new DirectoryEntry(serverPath, domainAndUsername, password);

            object obj = entry.NativeObject;
            DirectorySearcher search = new DirectorySearcher(entry);
            search.Filter = "(SAMAccountName=" + userName + ")";
            search.PropertiesToLoad.Add("cn");
            search.PropertiesToLoad.Add("sAMAccountName");
            search.PropertiesToLoad.Add("givenName");
            search.PropertiesToLoad.Add("sn");
            search.PropertiesToLoad.Add("co");
            search.PropertiesToLoad.Add("title");
            search.PropertiesToLoad.Add("mail");
            search.PropertiesToLoad.Add("sAMAccountType");
            SearchResult result = search.FindOne();
            return result;
        }
    }
}