'use strict';
//Departments service used for departments REST endpoint
angular.module('mean.dashboards').factory("Dashboards", ['$resource', function ($resource) {
    return $resource('dashboards/:dashboardId', {
        departmentId: '@id'
    }, {
            update: {
                method: 'PUT'
            }
        });
}]);