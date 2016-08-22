using System;
using System.Security.Principal;
using System.Web;

namespace App.Api.Infrastrucure.AuthProvider
{
    public class HttpContextAuthProvider
    {
        public string GetUserName()
        {
            return GetPrincipal().Identity.Name;
        }

        private IPrincipal GetPrincipal()
        {
            if (HttpContext.Current == null)
            {
                throw new ApplicationException("Not in ASP.NET request");
            }
            if (HttpContext.Current.User == null || !HttpContext.Current.User.Identity.IsAuthenticated)
            {
                throw new ApplicationException("No authenticated user");
            }
            return HttpContext.Current.User;
        }
    }
}
