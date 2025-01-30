namespace GS1Peru.AppWeb.Controllers.Entities.Email
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