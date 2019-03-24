using IceFactory.Interface.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace IceFactory.Repository.Infrastructure
{
    public class IceFactoryContextFactory : IContextFactory<DbContext>
    {
        /// <summary>
        ///     The connection string
        /// </summary>
        private readonly string _connectionString;

        /// <summary>
        ///     Database context options
        /// </summary>
        private DbContextOptions _options;

        /// <summary>
        ///     Initializes a new instance of the <see cref="IceFactoryContextFactory" /> class.
        /// </summary>
        /// <param name="connectionString">Connection string.</param>
        public IceFactoryContextFactory(string connectionString)
        {
            _connectionString = connectionString;
        }

        /// <summary>
        ///     Initializes a new instance of the
        ///     <see cref="T:IceFactory.Repository.Infrastructure.IceFactoryContextFactory" /> class.
        /// </summary>
        /// <param name="options">DbContextOptions.</param>
        public IceFactoryContextFactory(DbContextOptions options)
        {
            _options = options;
        }

        /// <summary>
        ///     Current client name that user selected.
        /// </summary>
        public string ClientName { private get; set; }

        /// <inheritdoc />
        /// <summary>
        ///     Creates new database context.
        /// </summary>
        /// <returns>DbContext: <see cref="T:IceFactory.Repository.Infrastructure.IceFactoryContext" /></returns>
        public DbContext Create()
        {
            if (string.IsNullOrEmpty(_connectionString)) return new IceFactoryContext(_options);

            var optionsBuilder = new DbContextOptionsBuilder<IceFactoryContext>();
            optionsBuilder.UseSqlServer(_connectionString);
            _options = optionsBuilder.Options;

            return new IceFactoryContext(_options);
        }
    }
}
