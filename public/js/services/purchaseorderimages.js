'use strict';
//Departments service used for departments REST endpoint
angular.module('mean.purchaseorderimages').factory("Purchaseorderimages", ['$resource', function ($resource) {
    return $resource('purchaseorderimages/:purchaseorderimageId', {
        purchaseorderimagesId: '@id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);