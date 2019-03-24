using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace IceFactory.Interface.Repository
{
    public interface IRepository<TEntity> where TEntity : class
    {
        /// <summary>
        ///     Gets the count.
        /// </summary>
        /// <value>Total rows count.</value>
        int Count { get; }

        /// <summary>
        ///     Gets the context.
        /// </summary>
        /// <typeparam name="T">Db Model</typeparam>
        /// <returns>The context</returns>
        T GetContext<T>() where T : class;

        /// <summary>
        ///     Alls this instance.
        /// </summary>
        /// <returns>AllAsync records from model</returns>
        IQueryable<TEntity> All();

        /// <summary>
        ///     Gets objects via optional filter, sort order, and includes.
        /// </summary>
        /// <param name="filter">The filter.</param>
        /// <param name="orderBy">The order by.</param>
        /// <param name="includeProperties">The include properties</param>
        /// <returns>IQueryable for model entity</returns>
        IQueryable<TEntity> Get(Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null, string includeProperties = "");

        /// <summary>
        ///     Gets model by id.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <returns>Entity</returns>
        Task<TEntity> GetByIdAsync(object id);

        /// <summary>
        ///     Gets objects from database by filter.
        /// </summary>
        /// <param name="predicate">Specified filter</param>
        /// <returns>IQueryable for model entity</returns>
        IQueryable<TEntity> Filter(Expression<Func<TEntity, bool>> predicate);

        /// <summary>
        ///     Gets objects from database with filtering and paging.
        /// </summary>
        /// <param name="filter">Specified filter.</param>
        /// <param name="total">Returns the total records count of the filter.</param>
        /// <param name="index">Page index.</param>
        /// <param name="size">Page size.</param>
        /// <returns>IQueryable for model entity</returns>
        IQueryable<TEntity> Filter(Expression<Func<TEntity, bool>> filter, int total, int index = 0, int size = 50);

        /// <summary>
        ///     Get objects from database with raw sql syntext
        /// </summary>
        /// <param name="sql">Sql syntext.</param>
        /// <param name="parameters">Parameter.</param>
        /// <returns></returns>
        Task<IQueryable<TEntity>> GetFromSqlAsync(RawSqlString sql, params object[] parameters);

        /// <summary>
        ///     Gets the object(s) is exists in database by specified filter.
        /// </summary>
        /// <param name="predicate">Specified filter expression</param>
        /// <returns><c>true</c> if contains the specified filter; otherwise, /c>.</returns>
        Task<bool> ContainsAsync(Expression<Func<TEntity, bool>> predicate);

        /// <summary>
        ///     Find object by specified expression.
        /// </summary>
        /// <param name="predicate">Specified filter.</param>
        /// <returns>Search result</returns>
        Task<TEntity> FindAsync(Expression<Func<TEntity, bool>> predicate);

        /// <summary>
        ///     Insert a new object to database.
        /// </summary>
        /// <param name="entity">A new object to insert.</param>
        /// <returns>Insert object</returns>
        Task<EntityEntry<TEntity>> InsertAsync(TEntity entity);

        /// <summary>
        ///     Insert list of new objects to database.
        /// </summary>
        /// <param name="entities">List of new objects</param>
        /// <returns></returns>
        Task InsertRangeAsync(IEnumerable<TEntity> entities);

        /// <summary>
        ///     Deletes the object by primary key
        /// </summary>
        /// <param name="id">Object key</param>
        Task DeleteAsync(object id);

        /// <summary>
        ///     DeleteAsync the object from database.
        /// </summary>
        /// <param name="entity">Specified a existing object to delete.</param>
        Task DeleteAsync(TEntity entity);

        /// <summary>
        ///     DeleteAsync objects from database by specified filter expression.
        /// </summary>
        /// <param name="predicate">Specify filter.</param>
        Task DeleteAsync(Expression<Func<TEntity, bool>> predicate);

        /// <summary>
        ///     UpdateAsync the object to database
        /// </summary>
        /// <param name="entity">A object to update.</param>
        Task UpdateAsync(TEntity entity);

        /// <summary>
        ///     UpdateAsync the objects to database
        /// </summary>
        /// <param name="entity">A objects to update.</param>
        Task UpdateAsync(IEnumerable<TEntity> entity);

        /// <summary>
        ///     UpdateAsync objects form database by specified filter expression.
        /// </summary>
        /// <param name="predicate">Specify filter.</param>
        Task UpdateAsync(Expression<Func<TEntity, bool>> predicate);
    }
}