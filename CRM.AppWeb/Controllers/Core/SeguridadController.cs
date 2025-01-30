using GS1Peru.AppWeb.Controllers.Modules.General;
using GS1Peru.Core.Entities;
using GS1Peru.Core.Entities.IP;
using GS1Peru.Core.Helpers;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Configuration;
using System.IO;

namespace GS1Peru.AppWeb.Controllers.Core
{
    public class SeguridadController : BaseController
    {
        public async Task<string> IsAuthenticated(string data)
        {
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                DataSQL oDataSQL = new DataSQL();
                response = await oDataSQL.ExecuteCommand("dbo.CSV_TOKEN_VALIDAR_SP", data);
            }
            return Ok(response);
        }

        public async Task<string> ValidarDatosLoginGoogle(string data)
        {
            string[] ARR_DATA = data.Split('¦');
            string fecha = ARR_DATA[2];
            StringBuilder sb = new StringBuilder();
            sb.Append(fecha.Substring(0, 4));
            sb.Append("-");
            sb.Append(fecha.Substring(4, 2));
            sb.Append("-");
            sb.Append(fecha.Substring(6, 2));
            sb.Append(" ");
            sb.Append(fecha.Substring(8, 2));
            sb.Append(":");
            sb.Append(fecha.Substring(10, 2));
            sb.Append(":");
            sb.Append(fecha.Substring(12, 2));
            sb.Append(".000");
            fecha = sb.ToString();

            sb = new StringBuilder();
            sb.Append(ARR_DATA[0]);
            sb.Append("¦");
            sb.Append(ARR_DATA[1]);
            sb.Append("¦");
            sb.Append(fecha);
            sb.Append("¯V");
            string request = sb.ToString();
            StatusResponse response = new StatusResponse();

            if (!string.IsNullOrEmpty(data))
            {
                DataSQL oDataSQL = new DataSQL();
                response = await oDataSQL.ExecuteCommand("dbo.CSV_SYSMUSER01_LOGIN_GOOGLE_SP", request);
                if (response.Success)
                {
                    if (!string.IsNullOrEmpty(response.Data))
                    {
                        string[] ARR_DATA_RESPONSE = response.Data.Split('¯');
                        if (ARR_DATA_RESPONSE[0] == "OK")
                        {
                            if (!string.IsNullOrEmpty(ARR_DATA_RESPONSE[1]))
                            {
                                string responseDataUser = ARR_DATA_RESPONSE[1];
                                //string[] arrDataUser = responseDataUser.Split('¦');
                                //string clientIp  = arrDataUser[3];
                                //IpProperties ipProperties = GenericController.GetCountryByIP(clientIp);
                                response = new StatusResponse();
                                oDataSQL = new DataSQL();

                                //if (ipProperties.Status == "fail")
                                //{
                                //    ipProperties = new IpProperties();
                                //}
                                //responseDataUser += "¦" + "¦" + "¦" + "¦" + ipProperties.CountryCode + "¦" + ipProperties.RegionName + "¦" + ipProperties.City;

                                string version_sistema = ConfigurationManager.AppSettings["_VersionApp"];

                                responseDataUser += "¦" + version_sistema;

                                response = await oDataSQL.ExecuteCommand("dbo.CSV_SYSMUSER01_LOGIN_SP", responseDataUser);
                                if (response.Success)
                                {
                                    if (response.Data != string.Empty)
                                    {
                                        string[] GET_DATA = response.Data.Split('¯');
                                        //string FLG_INGRESO = GET_DATA[2];

                                        //if (FLG_INGRESO != "OK")
                                        //{
                                            //response.Data = "DENIED";
                                        //}
                                    }
                                }
                            }
                            else
                            {
                                response.Data = "ERROR_CORREO";
                            }
                        }
                    }
                    else
                    {
                        response.Data = "ERROR_DATA";
                    }
                }
            }
            return Ok(response);
        }

        public async Task<string> ValidarLoginUsuario(string data)
        {
            string clientIp = Request.UserHostAddress;
            data = Encrypt.Run(data, false);
            data = data.Replace("#IP_CLIENTE#", clientIp);
            StatusResponse response = new StatusResponse();
            IpProperties ipProperties = GenericController.GetCountryByIP(clientIp);

            if (!string.IsNullOrEmpty(data))
            {
                if (ipProperties.Status == "fail")
                {
                    ipProperties = new IpProperties();
                }
                data += "¦" + ipProperties.CountryCode + "¦" + ipProperties.RegionName + "¦" + ipProperties.City;

                string version_sistema = ConfigurationManager.AppSettings["_VersionApp"];

                data += "¦" + version_sistema;

                DataSQL oDataSQL = new DataSQL();
                response = await oDataSQL.ExecuteCommand("dbo.CSV_SYSMUSER01_LOGIN_SP", data);

                //if (response.Success)
                //{
                //    if (response.Data != string.Empty)
                //    {
                //        string[] GET_DATA = response.Data.Split('¯');
                //        //string FLG_INGRESO = GET_DATA[2];

                //        //if (FLG_INGRESO != "OK")
                //        //{
                //        //    response.Data = "DENIED";
                //        //}
                //    }
                //}

            }
            return Ok(response);
        }

        public async Task<ActionResult> ValidarLoginGoogle()
        {
            //string clientIp = Request.UserHostAddress;
            //string data = clientIp;

            //StatusResponse response = new StatusResponse();
            //IpProperties ipProperties = GenericController.GetCountryByIP(clientIp);


            //if (ipProperties.Status == "fail")
            //{
            //    ipProperties = new IpProperties();
            //}
            //data += "¦" + ipProperties.CountryCode + "¦" + ipProperties.RegionName + "¦" + ipProperties.City;


            try
            {
                var url = Request.Url.Query;

                if (url != "")
                {
                    string queryString = url.ToString();
                    char[] delimiterChars = { '=' };
                    string[] words = queryString.Split(delimiterChars);
                    string code = words[1];

                    if (code != null)
                    {
                        //get the access token

                         string[] code_clean = code.Split('&');

                        HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create("https://accounts.google.com/o/oauth2/token");

                        webRequest.Method = "POST";

                        string redirect_url = ConfigurationManager.AppSettings["GoogleRedirectURL"];
                        string client_sceret = ConfigurationManager.AppSettings["GoogleClientSecret"];
                        string client_id = ConfigurationManager.AppSettings["GoogleClientId"];

                        string Parameters = "code=" + code_clean[0] + "&client_id=" + client_id + "&client_secret=" + client_sceret + "&redirect_uri=" + redirect_url + "&grant_type=authorization_code";

                        byte[] byteArray = Encoding.UTF8.GetBytes(Parameters);

                        webRequest.ContentType = "application/x-www-form-urlencoded";

                        webRequest.ContentLength = byteArray.Length;

                        Stream postStream = webRequest.GetRequestStream();

                        // Add the post data to the web request

                        postStream.Write(byteArray, 0, byteArray.Length);

                        postStream.Close();

                        WebResponse responsew = webRequest.GetResponse();

                        postStream = responsew.GetResponseStream();

                        StreamReader reader = new StreamReader(postStream);

                        string responseFromServer = reader.ReadToEnd();

                        GoogleAccessToken serStatus = JsonConvert.DeserializeObject<GoogleAccessToken>(responseFromServer);

                        if (serStatus != null)
                        {
                            string accessToken = string.Empty;

                            accessToken = serStatus.access_token;

                            //Session["Token"] = accessToken;

                            if (!string.IsNullOrEmpty(accessToken))
                            {
                                HttpClient client = new HttpClient();

                                var urlProfile = "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + accessToken;

                                client.CancelPendingRequests();

                                HttpResponseMessage output = client.GetAsync(urlProfile).Result;

                                if (output.IsSuccessStatusCode)
                                {

                                    string outputData = output.Content.ReadAsStringAsync().Result;

                                    GoogleUserOutputData serStatusData = JsonConvert.DeserializeObject<GoogleUserOutputData>(outputData);
                                    DateTime fechaActual = DateTime.Now;
                                    string fechaStr = fechaActual.ToString("yyyy-MM-dd HH:mm:ss") + ".000";
                                    /*Guardar el token, correo, fechahora en una tabla*/
                                    DataSQL odaSQL = new DataSQL();
                                    StatusResponse response = new StatusResponse();
                                    string clientIp = Request.UserHostAddress;
                                    IpProperties ipProperties = GenericController.GetCountryByIP(clientIp);
                                    StringBuilder sb = new StringBuilder();
                                    sb.Append(accessToken);
                                    sb.Append("¦");
                                    sb.Append(serStatusData.email);
                                    sb.Append("¦");
                                    sb.Append(clientIp);
                                    sb.Append("¦");
                                    //sb.Append(latlong);
                                    sb.Append("¦");
                                    sb.Append(ipProperties.Country);
                                    sb.Append("¦");
                                    sb.Append(ipProperties.RegionName);
                                    sb.Append("¦");
                                    sb.Append(ipProperties.City);
                                    sb.Append("¦");
                                    sb.Append(fechaStr);
                                    sb.Append("¯L");
                                    string data = sb.ToString();

                                    response = await odaSQL.ExecuteCommand("dbo.CSV_SYSMUSER01_LOGIN_GOOGLE_SP", data);

                                    if (response.Success)
                                    {
                                        if (!string.IsNullOrEmpty(response.Data))
                                        {
                                            return RedirectToAction("Inicio", "Sistema", new { @token = accessToken, @Email = serStatusData.email, @fecha = fechaActual.ToString("yyyyMMddHHmmss") });
                                        }
                                        else
                                        {
                                            return RedirectToAction("Inicio", "Sistema", new { @status = "failed" });
                                        }
                                    }
                                    else
                                    {
                                        return RedirectToAction("Inicio", "Sistema", new { @status = "failed" });
                                    }
                                }
                                else
                                {
                                    return RedirectToAction("Inicio", "Sistema", new { @status = "failed" });
                                }
                            }
                            else
                            {
                                return RedirectToAction("Inicio", "Sistema", new { @status = "failed" });
                            }
                        }
                        else
                        {
                            return RedirectToAction("Inicio", "Sistema", new { @status = "failed" });
                        }
                    }
                    else
                    {
                        return RedirectToAction("Inicio", "Sistema", new { @status = "failed" });
                    }
                }
                else
                {
                    return RedirectToAction("Inicio", "Sistema", new { @status = "failed" });
                }
            }
            catch (Exception ex)
            {
                GenerateTextFile<Exception>.FromObject(ex, string.Empty);
                return RedirectToAction("Inicio", "Sistema", new { @status = "failed" });
            }

            //DataSQL oDataSQL = new DataSQL();
            //response = await oDataSQL.ExecuteCommand("dbo.CSV_SYSMUSER01_LOGIN_SP", data);

            //if (response.Success)
            //{
            //    if (response.Data != string.Empty)
            //    {
            //        string[] GET_DATA = response.Data.Split('¯');
            //        string FLG_INGRESO = GET_DATA[2];

            //        if (FLG_INGRESO != "OK")
            //        {
            //            response.Data = "DENIED";
            //        }
            //    }
            //}


            //return Ok(response);
        }

        public async Task<string> RecuperarUsuario(string data)
        {
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                DataSQL oDataSQL = new DataSQL();
                response = await oDataSQL.ExecuteCommand("dbo.CSV_SYSMUSER01_RECUPERA_LOGIN_SP", data);

                if (response.Success)
                {
                    string[] VI_COLUMNS = response.Data.Split('¦');
                    if (VI_COLUMNS[0] == "OK")
                    {
                        string txtpath = Server.MapPath("~/Resources/Plantillas/Correo/RecuperarClave.html");
                        if (System.IO.File.Exists(txtpath))
                        {
                            string VI_HTML = System.IO.File.ReadAllText(txtpath);
                            string VI_HTML_INI = "";

                            VI_HTML_INI = VI_HTML.Replace("[TituloCorreo]", "Recuperar contraseña");
                            VI_HTML_INI = VI_HTML_INI.Replace("[FechaLarga]", DateTime.Now.ToString("dddd dd MMMM"));
                            VI_HTML_INI = VI_HTML_INI.Replace("[EstimadoUsuario]", "Estimado(a) " + VI_COLUMNS[2]);
                            VI_HTML_INI = VI_HTML_INI.Replace("[Usuario]", VI_COLUMNS[1]);
                            VI_HTML_INI = VI_HTML_INI.Replace("[Clave]", VI_COLUMNS[3]);


                            System.Net.NetworkCredential NetworkCred = new System.Net.NetworkCredential(System.Configuration.ConfigurationManager.AppSettings["_EmailFrom"], System.Configuration.ConfigurationManager.AppSettings["_EmailPassword"]);

                            System.Net.Mail.SmtpClient client = new System.Net.Mail.SmtpClient();
                            //client.DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network;
                            client.Host = System.Configuration.ConfigurationManager.AppSettings["_EmailServer"];
                            client.EnableSsl = System.Configuration.ConfigurationManager.AppSettings["_EmailEnableSSL"] == "true" ? true : false;
                            client.UseDefaultCredentials = System.Configuration.ConfigurationManager.AppSettings["_EmailUseDefaultCredentials"] == "true" ? true : false;
                            client.Credentials = NetworkCred;
                            client.Port = int.Parse(System.Configuration.ConfigurationManager.AppSettings["_EmailPort"]);
                            System.Net.Mail.MailMessage message = new System.Net.Mail.MailMessage
                            {
                                From = new System.Net.Mail.MailAddress(System.Configuration.ConfigurationManager.AppSettings["_EmailFrom"], System.Configuration.ConfigurationManager.AppSettings["_EmailAliasName"]),
                            };
                            try
                            {
                                //message.To.Add(VI_COLUMNS[5]);
                                message.Bcc.Add(VI_COLUMNS[5]);
                                message.Subject = "Recuperar contraseña - NATCODEE";
                                message.Priority = System.Net.Mail.MailPriority.High;
                                message.Body = VI_HTML_INI;
                                message.IsBodyHtml = true;

                                using (var cts = new System.Threading.CancellationTokenSource(40000))
                                {
                                    cts.Token.Register(client.SendAsyncCancel);
                                    await client.SendMailAsync(message);
                                }

                                response.Data += ('¯' + "OK" + '¦');

                            }
                            catch (Exception ex)
                            {
                                GenerateTextFile<Exception>.FromObject(ex, data);
                                //response.Data = "ERROR" + '¦' + ex.Message;
                            }

                            message.Dispose();
                        }

                    }
                }

            }
            return Ok(response);
        }

    }
}