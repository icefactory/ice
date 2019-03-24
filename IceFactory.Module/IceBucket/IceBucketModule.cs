using IceFactory.Model.Master;
using IceFactory.Model.ProductStock;
using IceFactory.Model.IceBucket;
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


namespace IceFactory.Module.IceBucket
{
    public class IceBucketModule : BaseModule
    {
        public IceBucketModule(IceFactoryUnitOfWork unitOfWork) : base(unitOfWork)
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
        public IQueryable<VDropDownList> GetForDropDownList(Expression<Func<IceBucketModel, bool>> filter = null,
            Func<IQueryable<IceBucketModel>, IOrderedQueryable<IceBucketModel>> orderBy = null, string includeProperties = "")
        {
            return UnitOfWork.Context.Query<IceBucketModel>().Select(s => new VDropDownList() { Id = s.bucketID, Code = s.customer_id.ToString(), Name = s.bucketID.ToString() });

        }

        /// <summary>
        ///     GetAsync all Product
        /// </summary>
        /// <returns>IQueryable of Product</returns>
        public async Task<IQueryable<IceBucketModel>> GetAsync()
        {
            return await Task.Factory.StartNew(() =>
            {
                //var Product = UnitOfWork.ProductRepository.Get(/*p => p.Status == StatusOfProduct.Enabled*/);
                return UnitOfWork.Context.Set<IceBucketModel>();
            });
        }

        /// <summary>
        ///     GetAsync Product by id
        /// </summary>
        /// <param name="id">Id of Product</param>
        /// <returns>The Product or null value</returns>
        public async Task<IceBucketModel> FindByIdAsync(Int32 id)
        {

            return await UnitOfWork.Context.Set<IceBucketModel>().Where(p => p.bucketID == id)
                .FirstOrDefaultAsync();

        }

        /// <summary>
        ///     Insert new Product to database
        /// </summary>
        /// <param name="blackList">The object of Product</param>
        /// <returns>The Product object</returns>
        public async Task<IceBucketModel> SaveData(IceBucketModel objData)
        {
            try
            {
                ////IceBucketModel objMast = new IceBucketModel();

                //List<IceBucketModel> lstProRemain = new List<IceBucketModel>();
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

                //objData._master.ModifyDate = DateTime.Today;
                //objData._master.ModifyByUserId = 1;

                //if (objData._master.retrun_bucketID <= 0)
                //{
                //    //objData._master.document_no = "abc";

                //    objData._master.CreateDate = DateTime.Today;
                //    objData._master.CreateByUserId = 1;
                //    UnitOfWork.Context.Set<IceBucketModel>().Add(objData._master);
                //}
                //else
                //{
                //    UnitOfWork.Context.Set<IceBucketModel>().Update(objData._master);
                //}
                //int i = UnitOfWork.Context.SaveChanges();
                //foreach (var item in objData._lstProducts)
                //{
                //    item.ModifyDate = DateTime.Today;
                //    item.ModifyByUserId = 1;
                //    if (item.id <= 0)
                //    {
                //        item.bucketID = objData._master.retrun_bucketID;
                //        //item.document_no = objData._master.document_no;
                //        item.status = "Y";
                //        item.CreateDate = DateTime.Today;
                //        item.CreateByUserId = 1;
                //        UnitOfWork.Context.Set<IceBucketModel>().Add(item);
                //    }
                //    else
                //    {
                //        UnitOfWork.Context.Set<IceBucketModel>().Update(item);
                //    }

                //    UnitOfWork.Context.SaveChanges();

                //    ProductStockModel objStock = new ProductStockModel();
                //    objStock.CreateByUserId = 1;
                //    objStock.CreateDate = DateTime.Today;
                //    objStock.ModifyByUserId = item.ModifyByUserId;
                //    objStock.ModifyDate = item.ModifyDate;
                //    objStock.product_id = item.product_id;
                //    objStock.relate_doc_id = item.bucketID;
                //    objStock.item_amt = item.quantity;
                //    //objStock.from_action = objData._master./*requisition_type*/;

                //    ProductStockModule processStock = new ProductStockModule(UnitOfWork);
                //    await processStock.InsertAsync(objStock);

                //}


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
        public async Task<IceBucketModel> UpdateAsync(IceBucketModel objData)
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
        public async Task<IQueryable<IceBucketModel>> getAll(filterIceBucket objFilter)
        {
            try
            {

                string sql = string.Format("exec stk_trn_search {0} , '{1}' , {2} ", objFilter.bucketID == null ? "null" : objFilter.bucketID.ToString(), objFilter.route_name, objFilter.route_id == null ? "null" : objFilter.route_id.ToString());

                int i = Convert.ToInt32(objFilter.bucketID ?? 0);

                //IceBucketModel objData = new IceBucketModel();
                var objData = UnitOfWork.Context.Set<IceBucketModel>().Where(w => w.bucketID.Equals(i));
                //objData._lstProducts = UnitOfWork.Context.Set<IceBucketModel>().Where(w => w.id.Equals(i)).ToList();
                //objData._lstPackages = UnitOfWork.Context.Set<IceBucketModel>().Where(w => w.id.Equals(i)).ToList();

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

        public async Task<IQueryable<vwIceBucketModel>> search(filterIceBucket objFilter)
        {
            try
            {

                string sql = string.Format("exec icebucket_search {0} , N'{1}' , {2} ,{3}, '{4}'  "
                    , objFilter.bucketID == null ? "null" : objFilter.bucketID.ToString()
                    , objFilter.bucket_no
                    , objFilter.route_id == null ? "null" : objFilter.route_id.ToString()
                    , objFilter.customer_id == null ? "null" : objFilter.customer_id.ToString()
                    , objFilter.status
                    );

                return UnitOfWork.Context.Query<vwIceBucketModel>().FromSql(sql);


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



        #endregion
    }
}
