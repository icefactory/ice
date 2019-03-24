using IceFactory.Repository.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace IceFactory.Module
{
    public class BaseModule
    {
        // <summary>
        ///     Initializes a new instance of the <see cref="BaseModule" /> class.
        /// </summary>
        /// <param name="unitOfWork">The unit of work.</param>
        protected BaseModule(IceFactoryUnitOfWork unitOfWork)
        {
            UnitOfWork = unitOfWork;
        }

        /// <summary>
        ///     Gets my project unit of work.
        /// </summary>
        /// <value>
        ///     My project unit of work.
        /// </value>
        protected IceFactoryUnitOfWork UnitOfWork { get; }

        /// <summary>
        ///     Save all data change to database
        /// </summary>
        /// <returns></returns>
        protected async Task SaveAsync()
        {
            await UnitOfWork.SaveAsync();
        }
    }
}
