using System.Web.Mvc;
using System.Web.Routing;

namespace GS1Peru.AppWeb
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Sistema", action = "Inicio", id = UrlParameter.Optional }
            );
        }
    }
}