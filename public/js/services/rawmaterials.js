'use strict';
//Departments service used for departments REST endpoint
angular.module('mean.rawmaterials').factory("RawMaterials", ['$resource', function ($resource) {
    return $resource('rawmaterials/:id', {
        id: '@id'
    }, {
            update: {
                method: 'PUT'
            }
        });
}]);