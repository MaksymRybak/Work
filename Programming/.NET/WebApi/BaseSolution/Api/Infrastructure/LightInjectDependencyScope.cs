using System;
using System.Collections.Generic;
using System.Web.Http.Dependencies;
using LightInject;

namespace App.Api.Infrastrucure
{
    internal class LightInjectDependencyScope : IDependencyScope
    {
        private readonly Scope _scope;
        private readonly IServiceContainer _serviceContainer;

        public LightInjectDependencyScope(IServiceContainer serviceContainer, Scope scope)
        {
            _serviceContainer = serviceContainer;
            _scope = scope;
        }

        public object GetService(Type serviceType)
        {
            return _serviceContainer.GetInstance(serviceType);
        }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            return _serviceContainer.GetAllInstances(serviceType);
        }

        public void Dispose()
        {
            _scope.Dispose();
        }
    }
}
