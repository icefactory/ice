using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace IceFactory.Model.Master
{
    //public static class StatusOfProduct
    //{
    //    #region " Static Fields and Constants "

    //    public const string Enabled = "Y";
    //    public const string Disabled = "N";

    //    #endregion
    //}
    public class UserProp : BaseEntity
    {

        public string user_name { get; set; }
        public string user_surname { get; set; }
        public DateTime? user_startwork { get; set; }
        public string user_idcard { get; set; }
        public int? position_type { get; set; }
        public DateTime? birth_date { get; set; }
        public string address { get; set; }
        public string phone_no { get; set; }
        public string phone_no2 { get; set; }
        public string resign_status { get; set; }
        public string userlogin_id { get; set; }
        public string userlogin_pwd { get; set; }
        public string status { get; set; }

    }
     
    public class UserModel : UserProp
    {
        
        [Key]
        public Int32 user_id { get; set; }

    }


    public class vwUserModel : UserProp
    {

        public Int32 user_id { get; set; }
        
        public virtual string position_description { get; set; }
    }

    public class filterUser
    {
        public Int32? user_id { get; set; }
        public string User_name { get; set; }
        public string status { get; set; }

    }
}
