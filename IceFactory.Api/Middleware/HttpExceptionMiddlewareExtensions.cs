using Microsoft.AspNetCore.Builder;

namespace IceFactory.Api.Middleware
{
    public static class HttpExceptionMiddlewareExtensions
    {
        public static IApplicationBuilder UseHttpExceptionMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<HttpExceptionMiddleware>();
        }
    }
}