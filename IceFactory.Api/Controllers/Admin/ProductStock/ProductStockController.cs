using System;
using System.Threading.Tasks;
using IceFactory.Model.ProductStock;
using IceFactory.Module.ProductStock;
using IceFactory.Repository.UnitOfWork;
using IceFactory.Utility.Http;
using Microsoft.AspNetCore.Mvc;

namespace IceFactory.Api.Controllers.Admin.ProductStock
{
    [Route("api/admin/[controller]")]
    public class ProductStockController : BaseController
    {
        private readonly ProductStockModule _objModule;

        public ProductStockController(IceFactoryUnitOfWork unitOfWork) : base(unitOfWork)
        {
            _objModule = new ProductStockModule(unitOfWork);
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
        [HttpPost("GetView")]
        public async Task<IActionResult> GetView([FromBody] filterStock objFilter)
        {
            try
            {
                //filterStock objFilter = new filterStock();
                //objFilter.product_id = id;
                return Ok(await _objModule.executGetStockTrans(objFilter));
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

        // Http POST
        //[HttpPost]
        //public async Task<IActionResult> Post([FromBody] ClassType classType)
        [HttpPost("insertData")]
        //Post([FromBody] ClassType classType)
        public async Task<IActionResult> insertData([FromBody] ProductStockModel objData)
        {
            try
            {
                //ProductStockModel objData = new ProductStockModel();
                //objData.product_id = id;
                //objData.item_amt = amt;

                return Ok(_objModule.InsertAsync(objData));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message.ConvertExceptionToErrorInfo());
                throw;
            }
        }
        [HttpPost("updateData")]
        public async Task<IActionResult> updateData([FromBody] ProductStockModel objData)
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