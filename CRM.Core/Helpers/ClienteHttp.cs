using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace GS1Peru.Core.Helpers
{
    public class ClienteHttp
    {
        public static async Task<string> Get(string urlBase, string NombreServicio, string metodo)
        {
            string data = string.Empty;
            try
            {
                HttpClient proxy = new HttpClient
                {
                    BaseAddress = new Uri(urlBase),
                    Timeout = TimeSpan.FromMinutes(30)
                };
                string UrlEjecutar = "/" + NombreServicio + "/" + metodo;
                HttpResponseMessage rpta = await proxy.GetAsync(UrlEjecutar);
                if (rpta.StatusCode.Equals(HttpStatusCode.OK))
                {
                    data = await rpta.Content.ReadAsStringAsync();
                }
                rpta.Dispose();
                proxy.Dispose();
            }
            catch (HttpRequestException hrex)
            {
                GenerateTextFile<Exception>.FromObject(hrex, metodo);
                data = string.Empty;
            }
            catch (TimeoutException tex)
            {
                GenerateTextFile<Exception>.FromObject(tex, metodo);
                data = string.Empty;
            }
            catch (TaskCanceledException tcex)
            {
                GenerateTextFile<Exception>.FromObject(tcex, metodo);
                data = string.Empty;
            }
            catch (Exception ex)
            {
                GenerateTextFile<Exception>.FromObject(ex, metodo);
                data = string.Empty;
            }

            return data;
        }

        public static async Task<string> PostForm(string urlBase, string NombreServicio, string metodo, string Data)
        {
            string rpta = string.Empty;
            try
            {
                HttpClient proxy = new HttpClient
                {
                    BaseAddress = new Uri(urlBase),
                    Timeout = TimeSpan.FromMinutes(30)
                };
                proxy.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("text/plain"));

                string UrlEjecutar = "/" + NombreServicio + "/" + metodo;
                var values = new Dictionary<string, string>() { { "Data", Data } };
                FormUrlEncodedContent content = new FormUrlEncodedContent(values);

                HttpResponseMessage rpta_http = await proxy.PostAsync(UrlEjecutar, content); //await proxy.GetAsync(UrlEjecutar);

                if (rpta_http.StatusCode.Equals(HttpStatusCode.OK))
                {
                    rpta = await rpta_http.Content.ReadAsStringAsync();
                }
                rpta_http.Dispose();
                proxy.Dispose();
            }
            catch (HttpRequestException hrex)
            {
                GenerateTextFile<Exception>.FromObject(hrex, Data);
                rpta = string.Empty;
            }
            catch (TimeoutException tex)
            {
                GenerateTextFile<Exception>.FromObject(tex, Data);
                rpta = string.Empty;
            }
            catch (TaskCanceledException tcex)
            {
                GenerateTextFile<Exception>.FromObject(tcex, Data);
                rpta = string.Empty;
            }
            catch (Exception ex)
            {
                GenerateTextFile<Exception>.FromObject(ex, Data);
                rpta = string.Empty;
            }

            return rpta;
        }

        public static async Task<string> PostText(string urlBase, string NombreServicio, string metodo, string Data)
        {
            string rpta = string.Empty;
            try
            {
                HttpClient proxy = new HttpClient
                {
                    BaseAddress = new Uri(urlBase),
                    Timeout = TimeSpan.FromMinutes(30)
                };
                proxy.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("text/plain"));

                string UrlEjecutar = "/" + NombreServicio + "/" + metodo;

                HttpContent content = new StringContent(Data);

                HttpResponseMessage rpta_http = await proxy.PostAsync(UrlEjecutar, content);

                if (rpta_http.StatusCode.Equals(HttpStatusCode.OK))
                {
                    rpta = await rpta_http.Content.ReadAsStringAsync();
                }
                rpta_http.Dispose();
                proxy.Dispose();
            }
            catch (HttpRequestException hrex)
            {
                GenerateTextFile<Exception>.FromObject(hrex, Data);
                rpta = string.Empty;
            }
            catch (TimeoutException tex)
            {
                GenerateTextFile<Exception>.FromObject(tex, Data);
                rpta = string.Empty;
            }
            catch (TaskCanceledException tcex)
            {
                GenerateTextFile<Exception>.FromObject(tcex, Data);
                rpta = string.Empty;
            }
            catch (Exception ex)
            {
                GenerateTextFile<Exception>.FromObject(ex, Data);
                rpta = string.Empty;
            }

            return rpta;
        }
    }
}