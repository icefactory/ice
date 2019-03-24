using IceFactory.Model.ProductStock;
using IceFactory.Model.View;
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


namespace IceFactory.Module.ProductStock
{
    public class ProductStockModule : BaseModule
    {
        public ProductStockModule(IceFactoryUnitOfWork unitOfWork) : base(unitOfWork)
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
        public IQueryable<VDropDownList> GetForDropDownList(Expression<Func<ProductStockModel, bool>> filter = null,
            Func<IQueryable<ProductStockModel>, IOrderedQueryable<ProductStockModel>> orderBy = null, string includeProperties = "")
        {
            return UnitOfWork.Context.Query<ProductStockModel>().Select(s => new VDropDownList() { Id = s.stock_trn_id, Code = s.product_id.ToString(), Name = s.product_id.ToString() });

        }

        /// <summary>
        ///     GetAsync all Product
        /// </summary>
        /// <returns>IQueryable of Product</returns>
        public async Task<IQueryable<ProductStockModel>> GetAsync()
        {
            return await Task.Factory.StartNew(() =>
            {
                //var Product = UnitOfWork.ProductRepository.Get(/*p => p.Status == StatusOfProduct.Enabled*/);
                return UnitOfWork.ProductStockRepository.Get();
            });
        }

        /// <summary>
        ///     GetAsync Product by id
        /// </summary>
        /// <param name="id">Id of Product</param>
        /// <returns>The Product or null value</returns>
        public async Task<ProductStockModel> FindByIdAsync(Int32 id)
        {

            return await UnitOfWork.ProductStockRepository.Get(p => p.product_id == id)
                .FirstOrDefaultAsync();

        }

        /// <summary>
        ///     Insert new Product to database
        /// </summary>
        /// <param name="blackList">The object of Product</param>
        /// <returns>The Product object</returns>
        public async Task<ProductStockModel> InsertAsync(ProductStockModel objData)
        {
            //if (UnitOfWork.ProductStockRepository.Get(p => p.stock_trn_id == Product.stock_trn_id /*&& p.Status == StatusOfProduct.Enabled*/).Count() > 0)
            //    throw new Exception(new ErrorInfo
            //    {
            //        Message = $"Can not insert Product code : {Product.stock_trn_id} duplicate data",
            //        MessageLocal = $"ไม่สามารถเพิ่มข้อมูลนี้ได้ เนื่องจาก : {Product.stock_trn_id} มีในระบบแล้ว",
            //        Data = Product.stock_trn_id
            //    }.ConvertErrorInfoToException());

            //return await UnitOfWork.ProductStockRepository.InsertAsync(Product);



            using (var cmd = UnitOfWork.Context.Database.GetDbConnection().CreateCommand())
            {
                cmd.CommandText = "stk_trn_insert";
                cmd.CommandType = CommandType.StoredProcedure;

                // InPut param
                cmd.Parameters.Add(new SqlParameter("@product_id", SqlDbType.BigInt) { Value = objData.product_id });
                cmd.Parameters.Add(new SqlParameter("@item_amt", SqlDbType.BigInt) { Value = objData.item_amt });
                cmd.Parameters.Add(new SqlParameter("@from_action", SqlDbType.NChar) { Value = objData.from_action });
                cmd.Parameters.Add(new SqlParameter("@UserId", SqlDbType.BigInt) { Value = objData.CreateByUserId });
                cmd.Parameters.Add(new SqlParameter("@relate_doc_id", SqlDbType.BigInt) { Value = objData.relate_doc_id });
                // OutPut return
                cmd.Parameters.Add(new SqlParameter("@retrunID", SqlDbType.BigInt) { Direction = ParameterDirection.Output });
                cmd.Parameters.Add(new SqlParameter("@returnRemainAmt", SqlDbType.BigInt) { Direction = ParameterDirection.Output });



                //cmd.Parameters.Add(new SqlParameter("@id", SqlDbType.BigInt) { Direction = ParameterDirection.Output });

                if (UnitOfWork.Context.Database.GetDbConnection().State == ConnectionState.Closed)
                {
                    UnitOfWork.Context.Database.OpenConnection();
                }

                if (cmd.ExecuteNonQuery() == 0)
                    throw new Exception(new ErrorInfo
                    {
                        Message = $"Can not insert Product code : {objData.product_id} duplicate data",
                        MessageLocal = $"ไม่สามารถเพิ่มข้อมูลนี้ได้ เนื่องจาก : {objData.product_id} มีในระบบแล้ว",
                        Data = objData.product_id
                    }.ConvertErrorInfoToException());

                //return await Task.Factory.StartNew(() =>
                //{
                objData.stock_trn_id = Convert.ToInt32(cmd.Parameters["@retrunID"].Value.ToString()); ;
                objData.remain_amt = Convert.ToInt32(cmd.Parameters["@returnRemainAmt"].Value.ToString());
                int i = Convert.ToInt32(objData.remain_amt);
                return objData;
                //});
            }

        }

        /// <summary>
        ///     UpdateAsync Product to database
        /// </summary>
        /// <param name="id">The id of Product</param>
        /// <param name="Product">The object of Product</param>
        /// <returns>null</returns>
        public async Task<ProductStockModel> UpdateAsync(ProductStockModel Product)
        {
            var ent = UnitOfWork.Context.Entry<ProductStockModel>(Product);
            ent.State = EntityState.Modified;
            int re = await UnitOfWork.Context.SaveChangesAsync();

            //await UnitOfWork.ProductRepository.UpdateAsync(Product);
            //await SaveAsync();

            return Product;
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
        public async Task<IQueryable<vwProductStockModel>> executGetStockTrans(filterStock objFilter)
        {
            try
            {

                string sql = string.Format("exec stk_trn_search {0} , '{1}' , {2} , {3}"
                    , objFilter.product_id == null ? "null" : objFilter.product_id.ToString()
                    , objFilter.product_name
                    , objFilter.stock_trn_id == null ? "null" : objFilter.stock_trn_id.ToString()
                    , objFilter.trans_date == null ? "null" : string.Format("'{0:yyyy-MM-dd}'", objFilter.trans_date)
                    );

                return UnitOfWork.Context.Query<vwProductStockModel>().FromSql(sql);

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
                //var Products = UnitOfWork.ProductRepository.Filter(p => ids.Contains(p.product_id));

                //if (!await Products.AnyAsync())
                //    throw new Exception(new ErrorInfo
                //    {
                //        Message = $"Can not find ids of Product : {string.Join(", ", ids)}",
                //        MessageLocal = $"ไม่พบข้อมูล Product : {string.Join(", ", ids)} ในระบบ",
                //        Data = string.Join(", ", ids)
                //    }.ConvertErrorInfoToException());

                //foreach (var Product in Products)
                //{
                //    //Product.Status = StatusOfProduct.Disabled;
                //    await UnitOfWork.ProductRepository.UpdateAsync(Product);
                //}

                //await SaveAsync();


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
