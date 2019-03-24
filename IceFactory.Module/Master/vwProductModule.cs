using IceFactory.Model.Master;
using IceFactory.Model.View;
using IceFactory.Repository.Infrastructure;
using IceFactory.Repository.UnitOfWork;
using IceFactory.Utility.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace IceFactory.Module.Master
{
    public class vwProductModule : ProductModule
    {
        public vwProductModule(IceFactoryUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        //#region " Functions for Product "

        ///// <summary>
        /////     GetAsync DropDownList
        ///// </summary>
        ///// <param name="filter"></param>
        ///// <param name="orderBy"></param>
        ///// <param name="includeProperties"></param>
        ///// <returns></returns>
        //public IQueryable<VDropDownList> GetForDropDownList(Expression<Func<ProductModel, bool>> filter = null,
        //    Func<IQueryable<ProductModel>, IOrderedQueryable<ProductModel>> orderBy = null, string includeProperties = "")
        //{
        //    return UnitOfWork.ProductRepository.Get(filter, orderBy, includeProperties).Select(p => new VDropDownList
        //    {
        //        Id = p.product_id,
        //        Name = $"{p.product_name}"
        //    });
        //}

        ///// <summary>
        /////     GetAsync all Product
        ///// </summary>
        ///// <returns>IQueryable of Product</returns>
        //public async Task<IQueryable<ProductModel>> GetAsync()
        //{
        //    return await Task.Factory.StartNew(() =>
        //    {
        //        var Product = UnitOfWork.ProductRepository.Get(/*p => p.Status == StatusOfProduct.Enabled*/);
        //        return Product;
        //    });
        //}

        ///// <summary>
        /////     GetAsync Product by id
        ///// </summary>
        ///// <param name="id">Id of Product</param>
        ///// <returns>The Product or null value</returns>
        //public async Task<ProductModel> FindByIdAsync(Int32 id)
        //{
        //    return await UnitOfWork.ProductRepository
        //        .Get(p => p.product_id == id)
        //        .FirstOrDefaultAsync();
        //}

        ///// <summary>
        /////     Insert new Product to database
        ///// </summary>
        ///// <param name="blackList">The object of Product</param>
        ///// <returns>The Product object</returns>
        //public async Task<EntityEntry<ProductModel>> InsertAsync(ProductModel Product)
        //{
        //    if (UnitOfWork.ProductRepository
        //    .Get(p => p.product_name == Product.product_name /*&& p.Status == StatusOfProduct.Enabled*/).Any())
        //        throw new Exception(new ErrorInfo
        //        {
        //            Message = $"Can not insert Product code : {Product.product_name} duplicate data",
        //            MessageLocal = $"ไม่สามารถเพิ่มข้อมูลนี้ได้ เนื่องจาก : {Product.product_name} มีในระบบแล้ว",
        //            Data = Product.product_name
        //        }.ConvertErrorInfoToException());

        //    var newProduct = await UnitOfWork.ProductRepository.InsertAsync(Product);
        //    await SaveAsync();

        //    return newProduct;

        //}

        ///// <summary>
        /////     UpdateAsync Product to database
        ///// </summary>
        ///// <param name="id">The id of Product</param>
        ///// <param name="Product">The object of Product</param>
        ///// <returns>null</returns>
        //public async Task<ProductModel> UpdateAsync(Int32 id, ProductModel Product)
        //{
        //    await UnitOfWork.ProductRepository.UpdateAsync(Product);
        //    await SaveAsync();

        //    return Product;
        //}

        ///// <summary>
        /////     UpdateAsync Product status from Enabled to Disabled
        ///// </summary>
        ///// <param name="id">Id of Product</param>
        ///// <returns>null</returns>
        ///// <exception cref="Exception">Throw exception when can not find Product by id</exception>
        //public async Task DeleteAsync(int id)
        //{
        //    var Product = await UnitOfWork.ProductRepository.GetByIdAsync(id);

        //    if (Product == null)
        //        throw new Exception(new ErrorInfo
        //        {
        //            Message = $"Can not find id of Product : {id}",
        //            MessageLocal = $"ไม่พบข้อมูล Product : {id} ในระบบ",
        //            Data = id
        //        }.ConvertErrorInfoToException());

        //    //Product.Status = StatusOfProduct.Disabled;

        //    await UnitOfWork.ProductRepository.UpdateAsync(Product);
        //    await SaveAsync();
        //}

        ///// <summary>
        /////     UpdateAsync list of Product status from Enabled to Disabled
        ///// </summary>
        ///// <param name="ids">List id of Product</param>
        ///// <returns>null</returns>
        ///// <exception cref="Exception">Throw exception when can not find any one of Product by list id of Branchs</exception>
        //public async Task DeleteAsync(IEnumerable<Int32> ids)
        //{
        //    var Products = UnitOfWork.ProductRepository.Filter(p => ids.Contains(p.product_id));

        //    if (!await Products.AnyAsync())
        //        throw new Exception(new ErrorInfo
        //        {
        //            Message = $"Can not find ids of Product : {string.Join(", ", ids)}",
        //            MessageLocal = $"ไม่พบข้อมูล Product : {string.Join(", ", ids)} ในระบบ",
        //            Data = string.Join(", ", ids)
        //        }.ConvertErrorInfoToException());

        //    foreach (var Product in Products)
        //    {
        //        //Product.Status = StatusOfProduct.Disabled;
        //        await UnitOfWork.ProductRepository.UpdateAsync(Product);
        //    }

        //    await SaveAsync();
        //}

        //#endregion

        public async Task<IQueryable<vwProductModel>> executeStore()
        {
            return await UnitOfWork.vwProductRepository.GetFromSqlAsync(
            @"select t1.*, t2.unit_name ,t3.unit_name AS secord_unit_name from product t1 inner join conf_unit  t2  on(t1.unit_id = t2.unit_id) left join conf_unit  t3  on(t1.secord_unit = t3.unit_id)");

            //var dd = new Repository.Infrastructure.IceFactoryContext();

        }

    }
}
