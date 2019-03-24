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
    public class RouteModule : BaseModule
    {
        public RouteModule(IceFactoryUnitOfWork unitOfWork) : base(unitOfWork)
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
        public IQueryable<VDropDownList> GetForDropDownList(Expression<Func<RouteModel, bool>> filter = null,
            Func<IQueryable<UnitModel>, IOrderedQueryable<RouteModel>> orderBy = null, string includeProperties = "")
        {
            return UnitOfWork.Context.Set<RouteModel>().Select(p => new VDropDownList
            {
                Id = p.route_id,
                Name = $"{p.route_name}",
                Code = p.route_id.ToString()
            });
        }

        /// <summary>
        ///     GetAsync all unit
        /// </summary>
        /// <returns>IQueryable of unit</returns>
        public async Task<IQueryable<RouteModel>> GetAsync()
        {
            return await Task.Factory.StartNew(() =>
            {
                var unit = UnitOfWork.Context.Set<RouteModel>().Where(w => w.Status == "Y");
                return unit;
            });
        }

        /// <summary>
        ///     GetAsync unit by id
        /// </summary>
        /// <param name="id">Id of unit</param>
        /// <returns>The unit or null value</returns>
        public async Task<RouteModel> FindByIdAsync(int id)
        {
            return await UnitOfWork.Context.FindAsync<RouteModel>()
                //.Where(w => w.route_id == id).FirstAsync()
                ;
        }

        /// <summary>
        ///     Insert new unit to database
        /// </summary>
        /// <param name="blackList">The object of unit</param>
        /// <returns>The unit object</returns>
        public async Task<EntityEntry<RouteModel>> InsertAsync(RouteModel objData)
        {
            if (UnitOfWork.Context.FindAsync<RouteModel>().Id == objData.route_id)
                throw new Exception(new ErrorInfo
                {
                    Message = $"Can not insert unit code : {objData.route_name} duplicate data",
                    MessageLocal = $"ไม่สามารถเพิ่มข้อมูลนี้ได้ เนื่องจาก : {objData.route_name} มีในระบบแล้ว",
                    Data = objData.route_name
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
        public async Task<RouteModel> UpdateAsync(RouteModel objData)
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



        public async Task<IQueryable<vwRouteModel>> search(filterRoute objFilter)
        {
            try
            {

                string sql = string.Format("exec mas_route_search {0} , '{1}' , '{2}' ", objFilter.route_id == null ? "null" : objFilter.route_id.ToString(), objFilter.route_name == null ? "" : objFilter.route_name.ToString(), string.IsNullOrEmpty(objFilter.Status) ? "" : objFilter.Status);

                return UnitOfWork.Context.Query<vwRouteModel>().FromSql(sql);

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
