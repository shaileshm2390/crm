'use strict';
//Departments service used for departments REST endpoint
angular.module('mean.conversions').factory("Conversions", ['$resource', function ($resource) {
    return $resource('conversions/:id', {
        id: '@id'
    }, {
            update: {
                method: 'PUT'
            }
        });
}]);