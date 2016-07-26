var input = element.all(by.tagName('input')).first();
input.sendKeys('F');
browser.sleep(1000);	// to use also when the click causes PopUp opening 
