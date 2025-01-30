using GS1Peru.AppWeb.Controllers.Core;
using GS1Peru.Core.Entities;
using GS1Peru.Core.Helpers;
using System.Configuration;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace GS1Peru.AppWeb.Controllers.Modules.Seguridad._00_Mantenimiento
{
    public class PlantillaCorreoController : BaseController
    {
        public async Task<string> LST(string data)
        {
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                DataSQL odaSQL = new DataSQL();
                response = await odaSQL.ExecuteCommand("dbo.CSV_INT_PLANTILLA_CORREO_LST_V01", data);
            }
            return Ok(response);
        }
        public async Task<string> CUD(string data)
        {
            data = data.Replace("#IP_CLIENTE#", Request.UserHostAddress);
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                DataSQL odaSQL = new DataSQL();
                response = await odaSQL.ExecuteCommand("dbo.CSV_INT_PLANTILLA_CORREO_CUD_V01", data);
            }
            return Ok(response);
        }
    }
}
