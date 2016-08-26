describe('app tests', function () {
    it("should have a title", function () {
        //remove this line when angular will be introduced
        browser.ignoreSynchronization = true;
        browser.get("http://localhost:54449/");
        browser.sleep(1000);
        expect(browser.getTitle()).toEqual("Yoda Releaser");
    });
});