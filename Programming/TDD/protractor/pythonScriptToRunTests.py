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
  nuget_install('Node.Js', '-Version', nodejs_version, '-OutputDirectory', base_dir, '-Verbosity', 'quiet', '-NoCache')
  nuget_install('NugetProtractorPackage', '-Version', protractor_version, '-OutputDirectory', base_dir, '-Verbosity', 'quiet', '-NoCache')
  subprocess.check_call([os.path.join(base_dir, 'Node.js.'+nodejs_version, 'node.exe'),os.path.join(base_dir, 'NugetProtractorPackage.'+protractor_version, 'protractor', 'bin', 'protractor'), test_conf_path])
finally:
  set_reg_value(secZone1KeyName, '2500', secZone1Value)
  set_reg_value(secZone2KeyName, '2500', secZone2Value)
  set_reg_value(secZone3KeyName, '2500', secZone3Value)
  set_reg_value(secZone4KeyName, '2500', secZone4Value)
