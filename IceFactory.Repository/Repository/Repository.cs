using IceFactory.Interface.Repository;
using IceFactory.Repository.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace IceFactory.Repository.Repository
{
    public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
    {
        /// <summary>
        ///     The db set.
        /// </summary>
        private readonly DbSet<TEntity> _dbSet;

        /// <summary>
        ///     The context.
        /// </summary>
        protected readonly IceFactoryContext Context;

        /// <summary>
        ///     Initializes a new instance of the <see cref="T:IceFactory.Repository.GenericRepository`1" /> class.
        /// </summary>
        /// <param name="context">Context.</param>
        protected Repository(IceFactoryContext context)
        {
            Context = context;
            _dbSet = context.Set<TEntity>();
        }

        /// <inheritdoc />
        /// <summary>
        ///     Gets the context.
        /// </summary>
        /// <typeparam name="T">Db Model</typeparam>
        /// <returns>The context</returns>
        public T GetContext<T>() where T : class
        {
            return (T)Convert.ChangeType(Context, Type.GetTypeCode(typeof(T)));
        }

        /// <inheritdoc />
        /// <summary>
        ///     Gets the count.
        /// </summary>
        /// <value>Total rows count.</value>
        public virtual int Count => Context.Set<TEntity>().Count();

        /// <inheritdoc />
        /// <summary>
        ///     Alls this instance.
        /// </summary>
        /// <returns>All Async records from model</returns>
        public virtual IQueryable<TEntity> All()
        {
            return _dbSet;
        }

        /// <inheritdoc />
        /// <summary>
        ///     Gets objects via optional filter, sort order, and includes.
        /// </summary>
        /// <param name="filter">The filter.</param>
        /// <param name="orderBy">The order by.</param>
        /// <param name="includeProperties">The include properties</param>
        /// <returns>IQueryable for model entity</returns>
        public virtual IQueryable<TEntity> Get(Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null, string includeProperties = "")
        {

            IQueryable<TEntity> query = _dbSet;

            if (filter != null) query = query.Where(filter);

            query = includeProperties.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                .Aggregate(query, (current, includeProperty) => current.Include(includeProperty));

            return orderBy != null ? orderBy(query) : query;
        }

        /// <inheritdoc />
        /// <summary>
        ///     Gets model by id.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <returns>DB Model</returns>
        public virtual async Task<TEntity> GetByIdAsync(object id)
        {
            return await _dbSet.FindAsync(id);
        }

        /// <inheritdoc />
        /// <summary>
        ///     Gets objects from database by filter.
        /// </summary>
        /// <param name="predicate">Specified filter</param>
        /// <returns>IQueryable for model entity</returns>
        public virtual IQueryable<TEntity> Filter(Expression<Func<TEntity, bool>> predicate)
        {
            return _dbSet.Where(predicate).AsQueryable();
        }

        /// <inheritdoc />
        /// <summary>
        ///     Gets objects from database with filtering and paging.
        /// </summary>
        /// <param name="filter">Specified filter.</param>
        /// <param name="total">Returns the total records count of the filter.</param>
        /// <param name="index">Page index.</param>
        /// <param name="size">Page size.</param>
        /// <returns>IQueryable for model entity</returns>
        public virtual IQueryable<TEntity> Filter(Expression<Func<TEntity, bool>> filter, int total, int index = 0,
            int size = 50)
        {
            var skipCount = index * size;
            var resetSet = filter != null ? _dbSet.Where(filter).AsQueryable() : _dbSet.AsQueryable();

            resetSet = skipCount == 0 ? resetSet.Take(size) : resetSet.Skip(skipCount).Take(size);

            return resetSet.AsQueryable();
        }

        /// <inheritdoc />
        /// <summary>
        ///     Get objects from database with raw sql syntext
        /// </summary>
        /// <param name="sql">Sql syntext.</param>
        /// <param name="parameters">Parameter.</param>
        /// <returns></returns>
        public virtual async Task<IQueryable<TEntity>> GetFromSqlAsync(RawSqlString sql, params object[] parameters)
        {
            return await Task.Factory.StartNew(() => _dbSet.FromSql(sql, parameters));
        }

        /// <inheritdoc />
        /// <summary>
        ///     Gets the object(s) is exists in database by specified filter.
        /// </summary>
        /// <param name="predicate">Specified filter expression</param>
        /// <returns><c>true</c> if contains the specified filter; otherwise, /c&gt;.</returns>
        public async Task<bool> ContainsAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await _dbSet.AnyAsync(predicate);
        }

        /// <inheritdoc />
        /// <summary>
        ///     Find object by specified expression.
        /// </summary>
        /// <param name="predicate">Specified filter.</param>
        /// <returns>Search result</returns>
        public virtual async Task<TEntity> FindAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await _dbSet.FirstOrDefaultAsync(predicate);
        }

        /// <inheritdoc />
        /// <summary>
        ///     Insert a new object to database.
        /// </summary>
        /// <param name="entity">A new object to insert.</param>
        /// <returns>Insert object</returns>
        public virtual async Task<EntityEntry<TEntity>> InsertAsync(TEntity entity)
        {
            return await _dbSet.AddAsync(entity);
        }

        /// <inheritdoc />
        /// <summary>
        ///     Insert list of new objects to database.
        /// </summary>
        /// <param name="entities">List of new objects to insert.</param>
        /// <returns></returns>
        public virtual async Task InsertRangeAsync(IEnumerable<TEntity> entities)
        {
            await _dbSet.AddRangeAsync(entities);
        }

        /// <inheritdoc />
        /// <summary>
        ///     Deletes the object by primary key
        /// </summary>
        /// <param name="id">Object key</param>
        public virtual async Task DeleteAsync(object id)
        {
            var entityToDelete = await _dbSet.FindAsync(id);
            await DeleteAsync(entityToDelete);
        }

        /// <inheritdoc />
        /// <summary>
        ///     DeleteAsync the object from database.
        /// </summary>
        /// <param name="entity">Specified a existing object to delete.</param>
        public virtual async Task DeleteAsync(TEntity entity)
        {
            await Task.Factory.StartNew(() =>
            {
                //            DbSet.Attach(entity);
                //            Context.Entry(entity).State = EntityState.Modified;

                if (Context.Entry(entity).State == EntityState.Detached) _dbSet.Attach(entity);

                _dbSet.Remove(entity);
            });
        }

        /// <inheritdoc />
        /// <summary>
        ///     DeleteAsync objects from database by specified filter expression.
        /// </summary>
        /// <param name="predicate">Specify filter.</param>
        public virtual async Task DeleteAsync(Expression<Func<TEntity, bool>> predicate)
        {
            var entities = Filter(predicate);

            foreach (var entity in entities) await DeleteAsync(entity);
        }

        /// <inheritdoc />
        /// <summary>
        ///     UpdateAsync the object to database
        /// </summary>
        /// <param name="entity">A object to update.</param>
        public virtual async Task UpdateAsync(TEntity entity)
        {
            await Task.Factory.StartNew(() =>
            {
                _dbSet.Attach(entity);
                Context.Entry(entity).State = EntityState.Modified;
            });
        }

        /// <inheritdoc />
        /// <summary>
        ///     UpdateAsync the objects to database
        /// </summary>
        /// <param name="entities">Enumerable of object</param>
        public virtual async Task UpdateAsync(IEnumerable<TEntity> entities)
        {
            foreach (var entity in entities) await UpdateAsync(entity);
        }

        /// <inheritdoc />
        /// <summary>
        ///     UpdateAsync objects form database by specified filter expression.
        /// </summary>
        /// <param name="predicate">Specify filter.</param>
        public virtual async Task UpdateAsync(Expression<Func<TEntity, bool>> predicate)
        {
            var entities = Filter(predicate);

            foreach (var entity in entities) await UpdateAsync(entity);
        }
    }
}
