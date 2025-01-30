using System.Collections.Generic;

namespace GS1Peru.Core.Entities.Mail
{
    public class MailMessage
    {
        public MailAddress From { get; set; }
        public List<string> To { get; set; }
        public List<string> CC { get; set; }
        public List<string> BCC { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public bool IsPriority { get; set; }
        public List<Attachment> Attachments { get; set; }
        public List<LinkedResource> LinkedResources { get; set; }
    }
}
