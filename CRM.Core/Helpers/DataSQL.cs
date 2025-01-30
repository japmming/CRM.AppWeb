using GS1Peru.Core.Entities;
using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace GS1Peru.Core.Helpers
{
    public class DataSQL
    {
        private readonly string connectionName;
        private readonly int timeout = 0;

        public DataSQL(string connectionNameSetting = "_ConnectionBD_INTRA", string timeoutSetting = "_TimeoutBD")
        {
            connectionName = ConfigurationManager.ConnectionStrings[connectionNameSetting].ConnectionString;
            int.TryParse(ConfigurationManager.AppSettings[timeoutSetting], out timeout);
        }

        public async Task<StatusResponse> ExecuteCommand(string storedProcedureName, string parameterValue = null, string parameterName = "@lstParametros")
        {
            StatusResponse response = new StatusResponse();
            using (SqlConnection con = new SqlConnection(connectionName))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand(storedProcedureName, con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = timeout;
                    if (!string.IsNullOrEmpty(parameterName) && !string.IsNullOrEmpty(parameterValue))
                    {
                        cmd.Parameters.AddWithValue(parameterName, parameterValue);
                    }
                    await con.OpenAsync();
                    object data = await cmd.ExecuteScalarAsync();
                    if (data != null)
                    {
                        response.Success = true;
                        response.Data = data.ToString();
                    }
                    con.Close();
                }
                catch (SqlException ex)
                {
                    GenerateTextFile<Exception>.FromObject(ex, parameterValue);
                }
                catch (Exception ex2)
                {
                    GenerateTextFile<Exception>.FromObject(ex2, parameterValue);
                }
            }
            return response;
        }

        public async Task<StatusResponseObject> ExecuteCommandObject(string storedProcedureName, string parameterValue = null, string parameterName = "@lstParametros")
        {
            StatusResponseObject response = new StatusResponseObject();
            using (SqlConnection con = new SqlConnection(connectionName))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand(storedProcedureName, con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = timeout;
                    if (parameterValue != null)
                    {
                        cmd.Parameters.AddWithValue(parameterName, parameterValue);
                    }
                    await con.OpenAsync();
                    object data = await cmd.ExecuteScalarAsync();
                    if (data != null)
                    {
                        response.Success = true;
                        response.Data = data;
                    }
                }
                catch (SqlException ex)
                {
                    GenerateTextFile<Exception>.FromObject(ex, parameterValue);
                }
                catch (Exception ex2)
                {
                    GenerateTextFile<Exception>.FromObject(ex2, parameterValue);
                }
            }
            return response;
        }
    }
}