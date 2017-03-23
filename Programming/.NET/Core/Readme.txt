ASP.NET Core, MVC 6, EF Core and Angular course on Pluralsight

ASP.NET Core is open sourced built on GitHub.
MVC and WebApi are combined. WebForms is gone.
Everything is a dependency. Nuget packages. Better performance.
ASP.NET Core is compatible with .NET Core and .NET 4.6.
We can continue to manage our ASP.NET website Core on IIS. 
Self hosted also supported. 

Core idea is a composition of our application.

Embrace open web development
- npm for tooling support
- bower for client-side library support
- grunt and gulp for build automation
- nuget for .net packages

Yeoman (yo) to create new projects, files, configs, etc. Works on top of nodejs and npm.
We install yo using npm: npm install yo -g
After that we have to install generator-aspnet.
Type yo aspnet to create aspnet project.

Create new web project typing dotnet new web
Kestrel is a web server
IISIntegration for authentication
Configure method used to set up the logic executed during incoming requests
wwwroot folder where we put files served by web server
The order of middleware calls is important

ASP.NET MVC 6
folders: Controllers, Views
files: *.cshtml, _ViewImports.cshtml, _ViewStart.cshtml
class and interfaces: Controller, IActionResult
We have to add MVC to Startup of our project (Configure and ConfigureServices methods)
Add routes mapped to controllers.
Use views to split FE/UI layouts.
If the app throws the exception, FE receives error 500.
Use UseDeveloperExceptionPage to see errors in the dev env.
We use IHostingEnvironment to get the current env (dev, staging, prod, etc.). Startup class.
TagHelpers. Inject tag helpers in _ViewImports.cshtml. 
Binding model to view using @model
MVC 6 validations: attributes in our model. Hook validation to our UI using tag helpers and jquery validate. So we have validation on the client and server sides.
Using Startup.ConfigureServices() to inject dependencies like service classes. Transient, scoped, singleton instances.
We use config.json to save app's configuration. We can override config using env variables in our launch.json. 

Using MVC6 to create REST endpoints
Create API Controller. We have the same base class (Controller) for Web and Api Controllers.
We decide what to return.
Get, Post requests. 
We can do validations using ModelState methods. Like in View. It will validate our [FromBody] parameter.
Validation attributes used in dto/cmd.
Convert our viewmodel (aka dto) in model using AutoMapper. Direct and reverse mappers.
Mapping collections.
Setting up logging.
We can make controller's methods asynchronous, using async and await and Task.
Some examples to make rest calls to external apis. Used HttpClient and linq to json.

ASP.NET Identity
Using Cookies, OAuth2, etc.
It's pluggable.
Store authorization using EF. IdentityDbContet, IdentityUser, UserManager, SignInManager. Create migration with identity objects (AspNetUsers, AspNetRoles, AspNetUserLogins, AspNetUserRoles, etc.) using dotnet ef migration module. Update db schema applying new migration.
Configuring Identity. services.AddIdentity(). Config cookies settings. 
Login path will contains ReturnUrl. We'll be redirected to the original path after login in.
We can configure Mvc to use Https. So, if we digit http, we'll be redirected to https.
Securing API - cookie auth (only for app's clients), OAuth2 and Open ID Connect (OIDC) - safer and support non JS clients. Cookie auth event - return 401 for API call (if path starts with /api), otherwise redirect to RedirectUrl. 
Using Identity in API calls. Add Authorize attribute to the controller -> we get all methods authenticated. User.Identity object used to get user's data.



