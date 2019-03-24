using IceFactory.Model.ProductStock;
using IceFactory.Repository.Infrastructure;
using System;
using System.Collections.Generic;
using System.Text;

namespace IceFactory.Repository.Repository.ProductStock
{
    public class ProductStockRepository : Repository<ProductStockModel>
    {
        public ProductStockRepository(IceFactoryContext context) : base(context)
        {
        }
    }
}
