'use strict';
//Customers service used for cutomers REST endpoint
angular.module('mean.buyers').factory("Buyers", ['$resource', function ($resource) {
    return $resource('buyers/edit/:customerId', {
        buyerId: '@id'
    }, {
            update: {
                method: 'PUT'
            }
        });
}]);