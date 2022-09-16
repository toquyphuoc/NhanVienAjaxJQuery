using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ConnectSQLServerAndUsingAjaxJQuery.Startup))]
namespace ConnectSQLServerAndUsingAjaxJQuery
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
