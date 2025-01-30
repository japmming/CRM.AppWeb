using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Net.Mail;
using System.Threading;
using System.Threading.Tasks;
using io = System.IO;

namespace GS1Peru.Core.Helpers
{
    public class ExcepcionCorreo
    {
        public static async Task<string> EnviarCorreoAWS(string plantilla, string correo_destinatario, string ruta_logo, string ruta_header, string ruta_image_usuario,
    string ruta_imagen_telefono, string ruta_imagen_celular, string ruta_imagen_correo, List<string> lista_ruta_archivo_pdf = null, string correo_confirmacion = "",
    string asuntoCorreo = "", string correo_origen = "", string correo_origen_alias = "", List<string> tipyFile = null, List<string> NameFile = null,
    string correo_copia_asesor = "", bool enviar_correo = true, string nom_asociado = "", string COD_USER = "", string nom_empresa = "")
        {
            bool exito = true;
            string id_correo = "";
            //exito &= (!(ruta_logo == ""));

            exito &= (!(plantilla == ""));
            exito &= (!(correo_destinatario == ""));
            exito &= (!(asuntoCorreo == ""));

            if (exito)
            {
                bool IsDeveloper = (AppSettings.Get("_IsDeveloper") == "true");
                io.FileStream fs = null;

                try
                {
                    MailMessage emailStuff = new MailMessage();

                    List<string> emailTo = new List<string>();
                    List<string> emailCC = new List<string>();
                    List<string> emailBCC = new List<string>();
                    List<Entities.Mail.LinkedResource> emailLinkedResources = new List<Entities.Mail.LinkedResource>();
                    Entities.Mail.LinkedResource ItemLinkedResource;
                    List<Entities.Mail.Attachment> emailAttachments = new List<Entities.Mail.Attachment>();
                    Entities.Mail.Attachment ItemAttachment;

                    if (AppSettings.Get("_SentEmailAWS") == "true")
                    {
                        emailStuff.From = new MailAddress(correo_origen, (IsDeveloper ? "PRUEBA DEV " : "") + correo_origen_alias);
                        emailStuff.Sender = new MailAddress(correo_origen, (IsDeveloper ? "PRUEBA DEV " : "") + correo_origen_alias);
                    }
                    else
                    {
                        emailStuff.From = new MailAddress(ConfigurationManager.AppSettings["_EmailFrom"], (IsDeveloper ? "PRUEBA DEV " : "") + "Activate - GS1 Perú");
                        emailStuff.Sender = new MailAddress(ConfigurationManager.AppSettings["_EmailFrom"], (IsDeveloper ? "PRUEBA DEV " : "") + "Activate - GS1 Perú");
                        emailStuff.CC.Add(correo_origen);
                        emailCC.Add(correo_origen);
                    }

                    emailStuff.To.Add(correo_destinatario);
                    emailTo.Add(correo_destinatario);

                    if (correo_confirmacion != "" && correo_confirmacion.Length > 0)
                    {
                        emailStuff.CC.Add(correo_confirmacion);
                        emailCC.Add(correo_confirmacion);
                    }

                    if (correo_copia_asesor != "" && correo_copia_asesor.Length > 0)
                    {
                        emailStuff.CC.Add(correo_copia_asesor);
                        emailCC.Add(correo_copia_asesor);
                    }

                    emailStuff.Subject = (IsDeveloper ? "PRUEBA DEV " : "") + asuntoCorreo;
                    emailStuff.Priority = MailPriority.High;
                    //emailStuff.IsBodyHtml =  (ConfigurationManager.AppSettings["_EmailEnableHTML"] == "true");
                    emailStuff.IsBodyHtml = false;

                    AlternateView alternateView = AlternateView.CreateAlternateViewFromString(plantilla, null, "text/html");

                    if (ruta_header != "")
                    {
                        LinkedResource resourceHeader = new LinkedResource(ruta_header, "image/gif");
                        resourceHeader.ContentId = "imagen_header";
                        alternateView.LinkedResources.Add(resourceHeader);

                        ItemLinkedResource = new Entities.Mail.LinkedResource
                        {
                            FileName = ruta_header,
                            MediaType = "image/gif",
                            ContentId = "imagen_header"
                        };
                        emailLinkedResources.Add(ItemLinkedResource);
                    }

                    if (ruta_logo != "")
                    {
                        LinkedResource resourceLogo = new LinkedResource(ruta_logo, "image/jpeg");
                        resourceLogo.ContentId = "imagen_logo";
                        alternateView.LinkedResources.Add(resourceLogo);

                        ItemLinkedResource = new Entities.Mail.LinkedResource
                        {
                            FileName = ruta_logo,
                            MediaType = "image/jpeg",
                            ContentId = "imagen_logo"
                        };
                        emailLinkedResources.Add(ItemLinkedResource);
                    }

                    if (ruta_image_usuario != "")
                    {
                        LinkedResource resourceUsuario = new LinkedResource(ruta_image_usuario, "image/jpeg");
                        resourceUsuario.ContentId = "imagen_usuario";
                        alternateView.LinkedResources.Add(resourceUsuario);

                        ItemLinkedResource = new Entities.Mail.LinkedResource
                        {
                            FileName = ruta_image_usuario,
                            MediaType = "image/jpeg",
                            ContentId = "imagen_usuario"
                        };
                        emailLinkedResources.Add(ItemLinkedResource);
                    }

                    if (ruta_imagen_telefono != "")
                    {
                        LinkedResource resourceTelefono = new LinkedResource(ruta_imagen_telefono, "image/jpeg");
                        resourceTelefono.ContentId = "imagen_telefono";
                        alternateView.LinkedResources.Add(resourceTelefono);

                        ItemLinkedResource = new Entities.Mail.LinkedResource
                        {
                            FileName = ruta_imagen_telefono,
                            MediaType = "image/jpeg",
                            ContentId = "imagen_telefono"
                        };
                        emailLinkedResources.Add(ItemLinkedResource);
                    }

                    if (ruta_imagen_celular != "")
                    {
                        LinkedResource resourceCelular = new LinkedResource(ruta_imagen_celular, "image/jpeg");
                        resourceCelular.ContentId = "imagen_celular";
                        alternateView.LinkedResources.Add(resourceCelular);

                        ItemLinkedResource = new Entities.Mail.LinkedResource
                        {
                            FileName = ruta_imagen_celular,
                            MediaType = "image/jpeg",
                            ContentId = "imagen_celular"
                        };
                        emailLinkedResources.Add(ItemLinkedResource);
                    }

                    if (ruta_imagen_correo != "")
                    {
                        LinkedResource resourceCorreo = new LinkedResource(ruta_imagen_correo, "image/jpeg");
                        resourceCorreo.ContentId = "imagen_correo";
                        alternateView.LinkedResources.Add(resourceCorreo);

                        ItemLinkedResource = new Entities.Mail.LinkedResource
                        {
                            FileName = ruta_imagen_correo,
                            MediaType = "image/jpeg",
                            ContentId = "imagen_correo"
                        };
                        emailLinkedResources.Add(ItemLinkedResource);
                    }

                    emailStuff.AlternateViews.Add(alternateView);

                    if (lista_ruta_archivo_pdf != null && lista_ruta_archivo_pdf.Count > 0)
                    {
                        string NameCartillaInfo = "";
                        string NameFileCartilla = "";
                        int nCount = 0;

                        if (NameFile != null)
                        {
                            nCount = NameFile.Count;
                        }

                        if (tipyFile == null || tipyFile.Count == 0)
                        {
                            tipyFile = new List<string>
                            {
                                "application/pdf"
                            };
                        }

                        for (int i = 0; i < lista_ruta_archivo_pdf.Count; i++)
                        {
                            NameCartillaInfo = io.Path.GetFileName(lista_ruta_archivo_pdf[i]);

                            NameFileCartilla = (nCount > 0) ? NameFile[i] : NameCartillaInfo;

                            fs = new io.FileStream(lista_ruta_archivo_pdf[i], io.FileMode.Open, io.FileAccess.Read, io.FileShare.ReadWrite);

                            emailStuff.Attachments.Add(new Attachment(fs, NameFileCartilla, tipyFile[i]));

                            ItemAttachment = new Entities.Mail.Attachment
                            {
                                FileName = lista_ruta_archivo_pdf[i],
                                Name = NameFileCartilla,
                                MediaType = tipyFile[i]
                            };

                            emailAttachments.Add(ItemAttachment);
                        }
                    }

                    Entities.Mail.MailMessage mailMessage = new Entities.Mail.MailMessage
                    {
                        From = new Entities.Mail.MailAddress(emailStuff.From.Address, emailStuff.From.DisplayName),
                        To = emailTo,
                        CC = emailCC,
                        BCC = emailBCC,
                        Subject = emailStuff.Subject,
                        Content = plantilla,
                        IsPriority = true,
                        Attachments = emailAttachments,
                        LinkedResources = emailLinkedResources,
                    };
                    //Console.WriteLine(customer);

                    if (enviar_correo)
                    {
                        if (AppSettings.Get("_SentEmailAWS") == "true")
                        {
                            AWSEmailSevice emailContaint = new AWSEmailSevice();
                            exito = await emailContaint.SendMail(emailStuff);
                        }
                        else
                        {
                            NetworkCredential NetworkCred = new NetworkCredential(ConfigurationManager.AppSettings["_EmailFrom"], ConfigurationManager.AppSettings["_EmailPassword"]);

                            SmtpClient client = new SmtpClient
                            {
                                //DeliveryMethod = SmtpDeliveryMethod.Network,
                                Host = ConfigurationManager.AppSettings["_EmailServer"],
                                EnableSsl = (ConfigurationManager.AppSettings["_EmailEnableSSL"] == "true"),
                                UseDefaultCredentials = (ConfigurationManager.AppSettings["_EmailUseDefaultCredentials"] == "true"),
                                Credentials = NetworkCred,
                                Port = int.Parse(ConfigurationManager.AppSettings["_EmailPort"])
                            };

                            using (var cts = new CancellationTokenSource(60000))
                            {
                                cts.Token.Register(client.SendAsyncCancel);
                                await client.SendMailAsync(emailStuff);
                                exito = true;
                            }
                        }
                    }

                }
                catch (Exception ex)
                {

                    //GenerateTextFile<Exception>.FromObject(ex, string.Empty);
                    if (fs != null)
                    {
                        fs.Close();
                    }
                }
                finally
                {
                    if (fs != null)
                    {
                        fs.Close();
                    }
                }
            }

            return id_correo;
        }
    }
}
