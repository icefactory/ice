using IceFactory.Model.Master;
using IceFactory.Repository.Infrastructure;
using System;
using System.Collections.Generic;
using System.Text;

namespace IceFactory.Repository.Repository.Master
{
    public class UnitRepository : Repository<UnitModel>
    {
        public UnitRepository(IceFactoryContext context) : base(context)
        {
        }
    }
}
