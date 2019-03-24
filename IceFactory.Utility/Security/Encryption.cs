using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace IceFactory.Utility.Security
{
    public static class Encryption
    {
        #region " All other members "

        public static string Encrypt(string clearText)
        {
            var clearBytes = Encoding.Unicode.GetBytes(clearText);

            using (var encryptor = Aes.Create())
            {
                var pdb = new Rfc2898DeriveBytes(SecurityKey.Key,
                    new byte[] {0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76});

                if (encryptor == null) return clearText;

                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);

                using (var ms = new MemoryStream())
                {
                    using (var cs = new CryptoStream(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(clearBytes, 0, clearBytes.Length);
                    }

                    clearText = Convert.ToBase64String(ms.ToArray());
                }
            }

            return clearText;
        }

        #endregion
    }
}