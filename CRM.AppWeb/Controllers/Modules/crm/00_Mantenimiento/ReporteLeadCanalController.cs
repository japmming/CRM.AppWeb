using GS1Peru.AppWeb.Controllers.Core;
using GS1Peru.Core.Entities;
using GS1Peru.Core.Helpers;
using System.Threading.Tasks;


namespace GS1Peru.AppWeb.Controllers.Modules.crm._00_Mantenimiento
{
    public class ReporteLeadCanalController : BaseController
    {
        public async Task<string> ListarReporteCanal(string data)
        {
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                DataSQL odaSQL = new DataSQL();
                response = await odaSQL.ExecuteCommand("dbo.CSV_REPORTE_CANAL_LISTAR_SP", data);
            }
            return Ok(response);
        }

    }
}
