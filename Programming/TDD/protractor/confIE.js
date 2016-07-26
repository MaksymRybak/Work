exports.config = {
    seleniumServerJar: "../../tools/ProtractorNugetPackage.3.2.2/protractor/selenium/selenium-server-standalone-2.46.0.jar",
    seleniumArgs: "-Dwebdriver.ie.driver=tools/ProtractorNugetPackage.3.2.2/protractor/selenium/IEDriverServer_2.46.exe",
    specs: ['spec.js'],
    allScriptsTimeout: 30000,
    capabilities: {
        'browserName': 'internet explorer',
        'platform': 'ANY',
        'version': '11'
    }
}
