'use strict';
//Departments service used for departments REST endpoint
angular.module('mean.users').factory("Users", ['$resource', function ($resource) {
    return $resource('users/:userId', {
        userId: '@id'
    }, {
            update: {
                method: 'PUT'
            }
        });
}]);