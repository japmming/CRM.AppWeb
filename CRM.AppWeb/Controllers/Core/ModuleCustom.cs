using System;
using System.IO;
using System.Text;
using System.Web;

namespace NotificacionWeb
{
    public class ModuleCustom : IHttpModule
    {
        public void Dispose()
        {
            //throw new NotImplementedException();
        }

        public void Init(HttpApplication context)
        {
            context.EndRequest += new EventHandler(OnEndRequest);
        }
        public void OnEndRequest(object sender, EventArgs e)
        {
            HttpContext context = ((HttpApplication)sender).Context;
            string filePath = context.Request.PhysicalPath;
            string rutaProyecto = context.Request.MapPath("~");

            if (!File.Exists(filePath))
            {
                StringBuilder sbScript = new StringBuilder();
                sbScript.Append("<script type=\"text/javascript\">");
                sbScript.Append("(function () {");
                sbScript.Append("   function refreshCSS() {");
                sbScript.Append("       var sheets = [].slice.call(document.getElementsByTagName(\"link\"));");
                sbScript.Append("       var head = document.getElementsByTagName(\"head\")[0];");
                sbScript.Append("       for (var i = 0; i < sheets.length; ++i) {");
                sbScript.Append("           var elem = sheets[i];");
                sbScript.Append("           var parent = elem.parentElement || head;");
                sbScript.Append("           parent.removeChild(elem);");
                sbScript.Append("           var rel = elem.rel;");
                sbScript.Append("           if (elem.href && typeof rel != \"string\" || rel.length == 0 || rel.toLowerCase() == \"stylesheet\") {");
                sbScript.Append("               var url = elem.href.replace(/(&|\\?)version=\\d+/, '');");
                sbScript.Append("               elem.href = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'version=' + (new Date().valueOf());");
                sbScript.Append("           }");
                sbScript.Append("           parent.appendChild(elem);");
                sbScript.Append("       }");
                sbScript.Append("   }");
                sbScript.Append("   var intentarReconectar = true;");
                sbScript.Append("   var cantidadReconectar = 0;");
                sbScript.Append("   var idReintento = 0;");
                sbScript.Append("   var ws;");
                sbScript.Append("   function conectarSocket() {");
                sbScript.Append("       if (!intentarReconectar) return;");
                sbScript.Append("       cantidadReconectar++;");
                sbScript.Append("       if (cantidadReconectar > 20 ) {");
                sbScript.Append("           intentarReconectar = false;");
                sbScript.Append("           clearInterval(idReintento);");
                sbScript.Append("           return;");
                sbScript.Append("       }");
                sbScript.Append("       console.log('ingresa conectarSocket', cantidadReconectar);");
                sbScript.Append("       ws = new WebSocket(\"ws://127.0.0.1:9876\");");
                sbScript.Append("       ws.onopen = function (msg) {");
                sbScript.Append("           intentarReconectar = false;");
                sbScript.Append("           if (idReintento != 0 ) clearInterval(idReintento);");
                sbScript.Append("           cantidadReconectar = 0;");
                sbScript.Append("           try {");
                sbScript.Append("               ws.send('conectar;" + rutaProyecto.Replace("\\", "|") + "');");
                sbScript.Append("           } catch (err) {}");
                sbScript.Append("       };");
                sbScript.Append("       ws.onmessage = function (msg) {");
                sbScript.Append("           if (msg.data == 'reload') window.location.reload();");
                sbScript.Append("           else if (msg.data == 'refresh') { refreshCSS();}");
                sbScript.Append("       };");
                sbScript.Append("       ws.onclose = function (msg) {");
                sbScript.Append("           intentarReconectar = true;");
                sbScript.Append("           idReintento = setInterval(conectarSocket, 5000);");
                sbScript.Append("       };");
                sbScript.Append("   }");
                sbScript.Append("   conectarSocket();");
                sbScript.Append("})();");
                sbScript.Append("</script>");
                context.Response.Write(sbScript.ToString());
            }

        }
    }
}