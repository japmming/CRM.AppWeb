namespace GS1Peru.Core.Entities.Mail
{
    public class MailAddress
    {
        public string Address { get; set; }
        public string DisplayName { get; set; }

        public MailAddress(string address, string displayName)
        {
            Address = address;
            DisplayName = displayName;
        }
    }
}
