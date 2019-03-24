using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace IceFactory.Model
{
    public class BaseEntity
    {
        //[Key] public Int32 Id { get; set; }

        public DateTime CreateDate { get; set; }

        public int CreateByUserId { get; set; }

        public DateTime? ModifyDate { get; set; }

        public int? ModifyByUserId { get; set; }
    }

    public class BaseFilter
    {
        public string Status { get; set; }

        public DateTime? CreateDate { get; set; }

        public int? CreateByUserId { get; set; }

        public DateTime? ModifyDate { get; set; }

        public int? ModifyByUserId { get; set; }
    }
}
