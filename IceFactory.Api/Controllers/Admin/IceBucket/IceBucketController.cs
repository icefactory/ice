using System;
using System.Threading.Tasks;
using IceFactory.Model.IceBucket;
using IceFactory.Module.IceBucket;
using IceFactory.Repository.UnitOfWork;
using IceFactory.Utility.Http;
using Microsoft.AspNetCore.Mvc;

namespace IceFactory.Api.Controllers.Admin.IceBucket
{
    [Route("api/admin/[controller]")]
    public class IceBucketController : BaseController
    {
        private readonly IceBucketModule _objModule;

        public IceBucketController(IceFactoryUnitOfWork unitOfWork) : base(unitOfWork)
        {
            _objModule = new IceBucketModule(unitOfWork);
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
        [HttpGet("getDDL")]
        public async Task<IActionResult> GetDDL()
        {
            try
            {

                return Ok(_objModule.GetForDropDownList());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message.ConvertExceptionToErrorInfo());
            }
        }
        [HttpGet("GetView/{id}")]
        public async Task<IActionResult> GetView(int id)
        {
            try
            {
                filterIceBucket objFilter = new filterIceBucket();
                objFilter.bucketID = id;
                return Ok(await _objModule.getAll(objFilter));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message.ConvertExceptionToErrorInfo());
            }
        }
        [HttpPost("search")]
        public async Task<IActionResult> GetSearch([FromBody] filterIceBucket objFilter)
        {
            try
            {
                return Ok(_objModule.search(objFilter));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message.ConvertExceptionToErrorInfo());
            }
        }
       
        [HttpPost("saveData")]
        public async Task<IActionResult> saveData([FromBody] IceBucketModel objData)
        {
            try
            {

                return Ok(_objModule.SaveData(objData));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message.ConvertExceptionToErrorInfo());

                //return BadRequest(e.Message.ConvertExceptionToErrorInfo());
                throw;
            }
        }
        [HttpPost("updateData")]
        public async Task<IActionResult> updateData([FromBody] IceBucketModel objData)
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

        [HttpDelete("deleteData/{id}")]
        public async Task<IActionResult> executeDeteteStatus(Int32 id)
        {
            try
            {

                return Ok(_objModule.executeDeteteStatus(id, 1));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message.ConvertExceptionToErrorInfo());
            }
        }

    }
}