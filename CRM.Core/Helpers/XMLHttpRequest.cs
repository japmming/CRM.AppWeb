using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace GS1Peru.Core.Helpers
{
    public class XMLHttpRequest
    {
        public async Task<string> GetString(string urlBase, string url)
        {
            string response = string.Empty;
            HttpClient http = new HttpClient();
            http.BaseAddress = new Uri(urlBase);
            http.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            HttpResponseMessage rpta = http.GetAsync(url).Result;
            if (rpta != null && rpta.StatusCode.Equals(HttpStatusCode.OK))
            {
                response = await rpta.Content.ReadAsStringAsync();
            }
            return response;
        }
    }
}