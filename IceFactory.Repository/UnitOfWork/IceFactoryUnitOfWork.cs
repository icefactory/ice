using IceFactory.Interface.Infrastructure;
using IceFactory.Repository.Infrastructure;
using IceFactory.Repository.Repository;
using IceFactory.Repository.Repository.Master;
using IceFactory.Repository.Repository.ProductStock;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace IceFactory.Repository.UnitOfWork
{
    public class IceFactoryUnitOfWork : UnitOfWork<DbContext>
    {
        /// <summary>
        ///     The service provider
        /// </summary>
        private readonly IServiceProvider _serviceProvider;

        #region " The repository "

        private UnitRepository _unitRepository;

        private ProductRepository _productRepository;

        private ProductStockRepository _productStockRepository;
        #endregion

        #region " Constructors "
        /// <inheritdoc />
        /// <summary>
        ///     Initializes a new instance of the <see cref="T:IceFactory.Repository.UnitOfWork.IceFactoryUnitOfWork" /> class.
        /// </summary>
        /// <param name="context">Context.</param>
        public IceFactoryUnitOfWork(DbContext context) : base(context)
        {
        }

        /// <inheritdoc />
        /// <summary>
        ///     Initializes a new instance of the <see cref="T:IceFactory.Repository.UnitOfWork.IceFactoryUnitOfWork" /> class.
        /// </summary>
        /// <param name="contextFactory">Context factory.</param>
        public IceFactoryUnitOfWork(IContextFactory<DbContext> contextFactory) : base(contextFactory)
        {
        }

        /// <inheritdoc />
        /// <summary>
        ///     Initializes a new instance of the <see cref="T:IceFactory.Repository.UnitOfWork.IceFactoryUnitOfWork" /> class.
        /// </summary>
        /// <param name="context">Context.</param>
        /// <param name="serviceProvider">Service Provider.</param>
        public IceFactoryUnitOfWork(DbContext context, IServiceProvider serviceProvider) : base(context)
        {
            _serviceProvider = serviceProvider;
        }

        /// <inheritdoc />
        /// <summary>
        ///     Initializes a new instance of the <see cref="T:IceFactory.Repository.UnitOfWork.IceFactoryUnitOfWork" /> class.
        /// </summary>
        /// <param name="contextFactory">Context factory.</param>
        /// <param name="serviceProvider">Service Provider.</param>
        public IceFactoryUnitOfWork(IContextFactory<DbContext> contextFactory, IServiceProvider serviceProvider) : base(
            contextFactory)
        {
            _serviceProvider = serviceProvider;
        }

        #endregion

        #region " The repository properties for module "

        public IServiceProvider ServiceProvider => _serviceProvider;

        public UnitRepository UnitRepository =>
            _unitRepository ??
            (_unitRepository = new UnitRepository((IceFactoryContext)Context));

        public ProductRepository ProductRepository =>
            _productRepository ??
            (_productRepository = new ProductRepository((IceFactoryContext)Context));

        public ProductStockRepository ProductStockRepository =>
            _productStockRepository ??
            (_productStockRepository = new ProductStockRepository((IceFactoryContext)Context));



        #endregion
    }
}
