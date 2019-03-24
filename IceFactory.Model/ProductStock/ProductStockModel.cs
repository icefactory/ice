using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace IceFactory.Model.ProductStock
{
    public static class StatusOfProduct
    {
        #region " Static Fields and Constants "

        public const string Enabled = "Y";
        public const string Disabled = "N";

        #endregion
    }
    public class ProductStockProp : BaseEntity
    {

        public Int32 product_id { get; set; }
        [DefaultValue(0)]
        public Int32 item_amt { get; set; } = 0;
        [DefaultValue(0)]
        public Int32 forward_amt { get; set; } = 0;

        [DefaultValue("STK")]
        public string from_action { get; set; }
        [DefaultValue(0)]
        public int? remain_amt { get; set; }
        public int relate_doc_id { get; set; }

    }

    public class ProductStockModel : ProductStockProp
    {

        [Key]
        public Int32 stock_trn_id { get; set; }

    }


    public class vwProductStockModel : ProductStockProp
    {
        public Int32 stock_trn_id { get; set; }

        public string product_name { get; set; }
        public virtual string unit_name { get; set; }
        public Int32? product_type { get; set; }
        public Int32 price_in { get; set; }
        public Int32 price_out { get; set; }
        public Int32? unit_id { get; set; }
        public string img_path { get; set; }

    }

    public class filterStock
    {

        public Int32? stock_trn_id { get; set; }
        public Int32? product_id { get; set; }
        public string product_name { get; set; }
        public DateTime? trans_date { get; set; }

    }
}
