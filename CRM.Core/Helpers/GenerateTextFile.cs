using System;
using System.Configuration;
using System.IO;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace GS1Peru.Core.Helpers
{
    public class GenerateTextFile<T>
    {
        public static void FromObject(T obj, string value, string filePathSetting = "_LogPath", string fileNameSetting = "_LogName")
        {
            string filePath = string.Format("{0}{1}", AppSettings.Get(filePathSetting), TextFormat.YYMMDD(AppSettings.Get(fileNameSetting), ".txt"));
            PropertyInfo[] propiedades = null;

            if (obj != null)
            {
                propiedades = obj.GetType().GetProperties();
            }

            using (FileStream fs = new FileStream(filePath, FileMode.Append, FileAccess.Write, FileShare.Write))
            {
                using (StreamWriter sw = new StreamWriter(fs, Encoding.Default))
                {
                    sw.WriteLine("Hora:" + DateTime.Now.ToString());

                    if (propiedades != null)
                    {
                        foreach (PropertyInfo propiedad in propiedades)
                        {
                            sw.Write(propiedad.Name);
                            sw.Write(" = ");
                            sw.WriteLine(propiedad.GetValue(obj, null) == null ? "" : propiedad.GetValue(obj, null).ToString());
                        }
                    }
                    sw.WriteLine("Value: " + value);
                    sw.WriteLine(new string('_', 50));
                }
            }

            bool sendMail = bool.Parse(ConfigurationManager.AppSettings["_SendMailException"] == null ? "false" : ConfigurationManager.AppSettings["_SendMailException"]);

            if (sendMail)
            {
                StringBuilder sb = new StringBuilder();
                sb.Append("Hora:" + DateTime.Now.ToString());
                sb.Append("[NEW]");

                if (propiedades != null)
                {
                    foreach (PropertyInfo propiedad in propiedades)
                    {
                        sb.Append(propiedad.Name);
                        sb.Append(" = ");
                        sb.Append(propiedad.GetValue(obj, null) == null ? "" : propiedad.GetValue(obj, null).ToString());
                        sb.Append("[NEW]");
                    }
                }

                sb.Append("Value: " + value);

                var VI_PLANTILLA_RUTA = ConfigurationManager.AppSettings["FileServer"] + @"TABLE\PLANTILLA\EXCEPTION\MailException_Plantilla.html"; ;
                string correo_alias = "GS1 Perú";
                string VI_TXT_PLANTILLA = File.ReadAllText(VI_PLANTILLA_RUTA);
                string VI_TXT_REMPLAZO = "";
                VI_TXT_REMPLAZO = VI_TXT_PLANTILLA.Replace("[EXCEPTION]", sb.ToString());
                VI_TXT_REMPLAZO = VI_TXT_REMPLAZO.Replace("[FECHA_LARGA]", DateTime.Now.ToLongDateString());
                VI_TXT_REMPLAZO = VI_TXT_REMPLAZO.Replace("[NEW]", "<br>");
                string correo_confirmacion = ConfigurationManager.AppSettings["_EmailConfirm"];
                string correo_destino = ConfigurationManager.AppSettings["_EmailException"];
                string asunto = "Intranet - Excepcion" + " - " + DateTime.Now.ToString("yyyy") + DateTime.Now.ToString("MM") + DateTime.Now.ToString("dd") + DateTime.Now.ToString("HH") + DateTime.Now.ToString("mm") + DateTime.Now.ToString("ffffff");
                string RUTA_LOGO = ConfigurationManager.AppSettings["FileServer"] + @"TABLE\PLANTILLA\MAIL\logo_gs1pe.jpg";
                Task.Run(() => ExcepcionCorreo.EnviarCorreoAWS(VI_TXT_REMPLAZO, correo_destino, "", "", "", "", "", "", null, "", asunto, correo_confirmacion, correo_alias));
            }
        }

        public static void FromString(string content, string filePathSetting = "_LogPath", string fileNameSetting = "_LogName")
        {
            string filePath = string.Format("{0}{1}", AppSettings.Get(filePathSetting), TextFormat.YYMMDD(AppSettings.Get(fileNameSetting), ".txt"));
            using (FileStream fs = new FileStream(filePath, FileMode.Append, FileAccess.Write, FileShare.Write))
            {
                using (StreamWriter sw = new StreamWriter(fs, Encoding.Default))
                {
                    sw.WriteLine(content);
                    sw.WriteLine(new string('_', 50));
                }
            }
        }
    }
}
