using GS1Peru.AppWeb.Controllers.Core;
using GS1Peru.Core.Entities;
using GS1Peru.Core.Helpers;
using System;
using System.Configuration;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace GS1Peru.AppWeb.Controllers.Modules.crm
{
    public class LeadsController : BaseController
    {
        public async Task<string> Listar(string data)
        {
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                DataSQL odaSQL = new DataSQL();
                response = await odaSQL.ExecuteCommand("dbo.CSV_LEADS_LST_SP", data);
            }
            return Ok(response);
        }
        public async Task<string> CUD(string data)
        {
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                data = data.Replace("#IP_CLIENTE#", Request.UserHostAddress);
                DataSQL odaSQL = new DataSQL();
                response = await odaSQL.ExecuteCommand("dbo.CSV_LEADS_CUD_SP", data);
              
            }
            return Ok(response);
        }
        public async Task<string> ComentarioCUD(string data)
        {
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                data = data.Replace("#IP_CLIENTE#", Request.UserHostAddress);
                DataSQL odaSQL = new DataSQL();
                response = await odaSQL.ExecuteCommand("dbo.CSV_LEADS_COMENTARIO_CUD_SP", data);
                

            }
            return Ok(response);
        }

    }
}
