using GS1Peru.AppWeb.Controllers.Core;
using GS1Peru.Core.Entities;
using GS1Peru.Core.Helpers;
using System.Threading.Tasks;

namespace GS1Peru.AppWeb.Controllers.Modules.crm._00_Mantenimiento
{
    public class EventoController : BaseController
    {
        public async Task<string> Listar(string data)
        {
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                DataSQL odaSQL = new DataSQL();
                response = await odaSQL.ExecuteCommand("dbo.CSV_EVENTO_LISTAR_SP", data);
            }
            return Ok(response);
        }

        public async Task<string> CUD_Evento(string data)
        {
            data = data.Replace("#IP_CLIENTE#", Request.UserHostAddress);
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                DataSQL odaSQL = new DataSQL();
                response = await odaSQL.ExecuteCommand("dbo.CSV_EVENTO_CUD_SP", data);
            }
            return Ok(response);
        }
    }
}
