using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using log4net;

namespace App.Api.Infrastrucure.Logging
{
    public class LogRequestDelegatingHandler : DelegatingHandler
    {
        private readonly ILog _log;

        public LogRequestDelegatingHandler(ILog log)
        {
            _log = log;
        }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            _log.InfoFormat("{0} {1}", request.Method, request.RequestUri);
            return base.SendAsync(request, cancellationToken);
        }
    }
}
