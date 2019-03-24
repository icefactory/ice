using System;
using System.Security.Claims;
using IceFactory.Repository.UnitOfWork;
using Microsoft.AspNetCore.Mvc;

namespace IceFactory.Api.Controllers
{
    public class BaseController : Controller
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="BaseController" /> class.
        /// </summary>
        /// <param name="unitOfWork">The unit of work.</param>
        public BaseController(IceFactoryUnitOfWork unitOfWork)
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

        protected int TransectionByUserId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

        protected static DateTime TransectionTime => DateTime.Now;
    }
}