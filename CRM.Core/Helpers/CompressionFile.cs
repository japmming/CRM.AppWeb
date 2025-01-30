using GS1Peru.Core.Entities;
using io = System.IO;
using System.IO.Compression;
using System.Collections.Generic;

namespace GS1Peru.Core.Helpers
{
    public class CompressionFile
    {

        public static byte[] Compression(List<SourceFileMemory> sourceFiles)
        {
            byte[] fileBytes = null;

            using (io.MemoryStream memory = new io.MemoryStream())
            {
                using (ZipArchive zip = new ZipArchive(memory, ZipArchiveMode.Create, true))
                {
                    foreach (SourceFileMemory sourceFile in sourceFiles)
                    {
                        ZipArchiveEntry zipItem = zip.CreateEntry(sourceFile.Name + sourceFile.Extension);

                        using (io.MemoryStream origenMemoryStream = new io.MemoryStream(sourceFile.FileBytes))
                        {
                            using (io.Stream entryStream = zipItem.Open())
                            {
                                origenMemoryStream.CopyTo(entryStream);
                            }
                        }

                    }
                }
                fileBytes = memory.ToArray();
            }

            return fileBytes;
        }
    }
}
