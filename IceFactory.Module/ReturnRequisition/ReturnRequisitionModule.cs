using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using IceFactory.Model.ProductStock;
using IceFactory.Model.ReturnRequisition;
using IceFactory.Model.View;
using IceFactory.Module.ProductStock;
using IceFactory.Repository.UnitOfWork;
using IceFactory.Utility.Http;
using Microsoft.EntityFrameworkCore;

namespace IceFactory.Module.ReturnRequisition
{
    public class ReturnRequisitionModule : BaseModule
    {
        public ReturnRequisitionModule(IceFactoryUnitOfWork unitOfWork) : base(unitOfWork)
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
        public IQueryable<VDropDownList> GetForDropDownList(
            Expression<Func<ReturnRequisitionModel, bool>> filter = null,
            Func<IQueryable<ReturnRequisitionModel>, IOrderedQueryable<ReturnRequisitionModel>> orderBy = null,
            string includeProperties = "")
        {
            return UnitOfWork.Context.Query<ReturnRequisitionModel>().Select(s => new VDropDownList()
            {
                Id = s.retrun_requisition_id, Code = s.customer_id.ToString(), Name = s.retrun_requisition_id.ToString()
            });
        }

        /// <summary>
        ///     GetAsync all Product
        /// </summary>
        /// <returns>IQueryable of Product</returns>
        public async Task<IQueryable<ReturnRequisitionModel>> GetAsync()
        {
            return await Task.Factory.StartNew(() =>
            {
                //var Product = UnitOfWork.ProductRepository.Get(/*p => p.Status == StatusOfProduct.Enabled*/);
                return UnitOfWork.Context.Set<ReturnRequisitionModel>();
            });
        }

        /// <summary>
        ///     GetAsync Product by id
        /// </summary>
        /// <param name="id">Id of Product</param>
        /// <returns>The Product or null value</returns>
        public async Task<ReturnRequisitionModel> FindByIdAsync(Int32 id)
        {
            return await UnitOfWork.Context.Set<ReturnRequisitionModel>().Where(p => p.retrun_requisition_id == id)
                .FirstOrDefaultAsync();
        }

        /// <summary>
        ///     Insert new Product to database
        /// </summary>
        /// <param name="blackList">The object of Product</param>
        /// <returns>The Product object</returns>
        public async Task<ReturnRequisitionDataModel> SaveReturnRequisitionData(ReturnRequisitionDataModel objData)
        {
            try
            {
                //ReturnRequisitionModel objMast = new ReturnRequisitionModel();

                //List<ProductModel> lstProRemain = new List<ProductModel>();
                //if (objData._master.description == "APR")
                //{
                //    foreach (var item in objData._lstProducts)
                //    {
                //        var objChk = UnitOfWork.Context.Set<ProductModel>().Where(w => w.product_id.Equals(item.product_id) && w.remain_amt < item.quantity).FirstOrDefault();
                //        if (objChk != null)
                //            lstProRemain.Add(objChk);
                //    }

                //    if (lstProRemain.Count > 0)
                //    {
                //        var lstMsg = lstProRemain.Select(s => string.Format("รายการสินค้า {0} ยอดคงเหลือ {1} น้อยกว่า ยอดเบิกจ่าย", s.product_name, s.remain_amt));
                //        throw new Exception(new ErrorInfo
                //        {
                //            Message = string.Join("\n", lstMsg),
                //            MessageLocal = string.Join("\n", lstMsg),
                //            Data = -1
                //        }.ConvertErrorInfoToException());
                //    }
                //}

                objData._master.ModifyDate = DateTime.Today;
                objData._master.ModifyByUserId = 1;

                if (objData._master.retrun_requisition_id <= 0)
                {
                    //objData._master.document_no = "abc";

                    objData._master.CreateDate = DateTime.Today;
                    objData._master.CreateByUserId = 1;
                    UnitOfWork.Context.Set<ReturnRequisitionModel>().Add(objData._master);
                }
                else
                {
                    UnitOfWork.Context.Set<ReturnRequisitionModel>().Update(objData._master);
                }

                int i = UnitOfWork.Context.SaveChanges();
                foreach (var item in objData._lstProducts)
                {
                    item.ModifyDate = DateTime.Today;
                    item.ModifyByUserId = 1;
                    if (item.return_product_id <= 0)
                    {
                        item.retrun_requisition_id = objData._master.retrun_requisition_id;
                        //item.document_no = objData._master.document_no;
                        item.status = "Y";
                        item.CreateDate = DateTime.Today;
                        item.CreateByUserId = 1;
                        UnitOfWork.Context.Set<ReturnRequisitionProductModel>().Add(item);
                    }
                    else
                    {
                        UnitOfWork.Context.Set<ReturnRequisitionProductModel>().Update(item);
                    }

                    UnitOfWork.Context.SaveChanges();

                    if (item.return_quantity > 0)
                    {
                        ProductStockModel objStock = new ProductStockModel();
                        objStock.CreateByUserId = 1;
                        objStock.CreateDate = DateTime.Today;
                        objStock.ModifyByUserId = item.ModifyByUserId;
                        objStock.ModifyDate = item.ModifyDate;
                        objStock.product_id = item.product_id;
                        objStock.relate_doc_id = item.return_product_id;
                        objStock.item_amt = item.return_quantity ?? 0;
                        objStock.from_action = "RTN";

                        ProductStockModule processStock = new ProductStockModule(UnitOfWork);
                        await processStock.InsertAsync(objStock);
                    }
                }

                foreach (var item in objData._lstPackages)
                {
                    //item.ModifyDate = DateTime.Today;
                    //item.ModifyByUserId = 1;
                    if (item.return_requisition_package_id <= 0)
                    {
                        item.retrun_requisition_id = objData._master.retrun_requisition_id;
                        //item.document_no = objData._master.document_no;
                        item.status = "Y";
                        //item.CreateDate = DateTime.Today;
                        //item.CreateByUserId = 1;
                        UnitOfWork.Context.Set<ReturnRequisitionPackageModel>().Add(item);
                    }
                    else
                    {
                        UnitOfWork.Context.Set<ReturnRequisitionPackageModel>().Update(item);
                    }

                    UnitOfWork.Context.SaveChanges();
                }

                foreach (var item in objData._lstItems)
                {
                    //item.ModifyDate = DateTime.Today;
                    //item.ModifyByUserId = 1;
                    if (item.return_requisition_item_id <= 0)
                    {
                        item.retrun_requisition_id = objData._master.retrun_requisition_id;
                        //item.document_no = objData._master.document_no;
                        item.status = "Y";
                        //item.CreateDate = DateTime.Today;
                        //item.CreateByUserId = 1;
                        UnitOfWork.Context.Set<ReturnRequisitionItemModel>().Add(item);
                    }
                    else
                    {
                        UnitOfWork.Context.Set<ReturnRequisitionItemModel>().Update(item);
                    }

                    UnitOfWork.Context.SaveChanges();
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
        public async Task<ReturnRequisitionDataModel> UpdateAsync(ReturnRequisitionDataModel objData)
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

        public async Task<ReturnRequisitionDataModel> getAll(filterReturnRequisition objFilter)
        {
            try
            {
                //string sql = string.Format("exec stk_trn_search {0} , '{1}' , {2} ", objFilter.retrun_requisition_id == null ? "null" : objFilter.retrun_requisition_id.ToString(), objFilter.product_name, objFilter.route_id == null ? "null" : objFilter.route_id.ToString());

                //int i = Convert.ToInt32(objFilter.retrun_requisition_id ?? 0);

                ReturnRequisitionDataModel objData = new ReturnRequisitionDataModel();
                //objData._master = UnitOfWork.Context.Set<ReturnRequisitionModel>().Where(w => w.retrun_requisition_id.Equals(i)).FirstOrDefault();
                //objData._lstProducts = UnitOfWork.Context.Set<ReturnRequisitionProductModel>().Where(w => w.id.Equals(i)).ToList();
                //objData._lstPackages = UnitOfWork.Context.Set<ReturnRequisitionPackageModel>().Where(w => w.id.Equals(i)).ToList();

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

        public async Task<ReturnRequisitionDataModel> initReturnRequisitionByRouteID(filterReturnRequisition objFilter)
        {
            try
            {
                string sql = string.Format("exec return_req_initByRoute {0} , '{1}' "
                    , objFilter.route_id == null ? "null" : objFilter.route_id.ToString()
                    , objFilter.document_date == null ? "" : string.Format("{0:yyyy-MM-dd}", objFilter.document_date)
                );

                ReturnRequisitionDataModel objData = new ReturnRequisitionDataModel();
                objData._vwMaster = UnitOfWork.Context.Query<vwReturnRequisitionModel>().FromSql(sql).FirstOrDefault();

                sql = string.Format("exec return_req_initByRoute_product {0} , '{1}' "
                    , objFilter.route_id == null ? "null" : objFilter.route_id.ToString()
                    , objFilter.document_date == null ? "" : string.Format("{0:yyyy-MM-dd}", objFilter.document_date)
                );
                objData._lstVwProducts =
                    UnitOfWork.Context.Query<vwReturnRequisitionProductModel>().FromSql(sql).ToList();

                sql = string.Format("exec return_req_initByRoute_package {0} , '{1}' "
                    , objFilter.route_id == null ? "null" : objFilter.route_id.ToString()
                    , objFilter.document_date == null ? "" : string.Format("{0:yyyy-MM-dd}", objFilter.document_date)
                );
                objData._lstVwPackages =
                    UnitOfWork.Context.Query<vwReturnRequisitionPackageModel>().FromSql(sql).ToList();


                sql = string.Format("exec return_req_prepareItemByRoute {0} , '{1}' "
                    , objFilter.route_id == null ? "null" : objFilter.route_id.ToString()
                    , objFilter.document_date == null ? "" : string.Format("{0:yyyy-MM-dd}", objFilter.document_date)
                );
                objData._lstVwPrepareItems =
                    UnitOfWork.Context.Query<ReturnRequisitionItemPrepare>().FromSql(sql).ToList();

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

        public async Task<int> executeDeteteStatus(Int32 id, Int32? iUserID)
        {
            try
            {
                using (var cmd = UnitOfWork.Context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "up_mas_product_delete";
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(new SqlParameter("@productID", SqlDbType.BigInt) {Value = id});
                    cmd.Parameters.Add(new SqlParameter("@user_id", SqlDbType.BigInt) {Value = iUserID ?? 1});


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


        public async Task<IQueryable<vwReturnRequisitionProductModel>> searchRequisitionProduct(
            filterReturnRequisition objFilter)
        {
            try
            {
                string sql = string.Format("exec req_search_product {0} , '{1}'"
                    , objFilter.retrun_requisition_id == null ? "null" : objFilter.retrun_requisition_id.ToString()
                    , objFilter.status
                );


                ReturnRequisitionDataModel objData = new ReturnRequisitionDataModel();
                //List<vwReturnRequisitionModel> dd = UnitOfWork.Context.Query<vwReturnRequisitionModel>().FromSql(sql).ToList();
                //if (dd.Count() > 0)
                //{
                return UnitOfWork.Context.Query<vwReturnRequisitionProductModel>()
                    .FromSql(sql); // UnitOfWork.Context.Query<vwReturnRequisitionModel>().FromSql(sql).FirstOrDefault();
                //objData._master = UnitOfWork.Context.Set<ReturnRequisitionModel>().Where(w => w.requisition_id.Equals(i)).FirstOrDefault();
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


        public async Task<vwReturnRequisitionModel> requisitionInitByRouteID(Int32 routeId)
        {
            try
            {
                string sql = string.Format("exec req_initByRoute {0} ", routeId);


                ReturnRequisitionDataModel objData = new ReturnRequisitionDataModel();
                return UnitOfWork.Context.Query<vwReturnRequisitionModel>().FromSql(sql).FirstOrDefault();
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