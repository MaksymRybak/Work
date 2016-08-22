namespace App
{
    public class Global : HttpApplication
    {
        private static readonly ILog Log = LogManager.GetLogger(typeof(Global));

        public static readonly string AppName = "App";
        public static readonly string AppVersion = typeof(Global).Assembly.GetCustomAttributes(typeof(AssemblyInformationalVersionAttribute), false).Cast<AssemblyInformationalVersionAttribute>().Single().InformationalVersion;
        public static readonly string AppConfiguration = typeof(Global).Assembly.GetCustomAttributes(typeof(AssemblyConfigurationAttribute), false).Cast<AssemblyConfigurationAttribute>().Single().Configuration;

        protected void Application_Start(object sender, EventArgs e)
        {
            // get possible app configuration (e.g. from Database)
            AppConfiguration appConfiguration = null;
            
            // config log4net
            XmlConfigurator.Configure(new MemoryStream(Encoding.UTF8.GetBytes(appConfiguration.Log4NetConfig)));
            GlobalContext.Properties["log4japp"] = AppName;
            GlobalContext.Properties["UserName"] = Environment.UserName;
            GlobalContext.Properties["ClientHost"] = new HttpClientHostLogger();
            GlobalContext.Properties["Version"] = AppVersion;

            Log.InfoFormat("Starting {0} v{1} ({2})", AppName, AppVersion, AppConfiguration);

            var connStr = appConfiguration.DatabaseConnectionString;
            Log.InfoFormat(connStr);

            // config IoC
            var container = new ServiceContainer();
            container.Register<IDatabase>(c => new Database(connStr), new PerScopeLifetime());

            var authProviderType = Type.GetType(ConfigurationManager.AppSettings["AuthProvider"]);
            var authProvider = (IAuthProvider)Activator.CreateInstance(authProviderType);
            GlobalContext.Properties["ClientUserName"] = new HttpClientUserNameLogger(authProvider);

            container.Register(authProviderType, new PerScopeLifetime());
            container.Register(c => (IAuthProvider)c.GetInstance(authProviderType), new PerScopeLifetime());

            GlobalConfiguration.Configure(cfg => Configure(cfg, container, appConfiguration));
        }

        public static void Configure(HttpConfiguration cfg, ServiceContainer container, AppConfiguration appConfiguration)
        {
            cfg.MapHttpAttributeRoutes();
            cfg.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            cfg.Formatters.JsonFormatter.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
            cfg.DependencyResolver = new LightInjectDependencyResolver(container);

            cfg.Services.Add(typeof(IExceptionLogger), new Log4NetExceptionLogger(Log));
            cfg.MessageHandlers.Add(new LogRequestDelegatingHandler(Log));

            container.Register<IAppRepository, AppRepository>(new PerScopeLifetime());
            container.Register<AppController>(new PerRequestLifeTime());
        }
    }
}
