using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace IceFactory.Model.IceBucket
{
    //public class IceBucketDataModel
    //{

    //    public IceBucketModel _master { get; set; }
    //    public vwIceBucketModel _vwMaster { get; set; }

    //}
    public class IceBucketProp : BaseEntity
    {
        public string bucket_no { get; set; }
        public int? size_id { get; set; }
        public decimal? service_amt { get; set; }
        public DateTime? borrow_date { get; set; }
        public DateTime? returndue_date { get; set; }
        public string bucket_desc { get; set; }
        public int? user_id { get; set; }
        public int receive_id { get; set; }
        public int? route_id { get; set; }
        public decimal? deposit_amt { get; set; }
        public int? bucket_status { get; set; }
        public DateTime? regis_date { get; set; }
        public string remark { get; set; }
        public DateTime? return_date { get; set; }
        public int? transporter_id { get; set; }
        public int? customer_id { get; set; }
        public int? customer_flag { get; set; }
        public int? borrow_type { get; set; }
        public string transporter1_name { get; set; }
        public string transporter2_name { get; set; }
        public string status { get; set; }

    }
    public class IceBucketModel : IceBucketProp
    {
        [Key]
        public Int32 bucketID { get; set; }

    }

    public class vwIceBucketModel : IceBucketProp
    {
        public Int32 bucketID { get; set; }

        public string route_name { get; set; }
        public string customer_name { get; set; }
        public string create_user_name { get; set; }
        public string modify_user_name { get; set; }

    }
    public class filterIceBucket
    {

        public int? bucketID { get; set; }
        public string bucket_no { get; set; }
        public int? route_id { get; set; }
        public int? customer_id { get; set; }
        public string customer_name { get; set; }
        public string route_name { get; set; }
        public string status { get; set; }

    }
}
