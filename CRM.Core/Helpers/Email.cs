using GS1Peru.Core.Entities;
using System;
using System.Net;
using System.Net.Mail;

namespace GS1Peru.Core.Helpers
{
    public class Email
    {
        public static bool Send(enEmail oEmail)
        {
            bool success = false;
            try
            {
                oEmail.Server = oEmail.Server ?? AppSettings.Get("_EmailServer");
                oEmail.Port = oEmail.Port ?? AppSettings.Get("_EmailPort");
                oEmail.From = oEmail.From ?? AppSettings.Get("_EmailFrom");
                oEmail.Password = oEmail.Password ?? AppSettings.Get("_EmailPassword");
                oEmail.Subject = oEmail.Subject ?? AppSettings.Get("_EmailSubject");
                oEmail.Content = oEmail.Content ?? AppSettings.Get("_EmailContent");
                oEmail.AliasName = oEmail.AliasName ?? AppSettings.Get("_EmailAliasName");
                oEmail.AliasAccount = oEmail.AliasAccount ?? AppSettings.Get("_EmailAliasAccount");
                oEmail.IsHTML = oEmail.IsHTML == null ? Boolean.Parse(AppSettings.Get("_EmailEnableHTML")) : oEmail.IsHTML.Value;
                oEmail.IsSSL = oEmail.IsSSL == null ? Boolean.Parse(AppSettings.Get("_EmailEnableSSL")) : oEmail.IsSSL.Value;
                MailMessage eMail = new MailMessage();
                eMail.Subject = oEmail.Subject;
                eMail.Body = oEmail.Content;
                eMail.IsBodyHtml = oEmail.IsHTML.Value;
                eMail.From = new MailAddress(oEmail.AliasAccount, oEmail.AliasName);
                eMail.Sender = new MailAddress(oEmail.AliasAccount, oEmail.AliasName);
                if (oEmail.To != null && oEmail.To.Length > 0)
                {
                    foreach (string to in oEmail.To)
                    {
                        eMail.To.Add(new MailAddress(to));
                    }
                }
                if (oEmail.CC != null && oEmail.CC.Length > 0)
                {
                    foreach (string cc in oEmail.CC)
                    {
                        eMail.CC.Add(new MailAddress(cc));
                    }
                }
                if (oEmail.BCC != null && oEmail.BCC.Length > 0)
                {
                    foreach (string cco in oEmail.BCC)
                    {
                        eMail.Bcc.Add(new MailAddress(cco));
                    }
                }
                if (oEmail.Attachments != null && oEmail.Attachments.Length > 0)
                {
                    foreach (string aa in oEmail.Attachments)
                    {
                        eMail.Attachments.Add(new Attachment(aa));
                    }
                }
                SmtpClient smtp = new SmtpClient();
                smtp.Host = oEmail.Server;
                int n;
                bool res = int.TryParse(oEmail.Port, out n);
                if (!res) n = 25;
                smtp.Port = n;
                smtp.EnableSsl = oEmail.IsSSL.Value;
                smtp.UseDefaultCredentials = false;
                smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtp.Credentials = new NetworkCredential(oEmail.From, oEmail.Password);
                smtp.Send(eMail);
                success = true;
            }
            catch (Exception ex)
            {
                GenerateTextFile<Exception>.FromObject(ex, string.Empty);
            }
            return (success);
        }
    }
}