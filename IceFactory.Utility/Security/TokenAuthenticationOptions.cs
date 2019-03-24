using System;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;

namespace IceFactory.Utility.Security
{
    public static class TokenAuthenticationOptions
    {
        #region " All other members "

        private static RSAParameters GenerateKey()
        {
            using (var rsa = RSA.Create())
            {
                rsa.KeySize = 2048;

                return rsa.ExportParameters(true);
            }
        }

        #endregion

        #region " Properties, Indexers "

        public static string Audience { get; } = "IceFactoryAudience";
        public static string Issuer { get; } = "IceFactoryIssuer";
        public static RsaSecurityKey Key { get; } = new RsaSecurityKey(GenerateKey());

        public static SigningCredentials SigningCredentials { get; } =
            new SigningCredentials(Key, SecurityAlgorithms.RsaSha256Signature);

        public static TimeSpan ExpiresSpan { get; } = TimeSpan.FromMinutes(480);
        public static string TokenType { get; } = "Bearer";

        #endregion
    }
}