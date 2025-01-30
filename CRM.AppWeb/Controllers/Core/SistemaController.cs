using GS1Peru.Core.Entities;
using GS1Peru.Core.Helpers;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace GS1Peru.AppWeb.Controllers.Core
{
    public class SistemaController : BaseController
    {
        public ActionResult Inicio()
        {
            enStartup oStartup = new enStartup
            {
                root = Url.Content("~"),
                versionApp = AppSettings.Get("_VersionApp"),
                isEncoded = (AppSettings.Get("_IsEncoded") == "true"),
                isDeveloper = (AppSettings.Get("_IsDeveloper") == "true"),
                DeveloperTitle = AppSettings.Get("_DeveloperTitle"),
                isAD = (AppSettings.Get("_IsDomainActiveDirectory") == "true"),
                charLocked = AppSettings.Get("_CharLocked"),
                rucApp = AppSettings.Get("RUC"),
                url_extra = AppSettings.Get("UrlWebExtra"),
                GoogleOAUTHURL = AppSettings.Get("GoogleOAUTHURL"),
                GoogleSCOPE = AppSettings.Get("GoogleSCOPE"),
                GoogleClientId = AppSettings.Get("GoogleClientId"),
                GoogleRedirectURL = AppSettings.Get("GoogleRedirectURL"),
                GoogleTYPE = AppSettings.Get("GoogleTYPE"),
                IpWebSocket = AppSettings.Get("_IpWebSocket")
            };
            ViewBag.Script = Encrypt.Run(new JavaScriptSerializer().Serialize(oStartup));
            ViewBag.VersionApp = oStartup.versionApp;
            return View();
        }
    }
}