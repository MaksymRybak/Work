expect(browser.driver.switchTo().activeElement().getAttribute("id")).toEqual("elementId");
expect(element(by.id("elementId")).getAttribute("class")).toEqual("ng-hide");
expect(element(by.id("elementId")).isPresent()).toBe(false);
