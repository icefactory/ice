using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using IceFactory.Model.Master;
using IceFactory.Module.Security;
using IceFactory.Repository.UnitOfWork;
using IceFactory.Utility.Http;
using IceFactory.Utility.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace IceFactory.Api.Controllers.Security
{
    [Route("api/security/[controller]")]
    public class AuthenticationController : BaseController
    {
        private readonly AuthenticationModule _authenticationModule;

        public AuthenticationController(IceFactoryUnitOfWork unitOfWork) : base(unitOfWork)
        {
            _authenticationModule = new AuthenticationModule(unitOfWork);
        }

        private static void CheckUserIsNotNull(UserModel user)
        {
            if (user == null)
                throw new Exception(new ErrorInfo
                {
                    Message = "Username or password is invalid",
                    MessageLocal = "ชื่อผู้ใช้ หรือรหัสผ่าน ไม่ถูกต้อง"
                }.ConvertErrorInfoToException());
        }

        private static string CreateToken(UserModel user, DateTime expires)
        {
            var handler = new JwtSecurityTokenHandler();

            var identity = new ClaimsIdentity(
                new GenericIdentity(user.userlogin_id, "TokenAuth"),
                new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.user_id.ToString()),
                    new Claim(ClaimTypes.Name, user.user_name),
                    new Claim(ClaimTypes.Surname, user.user_surname)
                }
            );

            var securityToken = handler.CreateToken(new SecurityTokenDescriptor
            {
                Issuer = TokenAuthenticationOptions.Issuer,
                Audience = TokenAuthenticationOptions.Audience,
                SigningCredentials = TokenAuthenticationOptions.SigningCredentials,
                Subject = identity,
                Expires = expires
            });

            return handler.WriteToken(securityToken);
        }

        [HttpPost]
        public async Task<IActionResult> LoginAsync([FromBody] UserModel user)
        {
            try
            {
                var existUser = await _authenticationModule.LoginAsync(user.userlogin_id, user.userlogin_pwd);

                CheckUserIsNotNull(existUser);

                var requestAt = DateTime.Now;
                var expiresIn = requestAt + TokenAuthenticationOptions.ExpiresSpan;

                var userLogin = new UserLogin
                {
                    LoginDate = requestAt,
                    ExpireDate = expiresIn,
                    Token = CreateToken(existUser, expiresIn),
                    Type = UserLoginType.Bearer,
                    Status = "Success",
                    User = existUser
                };

                return Ok(new
                {
                    RequertAt = userLogin.LoginDate,
                    ExpiresIn = TokenAuthenticationOptions.ExpiresSpan.TotalSeconds,
                    ExpiresAt = userLogin.LoginDate.AddSeconds(TokenAuthenticationOptions.ExpiresSpan.TotalSeconds),
                    TokeyType = TokenAuthenticationOptions.TokenType,
                    AccessToken = userLogin.Token,
                    User = new
                    {
                        userLogin.User.user_id,
                        userLogin.User.user_name,
                        userLogin.User.user_surname,
                        userLogin.User.userlogin_id,
                    }
                });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message.ConvertExceptionToErrorInfo());
            }
        }
    }
}