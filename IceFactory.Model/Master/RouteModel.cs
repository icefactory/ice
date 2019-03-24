using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace IceFactory.Model.Master
{
    
    public class RouteModel : BaseEntity
    {
        [Key]
        public Int32 route_id { get; set; }

        public string route_name { get; set; }
        public int? transpoter1_id { get; set; }
        public int? transpoter2_id { get; set; }
        public string car_id { get; set; }
        [Required]
        [DefaultValue(StatusOfUnit.Enabled)]
        public string Status { get; set; }
    }


    public class vwRouteModel
    {

        public Int32 route_id { get; set; }

        public string route_name { get; set; }
        public int? transporter1_id { get; set; }
        public int? transporter2_id { get; set; }
        public string car_id { get; set; }
        public string Status { get; set; }

        public string transporter1_name { get; set; }
        public string transporter2_name { get; set; }

    }


    public class filterRoute
    {

        public Int32? route_id { get; set; }
        public string route_name { get; set; }
        public string car_id { get; set; }
        public string Status { get; set; }


    }
}
