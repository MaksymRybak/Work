angular.module('app.common').filter('groups', function () {
    return function (group) {
        var groups = [];
        if (groups) {
            groups.forEach(function(group) {
                // put logic here
            });
        }
        return groups;
    }
});
