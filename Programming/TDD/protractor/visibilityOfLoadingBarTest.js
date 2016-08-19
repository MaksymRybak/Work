it("should show loading bar while loading data from backend", function () {
    var textBox = element(by.id("elementId"));
    textBox.sendKeys("some text...");
    textBox.sendKeys(protractor.Key.ENTER);
    browser.ignoreSynchronization = true;
    browser.sleep(100);
    expect(element(by.className("progress-bar")).isDisplayed()).toBeTruthy();
    browser.ignoreSynchronization = false;
    browser.sleep(2000);
    expect(element(by.className("progress-bar")).isPresent()).toBeFalsy();
});
