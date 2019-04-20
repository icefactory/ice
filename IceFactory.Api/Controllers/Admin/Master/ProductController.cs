using System;
using System.Threading.Tasks;
using IceFactory.Model.Master;
using IceFactory.Module.Master;
using IceFactory.Repository.UnitOfWork;
using IceFactory.Utility.Http;
using Microsoft.AspNetCore.Mvc;

namespace IceFactory.Api.Controllers.Admin.Master
{
    [Route("api/admin/[controller]")]
    public class ProductController : BaseController
    {
        private readonly ProductModule _objModule;

        public ProductController(IceFactoryUnitOfWork unitOfWork) : base(unitOfWork)
        {
            _objModule = new ProductModule(unitOfWork);
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

        [HttpPost("search")]
        public async Task<IActionResult> GetSearch([FromBody] filterProduct objFilter)
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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {
            try
            {
                return Ok(await _objModule.FindByIdAsync(id));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message.ConvertExceptionToErrorInfo());
            }
        }

        [HttpGet("getPrice/{cus_id}")]
        public async Task<IActionResult> getPriceAgency(int cus_id)
        {
            try
            {
                return Ok(await _objModule.getPriceAgency(cus_id));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message.ConvertExceptionToErrorInfo());
            }
        }

        // Http POST
        //[HttpPost]
        //public async Task<IActionResult> Post([FromBody] ClassType classType)
        [HttpPost("insertData")]
        //Post([FromBody] ClassType classType)
        public async Task<IActionResult> insertData([FromBody] ProductModel objData)
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
        public async Task<IActionResult> updateData([FromBody] ProductModel objData)
        {
            try
            {
                return Ok(_objModule.executeUpdateProduct(objData));
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