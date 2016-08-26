angular.module('app.common', []);

angular.module('app.common').controller('appCtrl1', [
    '$scope', function(scope) {
        scope.commonFunction1 = function () {
            // function logic
            return 0;
        }       

        scope.commonFunction2 = function (param1) {
            // function logic            
        }
    }
]);

angular.module('app.common').controller('appCtrl2', [
    '$scope', function (scope) {
        scope.toggleCheckedItem = function(item) {
            scope.onCheck({item:item});
        }
    }
]);