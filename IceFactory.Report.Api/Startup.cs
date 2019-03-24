using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Cors.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Net;

namespace SiamEast.Report.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //
            // Config cors origin
            services.AddCors(options =>
            {
                if (Configuration.GetValue<string>("AllowAllOrigins") == "true")
                {
                    options.AddPolicy("AllowSpecificOrigin",
                        builder => builder
                            .AllowAnyOrigin()
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .AllowCredentials());
                }
                else
                {
                    options.AddPolicy("AllowSpecificOrigin",
                        builder => builder
                            .WithOrigins(Configuration.GetValue<string>("AllowOrigins").Split(','))
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .AllowCredentials());
                }
            });

            services.Configure<MvcOptions>(options =>
            {
                options.Filters.Add(new CorsAuthorizationFilterFactory("AllowSpecificOrigin"));
            });

            if (Configuration.GetValue<string>("UnderProxyServer") == "true")
            {
                services.Configure<ForwardedHeadersOptions>(options =>
                {
                    // options.KnownProxies.Add(IPAddress.Parse("10.0.0.100"));
                    options.KnownProxies.Add(Dns.GetHostAddresses(Configuration.GetValue<string>("ProxyServer"))[0]);
                });
            }

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            //
            // Forward http headers use for run this system under reverse proxy
            // such as IISARR or NGINX.
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });

            app.UseCors("AllowSpecificOrigin");
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseMvc();
        }
    }
}