using System;
using System.Threading.Tasks;
using IceFactory.Model.Requisition;
using IceFactory.Module.Requisition;
using IceFactory.Repository.UnitOfWork;
using IceFactory.Utility.Http;
using Microsoft.AspNetCore.Mvc;

namespace IceFactory.Api.Controllers.Admin.Requisition
{
    [Route("api/admin/[controller]")]
    public class RequisitionController : BaseController
    {
        private readonly RequisitionModule _objModule;

        public RequisitionController(IceFactoryUnitOfWork unitOfWork) : base(unitOfWork)
        {
            _objModule = new RequisitionModule(unitOfWork);
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
                filterRequisition objFilter = new filterRequisition();
                objFilter.product_id = id;
                return Ok(await _objModule.getAll(objFilter));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message.ConvertExceptionToErrorInfo());
            }
        }
        [HttpPost("searchRequisition")]
        public async Task<IActionResult> GetSearchRequisition([FromBody] filterRequisition objFilter)
        {
            try
            {
                return Ok(_objModule.searchRequisition(objFilter));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message.ConvertExceptionToErrorInfo());
            }
        }
        [HttpPost("searchReqProduct")]
        public async Task<IActionResult> GetSearchRequisitionProduct([FromBody] filterRequisition objFilter)
        {
            try
            {
                return Ok(_objModule.searchRequisitionProduct(objFilter));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message.ConvertExceptionToErrorInfo());
            }
        }
        
        [HttpGet("initReqByRoute/{id}")]
        public async Task<IActionResult> initReqByRoute(int id)
        {
            try
            {
                return Ok(await _objModule.requisitionInitByRouteID(id));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message.ConvertExceptionToErrorInfo());
            }
        }

        // Http POST
        //[HttpPost]
        //public async Task<IActionResult> Post([FromBody] ClassType classType)
        [HttpPost("saveData")]
        //Post([FromBody] ClassType classType)
        public async Task<IActionResult> saveData([FromBody] RequisitionDataModel objData)
        {
            try
            {
                //ProductStockModel objData = new ProductStockModel();
                //objData.product_id = id;
                //objData.item_amt = amt;

                return Ok(_objModule.SaveRequisitionData(objData));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message.ConvertExceptionToErrorInfo());

                //return BadRequest(e.Message.ConvertExceptionToErrorInfo());
                throw;
            }
        }
        [HttpPost("updateData")]
        public async Task<IActionResult> updateData([FromBody] RequisitionDataModel objData)
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


        [HttpPost("loadPage/{route_id}")]
        public async Task<IActionResult> loadPage(int route_id)
        {
            //try
            //{
            //    filterRequisition objFilter = new filterRequisition();
            //    objFilter.route_id = route_id;
            //    objFilter.document_date = string.Format("{0:yyy-MM-dd}", DateTime.Today);

            //    RequisitionDataModel initData = new RequisitionDataModel();
            //    initData._vwMaster = _objModule.searchRequisition(objFilter)

            //     //Ok( _objModule.searchRequisition(objFilter));

            //    return Ok(await _objModule.searchRequisition());
            //}
            //catch (Exception e)
            //{
            //    return BadRequest(e.Message.ConvertExceptionToErrorInfo());
            //}
            return Ok(null);
        }
    }
}