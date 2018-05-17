'use strict';
//Customers service used for cutomers REST endpoint
angular.module('mean.customers').factory("Customers", ['$resource', function ($resource) {
    return $resource('customers/:customerId', {
        customerId: '@id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);