using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

namespace GS1Peru.Core.Helpers
{
    public class CompressionImage
    {
        public Image CompressImage(Stream ImageStream, int Size, int newQuality)   // set quality to 1-100, eg 50
        {
            int newWidth, newHeight;
            //using (Image image = Image.FromFile(fileName))
            using (Image image = new Bitmap(ImageStream))
            {
                if (image.Width > image.Height)
                {
                    newWidth = Size;
                    newHeight = Convert.ToInt32(image.Height * Size / (double)image.Width);
                }
                else
                {
                    newWidth = Convert.ToInt32(image.Width * Size / (double)image.Height);
                    newHeight = Size;
                }

                using (Image memImage = new Bitmap(image, newWidth, newHeight))
                {
                    ImageCodecInfo myImageCodecInfo;
                    System.Drawing.Imaging.Encoder myEncoder;
                    EncoderParameter myEncoderParameter;
                    EncoderParameters myEncoderParameters;
                    myImageCodecInfo = GetEncoderInfo("image/jpeg");
                    myEncoder = System.Drawing.Imaging.Encoder.Quality;
                    myEncoderParameters = new EncoderParameters(1);
                    myEncoderParameter = new EncoderParameter(myEncoder, newQuality);
                    myEncoderParameters.Param[0] = myEncoderParameter;

                    MemoryStream memStream = new MemoryStream();
                    memImage.Save(memStream, myImageCodecInfo, myEncoderParameters);

                    Image newImage = Image.FromStream(memStream);
                    ImageAttributes imageAttributes = new ImageAttributes();

                    using (Graphics g = Graphics.FromImage(newImage))
                    {
                        g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;  //**
                        g.DrawImage(newImage, new Rectangle(Point.Empty, newImage.Size), 0, 0, newImage.Width, newImage.Height, GraphicsUnit.Pixel, imageAttributes);
                    }
                    return newImage;
                }
            }
        }

        private static ImageCodecInfo GetEncoderInfo(string mimeType)
        {
            ImageCodecInfo[] encoders;
            encoders = ImageCodecInfo.GetImageEncoders();
            foreach (ImageCodecInfo ici in encoders)
                if (ici.MimeType == mimeType) return ici;

            return null;
        }
    }
}
