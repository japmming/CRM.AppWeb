using Amazon;
using Amazon.Runtime;
using Amazon.SimpleEmailV2;
using Amazon.SimpleEmailV2.Model;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Net.Mail;
using System.Reflection;
using System.Threading.Tasks;

namespace GS1Peru.Core.Helpers
{
    public class AWSEmailSevice
    {
        bool _isMailSent = false;
        public List<string> AttachedFiles = new List<string>();
        public string Template = string.Empty;
        public string _finalTemplate = string.Empty;
        public Dictionary<string, string> Replacements = new Dictionary<string, string>();
        public MailAddress To;

        public async Task<bool> SendMail(MailMessage mailMessage)
        {
            try
            {
                if (mailMessage != null)
                {
                    mailMessage.Priority = MailPriority.High;
                    mailMessage.IsBodyHtml = true;

                    if (AttachedFiles != null && AttachedFiles.Count > 0)
                    {
                        mailMessage.Attachments.Clear();
                        Attachment atchFile = null;
                        foreach (string AttachedFile in AttachedFiles)
                        {
                            atchFile = new Attachment(AttachedFile);
                            mailMessage.Attachments.Add(atchFile);
                        }
                    }

                    if (!string.IsNullOrEmpty(Template))
                        _finalTemplate = File.ReadAllText(Template);

                    if (Replacements.Count > 0)
                    {
                        if (string.IsNullOrEmpty(_finalTemplate))
                        {
                            throw new Exception("Set Template field (i.e. file path) while using replacement field");
                        }

                        foreach (var item in Replacements)
                        {
                            _finalTemplate = _finalTemplate.Replace(item.Key.ToString(), item.Value.ToString());
                        }
                    }

                    var message = mailMessage;
                    var stream = FromMailMessageToMemoryStream(message);

                    BasicAWSCredentials credentials = new BasicAWSCredentials(ConfigurationManager.AppSettings["_AWSAccessKeyID"], ConfigurationManager.AppSettings["_AWSSecretAccessKey"]);

                    using (AmazonSimpleEmailServiceV2Client client = new AmazonSimpleEmailServiceV2Client(credentials, RegionEndpoint.USWest2))
                    {                        
                        SendEmailRequest emailRequest = new SendEmailRequest { Content = new EmailContent { Raw = new RawMessage { Data = stream } } };
                        await client.SendEmailAsync(emailRequest);

                        _isMailSent = true;
                    }
                }
                else
                {
                    _isMailSent = false;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return _isMailSent;
        }

        private MemoryStream FromMailMessageToMemoryStream(MailMessage message)
        {
            Assembly assembly = typeof(SmtpClient).Assembly;

            Type mailWriterType = assembly.GetType("System.Net.Mail.MailWriter");

            MemoryStream stream = new MemoryStream();

            ConstructorInfo mailWriterContructor =
               mailWriterType.GetConstructor(BindingFlags.Instance | BindingFlags.NonPublic, null, new[] { typeof(Stream) }, null);
            object mailWriter = mailWriterContructor.Invoke(new object[] { stream });

            MethodInfo sendMethod =
               typeof(MailMessage).GetMethod("Send", BindingFlags.Instance | BindingFlags.NonPublic);

            if (sendMethod.GetParameters().Length == 3)
            {
                sendMethod.Invoke(message, BindingFlags.Instance | BindingFlags.NonPublic, null, new[] { mailWriter, true, true }, null); // .NET 4.x
            }
            else
            {
                sendMethod.Invoke(message, BindingFlags.Instance | BindingFlags.NonPublic, null, new[] { mailWriter, true }, null); // .NET < 4.0 
            }

            MethodInfo closeMethod =
               mailWriter.GetType().GetMethod("Close", BindingFlags.Instance | BindingFlags.NonPublic);
            closeMethod.Invoke(mailWriter, BindingFlags.Instance | BindingFlags.NonPublic, null, new object[] { }, null);

            return stream;
        }
    }
}