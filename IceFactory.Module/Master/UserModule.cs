using IceFactory.Model.Master;
using IceFactory.Model.View;
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
    public class UserModule : BaseModule
    {
        public UserModule(IceFactoryUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        #region " Functions for Unit "

        /// <summary>
        ///     GetAsync DropDownList
        /// </summary>
        /// <param name="filter"></param>
        /// <param name="orderBy"></param>
        /// <param name="includeProperties"></param>
        /// <returns></returns>
        public IQueryable<VDropDownList> GetForDropDownList(Expression<Func<UserModel, bool>> filter = null,
            Func<IQueryable<UnitModel>, IOrderedQueryable<UserModel>> orderBy = null, string includeProperties = "")
        {
            return UnitOfWork.Context.Set<UserModel>().Select(p => new VDropDownList
            {
                Id = p.user_id,
                Name = $"{p.user_name}",
                Code = p.user_id.ToString()
            });
        }

        /// <summary>
        ///     GetAsync all unit
        /// </summary>
        /// <returns>IQueryable of unit</returns>
        public async Task<IQueryable<UserModel>> GetAsync()
        {
            return await Task.Factory.StartNew(() =>
            {
                var unit = UnitOfWork.Context.Set<UserModel>().Where(w => w.status == "Y");
                return unit;
            });
        }

        /// <summary>
        ///     GetAsync unit by id
        /// </summary>
        /// <param name="id">Id of unit</param>
        /// <returns>The unit or null value</returns>
        public async Task<UserModel> FindByIdAsync(int id)
        {
            return await UnitOfWork.Context.FindAsync<UserModel>()
                //.Where(w => w.User_id == id).FirstAsync()
                ;
        }

        /// <summary>
        ///     Insert new unit to database
        /// </summary>
        /// <param name="blackList">The object of unit</param>
        /// <returns>The unit object</returns>
        public async Task<EntityEntry<UserModel>> InsertAsync(UserModel objData)
        {
            if (UnitOfWork.Context.FindAsync<UserModel>().Id == objData.user_id)
                throw new Exception(new ErrorInfo
                {
                    Message = $"Can not insert unit code : {objData.user_name} duplicate data",
                    MessageLocal = $"ไม่สามารถเพิ่มข้อมูลนี้ได้ เนื่องจาก : {objData.user_name} มีในระบบแล้ว",
                    Data = objData.user_name
                }.ConvertErrorInfoToException());

            var newUnit = await UnitOfWork.Context.AddAsync(objData);
            await SaveAsync();

            return newUnit;

        }

        /// <summary>
        ///     UpdateAsync unit to database
        /// </summary>
        /// <param name="id">The id of unit</param>
        /// <param name="unit">The object of unit</param>
        /// <returns>null</returns>
        public async Task<UserModel> UpdateAsync(UserModel objData)
        {
            UnitOfWork.Context.Update(objData);
            await SaveAsync();

            return objData;
        }

        /// <summary>
        ///     UpdateAsync unit status from Enabled to Disabled
        /// </summary>
        /// <param name="id">Id of unit</param>
        /// <returns>null</returns>
        /// <exception cref="Exception">Throw exception when can not find unit by id</exception>
        public async Task DeleteAsync(Int32 id)
        {
            var unit = await UnitOfWork.UnitRepository.GetByIdAsync(id);

            if (unit == null)
                throw new Exception(new ErrorInfo
                {
                    Message = $"Can not find id of unit : {id}",
                    MessageLocal = $"ไม่พบข้อมูล unit : {id} ในระบบ",
                    Data = id
                }.ConvertErrorInfoToException());

            unit.Status = StatusOfUnit.Disabled;

            await UnitOfWork.UnitRepository.UpdateAsync(unit);
            await SaveAsync();
        }

        /// <summary>
        ///     UpdateAsync list of unit status from Enabled to Disabled
        /// </summary>
        /// <param name="ids">List id of unit</param>
        /// <returns>null</returns>
        /// <exception cref="Exception">Throw exception when can not find any one of unit by list id of Branchs</exception>
        public async Task DeleteAsync(IEnumerable<int> ids)
        {
            var units = UnitOfWork.UnitRepository.Filter(p => ids.Contains(p.unit_id));

            if (!await units.AnyAsync())
                throw new Exception(new ErrorInfo
                {
                    Message = $"Can not find ids of unit : {string.Join(", ", ids)}",
                    MessageLocal = $"ไม่พบข้อมูล unit : {string.Join(", ", ids)} ในระบบ",
                    Data = string.Join(", ", ids)
                }.ConvertErrorInfoToException());

            foreach (var unit in units)
            {
                unit.Status = StatusOfUnit.Disabled;
                await UnitOfWork.UnitRepository.UpdateAsync(unit);
            }

            await SaveAsync();
        }



        public async Task<IQueryable<vwUserModel>> search(filterUser objFilter)
        {
            try
            {

                string sql = string.Format("exec mas_User_search {0} , '{1}' , '{2}' ", objFilter.user_id == null ? "null" : objFilter.user_id.ToString(), objFilter.User_name == null ? "" : objFilter.User_name.ToString(), string.IsNullOrEmpty(objFilter.status) ? "" : objFilter.status);

                return UnitOfWork.Context.Query<vwUserModel>().FromSql(sql);

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
