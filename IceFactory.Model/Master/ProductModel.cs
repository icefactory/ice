using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace IceFactory.Model.Master
{
    public static class StatusOfProduct
    {
        #region " Static Fields and Constants "

        public const string Enabled = "Y";
        public const string Disabled = "N";

        #endregion
    }
    public class ProductProp : BaseEntity
    {

        public int? seq { get; set; }
        public string product_name { get; set; }
        public int? product_type { get; set; }
        public int? price_in { get; set; }
        public int? price_out { get; set; }
        public int? unit_id { get; set; }
        public int? secord_unit { get; set; }
        public string shot_name { get; set; }
        public int? item_id { get; set; }
        public int? type_id { get; set; }
        public int? sort { get; set; }
        public string status { get; set; }
        public int? remain_amt { get; set; }
        public DateTime? stock_last_update { get; set; }
        public string img_path { get; set; }

    }
     
    public class ProductModel : ProductProp
    {
        
        [Key]
        public Int32 product_id { get; set; }

    }


    public class vwProductModel : ProductProp
    {

        public Int32 product_id { get; set; }
        
        public virtual string unit_name { get; set; }

        public string secord_unit_name { get; set; }

    }

    public class filterProduct
    {

        public Int32? product_id { get; set; }
        public string product_name { get; set; }
        public string status { get; set; }

    }
}
