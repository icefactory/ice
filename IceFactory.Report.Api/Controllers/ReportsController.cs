using System.IO;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Telerik.Reporting.Cache.File;
using Telerik.Reporting.Services;
using Telerik.Reporting.Services.AspNetCore;

namespace SiamEast.Report.Api.Controllers
{
    [Route("api/reports")]
    public class ReportsController : ReportsControllerBase
    {
        private readonly string _reportsPath;

        public ReportsController(IHostingEnvironment environment)
        {
            _reportsPath = Path.Combine(environment.WebRootPath, "Reports");

            ReportServiceConfiguration = new ReportServiceConfiguration
            {
                HostAppId = "SiamEast",
                Storage = new FileStorage(),
                ReportResolver = new ReportTypeResolver()
                                    .AddFallbackResolver(new ReportFileResolver(_reportsPath))
                
            };
        }

        [HttpGet("reportlist")]
        public IEnumerable<string> GetReports()
        {
            return Directory
                .GetFiles(_reportsPath)
                .Select(Path.GetFileName);
        }
    }
}
