using GS1Peru.AppWeb.Controllers.Core;
using GS1Peru.Core.Entities;
using GS1Peru.Core.Helpers;
using System.Threading.Tasks;

namespace GS1Peru.AppWeb.Controllers.Modules.General
{
    public class LayoutController : BaseController
    {
        public async Task<string> Layout_Listas(string data)
        {            
            string[] datos = data.Split('¦');
            string modulo = string.Empty;
            //switch (datos[2])
            //{
            //    case "PRO":
            //        modulo = AppSettings.Get("CodigoMenuProveedor");
            //        break;
            //    case "CLI":
            //        modulo = AppSettings.Get("CodigoMenuCliente");
            //        break;
            //    case "PER":
            modulo = AppSettings.Get("CodigoMenuUsuario");
            //        break;
            //}
            data = datos[0] + "¦" + datos[1] + "¦" + modulo;
            DataSQL oDataSQL = new DataSQL();
            StatusResponse response = await oDataSQL.ExecuteCommand("dbo.CSV_UserMenu_LIST_SP", data, "@Data");
            return Ok(response);
        }

        public async Task<string> ListarEjecutivos(string data)
        {
            StatusResponse response = new StatusResponse();
            DataSQL daSQL = new DataSQL();
            response = await daSQL.ExecuteCommand("dbo.CSV_INT_EJECUTIVOS_LST_SP", data);

            return Ok(response);
        }
        
        //public async Task<string> CartasCompromisoPorVencer_LST(string data)
        //{
        //    StatusResponse response = new StatusResponse();
        //    DataSQL daSQL = new DataSQL();
        //    response = await daSQL.ExecuteCommand("dbo.CSV_INT_CARTAS_COMPROMISO_POR_VENCER_LST_SP", data);

        //    return Ok(response);
        //}

        public async Task<string> ListarNotificaciones(string data)
        {
            StatusResponse response = new StatusResponse();
            DataSQL daSQL = new DataSQL();
            response = await daSQL.ExecuteCommand("dbo.CSV_INT_NOTIFICACIONES_LST_SP", data);

            return Ok(response);
        }
        public async Task<string> NotificacionesCUD(string data)
        {
            StatusResponse response = new StatusResponse();
            DataSQL daSQL = new DataSQL();
            response = await daSQL.ExecuteCommand("dbo.CSV_INT_NOTIFICACIONES_CUD_SP", data);

            return Ok(response);
        }
    }
}