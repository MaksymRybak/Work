angular.module('app.feature1').directive('feature1Directive', function () {
    return {
        templateUrl: 'app/feature1/feature1.html',
        controller: 'feature1Ctrl',
        scope: {
            onClose: '&'
        },
        link: function (scope, element, attrs, ctrl) {
            scope.$on('someAction', function (event, args) {
                scope.loadSomeData(args.param1);
            });
        }
    }
});
