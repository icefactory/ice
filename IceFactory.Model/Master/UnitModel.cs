using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace IceFactory.Model.Master
{
    public static class StatusOfUnit
    {
        #region " Static Fields and Constants "

        public const string Enabled = "Y";
        public const string Disabled = "N";

        #endregion
    }

    public class UnitModel : BaseEntity
    {
        [Key]
        public Int32 unit_id { get; set; }

        public string unit_Name { get; set; }
        
        [Required]
        [DefaultValue(StatusOfUnit.Enabled)]
        public string Status { get; set; }
    }
}
