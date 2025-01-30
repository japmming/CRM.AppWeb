using System;

namespace GS1Peru.Core.Helpers
{
    public class TextFormat
    {
        public static string YYMMDD(string texto, string extension = "")
        {
            DateTime fechaActual = DateTime.Now;
            string formato = String.Format("{0}_{1}_{2}_{3}{4}", texto, fechaActual.Year,
                fechaActual.Month.ToString().PadLeft(2, '0'),
                fechaActual.Day.ToString().PadLeft(2, '0'), extension);
            return (formato);
        }
    }
}