using IceFactory.Model.Master;
using IceFactory.Model.ProductStock;
using IceFactory.Model.Requisition;
using IceFactory.Model.View;
using IceFactory.Module.ProductStock;
using IceFactory.Repository.Infrastructure;
using IceFactory.Repository.UnitOfWork;
using IceFactory.Utility.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;


namespace IceFactory.Module.Requisition
{
    public class RequisitionModule : BaseModule
    {
        public RequisitionModule(IceFactoryUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        #region " Functions for Product "

        /// <summary>
        ///     GetAsync DropDownList
        /// </summary>
        /// <param name="filter"></param>
        /// <param name="orderBy"></param>
        /// <param name="includeProperties"></param>
        /// <returns></returns>
        public IQueryable<VDropDownList> GetForDropDownList(Expression<Func<RequisitionModel, bool>> filter = null,
            Func<IQueryable<RequisitionModel>, IOrderedQueryable<RequisitionModel>> orderBy = null, string includeProperties = "")
        {
            return UnitOfWork.Context.Query<RequisitionModel>().Select(s => new VDropDownList() { Id = s.requisition_id, Code = s.document_no.ToString(), Name = s.requisition_id.ToString() });

        }

        /// <summary>
        ///     GetAsync all Product
        /// </summary>
        /// <returns>IQueryable of Product</returns>
        public async Task<IQueryable<RequisitionModel>> GetAsync()
        {
            return await Task.Factory.StartNew(() =>
            {
                //var Product = UnitOfWork.ProductRepository.Get(/*p => p.Status == StatusOfProduct.Enabled*/);
                return UnitOfWork.Context.Set<RequisitionModel>();
            });
        }

        /// <summary>
        ///     GetAsync Product by id
        /// </summary>
        /// <param name="id">Id of Product</param>
        /// <returns>The Product or null value</returns>
        public async Task<RequisitionModel> FindByIdAsync(Int32 id)
        {

            return await UnitOfWork.Context.Set<RequisitionModel>().Where(p => p.requisition_id == id)
                .FirstOrDefaultAsync();

        }

        /// <summary>
        ///     Insert new Product to database
        /// </summary>
        /// <param name="blackList">The object of Product</param>
        /// <returns>The Product object</returns>
        public async Task<RequisitionDataModel> SaveRequisitionData(RequisitionDataModel objData)
        {
            try
            {
                //RequisitionModel objMast = new RequisitionModel();

                List<ProductModel> lstProRemain = new List<ProductModel>();
                if ("APR,POS,DLV".Contains(objData._master.requisition_type))
                {
                    foreach (var item in objData._lstProducts)
                    {
                        var objChk = UnitOfWork.Context.Set<ProductModel>().Where(w => w.product_id.Equals(item.product_id) && w.remain_amt < item.quantity).FirstOrDefault();
                        if (objChk != null)
                            lstProRemain.Add(objChk);
                    }

                    if (lstProRemain.Count > 0)
                    {
                        var lstMsg = lstProRemain.Select(s => string.Format("รายการสินค้า {0} ยอดคงเหลือ {1} น้อยกว่า ยอดเบิกจ่าย", s.product_name, s.remain_amt));
                        throw new Exception(new ErrorInfo
                        {
                            Message = string.Join("\n", lstMsg),
                            MessageLocal = string.Join("\n", lstMsg),
                            Data = -1
                        }.ConvertErrorInfoToException());
                    }
                }

                objData._master.ModifyDate = DateTime.Now;
                objData._master.ModifyByUserId = 1;

                if (objData._master.requisition_id <= 0)
                {
                    objData._master.document_no = "abc";

                    objData._master.CreateDate = DateTime.Now;
                    objData._master.CreateByUserId = 1;
                    UnitOfWork.Context.Set<RequisitionModel>().Add(objData._master);
                }
                else
                {
                    UnitOfWork.Context.Set<RequisitionModel>().Update(objData._master);
                }
                int i = UnitOfWork.Context.SaveChanges();

                foreach (var item in objData._lstProducts)
                {
                    item.ModifyDate = DateTime.Now;
                    item.ModifyByUserId = 1;
                    if (item.id <= 0)
                    {
                        item.requisition_id = objData._master.requisition_id;
                        item.document_no = objData._master.document_no;
                        item.status = "Y";
                        item.CreateDate = DateTime.Now;
                        item.CreateByUserId = 1;
                        UnitOfWork.Context.Set<RequisitionProductModel>().Add(item);
                    }
                    else
                    {
                        UnitOfWork.Context.Set<RequisitionProductModel>().Update(item);
                    }

                    await UnitOfWork.Context.SaveChangesAsync();
                    if ("APR,POS,DLV".Contains(objData._master.requisition_type))
                    {
                        ProductStockModel objStock = new ProductStockModel();
                        objStock.CreateByUserId = 1;
                        objStock.CreateDate = DateTime.Now;
                        objStock.ModifyByUserId = item.ModifyByUserId;
                        objStock.ModifyDate = item.ModifyDate;
                        objStock.product_id = item.product_id;
                        objStock.relate_doc_id = item.requisition_id;
                        objStock.item_amt = item.quantity;
                        objStock.from_action = objData._master.requisition_type;

                        ProductStockModule processStock = new ProductStockModule(UnitOfWork);
                        await processStock.InsertAsync(objStock);
                    }
                }

                return objData;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        /// <summary>
        ///     UpdateAsync Product to database
        /// </summary>
        /// <param name="id">The id of Product</param>
        /// <param name="Product">The object of Product</param>
        /// <returns>null</returns>
        public async Task<RequisitionDataModel> UpdateAsync(RequisitionDataModel objData)
        {
            //var ent = UnitOfWork.Context.Entry<ProductStockModel>(Product);
            //ent.State = EntityState.Modified;
            //int re = await UnitOfWork.Context.SaveChangesAsync();

            ////await UnitOfWork.ProductRepository.UpdateAsync(Product);
            ////await SaveAsync();

            return objData;
        }

        /// <summary>
        ///     UpdateAsync Product status from Enabled to Disabled
        /// </summary>
        /// <param name="id">Id of Product</param>
        /// <returns>null</returns>
        /// <exception cref="Exception">Throw exception when can not find Product by id</exception>
        public async Task DeleteAsync(int id)
        {
            var Product = await UnitOfWork.ProductRepository.GetByIdAsync(id);

            if (Product == null)
                throw new Exception(new ErrorInfo
                {
                    Message = $"Can not find id of Product : {id}",
                    MessageLocal = $"ไม่พบข้อมูล Product : {id} ในระบบ",
                    Data = id
                }.ConvertErrorInfoToException());

            //Product.Status = StatusOfProduct.Disabled;

            await UnitOfWork.ProductRepository.UpdateAsync(Product);
            await SaveAsync();
        }

        /// <summary>
        ///     UpdateAsync list of Product status from Enabled to Disabled
        /// </summary>
        /// <param name="ids">List id of Product</param>
        /// <returns>null</returns>
        /// <exception cref="Exception">Throw exception when can not find any one of Product by list id of Branchs</exception>
        public async Task DeleteAsync(IEnumerable<Int32> ids)
        {
            var Products = UnitOfWork.ProductRepository.Filter(p => ids.Contains(p.product_id));

            if (!await Products.AnyAsync())
                throw new Exception(new ErrorInfo
                {
                    Message = $"Can not find ids of Product : {string.Join(", ", ids)}",
                    MessageLocal = $"ไม่พบข้อมูล Product : {string.Join(", ", ids)} ในระบบ",
                    Data = string.Join(", ", ids)
                }.ConvertErrorInfoToException());

            foreach (var Product in Products)
            {
                //Product.Status = StatusOfProduct.Disabled;
                await UnitOfWork.ProductRepository.UpdateAsync(Product);
            }

            await SaveAsync();
        }
        public async Task<RequisitionDataModel> getAll(filterRequisition objFilter)
        {
            try
            {

                string sql = string.Format("exec stk_trn_search {0} , '{1}' , {2} ", objFilter.requisition_id == null ? "null" : objFilter.requisition_id.ToString(), objFilter.product_name, objFilter.route_id == null ? "null" : objFilter.route_id.ToString());

                int i = Convert.ToInt32(objFilter.requisition_id ?? 0);

                RequisitionDataModel objData = new RequisitionDataModel();
                objData._master = UnitOfWork.Context.Set<RequisitionModel>().Where(w => w.requisition_id.Equals(i)).FirstOrDefault();
                objData._lstProducts = UnitOfWork.Context.Set<RequisitionProductModel>().Where(w => w.requisition_id.Equals(i)).ToList();
                objData._lstPackages = UnitOfWork.Context.Set<RequisitionPackageModel>().Where(w => w.requisition_id.Equals(i)).ToList();

                return objData;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {

            }
        }

        public async Task<IQueryable<vwRequisitionModel>> searchRequisition(filterRequisition objFilter)
        {
            try
            {

                string sql = string.Format("exec req_search {0} , {1} , '{2}' ,'{3}' ,'{4}','{5}' , {6} "
                    , objFilter.requisition_id == null ? "null" : objFilter.requisition_id.ToString()
                    , objFilter.route_id == null ? "null" : objFilter.route_id.ToString()
                    , objFilter.route_name
                    , objFilter.document_date == null ? "" : string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(objFilter.document_date))
                    , objFilter.requisition_type
                    , objFilter.status
                    , objFilter.round == null ? "null" : objFilter.round.ToString()
                    );



                RequisitionDataModel objData = new RequisitionDataModel();
                return UnitOfWork.Context.Query<vwRequisitionModel>().FromSql(sql);


            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {

            }
        }
        public async Task<int> executeDeteteStatus(Int32 id, Int32? iUserID)
        {
            try
            {

                using (var cmd = UnitOfWork.Context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "up_mas_product_delete";
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(new SqlParameter("@productID", SqlDbType.BigInt) { Value = id });
                    cmd.Parameters.Add(new SqlParameter("@user_id", SqlDbType.BigInt) { Value = iUserID ?? 1 });




                    //cmd.Parameters.Add(new SqlParameter("@id", SqlDbType.BigInt) { Direction = ParameterDirection.Output });

                    if (UnitOfWork.Context.Database.GetDbConnection().State == ConnectionState.Closed)
                    {
                        UnitOfWork.Context.Database.OpenConnection();
                    }

                    return await cmd.ExecuteNonQueryAsync();

                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {

            }
        }


        public async Task<IQueryable<vwRequisitionProductModel>> searchRequisitionProduct(filterRequisition objFilter)
        {
            try
            {

                string sql = string.Format("exec req_search_product {0} , '{1}'"
                    , objFilter.requisition_id == null ? "null" : objFilter.requisition_id.ToString()
                    , objFilter.status
                    );



                RequisitionDataModel objData = new RequisitionDataModel();
                //List<vwRequisitionModel> dd = UnitOfWork.Context.Query<vwRequisitionModel>().FromSql(sql).ToList();
                //if (dd.Count() > 0)
                //{
                return UnitOfWork.Context.Query<vwRequisitionProductModel>().FromSql(sql);// UnitOfWork.Context.Query<vwRequisitionModel>().FromSql(sql).FirstOrDefault();
                //objData._master = UnitOfWork.Context.Set<RequisitionModel>().Where(w => w.requisition_id.Equals(i)).FirstOrDefault();
                //objData._lstProducts = UnitOfWork.Context.Set<RequisitionProductModel>().Where(w => w.requisition_id.Equals(i)).ToList();
                //objData._lstPackages = UnitOfWork.Context.Set<RequisitionPackageModel>().Where(w => w.requisition_id.Equals(i)).ToList();
                ////}
                //return objData;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {

            }
        }


        public async Task<vwRequisitionModel> requisitionInitByRouteID(Int32 routeId)
        {
            try
            {

                string sql = string.Format("exec req_initByRoute {0} ", routeId);



                RequisitionDataModel objData = new RequisitionDataModel();
                return UnitOfWork.Context.Query<vwRequisitionModel>().FromSql(sql).FirstOrDefault();


            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {

            }
        }

        #endregion
    }
}
