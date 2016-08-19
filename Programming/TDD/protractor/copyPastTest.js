it("should add year prefix when text pasted", function () {
        var inputBox = element(by.id("elementId"));
        inputBox.sendKeys("text");
        inputBox.sendKeys(protractor.Key.HOME);
        inputBox.sendKeys(protractor.Key.RIGHT);
        inputBox.sendKeys(protractor.Key.RIGHT);
        inputBox.sendKeys(protractor.Key.RIGHT);
        inputBox.sendKeys(protractor.Key.RIGHT);
        inputBox.sendKeys(protractor.Key.RIGHT);
        inputBox.sendKeys(protractor.Key.chord(protractor.Key.SHIFT, protractor.Key.RIGHT, protractor.Key.RIGHT, protractor.Key.RIGHT, protractor.Key.RIGHT));
        inputBox.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "c"));
        browser.get('http://localhost:49921/#/todo');
        expect(inputBox.getAttribute("value")).toEqual("");
        inputBox.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "v"));
        expect(inputBox.getAttribute("value")).toEqual(new Date().getFullYear() + "/text");
    });
