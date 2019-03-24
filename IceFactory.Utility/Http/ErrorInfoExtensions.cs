using Newtonsoft.Json;

namespace IceFactory.Utility.Http
{
    public static class ErrorInfoExtensions
    {
        public static ErrorInfo ConvertExceptionToErrorInfo(this string errorMessage)
        {
            if (!errorMessage.Contains("MessageLocal:"))
                return new ErrorInfo
                {
                    Message = errorMessage,
                    MessageLocal = errorMessage,
                    Data = null
                };

            var errorMessagesSplit1 = errorMessage.Split("MessageLocal:");
            var errorMessagesSplit2 = errorMessagesSplit1[1].Split("Data:");

            var message = errorMessagesSplit1[0].Replace("Message:", "");
            var messageLocal = errorMessagesSplit2[0].Replace("MessageLocal:", "").Trim();

            var jsonData = errorMessagesSplit2[1].Replace("Data:", "");
            var data = string.IsNullOrEmpty(jsonData)
                ? null
                : JsonConvert.DeserializeObject(jsonData);

            return new ErrorInfo
            {
                Message = message,
                MessageLocal = messageLocal,
                Data = data
            };
        }

        public static string ConvertErrorInfoToException(this ErrorInfo badRequestInfo)
        {
            return
                $"Message:{badRequestInfo.Message}MessageLocal:{badRequestInfo.MessageLocal}Data:{JsonConvert.SerializeObject(badRequestInfo.Data)}";
        }
    }
}