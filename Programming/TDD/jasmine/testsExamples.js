'use strict';
describe('appCtrl', function () {    
    var $httpBackend;
    sessionStorage.removeItem('itemName');

    beforeEach(module('app'));
	
    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('GET', 'apiUrl').respond([]);
        $httpBackend.when('GET', 'url').respond([]);        
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should ...', inject(function ($rootScope, $controller, $http) {
        var scope = $rootScope.$new();        

        $controller('bumBudgetCtrl', { $scope: scope, $http: $http });
        $httpBackend.flush();

        expect(scope.scopeObject).toBe(false);
    }));

    it('should ...', inject(function($rootScope, $controller, $http, $location) {
        var scope = $rootScope.$new();

        $httpBackend.when('GET', 'apiUrl').respond({
			objectProp: null
        });

        $controller('bumIndexCtrl', { $scope: scope, $http: $http, $location: $location });
        $httpBackend.flush();

        expect(scope.model.username).toBe('username');
        expect(scope.model.someValue.length).toEqual(1);
    }));
});
