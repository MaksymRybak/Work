// conf.js
exports.config = {
    directConnect: true,
    allScriptsTimeout: 30000,
    capabilities: {
        "browserName": "chrome",
        "chromeOptions": {
            binary: "./tools/Chromium.49.0.2623.112/chrome/chrome.exe"
        }
    },
    specs: ["app/app-spec.js"]
}