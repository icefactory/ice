﻿using System;
using System.ComponentModel.DataAnnotations;

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
        [Key] public Int32 user_id { get; set; }
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

    public class User
    {
        #region " Properties, Indexers "

        [Required] public string userlogin_id { get; set; }

        [Required] public string userlogin_pwd { get; set; }

        [Timestamp] public byte[] SecurityStamp { get; set; }

        [Required] public string Status { get; set; }

        public int user_id { get; set; }

        public string user_name { get; set; }

        public string user_surname { get; set; }

        public DateTime user_startwork { get; set; }

        public string user_idcard { get; set; }

        public DateTime birth_date { get; set; }

        public string address { get; set; }

        public string phone_no { get; set; }

        public string phone_no2 { get; set; }

        #endregion
    }

    public class UserLogin
    {
        #region " Properties, Indexers "

        public DateTime LoginDate { get; set; }
        public DateTime? ExpireDate { get; set; }
        public string Token { get; set; }

        [Required] public string Type { get; set; }

        [Required] public string Status { get; set; }

        public int UserId { get; set; }
        public UserModel User { get; set; }

        #endregion
    }

    public class UserLoginType
    {
        #region " Static Fields and Constants "

        public const string UserNamelAndPassword = "username and password";
        public const string Bearer = "Bearer";

        #endregion
    }
}