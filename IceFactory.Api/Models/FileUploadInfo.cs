namespace IceFactory.Api.Models
{
    public class FileUploadInfo
    {
        public string OriginalFileName { get; set; }
        public string OriginalFileExtension { get; set; }
        public long OriginalFileSize { get; set; }
        public string TempFileName { get; set; }
        public string TempFilePath { get; set; }
    }
}