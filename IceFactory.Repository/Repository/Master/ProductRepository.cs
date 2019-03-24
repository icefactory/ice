using IceFactory.Model.Master;
using IceFactory.Repository.Infrastructure;
using System;
using System.Collections.Generic;
using System.Text;

namespace IceFactory.Repository.Repository.Master
{
    public class ProductRepository : Repository<ProductModel>
    {
        public ProductRepository(IceFactoryContext context) : base(context)
        {
        }
    }
}
