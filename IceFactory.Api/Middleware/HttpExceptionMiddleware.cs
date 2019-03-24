using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace IceFactory.Api.Middleware
{
    public class HttpExceptionMiddleware
    {
        private readonly ILogger<HttpExceptionMiddleware> _logger;
        private readonly RequestDelegate _next;

        public HttpExceptionMiddleware(RequestDelegate next, ILoggerFactory loggerFactory)
        {
            _next = next ?? throw new ArgumentNullException(nameof(next));
            _logger = loggerFactory?.CreateLogger<HttpExceptionMiddleware>() ??
                      throw new ArgumentNullException(nameof(loggerFactory));
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                if (context.Response.HasStarted)
                {
                    _logger.LogWarning("The response has already started, the http middleware will not be executed.");
                    throw;
                }

                context.Response.Clear();
                context.Response.StatusCode = 400;
                context.Response.ContentType = @"application/json";

                await context.Response.WriteAsync(JsonConvert.SerializeObject(ex.Message));
            }
        }
    }
}