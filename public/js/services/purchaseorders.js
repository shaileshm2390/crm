'use strict';
//Departments service used for departments REST endpoint
angular.module('mean.purchaseorders').factory("Purchaseorders", ['$resource', function ($resource) {
    return $resource('purchaseorders/:purchaseorderId', {
        purchaseordersId: '@id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);