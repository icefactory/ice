using IceFactory.Model.Master;
using IceFactory.Repository.Infrastructure;
using System;
using System.Collections.Generic;
using System.Text;

namespace IceFactory.Repository.Repository.Master
{
    public class vwProductRepository : Repository<vwProductModel>
    {
        public vwProductRepository(IceFactoryContext context) : base(context)
        {
        }
    }
}
