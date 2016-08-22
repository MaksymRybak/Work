using App.Api.Infrastrucure.AuthProvider;

namespace App.Api.Infrastrucure.Logging
{
    public class HttpClientUserNameLogger
    {
        private readonly IAuthProvider _authProvider;

        public HttpClientUserNameLogger(IAuthProvider authProvider)
        {
            _authProvider = authProvider;
        }

        public override string ToString()
        {
            try
            {
                return _authProvider.GetUserName();
            }
            catch
            {
                return "";
            }
        }
    }
}
