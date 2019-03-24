using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IceFactory.Repository.Infrastructure
{
    public static class IceFactoryInitializer
    {
        public static async System.Threading.Tasks.Task InitializeAsync(IceFactoryContext context)
        {
            await context.Database.EnsureCreatedAsync();
        }
      
    }
}