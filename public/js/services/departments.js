'use strict';
//Departments service used for departments REST endpoint
angular.module('mean.departments').factory("Departments", ['$resource', function ($resource) {
    return $resource('departments/:departmentId', {
        departmentId: '@id'
    }, {
            update: {
                method: 'PUT'
            }
        });
}]);