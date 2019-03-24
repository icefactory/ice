using IceFactory.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace IceFactory.Repository.Infrastructure
{
    public class IceFactoryContext : DbContext
    {

        #region " Constructors "

        /// <inheritdoc />
        /// <summary>
        ///     Initializes a new instance of the <see cref="T:IceFactory.Repository.Infrastructure.IceFactoryContext" /> class.
        /// </summary>
        /// <param name="options">Options.</param>
        public IceFactoryContext(DbContextOptions options) : base(options)
        {
        }

        #endregion

        #region " Properties, Indexers "

        // Add a DbSet for each entity type that you want to include in your model. For more information 
        // on configuring and using a Code First model, see http://go.microsoft.com/fwlink/?LinkId=390109.


        //public DbQuery<Model.ProductStock.vwProductStockModel> stk_trn_search { get; set; }

        // public virtual DbSet<MyEntity> MyEntities { get; set; }
        public DbSet<Model.Master.UnitModel> conf_unit { get; set; }

        // public virtual DbSet<MyEntity> MyEntities { get; set; }
        public DbSet<Model.Master.ProductModel> product { get; set; }
        public DbSet<Model.Master.RouteModel> Route { get; set; }
        public DbSet<Model.Master.CustomerModel> customer { get; set; }
        public DbSet<Model.IceBucket.IceBucketModel> ice_bucket { get; set; }
        public DbSet<Model.Master.UserModel> users { get; set; }


        public DbSet<Model.Requisition.RequisitionModel> Requisition { get; set; }
        public DbSet<Model.Requisition.RequisitionProductModel> requisition_product { get; set; }
        public DbSet<Model.Requisition.RequisitionPackageModel> requisition_package { get; set; }

        // View
        public DbQuery<Model.Master.vwProductModel> vwproduct { get; set; }
        public DbQuery<Model.Master.vwRouteModel> vwRoutes { get; set; }
        public DbQuery<Model.Master.vwCustomerModel> vwCustomer { get; set; }
        public DbQuery<Model.IceBucket.vwIceBucketModel> vwIceBucket { get; set; }
        public DbQuery<Model.Master.vwUserModel> vwUsers { get; set; }

        public DbSet<Model.ProductStock.ProductStockModel> product_stock_transaction { get; set; }

        public DbQuery<Model.ProductStock.vwProductStockModel> vwProductStocks { get; set; }
        public DbQuery<Model.Requisition.vwRequisitionModel> vwRequisition { get; set; }
        public DbQuery<Model.Requisition.vwRequisitionProductModel> vwRequisition_product { get; set; }
        public DbQuery<Model.Requisition.vwRequisitionPackageModel> vwRequisition_package { get; set; }


        #endregion

    }
}
