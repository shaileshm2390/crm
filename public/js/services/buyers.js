'use strict';
//Customers service used for cutomers REST endpoint
angular.module('mean.buyers').factory("Buyers", ['$resource', function ($resource) {
    return $resource('buyers/:customerId', {
        customerId: '@id'
    }, {
            update: {
                method: 'PUT'
            }
        });
}]);