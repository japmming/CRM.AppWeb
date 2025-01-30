using GS1Peru.AppWeb.Controllers.Core;
using GS1Peru.Core.Entities;
using GS1Peru.Core.Helpers;
using System.Threading.Tasks;

namespace GS1Peru.AppWeb.Controllers.Modules.crm._00_Mantenimiento
{
    public class ComercialesController : BaseController
    {
        public async Task<string> Listar(string data)
        {
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                DataSQL odaSQL = new DataSQL();
                response = await odaSQL.ExecuteCommand("dbo.CSV_SYSMUSER01_EXT_LISTAR_SP", data);
            }
            return Ok(response);
        }

    }
}
