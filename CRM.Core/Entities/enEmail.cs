namespace GS1Peru.Core.Entities
{
    public class enEmail
    {
        public string[] To { get; set; }
        public string[] CC { get; set; }
        public string[] BCC { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public string[] Attachments { get; set; }
        public string Server { get; set; }
        public string Port { get; set; }
        public string From { get; set; }
        public string Password { get; set; }
        public string AliasName { get; set; }
        public string AliasAccount { get; set; }
        public bool? IsHTML { get; set; }
        public bool? IsSSL { get; set; }
    }
}