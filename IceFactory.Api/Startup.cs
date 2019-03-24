using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using IceFactory.Repository.Infrastructure;
using IceFactory.Repository.UnitOfWork;
using IceFactory.Utility.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace IceFactory.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        private string GetConnectionString()
        {
            return Configuration.GetConnectionString("SqlServerConnection");
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContextPool<IceFactoryContext>(options =>
                options.UseSqlServer(GetConnectionString(), b => b.MigrationsAssembly("IceFactory.Api")));

            //
            // Dependency Inject Core unit of work to all controller.
            services.AddScoped(service => new IceFactoryUnitOfWork(service.GetService<IceFactoryContext>()));

            //
            // Config cors origin
            services.AddCors(options =>
            {
                if (Configuration.GetValue<string>("AllowAllOrigins") == "true")
                {
                    options.AddPolicy("CorsPolicy",
                        builder => builder
                            .AllowAnyOrigin()
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .AllowCredentials());
                }
                else
                {
                    options.AddPolicy("CorsPolicy",
                        builder => builder
                            .WithOrigins(Configuration.GetValue<string>("AllowOrigins").Split(","))
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .AllowCredentials());
                }
            });

            if (Configuration.GetValue<string>("UnderProxyServer") == "true")
            {
                services.Configure<ForwardedHeadersOptions>(options =>
                {
                    // options.KnownProxies.Add(IPAddress.Parse("10.0.0.100")); 
                    options.ForwardedHeaders =
                        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
                    options.KnownProxies.Add(Dns.GetHostAddresses(Configuration.GetValue<string>("ProxyServer"))[0]);
                });
            }

            //
            // Add authentication for use this API
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(o => o.TokenValidationParameters = new TokenValidationParameters
                {
                    IssuerSigningKey = TokenAuthenticationOptions.Key,
                    ValidAudience = TokenAuthenticationOptions.Audience,
                    ValidIssuer = TokenAuthenticationOptions.Issuer,
                    ValidateIssuer = true,
                    // When receiving a token, check that we've signed it.
                    ValidateIssuerSigningKey = true,
                    // When receiving a token, check that it is still valid.
                    ValidateLifetime = true,
                    // This defines the maximum allowable clock skew - i.e. provides a tolerance on the token expiry time
                    // when validating the lifetime. As we're creating the tokens locally and validating them on the same
                    // machines which should have synchronised time, this can be set to zero. Where external tokens are
                    // used, some leeway here could be useful.
                    ClockSkew = TimeSpan.FromMinutes(0)
                });

            //
            // Config authorization for use this API
            services.AddAuthorization(auth =>
            {
                auth.AddPolicy("Bearer", new AuthorizationPolicyBuilder()
                    .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
                    .RequireAuthenticatedUser()
                    .Build());
            });

            //
            // Add framework services.
            services.AddMvc().AddJsonOptions(x =>
                x.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore);
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory,
            IceFactoryContext iceFactoryContext)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

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
            app.UseForwardedHeaders();

            app.UseExceptionHandler(appBuilder =>
            {
                appBuilder.Use(async (context, next) =>
                {
                    var error = context.Features[typeof(IExceptionHandlerFeature)] as IExceptionHandlerFeature;

                    //when authorization has failed, should return a json message to client
                    if (error?.Error is SecurityTokenExpiredException)
                    {
                        context.Response.StatusCode = 401;
                        context.Response.ContentType = "application/json";

                        await context.Response.WriteAsync(JsonConvert.SerializeObject(new
                        {
                            State = 401,
                            Message = "token expired"
                        }));
                    }
                    //when other error, return a error message json to client
                    else if (error?.Error != null)
                    {
                        context.Response.StatusCode = 500;
                        context.Response.ContentType = "application/json";

                        await context.Response.WriteAsync(JsonConvert.SerializeObject(new
                        {
                            State = 500,
                            error.Error.Message
                        }));
                    }
                    //when no error, do next.
                    else
                    {
                        await next();
                    }
                });
            });

            //
            // Shows UseCors with named policy.
            app.UseCors("CorsPolicy");
            app.UseAuthentication();
            app.UseHttpsRedirection();
            app.UseMvc();

            //
            // Initial data to database when create new database for first time.
            IceFactoryInitializer.InitializeAsync(iceFactoryContext).Wait();
        }
    }
}
