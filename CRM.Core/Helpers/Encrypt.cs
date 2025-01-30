using System;
using System.Text;
using System.Web;

namespace GS1Peru.Core.Helpers
{
    public class Encrypt
    {
        public static string ConvertHexToString(string value)
        {
            string hexValues = value;
            var hex = "";
            StringBuilder sb = new StringBuilder();
            for (var b = 0; b < hexValues.Length; b++)
            {
                if ((b + 1) % 2 == 0)
                {
                    hex = hexValues.Substring((b - 1), 2);
                    int v = Convert.ToInt32(hex, 16);
                    string stringValue = Char.ConvertFromUtf32(v);
                    char charValue = (char)v;
                    sb.Append(stringValue);
                }
            }
            return sb.ToString();
        }

        public static string ConvertStringToHex(string value)
        {
            byte[] ba = Encoding.Default.GetBytes(value);
            var hexString = BitConverter.ToString(ba);
            hexString = hexString.Replace("-", "");
            return hexString;
        }

        public static string Run(string data, bool flag = true)
        {
            string rpta = string.Empty;
            if (!string.IsNullOrEmpty(data))
            {
                bool tipo = flag;
                char[] datos = data.ToCharArray();
                long nReg = datos.LongLength;
                for (long i = 0; i < nReg; i++)
                {
                    if (flag)
                    {
                        datos[i]++;
                        flag = false;
                    }
                    else
                    {
                        datos[i]--;
                        flag = true;
                    }
                }
                rpta = String.Join("", datos);
                if (tipo) return HttpUtility.UrlPathEncode(rpta);
                else return rpta;
            }
            else return rpta;
        }
    }
}