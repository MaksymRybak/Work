using System.Collections.Generic;

namespace App.Api.Infrastrucure
{
    public class AppConfiguration
    {
        private readonly IDictionary<string, string> _appConfig;

        public AppConfiguration(IDictionary<string, string> appConfig)
        {
            _appConfig = appConfig;
        }

        public string DatabaseConnectionString => GetParameter("DatabaseConnectionString");

        private string GetParameter(string parameterName)
        {
            return _appConfig[parameterName];
        }
    }
}
