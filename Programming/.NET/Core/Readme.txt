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
files: *.cshtml
class and interfaces: Controller, IActionResult
We have to add MVC to Startup of our project (Configure and ConfigureServices methods)
Add routes mapped to controllers.
Use views to split FE/UI layouts.
