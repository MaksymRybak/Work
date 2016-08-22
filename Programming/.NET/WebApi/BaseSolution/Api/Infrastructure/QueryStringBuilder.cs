using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Yoda.Releaser.Api.Infrastrucure
{
    internal class QueryStringBuilder : List<Tuple<string, object>>
    {
        public void Add(string name, object value)
        {
            Add(Tuple.Create(name, value));
        }

        public override string ToString()
        {
            var tuples = this.Where(x => !string.IsNullOrWhiteSpace(x.Item2?.ToString()));
            var strings = tuples.Select(t => string.Concat(HttpUtility.UrlEncode(t.Item1), "=", HttpUtility.UrlEncode(t.Item2.ToString())));
            return string.Join("&", strings);
        }
    }
}
