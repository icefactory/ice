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
    public class UnitModule : BaseModule
    {
        public UnitModule(IceFactoryUnitOfWork unitOfWork) : base(unitOfWork)
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
        public IQueryable<VDropDownList> GetForDropDownList(Expression<Func<UnitModel, bool>> filter = null,
            Func<IQueryable<UnitModel>, IOrderedQueryable<UnitModel>> orderBy = null, string includeProperties = "")
        {
            return UnitOfWork.UnitRepository.Get(filter, orderBy, includeProperties).Select(p => new VDropDownList
            {
                Id = p.unit_id,
                Name = $"{p.unit_Name}",
                Code = p.unit_id.ToString()
            });
        }

        /// <summary>
        ///     GetAsync all unit
        /// </summary>
        /// <returns>IQueryable of unit</returns>
        public async Task<IQueryable<UnitModel>> GetAsync()
        {
            return await Task.Factory.StartNew(() =>
            {
                var unit = UnitOfWork.UnitRepository.Get(p => p.Status == StatusOfUnit.Enabled);
                return unit;
            });
        }

        /// <summary>
        ///     GetAsync unit by id
        /// </summary>
        /// <param name="id">Id of unit</param>
        /// <returns>The unit or null value</returns>
        public async Task<UnitModel> FindByIdAsync(int id)
        {
            return await UnitOfWork.UnitRepository
                .Get(p => p.unit_id == id)
                .FirstOrDefaultAsync();
        }

        /// <summary>
        ///     Insert new unit to database
        /// </summary>
        /// <param name="blackList">The object of unit</param>
        /// <returns>The unit object</returns>
        public async Task<EntityEntry<UnitModel>> InsertAsync(UnitModel unit)
        {
            if (UnitOfWork.UnitRepository
            .Get(p => p.unit_Name == unit.unit_Name && p.Status == StatusOfUnit.Enabled).Any())
                throw new Exception(new ErrorInfo
                {
                    Message = $"Can not insert unit code : {unit.unit_Name} duplicate data",
                    MessageLocal = $"ไม่สามารถเพิ่มข้อมูลนี้ได้ เนื่องจาก : {unit.unit_Name} มีในระบบแล้ว",
                    Data = unit.unit_Name
                }.ConvertErrorInfoToException());

            var newUnit = await UnitOfWork.UnitRepository.InsertAsync(unit);
            await SaveAsync();

            return newUnit;

        }

        /// <summary>
        ///     UpdateAsync unit to database
        /// </summary>
        /// <param name="id">The id of unit</param>
        /// <param name="unit">The object of unit</param>
        /// <returns>null</returns>
        public async Task<UnitModel> UpdateAsync(UnitModel unit)
        {
            await UnitOfWork.UnitRepository.UpdateAsync(unit);
            await SaveAsync();

            return unit;
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

        #endregion

    }
}
