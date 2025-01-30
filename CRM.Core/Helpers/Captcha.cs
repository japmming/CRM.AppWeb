using GS1Peru.Core.Entities;
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Text;

namespace GS1Peru.Core.Helpers
{
    public class Captcha
    {
        private static Random oAzar = new Random();

        private static string GetRandom()
        {
            int n = oAzar.Next(26) + 65;
            System.Threading.Thread.Sleep(15);
            return (((char)n).ToString());
        }

        public static enCaptcha CreateCaptcha(int width, int height, string fontType = "Arial", int fontSize = 30)
        {
            enCaptcha oCaptcha = new enCaptcha();
            Bitmap bmp = new Bitmap(width, height);
            Graphics grafico = Graphics.FromImage(bmp);
            Rectangle rect = new Rectangle(0, 0, width, height);
            LinearGradientBrush deg = new LinearGradientBrush(rect, Color.Aqua, Color.Blue,
                LinearGradientMode.BackwardDiagonal);
            grafico.FillRectangle(deg, rect);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 5; i++) { sb.Append(GetRandom()); }
            grafico.DrawString(sb.ToString(), new Font(fontType, fontSize), Brushes.White, 5, 10);
            for (int i = 0; i < 10; i++)
            {
                grafico.DrawLine(new Pen(Brushes.Yellow, 2),
                    new Point(oAzar.Next(width), oAzar.Next(height)),
                    new Point(oAzar.Next(width), oAzar.Next(height)));
            }
            oCaptcha.Code = sb.ToString();
            byte[] captcha;
            using (MemoryStream ms = new MemoryStream())
            {
                bmp.Save(ms, ImageFormat.Jpeg);
                captcha = ms.ToArray();
            }
            oCaptcha.Image = captcha;
            return (oCaptcha);
        }
    }
}