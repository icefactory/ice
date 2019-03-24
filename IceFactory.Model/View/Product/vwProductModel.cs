using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace IceFactory.Model.View.Poduct
{
    public static class StatusOfProduct
    {
        #region " Static Fields and Constants "

        public const string Enabled = "Y";
        public const string Disabled = "N";

        #endregion
    }

    public class vwProductModel 
    {

        //[Required]
        //[DefaultValue(StatusOfProduct.Enabled)]
        //public string Status { get; set; }
        [Key]
        public Int32 product_id { get; set; }
        public int? seq { get; set; }
        public string product_name { get; set; }
        public int? product_type { get; set; }
        public Decimal price_in { get; set; }
        public Decimal price_out { get; set; }
        public int? unit_id { get; set; }
        public int? userid_create { get; set; }
        public int? userid_update { get; set; }
        public DateTime? time_create { get; set; }
        public DateTime? time_update { get; set; }
        public int? secord_unit { get; set; }
        public string shot_name { get; set; }
        public int? item_id { get; set; }
        public int? type_id { get; set; }
        public int? sort { get; set; }

        public string  unit_name { get; set; }

        public string secord_unit_name { get; set; }

    }
}
