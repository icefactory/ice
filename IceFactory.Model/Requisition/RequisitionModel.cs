using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace IceFactory.Model.Requisition
{
    public class RequisitionDataModel
    {
        public RequisitionModel _master { get; set; }
        public vwRequisitionModel _vwMaster { get; set; }
        public List<RequisitionProductModel> _lstProducts { get; set; }
        public List<RequisitionPackageModel> _lstPackages { get; set; }
    }

    public class RequisitionModel : BaseEntity
    {
        [Key] public Int32 requisition_id { get; set; }

        public string document_no { get; set; }
        public int route_id { get; set; }
        public int? customer_flag { get; set; }
        public int? customer_id { get; set; }
        public int sell_type { get; set; }
        public int requisition_status { get; set; }
        public DateTime? document_date { get; set; }
        public int? transporter1_id { get; set; }
        public int? transporter2_id { get; set; }
        public int round { get; set; }
        public string description { get; set; }
        public int price_net { get; set; }
        public string status { get; set; }
        public string requisition_type { get; set; }
    }

    public class vwRequisitionModel : BaseEntity
    {
        public Int32 requisition_id { get; set; }
        public string document_no { get; set; }
        public int route_id { get; set; }
        public int? customer_flag { get; set; }
        public int? customer_id { get; set; }
        public int sell_type { get; set; }
        public int requisition_status { get; set; }
        public DateTime? document_date { get; set; }
        public int? transporter1_id { get; set; }
        public int? transporter2_id { get; set; }
        public int round { get; set; }
        public string description { get; set; }
        public int price_net { get; set; }
        public string status { get; set; }
        public string requisition_type { get; set; }


        public string transporter1_name { get; set; }
        public string transporter2_name { get; set; }

        public string route_name { get; set; }
        public string customer_name { get; set; }
        public string create_user_name { get; set; }
        public string modify_user_name { get; set; }
    }

    public class RequisitionProductModel : BaseEntity
    {
        [Key] public Int32 id { get; set; }

        public Int32 requisition_id { get; set; }
        public Int32 product_id { get; set; }

        [DefaultValue(0)] public Int32 quantity { get; set; }

        [DefaultValue(0)] public Int32 req_forward_qty { get; set; }

        [DefaultValue(0)] public Int32 price { get; set; }

        public string document_no { get; set; }
        public string status { get; set; }
    }

    public class vwRequisitionProductModel : BaseEntity
    {
        public Int32 id { get; set; }
        public Int32 requisition_id { get; set; }
        public Int32 product_id { get; set; }
        public Int32 quantity { get; set; }

        [DefaultValue(0)] public Int32 req_forward_qty { get; set; }

        public Int32 price { get; set; }

        public string document_no { get; set; }
        public string status { get; set; }

        public string product_name { get; set; }
        public string package_name { get; set; }
        public virtual string unit_name { get; set; }
    }

    public class RequisitionPackageModel : BaseEntity
    {
        [Key] public Int32 id { get; set; }

        public Int32 requisition_id { get; set; }
        public Int32 product_id { get; set; }
        public Int32 quantity { get; set; }
        public string document_no { get; set; }
        public string status { get; set; }
    }

    public class vwRequisitionPackageModel : BaseEntity
    {
        public Int32 id { get; set; }
        public Int32 requisition_id { get; set; }
        public Int32 product_id { get; set; }
        public Int32 quantity { get; set; }
        public string document_no { get; set; }
        public string status { get; set; }
        public string product_name { get; set; }
        public virtual string unit_name { get; set; }
    }

    public class filterRequisition
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