using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace IceFactory.Model.ReturnRequisition
{
    public class ReturnRequisitionDataModel
    {
        public ReturnRequisitionModel _master { get; set; }
        public vwReturnRequisitionModel _vwMaster { get; set; }
        public List<ReturnRequisitionProductModel> _lstProducts { get; set; }
        public List<ReturnRequisitionItemModel> _lstItems { get; set; }
        public List<ReturnRequisitionPackageModel> _lstPackages { get; set; }


        public List<vwReturnRequisitionProductModel> _lstVwProducts { get; set; }
        public List<vwReturnRequisitionItemModel> _lstVwItems { get; set; }
        public List<vwReturnRequisitionPackageModel> _lstVwPackages { get; set; }

        public List<ReturnRequisitionItemPrepare> _lstVwPrepareItems { get; set; }

        //public List<vwReturnRequisitionProductModel> _lstVWProducts { get; set; }
        //public List<vwReturnRequisitionProductModel> _lstVWPackages { get; set; }
    }

    public class ReturnRequisitionProp : BaseEntity
    {
        public string return_document_no { get; set; }
        public DateTime? return_document_date { get; set; }
        public int? sum_quantity { get; set; }
        public int? price_net { get; set; }
        public int? arears_price { get; set; }
        public int? customer_arrears_price { get; set; }
        public int? customer_flag { get; set; }
        public int? customer_id { get; set; }
        public int? pay_amt { get; set; }
        public int? ice_melt { get; set; }
        public DateTime? payment_date { get; set; }
        public int? sell_type { get; set; }
        public string description { get; set; }
        public int? route_id { get; set; }
        public int? transporter1_id { get; set; }
        public int? transporter2_id { get; set; }
        public int? round { get; set; }
        public int? user_id { get; set; }
        public string ref_requisition_id { get; set; }
        public int? is_active { get; set; }
        public string status { get; set; }
    }

    public class ReturnRequisitionModel : ReturnRequisitionProp
    {
        [Key] public Int32 retrun_requisition_id { get; set; }
    }

    public class vwReturnRequisitionModel : ReturnRequisitionProp
    {
        public Int32 retrun_requisition_id { get; set; }

        public string transporter1_name { get; set; }
        public string transporter2_name { get; set; }
        public string route_name { get; set; }
        public string customer_name { get; set; }
        public string create_user_name { get; set; }
        public string modify_user_name { get; set; }
    }

    public class ReturnRequisitionProductProp : BaseEntity
    {
        public string return_document_no { get; set; }
        public int product_id { get; set; }
        public int? quantity { get; set; }
        public int? return_quantity { get; set; }
        public int? ice_melt { get; set; }
        public int? product_ref { get; set; }
        public string status { get; set; }
        public int retrun_requisition_id { get; set; }
    }

    public class ReturnRequisitionProductModel : ReturnRequisitionProductProp
    {
        [Key] public int return_product_id { get; set; }
    }

    public class vwReturnRequisitionProductModel : ReturnRequisitionProductProp
    {
        public int return_product_id { get; set; }
        public string product_name { get; set; }
        public int? total_amt { get; set; }
    }

    public class ReturnRequisitionPackageProp
    {
        public string return_document_no { get; set; }
        public int product_id { get; set; }
        public int? quantity { get; set; }
        public int? return_quantity { get; set; }
        public int? damage { get; set; }
        public int? return_package_status { get; set; }
        public string status { get; set; }
        public int retrun_requisition_id { get; set; }
    }

    public class ReturnRequisitionPackageModel : ReturnRequisitionPackageProp
    {
        [Key] public int return_requisition_package_id { get; set; }
    }

    public class vwReturnRequisitionPackageModel : ReturnRequisitionPackageProp
    {
        public int return_requisition_package_id { get; set; }
        public string package_name { get; set; }
        public int? total_amt { get; set; }
    }


    public class ReturnRequisitionItemProp
    {
        public string return_document_no { get; set; }
        public int order_no { get; set; }
        public int? product_id { get; set; }
        public int? customer_id { get; set; }
        public int? quantity { get; set; }
        public int? price { get; set; }
        public int? sum_price { get; set; }
        public int? arrears_price { get; set; }
        public int? return_requisition_status { get; set; }
        public string product_ref { get; set; }
        public string status { get; set; }

        public int retrun_requisition_id { get; set; }
    }

    public class ReturnRequisitionItemModel : ReturnRequisitionItemProp
    {
        [Key] public int return_requisition_item_id { get; set; }
    }

    public class vwReturnRequisitionItemModel : ReturnRequisitionItemProp
    {
        public int return_requisition_item_id { get; set; }
        public string product_name { get; set; }
    }

    public class ReturnRequisitionItemPrepare
    {
        public int? product_id { get; set; }
        public string product_name { get; set; }

        [DefaultValue(0)] public int? price { get; set; }

        public int? total_amt { get; set; }
        public int? balance_amt { get; set; }
        public int? sumsell_amt { get; set; }
        public string product_ref { get; set; }
    }

    public class filterReturnRequisition
    {
        public int? retrun_requisition_id { get; set; }
        public int? route_id { get; set; }
        public string document_date { get; set; }
        public string status { get; set; }
    }
}