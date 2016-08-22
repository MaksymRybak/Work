using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Web.Script.Serialization;
using App.Api.Repositories.Interfaces;

namespace App.Api.Repositories
{
    public class AppRepository : IAppRepository
    {
        private readonly IDatabase _db;

        public AppRepository(IDatabase db)
        {
            _db = db;
        }

        public object Get(string parameterName)
        {
            var selectStatement = @"select *
                                    from DatabaseTable (nolock)";
            return _db.Query(selectStatement).Select(a => new Model { Name = a.Get<string>("Name") }).ToArray();
        }
    }
}
