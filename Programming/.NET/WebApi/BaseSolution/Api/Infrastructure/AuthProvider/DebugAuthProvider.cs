using System;

namespace App.Api.Infrastrucure.AuthProvider
{
    public class DebugAuthProvider : IAuthProvider
    {
        public string GetUserName()
        {
            return Environment.UserName;
        }
    }
}
