'use strict';
//Departments service used for departments REST endpoint
angular.module('mean.htsts').factory("Htsts", ['$resource', function ($resource) {
    return $resource('htsts/:id', {
        id: '@id'
    }, {
            update: {
                method: 'PUT'
            }
        });
}]);