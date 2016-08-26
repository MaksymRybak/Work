angular.module('app.feature1', ['app.common']);

angular.module('app.feature1').controller('feature1Ctrl', [
    '$scope', '$http', function(scope, http) {

        scope.model = {
            modelArray1: [],
            modelArray2: [],
            modelArray3: [],
            modelArray4:[]
        }

        scope.input = {
            inputParam1:'',
            inputParam2: '',
            inputParam3: '',
            inputParam4: true,
            inputParam5: true
        }

        scope.loadFeature1Data = function () {
            http.get('app/feature1/testData/testData.json').then(function(ret) {
                angular.extend(scope.model, ret.data);
                if (scope.model.modelArray1.length>0){
                    scope.input.inputParam1 = scope.model.modelArray1[0].id;
                    scope.input.inputParam2 = scope.model.modelArray1[0].number;
                    scope.input.inputParam3 = scope.model.modelArray1[0].description;
                }
            });
        }

        scope.todoChanged = function() {
            var versionToRelease = scope.model.modelArray1.filter(function(version) {
                return version.id === scope.input.inputParam1;
            })[0];
        }

        scope.toggleGroupAvailability = function(groupName,enabled) {
            scope.model.enabledGroups.filter(function(group) {
                return group.name === groupName;
            })[0].enabled = enabled;
        }
        
        scope.onCheckItem = function(item) {
            var checkedItem = scope.model.modelArray2.filter(function (currentItem) {
                return item.id === currentItem.id;
            })[0];
            checkedItem.checked = item.checked;
        }

        scope.close = function() {
            scope.onClose();
        }
    }
]);