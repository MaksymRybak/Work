using System.Web;

namespace App.Api.Infrastrucure.Logging
{
    public class HttpClientHostLogger
    {
        public override string ToString()
        {
            try
            {
                var req = HttpContext.Current.Request;
                var xForwardedFor = string.IsNullOrWhiteSpace(req.Headers["X-Forwarded-For"]) ? null : req.Headers["X-Forwarded-For"];
                var xClusterClientIp = string.IsNullOrWhiteSpace(req.Headers["X-Cluster-Client-Ip"]) ? null : req.Headers["X-Cluster-Client-Ip"];
                var xRealIp = string.IsNullOrWhiteSpace(req.Headers["X-Real-IP"]) ? null : req.Headers["X-Real-IP"];
                var userHostAddress = string.IsNullOrWhiteSpace(req.UserHostAddress) ? null : req.UserHostAddress;

                return xForwardedFor ?? xClusterClientIp ?? xRealIp ?? userHostAddress ?? "";
            }
            catch
            {
                return "";
            }
        }
    }
}
