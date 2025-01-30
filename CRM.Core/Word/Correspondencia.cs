using System.IO.Compression;
using io = System.IO;

namespace GS1Peru.Core.Word
{
    public class Correspondencia
    {
        public byte[] CrearDocWord(string ArchivoOrigen, string[] valores)
        {
            byte[] fileBytes = null;

            if (io.File.Exists(ArchivoOrigen))
            {
                string dataDoc;
                ZipArchiveEntry zae;

                using (io.MemoryStream docDestino = new io.MemoryStream())
                {
                    using (io.FileStream docOrigen = new io.FileStream(ArchivoOrigen, io.FileMode.OpenOrCreate, io.FileAccess.ReadWrite, io.FileShare.ReadWrite))
                    {
                        using (ZipArchive zipDestino = new ZipArchive(docDestino, ZipArchiveMode.Create))
                        {
                            using (ZipArchive zipOrigen = new ZipArchive(docOrigen, ZipArchiveMode.Read))
                            {
                                foreach (ZipArchiveEntry archivoXml in zipOrigen.Entries)
                                {
                                    zae = zipDestino.CreateEntry(archivoXml.FullName);

                                    using (io.Stream flujoDestino = zae.Open())
                                    {
                                        if (archivoXml.FullName.StartsWith("word/media"))
                                        {
                                            using (io.Stream flujoImagen = archivoXml.Open())
                                            {
                                                flujoImagen.CopyTo(flujoDestino);
                                            }
                                        }
                                        else
                                        {
                                            using (io.StreamWriter sw = new io.StreamWriter(flujoDestino, System.Text.Encoding.UTF8))
                                            {
                                                using (io.Stream flujoOrigen = archivoXml.Open())
                                                {
                                                    using (io.StreamReader sr = new io.StreamReader(flujoOrigen, System.Text.Encoding.UTF8))
                                                    {
                                                        if (archivoXml.Name.Equals("document.xml"))
                                                        {
                                                            dataDoc = Reemplazar(sr.ReadToEnd(), valores);
                                                        }
                                                        else
                                                        {
                                                            dataDoc = sr.ReadToEnd();
                                                        }
                                                        sw.Write(dataDoc);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    fileBytes = docDestino.ToArray();
                }
            }
            return fileBytes;
        }

        private string Reemplazar(string data, string[] valores)
        {
            if (!string.IsNullOrEmpty(data))
            {
                string[] VI_COLUMNS;
                for (int x = 0; x < valores.Length; x++)
                {
                    VI_COLUMNS = valores[x].Split('¦');
                    data = data.Replace(VI_COLUMNS[0].Trim(), VI_COLUMNS[1].Trim().Replace("&", "&amp;"));
                }
                //int posBusqueda = 0;
                //int posInicio = 0;
                //int posFin = 0;
                //int lenData = data.Length;
                //int cv = 0;
                //string campo = "";
                //while (posInicio > -1 && posBusqueda < lenData)
                //{
                //    posInicio = data.IndexOf("[", posBusqueda);
                //    if (posInicio > -1)
                //    {
                //        posBusqueda = posInicio + 1;
                //        posFin = data.IndexOf("]", posBusqueda);
                //        if (posFin > -1)
                //        {
                //            campo = data.Substring(posInicio, posFin - posInicio + 1);
                //            if (cv < valores.Length)
                //            {
                //                data = data.Replace(campo, valores[cv]);
                //                posBusqueda = posFin + 1;
                //                cv++;
                //            }
                //            else break;
                //        }
                //    }
                //}
            }
            return data;
        }
    }
}