using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace IceFactory.Model.Master
{

    public class CustomerProp : BaseEntity
    {
        //public string route_name { get; set; }
        //public int? transpoter1_id { get; set; }
        //public int? transpoter2_id { get; set; }
        //public string car_id { get; set; }
        [Required]
        [DefaultValue(StatusOfUnit.Enabled)]
        public string Status { get; set; }

        public string customer_name { get; set; }
        public string customer_surname { get; set; }
        public int customer_type { get; set; }
        public string address { get; set; }
        public string phone { get; set; }
        public string phone_no2 { get; set; }
        public DateTime? customer_register { get; set; }
        public int? route_id { get; set; }
        public int? customer_group { get; set; }
	

    }

    public class CustomerModel : CustomerProp
    {
        [Key]
        public Int32 customer_id { get; set; }
    }

    public class vwCustomerModel : CustomerProp
    {

        public Int32 customer_id { get; set; }

        public string route_name { get; set; }
        public int? transporter1_id { get; set; }
        public int? transporter2_id { get; set; }
        public string transporter1_name { get; set; }
        public string transporter2_name { get; set; }

    }


    public class filterCustomer
    {

        public Int32? customer_id { get; set; }
        public string customer_name { get; set; }
        public string customer_surname { get; set; }
        public int? customer_type { get; set; }
        public int? route_id { get; set; }
        public string Status { get; set; }


    }
}
