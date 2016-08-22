using System;
using System.Collections.Generic;
using System.Web.Http.Dependencies;
using LightInject;

namespace App.Api.Infrastrucure
{
    internal class LightInjectDependencyResolver : IDependencyResolver
    {
        private readonly IServiceContainer _serviceContainer;

        public LightInjectDependencyResolver(IServiceContainer serviceContainer)
        {
            _serviceContainer = serviceContainer;
        }

        public void Dispose()
        {
            _serviceContainer.Dispose();
        }

        public object GetService(Type serviceType)
        {
            return _serviceContainer.TryGetInstance(serviceType);
        }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            return _serviceContainer.GetAllInstances(serviceType);
        }

        public IDependencyScope BeginScope()
        {
            return new LightInjectDependencyScope(_serviceContainer, _serviceContainer.BeginScope());
        }
    }
}
