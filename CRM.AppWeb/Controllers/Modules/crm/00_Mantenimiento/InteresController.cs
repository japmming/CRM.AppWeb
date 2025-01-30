using GS1Peru.AppWeb.Controllers.Core;
using GS1Peru.Core.Entities;
using GS1Peru.Core.Helpers;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace GS1Peru.AppWeb.Controllers.Modules.crm._00_Mantenimiento
{
    public class InteresController : BaseController
    {
        public async Task<string> Listar(string data)
        {
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                DataSQL odaSQL = new DataSQL();
                response = await odaSQL.ExecuteCommand("CSV_INTERES_LISTAR_SP", data);
            }
            return Ok(response);
        }

        public async Task<string> CUD_INTERES(string data)
        {
            data = data.Replace("#IP_CLIENTE#", Request.UserHostAddress);
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                DataSQL odaSQL = new DataSQL();
                response = await odaSQL.ExecuteCommand("dbo.CSV_INTERES_CUD_SP", data);
            }
            return Ok(response);
        }



    }
}
