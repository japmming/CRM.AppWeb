using GS1Peru.AppWeb.Controllers.Core;
using GS1Peru.Core.Entities;
using GS1Peru.Core.Helpers;
using System.Threading.Tasks;

namespace GS1Peru.AppWeb.Controllers.Modules.Seguridad.Utilitarios
{
    public class UsuarioPermisoController : BaseController
    {

        public async Task<string> LISTAR(string data)
        {
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                DataSQL odaSQL = new DataSQL();
                response = await odaSQL.ExecuteCommand("dbo.CSV_UsuarioPermiso_LISTAR_SP", data);
            }
            return Ok(response);
        }


        public async Task<string> LISTAR_USUARIOS(string data)
        {
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                DataSQL odaSQL = new DataSQL();
                response = await odaSQL.ExecuteCommand("dbo.CSV_SYSMUSER01_USUARIO_PERMISO_LISTAR_SP", data);
            }
            return Ok(response);
        }

        public async Task<string> GUARDAR_USUARIOS(string data)
        {
            StatusResponse response = new StatusResponse();
            if (!string.IsNullOrEmpty(data))
            {
                DataSQL odaSQL = new DataSQL();
                response = await odaSQL.ExecuteCommand("dbo.CSV_USUARIO_PERMISO_GUARDAR_SP", data);
            }
            return Ok(response);
        }


    }
}
