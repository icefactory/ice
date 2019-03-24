using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace IceFactory.Model.ReturnRequisition
{
    public class ReturnRequisitionDataModel
    {

        public ReturnRequisitionModel _master { get; set; }
        public vwReturnRequisitionModel _vwMaster { get; set; }
        public List<ReturnRequisitionProductModel> _lstProducts { get; set; }
        public List<ReturnRequisitionPackageModel> _lstPackages { get; set; }
        //public List<vwReturnRequisitionProductModel> _lstVWProducts { get; set; }
        //public List<vwReturnRequisitionProductModel> _lstVWPackages { get; set; }

    }
    public class ReturnRequisitionProp : BaseEntity
    {
        public Int32 return_document_id { get; set; }
        public DateTime? return_document_date { get; set; }
        public Int32 sum_quantity { get; set; }
        public Int32 price_net { get; set; }
        public Int32 arears_price { get; set; }
        public Int32 customer_arrears_price { get; set; }
        public Int32 customer_flag { get; set; }
        public Int32 customer_id { get; set; }
        public Int32 pay_amt { get; set; }
        public Int32 ice_melt { get; set; }
        public DateTime? payment_date { get; set; }
        public Int32 sell_type { get; set; }
        public string description { get; set; }
        public Int32 route_id { get; set; }
        public Int32 transporter1_id { get; set; }
        public Int32 transporter2_id { get; set; }
        public Int32 round { get; set; }
        public Int32 user_id { get; set; }
        public string ref_requisition_id { get; set; }
        public Int32 is_active { get; set; }
        public string status { get; set; }

    }
    public class ReturnRequisitionModel : ReturnRequisitionProp
    {
        [Key]
        public Int32 retrun_requisition_id { get; set; }

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

    public class ReturnRequisitionProductModel : BaseEntity
    {

        [Key]

        public Int32 id { get; set; }
        public Int32 requisition_id { get; set; }
        public Int32 product_id { get; set; }
        [DefaultValue(0)]
        public Int32 quantity { get; set; }
        [DefaultValue(0)]
        public Int32 req_forward_qty { get; set; }
        [DefaultValue(0)]
        public Int32 price { get; set; }

        public string document_no { get; set; }
        public string status { get; set; }

    }

    public class vwReturnRequisitionProductModel
    {

        public Int32 id { get; set; }
        public Int32 requisition_id { get; set; }
        public Int32 product_id { get; set; }
        public Int32 quantity { get; set; }
        [DefaultValue(0)]
        public Int32 req_forward_qty { get; set; }
        public Int32 price { get; set; }

        public string document_no { get; set; }
        public string status { get; set; }

        public string product_name { get; set; }

    }

    public class ReturnRequisitionPackageModel : BaseEntity
    {
        [Key]
        public Int32 id { get; set; }
        public Int32 requisition_id { get; set; }
        public Int32 product_id { get; set; }
        public Int32 quantity { get; set; }
        public string document_id { get; set; }
        public string status { get; set; }
    }

    public class vwReturnRequisitionPackageModel
    {
        public Int32 id { get; set; }
        public Int32 requisition_id { get; set; }
        public Int32 product_id { get; set; }
        public Int32 quantity { get; set; }
        public string document_no { get; set; }
        public string status { get; set; }
        public string product_name { get; set; }

    }
    public class filterReturnRequisition
    {

        public int? id { get; set; }
        public int? requisition_id { get; set; }
        public int? route_id { get; set; }
        public int? round { get; set; }
        public string route_name { get; set; }
        public int? product_id { get; set; }
        public string document_no { get; set; }
        public string document_date { get; set; }
        public string status { get; set; }
        public string product_name { get; set; }
        public string requisition_type { get; set; }

    }
}
