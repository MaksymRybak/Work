angular.module('app.common').directive('appSelectize',['$timeout', function ($timeout) {
	return {
		restrict: 'A',
		require: 'ngModel',
		scope: {
			options: '='
		},
		link: function (scope, element, attrs, ngModel) {
			var configurationObject = {}
			var options;
			scope.$watch('options', function (newValue, oldValue) {
				if (newValue && newValue.length > 0) {
					options = newValue.map(function (item) {
						return { item: item }
					});
				} else {
					options = [];
				}
				configurationObject = {
				    openOnFocus: false,
					valueField: 'item',
					labelField: 'item',
					searchField: 'item',
					options: options
				};

				$timeout(function () {
					element.selectize()[0].selectize.destroy();
					var instance = element.selectize(configurationObject)[0].selectize;
					instance.setValue(ngModel.$modelValue);
				    instance.focus();
				});
			});
		}
	};
}]);

angular.module('app.common').directive('appTable', ['$timeout',function(timeout) {
    return {
        templateUrl: 'app/common/appPage.html',
        scope: {
            var1: '@',
            var2: '=',
            var3 : '=',
            var4: '&'
        },
        link: function (scope, element, attrs, ctrl) {
            var lastState = '';
            var currentState = '';
            scope.id = randomString(10);

            $(window).on('resize', function () {
                currentState = getState();
                if (currentState !== lastState) {
                    timeout(function () {
                        redrawTable();
                    }, 0);
                }
                lastState = currentState;
            });

            scope.$watch('var3', function (newValue, oldValue) {
                timeout(function () {
                    redrawTable();
                }, 0);
            });

            function redrawTable() {
                $("#"+scope.id).remove();
                
                if (isScrollable()) {
                    
                    var table = $(element[0].querySelector('.table'));                    
                    var tableCloned = table.clone();
                    tableCloned.insertBefore(table);
                    tableCloned.addClass('fixed-column');
                    tableCloned.attr("id", scope.id);
                    timeout(function () {
                        tableCloned.find('th:not(:first-child), td:not(:first-child)').remove();
                        tableCloned.find('tr').each(function (i, elem) {
                            var currentRowOnOriginalTable = table.find('tr:eq(' + i + ')');
                            $(this).height(currentRowOnOriginalTable.height());
                        });
                    }
                        , 0);
                }
            };

            function getState() {
                return isScrollable() ? "scrollable" : "not_scrollable";
            }

            function isScrollable() {
                return element.children()[0].scrollWidth > element.children()[0].offsetWidth;
            };

            function randomString(length) {
                var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

                if (!length) {
                    length = Math.floor(Math.random() * chars.length);
                }

                var str = '';
                for (var i = 0; i < length; i++) {
                    str += chars[Math.floor(Math.random() * chars.length)];
                }
                return str;
            }
        },
        controller: 'tableCtrl'
    }
}]);

angular.module('app.common').directive('listItem', function () {
    return {
        templateUrl: 'app/common/listItem.html',
        scope: {
            items: '=',
            onCheck: '&'
        },
        controller: 'listItemCtrl'
    }
});
