import os
import dotnet

project_team = 'teamName'
project_name = 'projectName'
project_version = '1.0.0'
project_authors = 'companyName'

beta_query = r'Project: ProjName Subsystem: %softwareName% State: Fixed Type: Feature'
official_query = r'Project: ProjName Subsystem: %softwareName% Company versions: {%versionToRelease%} .. {%fromVersion%} State: Released Type: Feature Official: False' 
version_label = '' 
release_notes = '\\\\applications\\'+project_name+ '\\UserDocuments\\ReleaseNotes\\ReleaseNotes.html'

build_configuration = 'Release'
build_platform = 'Any CPU'
build_number = 0
build_vcs_number = 'n/a'

package_configurations = ['Deploy_CI', 'Deploy_LIVE', 'Deploy_PRODUCTION']
package_base_dir = r'\\shareready\Build'

deploy_environment = 'CI'
protractor_config_file = 'conf_chromium.js'

default = ['init']
init = ['install_deps', 'assembly_info']
build = ['init', 'check_deps', 'compile', 'test']
continuous_integration = ['set_tc_version', 'build', 'web_package','deploy']
release_official = ['set_tc_version', 'copy_to_applications','create_release_notes', 'officialize_tasks']


def install_deps():
    dotnet.nuget_restore(bjoin('src', project_name + '.sln'))


def set_tc_version():
    dotnet.tc_print("buildNumber '%s'" % project_version)


def assembly_info():
    dotnet.assembly_info(
        bjoin('src', 'SharedAssemblyInfo.cs'),
        AssemblyProduct=project_name,
        AssemblyCopyright='',
        AssemblyTrademark='',
        AssemblyCompany=project_authors,
        AssemblyConfiguration='%s - %s' % (build_number, build_vcs_number),
        AssemblyVersion=project_version,
        AssemblyFileVersion=project_version,
        AssemblyInformationalVersion=project_version
    )

def check_deps():
    dotnet.nuget_check(bjoin('src', project_name + '.sln'))

def grunt(task='default'):
    dotnet.run_grunt_task(task)

def compile():
    dotnet.msbuild(bjoin('src', project_name + '.sln'), 'Rebuild', Configuration=build_configuration, Platform=build_platform)


def test_protractor():
    dotnet.run_protractor_tests(bjoin('src', project_name, protractor_config_file))

def test():
    os.environ["PATH"] += os.pathsep + os.path.join('C:\\','BuildAgent','jre','bin')
    dotnet.nunit('src/*/bin/' + build_configuration + '/*.Tests.dll')
    dotnet.run_phantom_jasmine(bjoin('src', project_name, 'Tests.html'))
    try:
      dotnet.start_iis_express(bjoin('src', project_name),'54449')
      test_protractor();
    finally:
      dotnet.stop_iis_express()

def web_package():
    for package_configuration in package_configurations:
        package_dir = os.path.join(package_base_dir, project_name, 'build', project_version, package_configuration)
        grunt(package_configuration)
        dotnet.msbuild(
            bjoin('src', project_name + '.sln'),
            'Rebuild',
            Configuration=package_configuration,
            Platform=build_platform,
            DeployOnBuild='true',
            DeployTarget='Package',
            PackageAsSingleFile='true',
            PackageLocation=os.path.join(package_dir, 'package.zip')
        )


def deploy():
    companyscript.request_app_deploy(deploy_environment, project_name, project_version)


def copy_to_applications():
    src = os.path.join(package_base_dir, project_name, 'build', project_version)
    dest = os.path.join(r'\\applications', project_name, 'SetupKit', 'Versions', project_version)
    dotnet.robocopy(src, dest)


def bjoin(*args):
    base_path = os.path.dirname(os.path.realpath(__file__))
    return os.path.join(base_path, *args)


def create_release_notes():
    dotnet.release_beta_workitems(project_name, project_team, beta_query, official_query, project_version, version_label, release_notes)
    
def officialize_tasks():
    dotnet.release_official_workitems(project_name, project_team, beta_query, official_query, project_version)