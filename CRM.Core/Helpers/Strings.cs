using System;
using System.Globalization;
using System.Text;

namespace GS1Peru.Core.Helpers
{
    public static class Strings
    {
        public static string Right(this string str, int Length)
        {
            int LenT = str.Length;
            if (LenT <= Length)
            {
                return str;
            }
            else
            {
                return str.Substring(LenT - Length);
            }
        }

        public static string Left(this string str, int Length)
        {
            int LenT = str.Length;
            if (LenT <= Length)
            {
                return str;
            }
            else
            {
                return str.Substring(0, Length);
            }
        }

        public static bool IsNumeric(this string str)
        {
            double result;

            if (double.TryParse(str, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.CurrentCulture, out result))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public static string MonthName(this int Month)
        {
            string result = string.Empty;

            switch (Month)
            {
                case 0:
                    result = "APERTURA";
                    break;
                case 1:
                    result = "ENERO";
                    break;
                case 2:
                    result = "FEBRERO";
                    break;
                case 3:
                    result = "MARZO";
                    break;
                case 4:
                    result = "ABRIL";
                    break;
                case 5:
                    result = "MAYO";
                    break;
                case 6:
                    result = "JUNIO";
                    break;
                case 7:
                    result = "JULIO";
                    break;
                case 8:
                    result = "AGOSTO";
                    break;
                case 9:
                    result = "SEPTIEMBRE";
                    break;
                case 10:
                    result = "OCTUBRE";
                    break;
                case 11:
                    result = "NOVIEMBRE";
                    break;
                case 12:
                    result = "DICIEMBRE";
                    break;
                case 13:
                    result = "CIERRE";
                    break;
                default:
                    result = "NO EXISTE";
                    break;
            }

            return result;
        }

        public static int MonthGet(this string MonthName)
        {
            int result = 0;

            switch (MonthName)
            {
                case "APERTURA":
                    result = 0;
                    break;
                case "ENERO":
                    result = 1;
                    break;
                case "FEBRERO":
                    result = 2;
                    break;
                case "MARZO":
                    result = 3;
                    break;
                case "ABRIL":
                    result = 4;
                    break;
                case "MAYO":
                    result = 5;
                    break;
                case "JUNIO":
                    result = 6;
                    break;
                case "JULIO":
                    result = 7;
                    break;
                case "AGOSTO":
                    result = 8;
                    break;
                case "SEPTIEMBRE":
                    result = 9;
                    break;
                case "SETIEMBRE":
                    result = 9;
                    break;
                case "OCTUBRE":
                    result = 10;
                    break;
                case "NOVIEMBRE":
                    result = 11;
                    break;
                case "DICIEMBRE":
                    result = 12;
                    break;
                case "CIERRE":
                    result = 13;
                    break;
                default:
                    result = -1;
                    break;
            }

            return result;
        }

        public static string FirstLetterToUpper(this string str)
        {
            if (str == null)
                return null;

            if (str.Length > 1)
                return char.ToUpper(str[0]) + str.Substring(1).ToLower();

            return str.ToUpper();
        }

        public static string ToTitleCase(this string str)
        {
            return CultureInfo.CurrentCulture.TextInfo.ToTitleCase(str.ToLower());
        }

        public static char Chr(this int valor)
        {
            return Convert.ToChar(valor);
        }

        public static char ChrW(this int CharCode)
        {
            return Convert.ToChar((int)(CharCode & 0xffff));
        }

        public static char Lf()
        {
            return '\n';
        }

        public static char Cr()
        {
            return '\r';
        }

        public static char Tab()
        {
            return '\t';
        }

        public static bool IsDateC(this string anyString)
        {
            bool ValorReturn;
            if (anyString == null)
            {
                anyString = "";
            }
            if (anyString.Length > 0)
            {
                DateTime dummyOut;
                ValorReturn = DateTime.TryParse(anyString, out dummyOut);
            }
            else
            {
                ValorReturn = false;
            }
            return ValorReturn;
        }

        public static string ToShortDateStringStandar(this DateTime Value)
        {
            return Value.ToString("yyyy-MM-dd");
        }

        public static string REMPLASA_CODIGO_HTML(this string DATO_A_REMPLASAR)
        {
            string DATO_REMPLASADO = DATO_A_REMPLASAR;
            string[] CARACTERES = {
                                  "&Aacute;|Á","&#193;|Á","&#xC1;|Á","&aacute;|á","&#225;|á","&#xE1;|á",
                                  "&Eacute;|É","&#201;|É","&#xC9;|É","&eacute;|é","&#233;|é","&#xE9;|é",
                                  "&Iacute;|Í","&#205;|Í","&#xCD;|Í","&iacute;|í","&#237;|í","&#xED;|í",
                                  "&Oacute;|Ó","&#211;|Ó","&#xD3;|Ó","&oacute;|ó","&#243;|ó","&#xF3;|ó",
                                  "&Uacute;|Ú","&#218;|Ú","&#xDA;|Ú","&uacute;|ú","&#250;|ú","&#xFA;|ú",
                                  "&Ntilde;|Ñ","&#209;|Ñ","&#xD1;|Ñ","&ntilde;|ñ","&#241;|ñ","&#xF1;|ñ",
                                  "&Uuml;|Ü","&#220;|Ü","&#xDC;|Ü","&uuml;|ü","&#252;|ü","&#xFC;|ü",
                                  "&#38|&","&amp;|&","&#39;|'","&QUOT;|\"","&quot;|\""
                               };
            int X;
            for (X = 0; X <= CARACTERES.Length - 1; X++)
            {
                string[] DIG_REMPLAZAR = CARACTERES[X].Split('|');
                DATO_REMPLASADO = DATO_REMPLASADO.Replace(DIG_REMPLAZAR[0], DIG_REMPLAZAR[1]);
            }

            return DATO_REMPLASADO;
        }

        public static string RemoveDiacritics(this string text)
        {
            var normalizedString = text.Normalize(NormalizationForm.FormD);
            var stringBuilder = new StringBuilder();

            foreach (var c in normalizedString)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }

            return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
        }

        public static string RemoveChar(this string s, char n)
        {
            StringBuilder sb = new StringBuilder();

            foreach (char c in s)
            {
                if (!c.Equals(n))
                    sb.Append(c);
            }
            return sb.ToString();
        }

        public static bool ToBoolean(this string value)
        {
            switch (value.ToLower())
            {
                case "true":
                    return true;
                case "t":
                    return true;
                case "1":
                    return true;
                case "0":
                    return false;
                case "false":
                    return false;
                case "f":
                    return false;
                default:
                    throw new InvalidCastException("You can't cast that value to a bool!");
            }
        }

        public static string GetTypeNet(string TypeColumnDBF)
        {
            switch (TypeColumnDBF.ToLower())
            {
                case "character":
                    return "String";
                case "date":
                    return "DateTime";
                case "number":
                    return "Decimal";
                case "boolean":
                    return "Boolean";
            }
            throw new Exception("Invalid DBF data type specified: " + TypeColumnDBF);
        }

        public static string ConvertirDigitoCodigo(this string value)
        {
            string ReturnValue = value;
            string[] Caracteres = { "&|&amp;" };
            int X;
            string[] DIG_REMPLAZAR;
            for (X = 0; X <= Caracteres.Length - 1; X++)
            {
                DIG_REMPLAZAR = Caracteres[X].Split('|');
                ReturnValue = ReturnValue.Replace(DIG_REMPLAZAR[0], DIG_REMPLAZAR[1]);
            }
            return ReturnValue;
        }

    }
}
