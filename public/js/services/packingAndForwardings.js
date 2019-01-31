'use strict';
//Departments service used for departments REST endpoint
angular.module('mean.packingAndForwardings').factory("PackingAndForwardings", ['$resource', function ($resource) {
    return $resource('packingAndForwardings/:id', {
        id: '@id'
    }, {
            update: {
                method: 'PUT'
            }
        });
}]);