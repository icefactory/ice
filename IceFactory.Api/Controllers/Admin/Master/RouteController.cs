using System;
using System.Linq;
using System.Threading.Tasks;
using IceFactory.Model.Master;
using IceFactory.Model.View;
using IceFactory.Module.Master;
using IceFactory.Repository.UnitOfWork;
using IceFactory.Utility.Http;
using Microsoft.AspNetCore.Mvc;

namespace IceFactory.Api.Controllers.Admin.Master
{
    [Route("api/admin/[controller]")]
    public class RouteController : BaseController
    {
        private readonly RouteModule _objModule;

        public RouteController(IceFactoryUnitOfWork unitOfWork) : base(unitOfWork)
        {
            _objModule = new RouteModule(unitOfWork);
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                return Ok(await _objModule.GetAsync());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message.ConvertExceptionToErrorInfo());
            }
        }

        [HttpPost("search")]
        public async Task<IActionResult> search([FromBody] filterRoute objFilter)
        {
            try
            {
                return Ok(await _objModule.search(objFilter));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message.ConvertExceptionToErrorInfo());
            }
        }
        [HttpGet("getDDL")]
        public async Task<IActionResult> GetDDL()
        {
            try
            {

                return Ok(_objModule.GetForDropDownList().OrderBy(o => o.Id));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message.ConvertExceptionToErrorInfo());
            }
        }
        [HttpPost("insertData")]
        public async Task<IActionResult> insertData(RouteModel objData)
        {
            try
            {

                return Ok(_objModule.InsertAsync(objData));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message.ConvertExceptionToErrorInfo());
            }
        }
        [HttpPost("updateData")]
        public async Task<IActionResult> updateData(RouteModel objData)
        {
            try
            {

                return Ok(_objModule.UpdateAsync(objData));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message.ConvertExceptionToErrorInfo());
            }
        }

        [HttpPost("deleteData")]
        public async Task<IActionResult> deleteData(Int32 id)
        {
            try
            {

                return Ok(_objModule.DeleteAsync(id));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message.ConvertExceptionToErrorInfo());
            }
        }

    }
}