def request_app_deploy(env_name, app_name, app_version):
    url = 'http://companyappserver.com/api/v1/appdeploycmd'
    json = '{ "envName": "%s", "appName": "%s", "appVersion": "%s" }' % (env_name, app_name, app_version)
    print('POST %s %s' % (url, json))
    import System.Net
    with System.Net.WebClient() as wc:
        wc.UseDefaultCredentials = True
        wc.Headers.Add('Content-Type', 'application/json')
        wc.UploadString(url, json)
