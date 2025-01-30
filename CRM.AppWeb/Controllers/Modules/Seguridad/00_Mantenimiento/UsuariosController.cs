using GS1Peru.AppWeb.Controllers.Core;
using GS1Peru.Core.Entities;
using GS1Peru.Core.Helpers;
using System.Configuration;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using io = System.IO;

namespace GS1Peru.AppWeb.Controllers.Modules._05_Utilitarios
{
    public class UsuariosController : BaseController
    {
        public async Task<string> Listar(string data)
        {
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                DataSQL odaSQL = new DataSQL();
                response = await odaSQL.ExecuteCommand("dbo.CSV_SYSMUSER01_LISTAR_SP", data);
            }
            return Ok(response);
        }

        public async Task<string> CUD(string data, HttpPostedFileBase file_img)
        {
            data = data.Replace("#IP_CLIENTE#", Request.UserHostAddress);
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                string[] VI_TABLAS = data.Split('¯');
                string VI_PARAM_SP = VI_TABLAS[1] + "¯" + VI_TABLAS[2] + "¯" + VI_TABLAS[3];
                DataSQL odaSQL = new DataSQL();
                response = await odaSQL.ExecuteCommand("dbo.CSV_SYSMUSER01_CUD_SP", VI_PARAM_SP);

                if (file_img != null)
                {
                    if (response.Success)
                    {
                        string[] VI_RPTA_SQL = response.Data.Split('¦');

                        if (VI_RPTA_SQL[0] == "OK")
                        {
                            string VI_RUTA_INI = ConfigurationManager.AppSettings["FileServer"] + @"\TABLE\SYSMUSER01";

                            if (!io.Directory.Exists(VI_RUTA_INI))
                                io.Directory.CreateDirectory(VI_RUTA_INI);

                            string[] VI_COLUMNS = VI_TABLAS[2].Split('¦');

                            string VI_RUTA_INI_ID = VI_RUTA_INI + @"\" + VI_COLUMNS[0];

                            if (!io.Directory.Exists(VI_RUTA_INI_ID))
                                io.Directory.CreateDirectory(VI_RUTA_INI_ID);

                            string VI_RUTA_FILE = io.Path.Combine(VI_RUTA_INI_ID, VI_COLUMNS[0] + ".jpg");

                            if (io.File.Exists(VI_RUTA_FILE))
                            {
                                io.File.Delete(VI_RUTA_FILE);
                            }
                            //file_img.SaveAs(VI_RUTA_FILE);
                            using (var fileStream = new io.FileStream(VI_RUTA_FILE, io.FileMode.Create, io.FileAccess.Write, io.FileShare.ReadWrite))
                            {
                                file_img.InputStream.Seek(0, io.SeekOrigin.Begin);
                                file_img.InputStream.CopyTo(fileStream);
                            }
                            file_img.InputStream.Dispose();
                        }
                    }

                }


            }
            return Ok(response);
        }

        public async Task<string> UsuarioCUD(string data, HttpPostedFileBase FILE_IMG)
        {
            data = data.Replace("#IP_CLIENTE#", Request.UserHostAddress);
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                string[] VI_TABLAS = data.Split('¯');
                string VI_TOKEN = VI_TABLAS[1];
                string VI_LSTDT = VI_TABLAS[2];
                string VI___CUD = VI_TABLAS[3];

                string VI_PARAMETRO = VI_TOKEN + "¯" + VI_LSTDT + "¯" + VI___CUD;
                DataSQL odaSQL = new DataSQL();
                response = await odaSQL.ExecuteCommand("dbo.CSV_SYSMUSER01_CUD_SP", VI_PARAMETRO);

                if (response.Data != null)
                {
                    string[] VI_GET_RPTA = response.Data.Split('¦');

                    if (VI_GET_RPTA[0] == "OK")
                    {
                        #region GUARDAR FOTO
                        string VI_RUTA_INI = ConfigurationManager.AppSettings["FileServer"] + @"TABLE\SYSMUSER01\";
                        if (!io.Directory.Exists(VI_RUTA_INI))
                            io.Directory.CreateDirectory(VI_RUTA_INI);
                        string[] VI_LSTDT_COLUMNS = VI_LSTDT.Split('¦');

                        string VI_RUTA_CODUSER = VI_RUTA_INI + @"\" + VI_LSTDT_COLUMNS[0];
                        if (!io.Directory.Exists(VI_RUTA_CODUSER))
                            io.Directory.CreateDirectory(VI_RUTA_CODUSER);
                        string VI_RUTA_FILE;
                        if (FILE_IMG != null)
                        {
                            VI_RUTA_FILE = io.Path.Combine(VI_RUTA_CODUSER, FILE_IMG.FileName);

                            if (io.File.Exists(VI_RUTA_FILE))
                            {
                                io.File.Delete(VI_RUTA_FILE);
                            }
                            //FILE_IMG.SaveAs(VI_RUTA_FILE);
                            using (var fileStream = new io.FileStream(VI_RUTA_FILE, io.FileMode.Create, io.FileAccess.Write, io.FileShare.ReadWrite))
                            {
                                FILE_IMG.InputStream.Seek(0, io.SeekOrigin.Begin);
                                FILE_IMG.InputStream.CopyTo(fileStream);
                            }
                            FILE_IMG.InputStream.Dispose();
                        }
                        #endregion
                    }
                }
            }
            return Ok(response);
        }

        public async Task<string> CambiarPassword(string data)
        {
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                DataSQL odaSQL = new DataSQL();
                response = await odaSQL.ExecuteCommand("dbo.CSV_SYSMUSER01_CAMBIAR_PASSWORD_SP", data);
            }
            return Ok(response);
        }

        public FileResult DESCARGAR_FOTO(string data)
        {
            string[] Datos = data.Split('¦');
            string VI_SOLI = Datos[0];
            byte[] bufferFile = null;

            string rutaFolder = ConfigurationManager.AppSettings["FileServer"] + @"\TABLE\SYSMUSER01" + @"\" + VI_SOLI;

            if (VI_SOLI != "" && VI_SOLI != null)
            {
                string rutaArchivo = io.Path.Combine(rutaFolder, VI_SOLI + ".jpg");

                if (io.File.Exists(rutaArchivo))
                {
                    //bufferFile = io.File.ReadAllBytes(rutaArchivo);
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

        public async Task<string> LayoutUsuarioCUD(string data)
        {
            data = data.Replace("#IP_CLIENTE#", Request.UserHostAddress);
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                string[] VI_TABLAS = data.Split('¯');
                string VI_PARAM_SP = VI_TABLAS[0] + "¯" + VI_TABLAS[1] + "¯" + VI_TABLAS[2];
                DataSQL odaSQL = new DataSQL();
                response = await odaSQL.ExecuteCommand("dbo.CSV_SYSMUSER01_CUD_SP", VI_PARAM_SP);
            }
            return Ok(response);
        }

        public async Task<string> Listar_Anotaciones(string data)
        {
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                DataSQL odaSQL = new DataSQL();
                response = await odaSQL.ExecuteCommand("dbo.CSV_INT_SYSMUSER01_ANOTACIONES_LST_V01", data);
            }
            return Ok(response);
        }

        public async Task<string> CUD_Anotaciones(string data)
        {
            data = data.Replace("#IP_CLIENTE#", Request.UserHostAddress);
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                DataSQL odaSQL = new DataSQL();
                response = await odaSQL.ExecuteCommand("dbo.CSV_INT_SYSMUSER01_ANOTACIONES_CUD_V01", data);
            }
            return Ok(response);
        }
    }
}