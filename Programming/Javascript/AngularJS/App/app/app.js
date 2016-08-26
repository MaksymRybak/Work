angular.module('app', ['ngRoute', 'app.feature1']);
angular.module('app').config(['$routeProvider', function($routeProvider) {

    $routeProvider.when('/', { redirectTo: '/feature1' });
    $routeProvider.otherwise({ redirectTo: '/feature1' });
}]);