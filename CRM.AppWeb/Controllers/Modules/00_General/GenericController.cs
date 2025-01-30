using GS1Peru.AppWeb.Controllers.Core;
using GS1Peru.Core.Entities;
using GS1Peru.Core.Entities.IP;
using GS1Peru.Core.Helpers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Mvc;
using io = System.IO;

namespace GS1Peru.AppWeb.Controllers.Modules.General
{
    public class GenericController : BaseController
    {
        public async Task<string> Generic_ListasGenericas(string data)
        {
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                DataSQL odaSQL = new DataSQL();
                response = await odaSQL.ExecuteCommand("dbo.CSV_LISTAS_GENERICAS_SP", data);
            }
            return Ok(response);
        }

        public async Task<string> GetRUC(string data)
        {
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                if (data.Length == 8)
                {
                    response.Success = true;
                    response.Data = await ClienteHttp.PostText("http://193.164.131.253", "pcj/servicio", "CONTRIBUYENTE_SUNAT/ObtenerContribuyente", data);
                }
                else
                {
                    DataSQL odaSQL = new DataSQL();
                    response = await odaSQL.ExecuteCommand("dbo.CSV_CONTRIBUYENTE_LISTXCOD_SP", data, "@RUC");
                }
            }
            return Ok(response);
        }

        public static async Task<StatusResponse> ObtenerContribuyente(string Data)
        {
            StatusResponse response = new StatusResponse();

            /*
                string rpta = string.Empty;

                HttpClient proxy = new HttpClient
                {
                    BaseAddress = new Uri("http://aplicaciones007.jne.gob.pe")
                };
                proxy.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                proxy.DefaultRequestHeaders.Add("Requestverificationtoken", "30OB7qfO2MmL2Kcr1z4S0ttQcQpxH9pDUlZnkJPVgUhZOGBuSbGU4qM83JcSu7DZpZw-IIIfaDZgZ4vDbwE5-L9EPoBIHOOC1aSPi4FS_Sc1:clDOiaq7mKcLTK9YBVGt2R3spEU8LhtXEe_n5VG5VLPfG9UkAQfjL_WT9ZDmCCqtJypoTD26ikncynlMn8fPz_F_Y88WFufli38cUM-24PE1");
                string UrlEjecutar = "/srop_publico/Consulta/api/AfiliadoApi/GetNombresCiudadano";
                var values = new Dictionary<string, string>() { { "CODDNI", Data } };
                FormUrlEncodedContent content = new FormUrlEncodedContent(values);
                HttpResponseMessage rpta_http = await proxy.PostAsync(UrlEjecutar, content);
                if (rpta_http.StatusCode.Equals(HttpStatusCode.OK))
                {
                    rpta = await rpta_http.Content.ReadAsStringAsync();
                }
                rpta_http.Dispose();
                proxy.Dispose();
                string[] VI_COLUMNS_01 = rpta.Split(',');
                string[] VI_COLUMNS_02 = VI_COLUMNS_01[0].Split(':');
                response = new StatusResponse
                {
                    Success = true,
                    Data = VI_COLUMNS_02[1].Replace("\"", "")
                };
            */
            //https://eldni.com/buscar-por-dni?dni=43936066
            //https://dniruc.apisperu.com/api/v1/dni/43936066?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Impob255ZnJhbmtAZ21haWwuY29tIn0.lCdP2XhTDXqDn7rJoJELYt1S_Y1kZGjO70cDdSJimwM

            string data_get = string.Empty;
            try
            {
                HttpClient proxy = new HttpClient
                {
                    BaseAddress = new System.Uri("https://eldni.com"),
                    Timeout = System.TimeSpan.FromMinutes(30)
                };
                string UrlEjecutar = "/buscar-por-dni?dni=" + Data;
                HttpResponseMessage rpta = await proxy.GetAsync(UrlEjecutar);
                if (rpta.StatusCode.Equals(System.Net.HttpStatusCode.OK))
                {
                    data_get = await rpta.Content.ReadAsStringAsync();
                }
                rpta.Dispose();
                proxy.Dispose();
                string str_find_ini = "<tbody>";
                int posicion_01 = data_get.IndexOf(str_find_ini) + str_find_ini.Length;
                int posicion_02 = data_get.IndexOf("</tbody>");
                if (posicion_01 > str_find_ini.Length)
                {
                    data_get = data_get.Substring(posicion_01, posicion_02 - posicion_01);
                    string[] spearator = { "<td class=\"text-left\">", "</td>" };
                    data_get = data_get.Replace("\n", "").Replace("<tr>", "").Replace("</tr>", "");
                    string[] data_a = data_get.Split(spearator, System.StringSplitOptions.RemoveEmptyEntries);
                    data_get = data_a[3] + "|" + data_a[5] + "|" + data_a[1];
                }
                else
                {
                    data_get = string.Empty;
                }
                //"LLONTOP|CABALLERO|JHONY FRANK"
            }
            catch (Exception ex)
            {
                GenerateTextFile<Exception>.FromObject(ex, Data);
                data_get = "error:" + ex.Message;
            }
            response = new StatusResponse
            {
                Success = true,
                Data = data_get
            };
            return response;
        }

        public static async Task<string> EnviarCorreoAWS(string plantilla, string correo_destinatario, string ruta_logo, string ruta_header, string ruta_image_usuario,
            string ruta_imagen_telefono, string ruta_imagen_celular, string ruta_imagen_correo, List<string> lista_ruta_archivo_pdf = null, string correo_confirmacion = "",
            string asuntoCorreo = "", string correo_origen = "", string correo_origen_alias = "", List<string> tipyFile = null, List<string> NameFile = null,
            string correo_copia_asesor = "", bool enviar_correo = true, string nom_asociado = "", string COD_USER = "", string nom_empresa = "")
        {
            bool exito = true;
            string id_correo = "";
            //exito &= (!(ruta_logo == ""));

            //exito &= (!(plantilla == ""));
            exito &= (!(correo_destinatario == ""));
            exito &= (!(asuntoCorreo == ""));

            if (exito)
            {
                bool IsDeveloper = (AppSettings.Get("_IsDeveloper") == "true");
                io.FileStream fs = null;
                string customer = string.Empty;

                try
                {
                    MailMessage emailStuff = new MailMessage();

                    List<string> emailTo = new List<string>();
                    List<string> emailCC = new List<string>();
                    List<string> emailBCC = new List<string>();
                    List<Entities.Email.LinkedResource> emailLinkedResources = new List<Entities.Email.LinkedResource>();
                    Entities.Email.LinkedResource ItemLinkedResource;
                    List<Entities.Email.Attachment> emailAttachments = new List<Entities.Email.Attachment>();
                    Entities.Email.Attachment ItemAttachment;

                    if (correo_origen == "")
                    {
                        string correo_confirmacion2 = ConfigurationManager.AppSettings["_EmailConfirm"];
                        string alias_correo_confirmacion2 = "Soporte GS1 Perú";
                        emailStuff.From = new MailAddress(correo_confirmacion2, (IsDeveloper ? "PRUEBA DEV " : "") + alias_correo_confirmacion2);
                        emailStuff.Sender = new MailAddress(correo_confirmacion2, (IsDeveloper ? "PRUEBA DEV " : "") + alias_correo_confirmacion2);
                    }
                    else
                    {
                        emailStuff.From = new MailAddress(correo_origen, (IsDeveloper ? "PRUEBA DEV " : "") + correo_origen_alias);
                        emailStuff.Sender = new MailAddress(correo_origen, (IsDeveloper ? "PRUEBA DEV " : "") + correo_origen_alias);
                        emailStuff.CC.Add(correo_origen);
                        emailCC.Add(correo_origen);
                    }

                    //if (AppSettings.Get("_SentEmailAWS") == "true")
                    //{
                    //    emailStuff.From = new MailAddress(correo_origen, (IsDeveloper ? "PRUEBA DEV " : "") + correo_origen_alias);
                    //    emailStuff.Sender = new MailAddress(correo_origen, (IsDeveloper ? "PRUEBA DEV " : "") + correo_origen_alias);
                    //}
                    //else
                    //{
                    //    emailStuff.From = new MailAddress(ConfigurationManager.AppSettings["_EmailFrom"], (IsDeveloper ? "PRUEBA DEV " : "") + "Activate - GS1 Perú");
                    //    emailStuff.Sender = new MailAddress(ConfigurationManager.AppSettings["_EmailFrom"], (IsDeveloper ? "PRUEBA DEV " : "") + "Activate - GS1 Perú");
                    //    emailStuff.CC.Add(correo_origen);
                    //    emailCC.Add(correo_origen);
                    //}

                    string[] VI_DATOS_DESTINATARIO = correo_destinatario.Split(',');

                    foreach (string destinatario in VI_DATOS_DESTINATARIO)
                    {
                        emailStuff.To.Add(destinatario);
                        emailTo.Add(destinatario);
                    }

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
                    emailStuff.IsBodyHtml = (ConfigurationManager.AppSettings["_EmailEnableHTML"] == "true");

                    AlternateView alternateView = AlternateView.CreateAlternateViewFromString(plantilla, null, "text/html");

                    if (ruta_header != "")
                    {
                        LinkedResource resourceHeader = new LinkedResource(ruta_header, "image/gif");
                        resourceHeader.ContentId = "imagen_header";
                        alternateView.LinkedResources.Add(resourceHeader);

                        ItemLinkedResource = new Entities.Email.LinkedResource
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

                        ItemLinkedResource = new Entities.Email.LinkedResource
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

                        ItemLinkedResource = new Entities.Email.LinkedResource
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

                        ItemLinkedResource = new Entities.Email.LinkedResource
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

                        ItemLinkedResource = new Entities.Email.LinkedResource
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

                        ItemLinkedResource = new Entities.Email.LinkedResource
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

                            ItemAttachment = new Entities.Email.Attachment
                            {
                                FileName = lista_ruta_archivo_pdf[i],
                                Name = NameFileCartilla,
                                MediaType = tipyFile[i]
                            };

                            emailAttachments.Add(ItemAttachment);
                        }
                    }

                    Entities.Email.MailMessage mailMessage = new Entities.Email.MailMessage
                    {
                        From = new Entities.Email.MailAddress(emailStuff.From.Address, emailStuff.From.DisplayName),
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

                    customer = JsonConvert.SerializeObject(mailMessage);

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
                    else
                    {
                        string VI_FECHA = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                        //string VI_TOKEN = Guid.NewGuid().ToString().Replace("-", "");
                        //
                        //string VI_RUTAS = ruta_json_gmail + @"\" + VI_FECHA + "_" + id_ruta + "_" + VI_TOKEN + ".txt";
                        //StreamWriter sw = new StreamWriter(VI_RUTAS);
                        //sw.WriteLine(customer);
                        //sw.Close();
                        //ruta_json_gmail
                        #region Registro en tabla SINCRONIZACION_CORREO
                        StatusResponse response = new StatusResponse();
                        
                        StringBuilder sb = new StringBuilder();
                        sb.Append("¦");
                        sb.Append("INTRA");
                        sb.Append("¦");
                        sb.Append(nom_asociado);
                        sb.Append("¦");
                        sb.Append(COD_USER);
                        sb.Append("¦");
                        sb.Append(customer);
                        /*sb.Append("¦");
                        sb.Append(VI_FECHA);*/
                        sb.Append("¦");
                        sb.Append(nom_empresa);
                        //VI_LSTDAT 
                        string VI_DATA = "¯" + sb.ToString() + "¯C";
                        DataSQL odaSQL = new DataSQL();
                        response = await odaSQL.ExecuteCommand("CSV_INT_SINCRONIZACION_CORREO_V01", VI_DATA);

                        if (response.Success)
                        {
                            if (response.Data != "")
                            {
                                //Task.Run(async ()  => await General.GenericController.ConectarWebSocket(response.Data, "SendMail")).Wait();
                                await General.GenericController.ConectarWebSocket(response.Data, "SendMail");
                            }
                        }

                        //if (id_correo != "")
                        //{
                        //    if (correosIds.Length > 0)
                        //    {
                        //        correosIds.Append('¦');
                        //    }
                        //    correosIds.Append(id_correo);
                        //}


                        #endregion
                        //CSV_INT_SINCRONIZACION_CORREO_V01
                    }
                }
                catch (Exception ex)
                {
                    GenerateTextFile<Exception>.FromObject(ex, customer);

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

                    if(exito)
                    {
                        id_correo = "1";
                    }
                    else
                    {
                        id_correo = "0";
                    }

                }
            }

            return id_correo;
        }

        public static async Task<bool> ConectarWebSocket(string data, string accion)
        {
            string mensaje = "";
            StringBuilder sb = new StringBuilder();
            //sb.Append("SendMail¯");
            sb.Append(accion);
            sb.Append("¯");
            sb.Append(data);
            mensaje = sb.ToString();
            bool exito = true;
            ClientWebSocket cliente;
            CancellationTokenSource cancellationToken;

            cliente = new ClientWebSocket();
            cancellationToken = new CancellationTokenSource();

            string url = ConfigurationManager.AppSettings["_IpWebSocket"] == null ? "" : ConfigurationManager.AppSettings["_IpWebSocket"];
            if (url != "")
            {
                try
                {
                    await cliente.ConnectAsync(new Uri(url), cancellationToken.Token);
                    if (cliente.State == WebSocketState.Open)
                    {
                        await cliente.SendAsync(new ArraySegment<byte>(Encoding.UTF8.GetBytes(mensaje)),
                        WebSocketMessageType.Text, true, cancellationToken.Token);
                        await cliente.CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty, cancellationToken.Token);
                    }
                    exito = true;
                }
                catch (Exception ex)
                {
                    GenerateTextFile<Exception>.FromObject(ex, data.ToString());
                    exito = false;
                }
            }

            return exito;
        }

        public async Task<string> DASHBOARD_ASESORIA(string data)
        {
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                DataSQL odaSQL = new DataSQL();
                response = await odaSQL.ExecuteCommand("dbo.CSV_DASHBOARD_ASESORIA", data);
            }
            return Ok(response);
        }

        public FileResult DescargarArchivoPlantilla(string data)
        {
            string[] arrayDatos = data.Split('¦');
            string fase = arrayDatos[0];
            string archivo = arrayDatos[2];

            string nombreCarpeta;

            byte[] bufferFile = null;

            switch (fase)
            {
                case "1":
                    nombreCarpeta = @"\CARGA_MASIVA";
                    break;
                case "2":
                    nombreCarpeta = @"\INFORMACION_CLIENTE";
                    break;
                case "3":
                    nombreCarpeta = @"\PAGOS";
                    break;
                case "4":
                    nombreCarpeta = @"\EXTRACTO_BANCARIO";
                    break;
                default:
                    nombreCarpeta = @"\GENERAL";
                    break;
            }

            string[] archivoSeparado = archivo.Split('.');
            //int numero = archivoSeparado.Length;

            string rutaFolder = ConfigurationManager.AppSettings["FileServer"] + @"PLANTILLAS" + nombreCarpeta;

            if (archivo != "")
            {
                string rutaArchivo = io.Path.Combine(rutaFolder, archivo);

                if (io.File.Exists(rutaArchivo))
                {
                    using (io.Stream reader = new io.FileStream(rutaArchivo, io.FileMode.Open, io.FileAccess.Read, io.FileShare.ReadWrite))
                    {
                        bufferFile = new byte[reader.Length];
                        reader.Read(bufferFile, 0, bufferFile.Length);
                    }
                }
            }

            if (bufferFile != null)
            {
                return File(bufferFile, "application/octet-stream");
            }
            else
            {
                return null;
            }
        }

        public async Task<string> LST_Cliente_Asociado_Retirado_Externo(string data)
        {
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                DataSQL odaSQL = new DataSQL();
                response = await odaSQL.ExecuteCommand("dbo.CSV_CLIENTE_ASOC_RET_EXT_LST", data);
            }
            return Ok(response);
        }

        public async Task<string> ListHistorialCambioTablas(string data)
        {
            StatusResponse response = new StatusResponse();


            DataSQL odaSQL = new DataSQL();
            response = await odaSQL.ExecuteCommand("dbo.CSV_INT_HISTORIAL_TABLA_LIST", data);

            return Ok(response);
        }

        public async Task<string> ListHistorialCambioTablasProd(string data)
        {
            StatusResponse response = new StatusResponse();

            DataSQL odaSQL = new DataSQL();
            response = await odaSQL.ExecuteCommand("dbo.CSV_INT_HISTORIAL_TABLA_LST_PROD", data);

            return Ok(response);
        }

        public async Task<FileResult> ListHistorialCambioTablasProdFot(string data)
        {
            StatusResponse response = new StatusResponse();
            DataSQL odaSQL = new DataSQL();
            response = await odaSQL.ExecuteCommand("dbo.CSV_INT_HISTORIAL_TABLA_LST_PROD", data);
            List<byte> RPTA = new List<byte>();

            if (response.Success)
            {
                string[] DATA_DE_SQL = response.Data.Split('¯');
                if (DATA_DE_SQL[0] == "OK")
                {
                    StringBuilder sb = new StringBuilder();
                    string[] DATOS1 = DATA_DE_SQL[1].Split('¬');

                    string[] VI_CAMPOS;
                    string VI_ARCHIVO;

                    int nregistros = DATOS1.Length;
                    int cNo = 0;
                    io.FileInfo fi;
                    List<byte[]> imagenes = new List<byte[]>();

                    for (var i = 0; i < nregistros; i++)
                    {
                        VI_CAMPOS = DATOS1[i].Split('¦');
                        VI_ARCHIVO = io.Path.Combine(VI_CAMPOS[1], VI_CAMPOS[0]);
                        if (io.File.Exists(VI_ARCHIVO))
                        {
                            sb.Append(VI_CAMPOS[2]);
                            sb.Append("¦");
                            fi = new io.FileInfo(VI_ARCHIVO);
                            imagenes.Add(io.File.ReadAllBytes(VI_ARCHIVO));
                            sb.Append(fi.Length);
                        }
                        else
                        {
                            sb.Append("¦");
                            cNo++;
                        }
                        sb.Append("¦");
                        sb.Append(VI_CAMPOS[4]);
                        sb.Append("¦");
                        sb.Append(VI_CAMPOS[5]);
                        sb.Append("¦");
                        sb.Append(VI_CAMPOS[6]);
                        sb.Append("¦");
                        sb.Append(VI_CAMPOS[7]);
                        if (i < nregistros - 1) sb.Append(";");
                    }
                    sb.Append("¨");
                    if (cNo > 0)
                    {
                        VI_ARCHIVO = Server.MapPath("~/Resources/Images/Image_Default.png");
                        fi = new io.FileInfo(VI_ARCHIVO);
                        imagenes.Add(io.File.ReadAllBytes(VI_ARCHIVO));
                        sb.Append(fi.Length);
                    }
                    int n = sb.Length;
                    byte n1 = (byte)(n / 255);
                    byte n2 = (byte)(n % 255);
                    RPTA.Add(n1);
                    RPTA.Add(n2);
                    byte[] texto = Encoding.Default.GetBytes(sb.ToString());
                    n = sb.Length;
                    for (int i = 0; i < n; i++)
                    {
                        RPTA.Add(texto[i]);
                    }
                    n = imagenes.Count;
                    int x;
                    for (int i = 0; i < n; i++)
                    {
                        x = imagenes[i].Length;
                        for (int j = 0; j < x; j++)
                        {
                            RPTA.Add(imagenes[i][j]);
                        }
                    }

                }
            }
            else
            {
                response.Success = true;
                response.Data = "ERROR";
            }

            return File(RPTA.ToArray(), "application/octet-stream");
        }

        public static IpProperties GetCountryByIP(string ipAddress)
        {
            string ipResponse = IPRequestHelper("http://ip-api.com/json/" + ipAddress);

            IpProperties ipInfo = JsonConvert.DeserializeObject<IpProperties>(ipResponse);

            if (ipInfo == null)
            {
                ipInfo = new IpProperties();
            }

            return ipInfo;
        }

        public static string IPRequestHelper(string url)
        {
            string responseRead = string.Empty;

            HttpWebRequest objRequest = (HttpWebRequest)WebRequest.Create(url);
            objRequest.Timeout = 4000;

            try
            {
                HttpWebResponse objResponse = (HttpWebResponse)objRequest.GetResponse();

                io.StreamReader responseStream = new io.StreamReader(objResponse.GetResponseStream());
                responseRead = responseStream.ReadToEnd();

                responseStream.Close();
                responseStream.Dispose();
            }
            catch (Exception ex)
            {
                GenerateTextFile<Exception>.FromObject(ex, url);
            }

            return responseRead;
        }
    }
}