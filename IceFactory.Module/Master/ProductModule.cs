using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using IceFactory.Model.Master;
using IceFactory.Model.View;
using IceFactory.Repository.UnitOfWork;
using IceFactory.Utility.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace IceFactory.Module.Master
{
    public class ProductModule : BaseModule
    {
        public ProductModule(IceFactoryUnitOfWork unitOfWork) : base(unitOfWork)
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
        public IQueryable<VDropDownList> GetForDropDownList(Expression<Func<ProductModel, bool>> filter = null,
            Func<IQueryable<ProductModel>, IOrderedQueryable<ProductModel>> orderBy = null,
            string includeProperties = "")
        {
            return UnitOfWork.ProductRepository.Get(filter, orderBy, includeProperties).Select(p => new VDropDownList
            {
                Id = p.product_id,
                Name = $"{p.product_name}",
                Code = p.product_id.ToString()
            });
        }

        /// <summary>
        ///     GetAsync all Product
        /// </summary>
        /// <returns>IQueryable of Product</returns>
        public async Task<IQueryable<ProductModel>> GetAsync()
        {
            return await Task.Factory.StartNew(() =>
            {
                var Product = UnitOfWork.ProductRepository.Get( /*p => p.Status == StatusOfProduct.Enabled*/)
                    .OrderBy(o => o.seq);
                return Product;
            });
        }

        /// <summary>
        ///     GetAsync Product by id
        /// </summary>
        /// <param name="id">Id of Product</param>
        /// <returns>The Product or null value</returns>
        public async Task<ProductModel> FindByIdAsync(Int32 id)
        {
            return await UnitOfWork.ProductRepository
                .Get(p => p.product_id == id)
                .FirstOrDefaultAsync();
        }

        /// <summary>
        ///     Insert new Product to database
        /// </summary>
        /// <param name="blackList">The object of Product</param>
        /// <returns>The Product object</returns>
        public async Task<EntityEntry<ProductModel>> InsertAsync(ProductModel Product)
        {
            if (UnitOfWork.ProductRepository
                .Get(p => p.product_name == Product.product_name /*&& p.Status == StatusOfProduct.Enabled*/).Any())
                throw new Exception(new ErrorInfo
                {
                    Message = $"Can not insert Product code : {Product.product_name} duplicate data",
                    MessageLocal = $"ไม่สามารถเพิ่มข้อมูลนี้ได้ เนื่องจาก : {Product.product_name} มีในระบบแล้ว",
                    Data = Product.product_name
                }.ConvertErrorInfoToException());

            var newProduct = await UnitOfWork.ProductRepository.InsertAsync(Product);
            await SaveAsync();

            return newProduct;
        }

        /// <summary>
        ///     UpdateAsync Product to database
        /// </summary>
        /// <param name="id">The id of Product</param>
        /// <param name="Product">The object of Product</param>
        /// <returns>null</returns>
        public async Task<ProductModel> UpdateAsync(ProductModel Product)
        {
            await UnitOfWork.ProductRepository.UpdateAsync(Product);
            await SaveAsync();

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

        public async Task<IQueryable<ProductModel>> getProductByListId(string sListId)
        {
            try
            {
                string sql = string.Format("exec prd_search_byListId {0} "
                    , sListId
                );

                return UnitOfWork.Context.Query<ProductModel>().FromSql(sql).OrderBy(o => o.seq);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
            }
        }


        public async Task<IQueryable<vwProductModel>> search(filterProduct objFilter)
        {
            try
            {
                string sql = string.Format("exec mas_product_search {0} ,'{1}', '{2}'"
                    , objFilter.product_id == null ? "null" : objFilter.product_id.ToString()
                    , objFilter.product_name
                    , objFilter.status
                );


                return UnitOfWork.Context.Query<vwProductModel>().FromSql(sql);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
            }
        }

        public async Task<IQueryable<vwPriceAgencyModel>> getPriceAgency(int cus_id)
        {
            try
            {
                string sql = string.Format("exec mas_priceagencyByCusID {0} ,'Y'"
                    , cus_id
                );


                return UnitOfWork.Context.Query<vwPriceAgencyModel>().FromSql(sql);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
            }
        }

        public async Task<int> executeUpdateProduct(ProductModel objData)
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
                    cmd.CommandText = "up_mas_product";
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(new SqlParameter("@productID", SqlDbType.BigInt) {Value = objData.product_id});
                    cmd.Parameters.Add(new SqlParameter("@productName", SqlDbType.NVarChar)
                        {Value = objData.product_name});
                    cmd.Parameters.Add(new SqlParameter("@price_in", SqlDbType.BigInt) {Value = objData.price_in});
                    cmd.Parameters.Add(new SqlParameter("@price_out", SqlDbType.BigInt) {Value = objData.price_out});


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

        #endregion
    }
}