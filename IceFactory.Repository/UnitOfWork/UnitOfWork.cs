using Microsoft.EntityFrameworkCore;
using IceFactory.Interface.Infrastructure;
using IceFactory.Interface.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace IceFactory.Repository.UnitOfWork
{
    public class UnitOfWork<TContext> : IUnitOfWork where TContext : DbContext
    {
        /// <summary>
        ///     The context factory.
        /// </summary>
        private readonly IContextFactory<TContext> _contextFactory;

        /// <inheritdoc />
        /// <summary>
        ///     Initializes a new instance of the <see cref="T:IceFactory.Repository.UnitOfWOrk.UnitOfWork`1" /> class.
        /// </summary>
        /// <param name="contextFactory">The db context factory.</param>
        protected UnitOfWork(IContextFactory<TContext> contextFactory) : this(contextFactory.Create())
        {
            _contextFactory = contextFactory;
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="T:IceFactory.Repository.UnitOfWOrk.UnitOfWork`1" /> class.
        /// </summary>
        /// <param name="context">Context.</param>
        protected UnitOfWork(TContext context)
        {
            Context = context;
        }

        /// <summary>
        ///     The context.
        /// </summary>
        /// <value>The context.</value>
        public TContext Context { get; private set; }

        /// <inheritdoc />
        /// <summary>
        ///     Regenerates the context.
        /// </summary>
        public async Task RegenerateContextAsync()
        {
            if (Context != null) await SaveAsync();

            Context = _contextFactory.Create();
        }

        /// <inheritdoc />
        /// <summary>
        ///     Save context change.
        /// </summary>
        /// <returns>The save.</returns>
        public async Task SaveAsync()
        {
            await Context.SaveChangesAsync();
        }

    }
}
