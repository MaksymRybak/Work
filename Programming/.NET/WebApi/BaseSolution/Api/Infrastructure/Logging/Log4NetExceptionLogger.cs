using System.Web.Http.ExceptionHandling;
using log4net;

namespace App.Api.Infrastrucure.Logging
{
    public class Log4NetExceptionLogger : ExceptionLogger
    {
        private readonly ILog _log;

        public Log4NetExceptionLogger(ILog log)
        {
            _log = log;
        }

        public override void Log(ExceptionLoggerContext context)
        {
            _log.Error(string.Concat(context.Request.Method, " ", context.Request.RequestUri), context.Exception);
        }
    }
}
