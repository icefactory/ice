using System.Threading.Tasks;

namespace IceFactory.Interface.UnitOfWork
{
    /// <summary>
    ///     Unit of work.
    /// </summary>
    public interface IUnitOfWork
    {
        /// <summary>
        ///     Regenerates the context.
        /// </summary>
        Task RegenerateContextAsync();

        /// <summary>
        ///     Save context change.
        /// </summary>
        /// <returns>The save.</returns>
        Task SaveAsync();
    }
}