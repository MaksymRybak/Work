describe('index.html protractor tests', function() {

    beforeEach(function() {
        browser.addMockModule('httpBackendMock', function() {
            angular.module('httpBackendMock', ['app', 'ngMockE2E']).run(function($httpBackend) {
                $httpBackend.whenGET(/^\pages\//).passThrough();
                $httpBackend.whenGET('api/context').respond({
                    property: 'TODO'
                });
				$httpBackend.whenDELETE('url').respond(function (method, url, data) { return [200]; });
				$httpBackend.whenDELETE('url').respond(function (method, url, data) { return [200, { property: null }]; });
            });
        });

        browser.get('http://localhost:63900/');
    });
    
    it('should have a title', function() {
		// Test logic here
    });
});
