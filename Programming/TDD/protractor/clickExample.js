var btn = element(by.id('btnId'));
btn.click();

var tot = element(by.binding('totValue | number:2'));
element(by.css('.className')).all(by.tagName('li')).get(1).click();
expect(tot.getText()).toMatch('1,500.00');

var btn = element(by.id("btnId"));
btn.sendKeys(protractor.Key.ENTER);
browser.sleep(1000);
expect(element(by.id("elementId")).getAttribute("style")).toEqual("display: block;");
