nuget_install('PhantomJS', '-Version', phantomjs_version, '-OutputDirectory', base_dir, '-Verbosity', 'quiet')
subprocess.check_call([os.path.join(base_dir, 'PhantomJS.' + phantomjs_version, 'tools', 'phantomjs', 'phantomjs.exe'), os.path.join(base_dir, 'run-phantomjs-jasmine.js'), test_html_path])
