using System.Linq;
using System.Web.Http;
using App.Api.Repositories.Interfaces;

namespace App.Api.Services
{
    [RoutePrefix("api/ui")]
    public class AppController : ApiController
    {
        private readonly IAppRepository _appRepository;

        public AppController(IAppRepository appRepository)
        {
            _appRepository = appRepository;
        }

        [HttpGet, Route("names")]
        public object Get()
        {
            var names = _appRepository.Get(null);
            return names.ToList().Select(n => new { n.Name });
        }
    }
}
