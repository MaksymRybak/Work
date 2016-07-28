// app
public class Global : HttpApplication
{
	private static readonly ILog Log = LogManager.GetLogger(typeof(Global));	

	public static readonly string AppVersion = typeof(Global).Assembly.GetCustomAttributes(typeof(AssemblyInformationalVersionAttribute), false).Cast<AssemblyInformationalVersionAttribute>().Single().InformationalVersion;
    public static readonly string AppConfiguration = typeof(Global).Assembly.GetCustomAttributes(typeof(AssemblyConfigurationAttribute), false).Cast<AssemblyConfigurationAttribute>().Single().Configuration;
		
	protected void Application_Start(object sender, EventArgs e)
	{
		XmlConfigurator.Configure(new MemoryStream(Encoding.UTF8.GetBytes(log4netConfig)));
		GlobalContext.Properties["log4japp"] = "AppName";		
		GlobalContext.Properties["UserName"] = Environment.UserName;		

		Log.InfoFormat("Starting {0} v{1} ({2})", "AppName", AppVersion, AppConfiguration);
		
		var connStr = "TODO: get connection string from configuration";
		Log.InfoFormat("ConnectionString : {0}", connStr);

		var container = new ServiceContainer();		
		container.Register<IDatabase>(c => new Database(connStr), new PerScopeLifetime());
		container.Register<IOracleDatabase>(od => new OracleDatabase("TODO: OracleCredentials", "TODO: OracleConnectionConfiguration"));			

		GlobalConfiguration.Configure(cfg =>
		{
			cfg.Filters.Add(new UserAuthorizationAttribute(container));
			Configure(cfg, container);
		});
	}

	public static void Configure(HttpConfiguration cfg, ServiceContainer container)
	{
		cfg.MapHttpAttributeRoutes();
		cfg.Formatters.JsonFormatter.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;

		cfg.DependencyResolver = new LightInjectDependencyResolver(container);
		cfg.Services.Add(typeof(IExceptionLogger), new Log4NetExceptionLogger(Log));
		cfg.MessageHandlers.Add(new LogRequestDelegatingHandler(Log));

		container.Register<AppsBuilders>(new PerScopeLifetime());
		container.Register<IRepositories, Repositories>(new PerScopeLifetime());
		container.Register<IManagers, Managers>(new PerScopeLifetime());			
		
		container.Register<Controllers>(new PerScopeLifetime());
	}
}

// for tests
public static IDisposable StartWebServer(IDatabase db, ServiceContainer container)
{          
    if (container == null) 
        container = new ServiceContainer();

    container.RegisterInstance(db);

    return WebApp.Start("http://localhost:9000/", appBuilder =>
    {
        HttpConfiguration config = new HttpConfiguration();
        Global.Configure(config, container);                
        appBuilder.Use((context, next) =>
        {
            context.Request.User = new GenericPrincipal(new GenericIdentity("TestUser", "Test"), null);
            return next.Invoke();
        });

        appBuilder.UseWebApi(config);
    });
}

