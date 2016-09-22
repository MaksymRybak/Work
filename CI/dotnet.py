import os
import glob
import subprocess
import re
import clr
import System

framework_version = '4.0.30319'
nunit_version = '2.6.2'
nugetcheck_version = '0.1.8'
sqlmigrator_version = '0.9.1'
sqlserver_version = '110'
wix_version = '3.8.1128.0'
tfs_uri = r'http://localhost:8080/tfs/DefaultCollection'
nodejs_version = '5.3.0'
protractor_version = '3.2.2'
chromium_version = '49.0.2623.112'
ticket_server_uri = r'ticket_server.it'
ticket_server_port = 443
ticket_server_ssl = True

base_dir = os.path.join(os.path.dirname(__file__))
msbuild_tools_version = '14.0'

def msbuild(project_path, *targets, **properties):
    msbuild_path = get_reg_value('HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\MSBuild\\ToolsVersions\\' + msbuild_tools_version, 'MSBuildToolsPath')
    msbuild_path = os.path.join(msbuild_path, 'MSBuild.exe')
    call_args = [msbuild_path, project_path, '/verbosity:minimal', '/nologo', '/p:VisualStudioVersion=' + msbuild_tools_version]
    if targets:
        call_args.append('/t:' + ';'.join(targets))
    call_args.extend(['/p:%s=%s' % (k, v) for k, v in properties.iteritems()])
    subprocess.check_call(call_args)


def nuget_restore(*args):
    subprocess.check_call([os.path.join(base_dir, 'NuGet.exe'), 'restore'] + list(args))


def nuget_install(*args):
    subprocess.check_call([os.path.join(base_dir, 'NuGet.exe'), 'install'] + list(args))


def nuget_push(*args):
    subprocess.check_call([os.path.join(base_dir, 'NuGet.exe'), 'push'] + list(args))


def nuget_pack(*args):
    subprocess.check_call([os.path.join(base_dir, 'NuGet.exe'), 'pack'] + list(args))


def nuget_check(sln_path):
    nuget_install('NuGetCheck', '-Version', nugetcheck_version, '-OutputDirectory', base_dir)
    subprocess.check_call([os.path.join(base_dir, 'NuGetCheck.' + nugetcheck_version, 'tools', 'NuGetCheck.exe'), 'PackageVersionMismatch', sln_path])


def nunit(*dll_globs, **kwargs):
    report_path = os.path.join(base_dir, 'TestResult.xml')
    nuget_install('NUnit.Runners', '-Version', nunit_version, '-OutputDirectory', base_dir)
    exe = 'nunit-console-x86.exe' if kwargs.get('x86') else 'nunit-console.exe'
    nunit_command = [
        os.path.join(base_dir, 'NUnit.Runners.' + nunit_version, 'tools', exe),
        '/nologo',
        '/framework=' + framework_version,
        '/noshadow',
        '/xml=' + report_path
    ]
    for dll_glob in dll_globs:
        nunit_command.extend(glob.glob(dll_glob))
    subprocess.check_call(nunit_command)
    tc_print("importData type='nunit' path='%s'" % report_path)


def assembly_info(filepath, **kwargs):
    with open(filepath, 'w') as f:
        f.write('\n'.join(['[assembly: System.Reflection.%s("%s")]' % (k, v) for k, v in kwargs.iteritems()]))


def tc_print(s):
    print("##teamcity[%s]" % s)


def webdeploy_sync_server(master, *slaves):
    for slave in slaves:
        msdeploy('-verb:sync', '-source:webserver,computername=' + master, '-dest:auto,computername=' + slave)


def get_reg_value(key_name, value_name, default_value=None):
    import Microsoft.Win32
    return Microsoft.Win32.Registry.GetValue(key_name, value_name, default_value)

def set_reg_value(key_name, value_name, default_value=None):
    import Microsoft.Win32
    return Microsoft.Win32.Registry.SetValue(key_name, value_name, default_value)

def msdeploy(*args):
    # For some reason, MSDeploy refuse to understand standard check_call arguments, so i had to construct the commandline by hand
    msdeploy_dir = get_reg_value(r'HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\IIS Extensions\MSDeploy\1', 'InstallPath')
    msdeploy_cmd = '"' + os.path.join(msdeploy_dir, 'msdeploy.exe') + '" ' + ' '.join(args)
    print(msdeploy_cmd)
    subprocess.check_call(msdeploy_cmd)


def robocopy(src, dest):
    returncode = subprocess.call(['robocopy.exe', src, dest, '/MIR'])
    if returncode > 8:
        raise Exception('ROBOCOPY failed with exit code %s' % returncode)


def robocopy2(*args):
    returncode = subprocess.call(['robocopy.exe'] + list(args))
    if returncode > 8:
        raise Exception('ROBOCOPY failed with exit code %s' % returncode)


def sql_query(conn_str, sql):
    rows = []

    with sql_open_conn(conn_str) as conn:
        with conn.CreateCommand() as cmd:
            cmd.CommandText = sql
            with cmd.ExecuteReader() as rdr:
                while rdr.Read():
                    rows.append(dict([(rdr.GetName(idx), rdr[idx]) for idx in range(rdr.FieldCount)]))

    return rows


def sql_exec(conn_str, sql):
    with sql_open_conn(conn_str) as conn:
        with conn.CreateCommand() as cmd:
            cmd.CommandText = sql
            return cmd.ExecuteNonQuery()


def sql_scalar(conn_str, sql):
    with sql_open_conn(conn_str) as conn:
        with conn.CreateCommand() as cmd:
            cmd.CommandText = sql
            return cmd.ExecuteScalar()


# def sqlcmd(*args):
#   sqlcmd_dir = dotnet.get_reg_value(r'HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Microsoft SQL Server\110\Tools\ClientSetup', 'Path', '.')
#   sqlcmd_path = os.path.join(sqlcmd_path, 'sqlcmd.exe')
#   if not os.path.isfile(sqlcmd_path):
#       raise Exception('Unable to locate SQLServer 2012 command line tool. Is SQLServer LocalDB installed?')
#   subprocess.check_call([sqlcmd_path] + list(args))


def sqllocaldb(*args):
    sqllocaldb_path = os.path.join(get_sqlserver_tools_dir(), 'SqlLocalDB.exe')
    subprocess.check_call([sqllocaldb_path] + list(args))


def get_sqlserver_tools_dir():
    reg_dir = ['HKEY_LOCAL_MACHINE', 'SOFTWARE', 'Microsoft', 'Microsoft SQL Server', sqlserver_version, 'Tools', 'ClientSetup']
    sqllocaldb_dir = get_reg_value('\\'.join(reg_dir), 'Path')
    if not sqllocaldb_dir:
        raise Exception('Unable to locate SQLServer tools. Is SQLServer v%s installed?' % sqlserver_version)
    return sqllocaldb_dir


def sql_open_conn(conn_str):
    clr.AddReference('System.Data')
    import System.Data

    conn = System.Data.SqlClient.SqlConnection(conn_str)
    conn.Open()
    return conn


def sql_migrator(**kwargs):
    nuget_install('SqlMigrator', '-Version', sqlmigrator_version, '-OutputDirectory', base_dir, '-Verbosity', 'quiet')

    sqlmigrator_command = [
        os.path.join(base_dir, 'SqlMigrator.' + sqlmigrator_version, 'tools', 'SqlMigrator.exe')
    ]

    for k, v in kwargs.iteritems():
        sqlmigrator_command.append('/' + k)
        sqlmigrator_command.append(v)

    subprocess.check_call(sqlmigrator_command)


def git_tfs_release_notes(repo_path):
    libgit2sharp_version = '1.0.0'
    semver_version = '1.0.0'

    nuget_install('LibGit2Sharp', '-Version', libgit2sharp_version, '-OutputDirectory', base_dir, '-Verbosity', 'quiet')
    nuget_install('semver', '-Version', semver_version, '-OutputDirectory', base_dir, '-Verbosity', 'quiet')
    clr.AddReferenceToFileAndPath(os.path.join(base_dir, 'LibGit2Sharp.' + libgit2sharp_version, 'lib', 'net35', 'LibGit2Sharp.dll'))
    clr.AddReferenceToFileAndPath(os.path.join(base_dir, 'semver.' + semver_version, 'lib', 'net40', 'Semver.dll'))
    import LibGit2Sharp
    import Semver
    with LibGit2Sharp.Repository(repo_path) as repo:
        tags = list(repo.Tags)
        latest_version_tag = max(tags, key=lambda x: Semver.SemVersion.Parse(x.Name)) if tags else None
        commit_filter = LibGit2Sharp.CommitFilter()
        commit_filter.Since = repo.Head
        commit_filter.Until = latest_version_tag

        workitem_ids = set()
        for commit in repo.Commits.QueryBy(commit_filter):
            for match in re.finditer(r'#(\d+)', commit.Message):
                workitem_ids.add(int(match.group(1)))

        rows = []
        if latest_version_tag:
            rows.append('Since %s' % latest_version_tag.Name)
        rows.extend(['* %d %s' % (x, tfs_get_workitem_title(x)) for x in workitem_ids])
        return '\n'.join(rows)


def tfs_get_workitem_title(id):
    clr.AddReference('Microsoft.TeamFoundation.Client')
    import Microsoft.TeamFoundation.Client
    clr.AddReference('Microsoft.TeamFoundation.WorkItemTracking.Client')
    import Microsoft.TeamFoundation.WorkItemTracking.Client

    tfs = Microsoft.TeamFoundation.Client.TfsTeamProjectCollectionFactory.GetTeamProjectCollection(System.Uri(tfs_uri))
    item_store = tfs.GetService[Microsoft.TeamFoundation.WorkItemTracking.Client.WorkItemStore]()
    work_item = item_store.GetWorkItem(id)
    return work_item.Title


def run_phantom_jasmine(test_html_path):
    phantomjs_version = '2.1.1'

    nuget_install('PhantomJS', '-Version', phantomjs_version, '-OutputDirectory', base_dir, '-Verbosity', 'quiet')
    subprocess.check_call([os.path.join(base_dir, 'PhantomJS.' + phantomjs_version, 'tools', 'phantomjs', 'phantomjs.exe'), os.path.join(base_dir, 'run-phantomjs-jasmine.js'), test_html_path])

def start_iis_express(siteFolder,sitePort):
    iisexpress_path = os.path.join(os.environ['ProgramFiles'], 'IIS Express','iisexpress.exe')
    call_args = [iisexpress_path, '/path:'+siteFolder,'/port:'+sitePort, '/clr:v4.0', '/systray:false']
    subprocess.Popen(call_args)

def stop_iis_express():
    subprocess.check_call(["taskkill", "/F", "/IM", "iisexpress.exe"])
	
def run_protractor_tests(test_conf_path):
    # https://github.com/seleniumhq/selenium-google-code-issue-archive/issues/1795 (IE Protected Mode must be set to the same value)
    secZone1KeyName = r'HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Internet Settings\Zones\1'
    secZone2KeyName = r'HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Internet Settings\Zones\2'
    secZone3KeyName = r'HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Internet Settings\Zones\3'
    secZone4KeyName = r'HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Internet Settings\Zones\4'
    secZone1Value = get_reg_value(secZone1KeyName, '2500')
    secZone2Value = get_reg_value(secZone2KeyName, '2500')
    secZone3Value = get_reg_value(secZone3KeyName, '2500')
    secZone4Value = get_reg_value(secZone4KeyName, '2500')
    set_reg_value(secZone1KeyName, '2500', 0)
    set_reg_value(secZone2KeyName, '2500', 0)
    set_reg_value(secZone3KeyName, '2500', 0)
    set_reg_value(secZone4KeyName, '2500', 0)

    try:
      nuget_install('Chromium', '-Version', chromium_version, '-OutputDirectory', base_dir, '-Verbosity', 'quiet', '-NoCache')
      nuget_install('Node.Js', '-Version', nodejs_version, '-OutputDirectory', base_dir, '-Verbosity', 'quiet')
      nuget_install('Protractor', '-Version', protractor_version, '-OutputDirectory', base_dir, '-Verbosity', 'quiet', '-NoCache')
      subprocess.check_call([os.path.join(base_dir, 'Node.js.'+nodejs_version, 'node.exe'),os.path.join(base_dir, 'Protractor.'+protractor_version, 'protractor', 'bin', 'protractor'), test_conf_path])
    finally:
      set_reg_value(secZone1KeyName, '2500', secZone1Value)
      set_reg_value(secZone2KeyName, '2500', secZone2Value)
      set_reg_value(secZone3KeyName, '2500', secZone3Value)
      set_reg_value(secZone4KeyName, '2500', secZone4Value)
	
def wix_candle_light(wsx_path):
    nuget_install('WiX.Toolset', '-Version', wix_version, '-OutputDirectory', base_dir)

    wsx_dir = os.path.dirname(wsx_path)
    wsx_filename = os.path.splitext(wsx_path)[0]

    wixobj_path = os.path.join(wsx_dir, wsx_filename + '.wixobj')
    subprocess.check_call([
        os.path.join(base_dir, 'WiX.Toolset.' + wix_version, 'tools', 'wix', 'candle.exe'),
        '-pedantic',
        '-v',
        '-ext', 'WixUIExtension',
        wsx_path,
        '-out', wixobj_path
    ])

    subprocess.check_call([
        os.path.join(base_dir, 'WiX.Toolset.' + wix_version, 'tools', 'wix', 'light.exe'),
        '-pedantic',
        '-v',
        '-ext', 'WixUIExtension',
        wixobj_path,
        '-out', os.path.join(wsx_dir, wsx_filename + '.msi')
    ])

def release_beta_workitems(software_name, team, beta_query, official_query, version, label, release_notes):
    releaser_integration_version = '1.0.0'
    nuget_install('Releaser.Integration', '-Version', releaser_integration_version, '-OutputDirectory', base_dir, '-Verbosity', 'quiet', '-ExcludeVersion','-NoCache')    
    clr.AddReferenceToFileAndPath(os.path.join(base_dir, 'EasyHttp', 'lib', 'net40', 'EasyHttp.dll'))
    clr.AddReferenceToFileAndPath(os.path.join(base_dir, 'JsonFx', 'lib', 'net40', 'JsonFx.dll'))
    clr.AddReferenceToFileAndPath(os.path.join(base_dir, 'HtmlAgilityPack', 'lib', 'net40', 'HtmlAgilityPack.dll'))
    workItems = tocketServerWorkItemsManager.GetResolvedWorkItems(software_name)
    ids = ''
    for workItem in workItems:
        ids = ids + workItem.Id + ';'
    print 'For the subsystem "{0}" (under "{1}" team) will be created the following version: "{2}" with the label "{3}" and released the following issues: "{4}"'.format(software_name, team, version, label, ids)
    tocketServerWorkItemsManager.BetaReleaseWorkItems(workItems, software_name, version)    
    release_notes_file = open(release_notes, "r+")
    html = release_notes_file.read()
    release_notes_file.seek(0)
    release_notes_file.write(relaseNotesHtmlAppender.Append(html, version, label, workItems))
    release_notes_file.truncate()
    release_notes_file.close()
    
def release_official_workitems(software_name, team, beta_query, official_query, version):
    releaser_integration_version = '1.0.0'
    nuget_install('Releaser.Integration', '-Version', releaser_integration_version, '-OutputDirectory', base_dir, '-Verbosity', 'quiet', '-ExcludeVersion','-NoCache')        
    clr.AddReferenceToFileAndPath(os.path.join(base_dir, 'EasyHttp', 'lib', 'net40', 'EasyHttp.dll'))
    clr.AddReferenceToFileAndPath(os.path.join(base_dir, 'JsonFx', 'lib', 'net40', 'JsonFx.dll'))
    clr.AddReferenceToFileAndPath(os.path.join(base_dir, 'HtmlAgilityPack', 'lib', 'net40', 'HtmlAgilityPack.dll'))
    workItems = ticketWorkItemsManager.GetBetaReleasedAndAcceptedWorkItems(software_name, version)
    ids = ''
    for workItem in workItems:
        ids = ids + workItem.Id + ';'
    print 'For the subsystem "{0}" (under "{1}" team) will be officialized the following version "{2}" with the associated issues: "{3}"'.format(software_name, team, version, ids)
    ticketWorkItemsManager.OfficializeWorkItems(workItems, software_name, version)

def run_grunt_task(task):
    nuget_install('Node.Js', '-Version', nodejs_version, '-OutputDirectory', base_dir, '-Verbosity', 'quiet')    
    subprocess.check_call([os.path.join(base_dir, 'Node.js.'+nodejs_version, 'node.exe'),'-e','require("grunt").tasks(["'+task+'"])'])
    