using System;
using System.Linq;
using System.Threading.Tasks;
using IceFactory.Model.Master;
using IceFactory.Repository.UnitOfWork;
using IceFactory.Utility.Security;
using Microsoft.EntityFrameworkCore;

namespace IceFactory.Module.Security
{
    public class AuthenticationModule : BaseModule
    {
        public AuthenticationModule(IceFactoryUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        /// <summary>
        ///     User can login with this method.
        /// </summary>
        /// <param name="email">User emial.</param>
        /// <param name="password">User password.</param>
        /// <returns>The user object.</returns>
        public async Task<UserModel> LoginAsync(string username, string password)
        {
            try
            {
                //
                // Find user form email address.

                var user = await UnitOfWork.Context.Set<UserModel>().Where(p => p.userlogin_id == username)
                    .FirstOrDefaultAsync();

                //
                // If not found return null to user.
                if (user == null)
                    return null;

                //
                // If found confirm password is correct?
                if (user.userlogin_pwd == Encryption.MD5Hash(password))
                {
                    if (user.status == "Y")
                    {
                        return user;
                    }
                }

                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}