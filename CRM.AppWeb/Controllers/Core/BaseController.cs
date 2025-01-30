using GS1Peru.Core.Entities;
using GS1Peru.Core.Helpers;
using System;
using System.Net;
using System.Text;
using System.Web.Mvc;

namespace GS1Peru.AppWeb.Controllers.Core
{
    [RequireHttps]
    public class BaseController : Controller
    {
        protected override void OnException(ExceptionContext filterContext)
        {
            GenerateTextFile<Exception>.FromObject(filterContext.Exception, string.Empty);
            filterContext.HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
            filterContext.HttpContext.Response.AddHeader("StatusResponse", "{\"success\":false}");
        }

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext.HttpContext.Request.HttpMethod == "POST" && filterContext.HttpContext.Request.Files.Count == 0)
            {
                int n = (int)filterContext.HttpContext.Request.InputStream.Length;
                byte[] buffer = new byte[n];
                filterContext.HttpContext.Request.InputStream.Read(buffer, 0, n);
                string data = Encoding.UTF8.GetString(buffer);
                if (Convert.ToBoolean(AppSettings.Get("_IsEncoded")))
                {

                    filterContext.ActionParameters["data"] = Encrypt.Run(data, false);
                }
                else
                {
                    filterContext.ActionParameters["data"] = data;
                }
            }
        }

        public string Ok(StatusResponse obj)
        {
            if (Convert.ToBoolean(AppSettings.Get("_IsEncoded")))
            {
                obj.Data = Encrypt.Run(obj.Data);
            }
            Response.StatusCode = (int)HttpStatusCode.OK;
            if (obj.Success)
            {
                Response.AddHeader("StatusResponse", "{\"success\":true}");
                //Response.StatusDescription = "{\"Success\":true}";
            }
            else
            {
                Response.AddHeader("StatusResponse", "{\"success\":false}");
                //Response.StatusDescription = "{\"Success\":false}";
            }
            return obj.Data;
        }

        //private string Encriptar(string data, bool flag = true)
        //{
        //	string rpta = string.Empty;
        //	if (!string.IsNullOrEmpty(data))
        //	{
        //		bool tipo = flag;
        //		char[] datos = data.ToCharArray();
        //		long nReg = datos.LongLength;
        //		for (long i = 0; i < nReg; i++)
        //		{
        //			if (flag)
        //			{
        //				datos[i]++;
        //				flag = false;
        //			}
        //			else
        //			{
        //				datos[i]--;
        //				flag = true;
        //			}
        //		}
        //		rpta = String.Join("", datos);
        //		if (tipo) return HttpUtility.UrlPathEncode(rpta);
        //		else return rpta;
        //	}
        //	else return rpta;
        //}

    }
}