using System.Collections.Generic;

namespace App.Api.Repositories.Interfaces
{
    public interface IAppRepository
    {
        object Get(string parameterName);
    }
}
