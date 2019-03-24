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
    public class UnitController : BaseController
    {
        private readonly UnitModule _unitModule;

        public UnitController(IceFactoryUnitOfWork unitOfWork) : base(unitOfWork)
        {
            _unitModule = new UnitModule(unitOfWork);
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                return Ok(await _unitModule.GetAsync());
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

                return Ok(_unitModule.GetForDropDownList().OrderBy(o => o.Id));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message.ConvertExceptionToErrorInfo());
            }
        }
        [HttpPost("insertData")]
        public async Task<IActionResult> insertData(UnitModel objData)
        {
            try
            {

                return Ok(_unitModule.InsertAsync(objData));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message.ConvertExceptionToErrorInfo());
            }
        }
        [HttpPost("updateData")]
        public async Task<IActionResult> updateData(UnitModel objData)
        {
            try
            {

                return Ok(_unitModule.UpdateAsync(objData));
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

                return Ok(_unitModule.DeleteAsync(id));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message.ConvertExceptionToErrorInfo());
            }
        }

    }
}